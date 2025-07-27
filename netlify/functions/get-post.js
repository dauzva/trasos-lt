// netlify/functions/get-post.js
import { neon } from '@netlify/neon';

// Initialize Neon client
const sql = neon();

export default async function handler(event) {
  try {
    const url = new URL(event.rawUrl || event.url, `https://${event.headers.host}`);
    const postId = url.searchParams.get('id');
    if (!postId) {
      return new Response(JSON.stringify({
        success: false,
        error: 'Post ID is required'
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    console.log(`Fetching post with ID: ${postId}`);
    const result = await sql`
      SELECT * FROM public_posts 
      WHERE id = ${postId}
    `;
    if (result.length === 0) {
      return new Response(JSON.stringify({
        success: false,
        error: 'Post not found'
      }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    const post = result[0];
    const transformedPost = {
      id: post.id,
      title: post.display_title,
      content: post.content,
      category: post.category,
      timestamp: post.created_at,
      author: "AI Generatorius"
    };
    return new Response(JSON.stringify({
      success: true,
      post: transformedPost
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Error in get-post function:', error);
    return new Response(JSON.stringify({
      success: false,
      error: error.message
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
