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
      SELECT * FROM posts
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
      title: post.title, // use correct column
      content: post.content,
      category: post.category,
      subcategory: post.subcategory,
      tags: post.tags,
      author: post.author,
      date: post.date || post.created_at,
      image: post.image_url || null,
      timestamp: post.created_at
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
