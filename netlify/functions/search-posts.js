import { neon } from '@netlify/neon';

// Initialize Neon client
const sql = neon();

// Helper function to normalize text for fuzzy search (remove Lithuanian diacritics)
function normalizeText(text) {
  if (!text) return '';
  return text
    .toLowerCase()
    .replace(/ą/g, 'a')
    .replace(/č/g, 'c')
    .replace(/ę/g, 'e')
    .replace(/ė/g, 'e')
    .replace(/į/g, 'i')
    .replace(/š/g, 's')
    .replace(/ų/g, 'u')
    .replace(/ū/g, 'u')
    .replace(/ž/g, 'z')
    .replace(/[^a-z0-9\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

// Helper function to create search terms for fuzzy matching
function createSearchTerms(query) {
  const normalized = normalizeText(query);
  const terms = normalized.split(' ').filter(term => term.length > 1);
  
  // Create variations for each term
  const searchTerms = [];
  
  terms.forEach(term => {
    // Exact match
    searchTerms.push(term);
    
    // Partial matches (for fuzzy search)
    if (term.length > 3) {
      // Add prefix matches
      searchTerms.push(term.substring(0, term.length - 1));
      searchTerms.push(term.substring(0, term.length - 2));
    }
    
    // Add suffix matches
    if (term.length > 3) {
      searchTerms.push(term.substring(1));
      searchTerms.push(term.substring(2));
    }
  });
  
  return [...new Set(searchTerms)]; // Remove duplicates
}

export default async function handler(event) {
  try {
    const url = new URL(event.rawUrl || event.url, `https://${event.headers.host}`);
    const query = url.searchParams.get('q');
    const limit = parseInt(url.searchParams.get('limit')) || 10;
    const offset = parseInt(url.searchParams.get('offset')) || 0;
    
    if (!query || query.trim().length < 2) {
      return new Response(
        JSON.stringify({
          success: true,
          posts: [],
          categories: [],
          total: 0,
          query: query
        }),
        {
          status: 200,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }
    
    console.log(`Searching for: "${query}"`);
    
    const normalizedQuery = normalizeText(query);
    const searchTerms = createSearchTerms(query);
    
    console.log(`Normalized query: "${normalizedQuery}"`);
    console.log(`Search terms: ${searchTerms.join(', ')}`);
    
    // Search posts with fuzzy matching
    const posts = await sql`
      SELECT *, 
        CASE 
          WHEN LOWER(title) LIKE ${`%${normalizedQuery}%`} THEN 10
          WHEN LOWER(excerpt) LIKE ${`%${normalizedQuery}%`} THEN 8
          WHEN LOWER(content) LIKE ${`%${normalizedQuery}%`} THEN 6
          WHEN LOWER(category) LIKE ${`%${normalizedQuery}%`} THEN 7
          WHEN LOWER(subcategory) LIKE ${`%${normalizedQuery}%`} THEN 7
          WHEN LOWER(tags::text) LIKE ${`%${normalizedQuery}%`} THEN 5
          ELSE 1
        END as relevance_score
      FROM posts
      WHERE published = true 
      AND (
        LOWER(title) LIKE ${`%${normalizedQuery}%`}
        OR LOWER(excerpt) LIKE ${`%${normalizedQuery}%`}
        OR LOWER(content) LIKE ${`%${normalizedQuery}%`}
        OR LOWER(category) LIKE ${`%${normalizedQuery}%`}
        OR LOWER(subcategory) LIKE ${`%${normalizedQuery}%`}
        OR LOWER(tags::text) LIKE ${`%${normalizedQuery}%`}
        OR LOWER(author) LIKE ${`%${normalizedQuery}%`}
      )
      ORDER BY relevance_score DESC, created_at DESC
      LIMIT ${limit} OFFSET ${offset}
    `;
    
    // Count total results
    const countResult = await sql`
      SELECT COUNT(*) as total FROM posts
      WHERE published = true 
      AND (
        LOWER(title) LIKE ${`%${normalizedQuery}%`}
        OR LOWER(excerpt) LIKE ${`%${normalizedQuery}%`}
        OR LOWER(content) LIKE ${`%${normalizedQuery}%`}
        OR LOWER(category) LIKE ${`%${normalizedQuery}%`}
        OR LOWER(subcategory) LIKE ${`%${normalizedQuery}%`}
        OR LOWER(tags::text) LIKE ${`%${normalizedQuery}%`}
        OR LOWER(author) LIKE ${`%${normalizedQuery}%`}
      )
    `;
    
    const total = parseInt(countResult[0].total);
    
    // Transform posts data
    const transformedPosts = posts.map(post => ({
      id: post.id,
      title: post.title,
      content: post.content,
      category: post.category,
      subcategory: post.subcategory,
      tags: post.tags,
      author: post.author,
      date: post.date || post.created_at,
      excerpt: post.excerpt,
      image_url: post.image_url,
      slug: post.slug || `post-${post.id}`,
      relevance_score: post.relevance_score
    }));
    
    // Search categories (from the predefined categories structure)
    // This is a simple implementation - in a real app you might want to store categories in DB
    const categoryMatches = [];
    
    // Import categories data for searching
    // Note: This is a simplified approach. In production, you might want to store categories in the database
    const categoryKeywords = [
      'trasos', 'vaismedziams', 'darzovems', 'gelems', 'uogakrumiams', 'vejai',
      'obelems', 'kriausems', 'vysnioms', 'slyvoms', 'persikams', 'citrusams',
      'pomidorams', 'agurkams', 'kopustams', 'morkoms', 'svogunams', 'bulvems',
      'seklos', 'darzoviu-seklos', 'zoleliu-seklos', 'geliu-seklos',
      'sodinukai', 'vaismedziu-sodinukai', 'uogakrumiai', 'dekoratyviniai-augalai'
    ];
    
    categoryKeywords.forEach(category => {
      const normalizedCategory = normalizeText(category);
      if (normalizedCategory.includes(normalizedQuery) || normalizedQuery.includes(normalizedCategory)) {
        categoryMatches.push({
          name: category,
          slug: category,
          type: 'category'
        });
      }
    });
    
    return new Response(
      JSON.stringify({
        success: true,
        posts: transformedPosts,
        categories: categoryMatches,
        total: total,
        hasMore: offset + limit < total,
        query: query,
        normalizedQuery: normalizedQuery,
        pagination: {
          limit,
          offset
        }
      }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      }
    );

  } catch (error) {
    console.error('Error in search-posts function:', error);
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message
      }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
}

