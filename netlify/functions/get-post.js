import { neon } from '@netlify/neon';

// Initialize Neon client
const sql = neon();

export default async function handler(event) {
  try {
    const url = new URL(event.rawUrl || event.url, `https://${event.headers.host}`);
    const postTitle = url.searchParams.get('title');
    if (!postTitle) {
      return new Response(JSON.stringify({
        success: false,
        error: 'Post title is required'
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    console.log(`Fetching post with title: ${postTitle}`);
    // Query all posts and match in JS for full transliteration compatibility
    const result = await sql`SELECT * FROM posts`;
    const post = result.find(p => kebabTitle(p.title) === postTitle);
    if (!post) {
      return new Response(JSON.stringify({
        success: false,
        error: 'Post not found'
      }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' }
      });
    }
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

// Helper to convert Lithuanian characters to ASCII
function ltToAscii(str) {
  return str
    .replace(/ą/g, 'a')
    .replace(/č/g, 'c')
    .replace(/ę/g, 'e')
    .replace(/ė/g, 'e')
    .replace(/į/g, 'i')
    .replace(/š/g, 's')
    .replace(/ų/g, 'u')
    .replace(/ū/g, 'u')
    .replace(/ž/g, 'z')
    .replace(/Ą/g, 'A')
    .replace(/Č/g, 'C')
    .replace(/Ę/g, 'E')
    .replace(/Ė/g, 'E')
    .replace(/Į/g, 'I')
    .replace(/Š/g, 'S')
    .replace(/Ų/g, 'U')
    .replace(/Ū/g, 'U')
    .replace(/Ž/g, 'Z');
}

function kebabTitle(title) {
  return ltToAscii(title)
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}
