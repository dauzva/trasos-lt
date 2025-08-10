import { neon } from '@netlify/neon';

// Initialize Neon client
const sql = neon();

export default async function handler(event) {
  try {
    const url = new URL(event.rawUrl || event.url, `https://${event.headers.host}`);
    const limit = parseInt(url.searchParams.get('limit')) || 10;
    const offset = parseInt(url.searchParams.get('offset')) || 0;
    const category = url.searchParams.get('category');
    
    console.log(`Fetching posts: limit=${limit}, offset=${offset}, category=${category}`);
    
    let posts, countResult;
    
    if (category) {
      // Filter by category, order by most recent
      posts = await sql`
        SELECT * FROM posts
        WHERE published = true AND category = ${category}
        ORDER BY created_at DESC
        LIMIT ${limit} OFFSET ${offset}
      `;
      
      countResult = await sql`
        SELECT COUNT(*) as total FROM posts 
        WHERE published = true AND category = ${category}
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
      image_url: post.image_url
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
          category
        }
      }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      }
    );

  } catch (error) {
    console.error('Error in get-posts function:', error);
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
