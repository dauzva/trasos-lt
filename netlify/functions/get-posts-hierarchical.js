import { neon } from '@netlify/neon';

// Initialize Neon client
const sql = neon();

// Helper function to normalize category names (remove Lithuanian diacritics)
function normalizeCategory(category) {
  if (!category) return category;
  return category
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
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

// Helper function to build hierarchical category paths
function buildCategoryPaths(mainCategory, subCategory, subSubCategory) {
  const paths = [];
  
  // Normalize all categories
  const normalizedMain = normalizeCategory(mainCategory);
  const normalizedSub = normalizeCategory(subCategory);
  const normalizedSubSub = normalizeCategory(subSubCategory);
  
  // Add the main category
  if (normalizedMain) {
    paths.push(normalizedMain);
  }
  
  // Add subcategory path
  if (normalizedMain && normalizedSub) {
    paths.push(`${normalizedMain}/${normalizedSub}`);
  }
  
  // Add sub-subcategory path
  if (normalizedMain && normalizedSub && normalizedSubSub) {
    paths.push(`${normalizedMain}/${normalizedSub}/${normalizedSubSub}`);
  }
  
  return paths;
}

export default async function handler(event) {
  try {
    const url = new URL(event.rawUrl || event.url, `https://${event.headers.host}`);
    const limit = parseInt(url.searchParams.get('limit')) || 10;
    const offset = parseInt(url.searchParams.get('offset')) || 0;
    const mainCategory = url.searchParams.get('mainCategory');
    const subCategory = url.searchParams.get('subCategory');
    const subSubCategory = url.searchParams.get('subSubCategory');
    
    console.log(`Fetching hierarchical posts: main=${mainCategory}, sub=${subCategory}, subSub=${subSubCategory}`);
    
    let posts, countResult;
    
    if (mainCategory) {
      // Build all possible category paths for hierarchical matching
      const categoryPaths = buildCategoryPaths(mainCategory, subCategory, subSubCategory);
      
      // Get the most specific category for exact matching
      const targetCategory = subSubCategory || subCategory || mainCategory;
      const normalizedTarget = normalizeCategory(targetCategory);
      
      console.log(`Target category: ${normalizedTarget}, Category paths: ${categoryPaths.join(', ')}`);
      
      // Query posts that match the target category OR have category paths that include our target
      // This implements the hierarchical logic where posts appear in parent categories
      posts = await sql`
        SELECT * FROM posts
        WHERE published = true 
        AND (
          category = ${normalizedTarget}
          OR subcategory = ${normalizedTarget}
          OR category LIKE ${normalizedTarget + '%'}
          OR subcategory LIKE ${normalizedTarget + '%'}
          OR category LIKE ${'%' + normalizedTarget}
          OR subcategory LIKE ${'%' + normalizedTarget}
        )
        ORDER BY created_at DESC
        LIMIT ${limit} OFFSET ${offset}
      `;
      
      countResult = await sql`
        SELECT COUNT(*) as total FROM posts 
        WHERE published = true 
        AND (
          category = ${normalizedTarget}
          OR subcategory = ${normalizedTarget}
          OR category LIKE ${normalizedTarget + '%'}
          OR subcategory LIKE ${normalizedTarget + '%'}
          OR category LIKE ${'%' + normalizedTarget}
          OR subcategory LIKE ${'%' + normalizedTarget}
        )
      `;
    } else {
      // Get all posts, order by most recent
      posts = await sql`
        SELECT * FROM posts
        WHERE published = true
        ORDER BY created_at DESC
        LIMIT ${limit} OFFSET ${offset}
      `;
      
      countResult = await sql`
        SELECT COUNT(*) as total FROM posts WHERE published = true
      `;
    }
    
    const total = parseInt(countResult[0].total);
    
    // Transform data to match frontend expectations
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
      slug: post.slug || `post-${post.id}`
    }));
    
    return new Response(
      JSON.stringify({
        success: true,
        posts: transformedPosts,
        total: total,
        hasMore: offset + limit < total,
        pagination: {
          limit,
          offset,
          mainCategory,
          subCategory,
          subSubCategory
        }
      }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      }
    );

  } catch (error) {
    console.error('Error in get-posts-hierarchical function:', error);
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

