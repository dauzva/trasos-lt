// netlify/functions/generate-blog.js
import OpenAI from 'openai';
import { neon } from '@netlify/neon';

const openai = new OpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: process.env.OPENROUTER_API_KEY,
  defaultHeaders: {
    "HTTP-Referer": process.env.SITE_URL,
    "X-Title": "Trasos.lt Blog Generator",
  },
});

// Initialize Neon client
const sql = neon();

// Available categories for random selection (ASCII-compatible)
import { allCategorySlugs } from '../../src/data/category-mapping.js';

// Save post to Neon DB
async function savePost(postData) {
  try {
    const result = await sql`
      INSERT INTO posts (title, content, category, published, image_url)
      VALUES (${postData.title}, ${postData.content}, ${postData.category}, ${postData.published}, ${postData.image_url})
      RETURNING id, title, content, category, created_at
    `;
    
    console.log('Post saved to Neon DB:', result[0].id);
    return result[0];
  } catch (error) {
    console.error('Error saving post to Neon DB:', error);
    throw error;
  }
}

// Extract title from markdown content
function extractTitle(content) {
  const lines = content.split('\n');
  const titleLine = lines.find(line => line.trim().startsWith('#'));
  if (titleLine) {
    return titleLine.replace(/^#+\s*/, '').trim();
  }
  return 'Naujas straipsnis';
}

export default async function handler(event) {
  try {
    // Randomly select a category for the blog post
    const categories = allCategorySlugs;
    const randomCategory = categories[Math.floor(Math.random() * categories.length)];

    // Generate blog post content
    const completion = await openai.chat.completions.create({
      model: "qwen/qwen3-235b-a22b-2507:free",
      messages: [
        {
          "role": "user",
          "content": "Write a 1000-word blog post in Lithuanian for Agriculture Wiki about" + randomCategory + ". author: Virtualus žemės ūkio ekspertas. Create a Markdown file with front matter (title, author, category, image, tags, date) followed by content in Markdown format including headings, lists, and examples. Use a friendly and informative tone. Include relevant keywords for SEO. The post should be well-structured with an introduction, main content, and conclusion. Make sure to include practical tips and examples where applicable."
        }
      ],
    });

    const content = completion.choices[0].message.content;
    const title = extractTitle(content);

    // Set image_url to null
    const postData = {
      title: title,
      content: content,
      category: randomCategory,
      published: true,
      image_url: null
    };

    // Save to Neon DB
    const savedPost = await savePost(postData);

    return new Response(
      JSON.stringify({
        success: true,
        post: {
          id: savedPost.id,
          title: savedPost.title,
          content: savedPost.content,
          category: savedPost.category,
          created_at: savedPost.created_at,
          author: "AI Generatorius",
          image_url: savedPost.image_url
        }
      }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  } catch (error) {
    console.error('Error generating blog post:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
}
