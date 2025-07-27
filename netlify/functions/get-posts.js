// netlify/functions/get-posts.js
import { neon } from '@neondatabase/serverless';

// Initialize Neon client
const sql = neon(process.env.NETLIFY_DATABASE_URL);

export default async function handler(req, res) {
  try {
    const url = new URL(req.url, `https://${req.headers.host}`);
    const limit = parseInt(url.searchParams.get('limit')) || 10;
    const offset = parseInt(url.searchParams.get('offset')) || 0;
    const category = url.searchParams.get('category');
    
    console.log(`Fetching posts: limit=${limit}, offset=${offset}, category=${category}`);
    
    let posts, countResult;
    
    if (category) {
      // Filter by category
      posts = await sql`
        SELECT * FROM public_posts 
        WHERE category = ${category}
        LIMIT ${limit} OFFSET ${offset}
      `;
      
      countResult = await sql`
        SELECT COUNT(*) as total FROM posts 
        WHERE published = true AND category = ${category}
      `;
    } else {
      // Get all posts
      posts = await sql`
        SELECT * FROM public_posts 
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
      title: post.display_title,
      content: post.content,
      category: post.category,
      timestamp: post.created_at,
      author: "AI Generatorius",
      excerpt: post.excerpt,
      image_url: post.image_url
    }));
    
    res.status(200).json({
      success: true,
      posts: transformedPosts,
      total: total,
      hasMore: offset + limit < total,
      pagination: {
        limit,
        offset,
        category
      }
    });
    
  } catch (error) {
    console.error('Error in get-posts function:', error);
    res.status(500).json({ 
      success: false,
      error: error.message 
    });
  }
}

