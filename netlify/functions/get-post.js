// netlify/functions/get-post.js
import { neon } from '@neondatabase/serverless';

// Initialize Neon client
const sql = neon(process.env.NETLIFY_DATABASE_URL);

export default async function handler(req, res) {
  try {
    const url = new URL(req.url, `https://${req.headers.host}`);
    const pathParts = url.pathname.split('/');
    const postId = pathParts[pathParts.length - 1];
    
    if (!postId || postId === 'get-post') {
      return res.status(400).json({
        success: false,
        error: 'Post ID is required'
      });
    }
    
    console.log(`Fetching post with ID: ${postId}`);
    
    const result = await sql`
      SELECT * FROM public_posts 
      WHERE id = ${postId}
    `;
    
    if (result.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Post not found'
      });
    }
    
    const post = result[0];
    
    // Transform data to match frontend expectations
    const transformedPost = {
      id: post.id,
      title: post.display_title,
      content: post.content,
      category: post.category,
      timestamp: post.created_at,
      author: "AI Generatorius"
    };
    
    res.status(200).json({
      success: true,
      post: transformedPost
    });
    
  } catch (error) {
    console.error('Error in get-post function:', error);
    res.status(500).json({ 
      success: false,
      error: error.message 
    });
  }
}

