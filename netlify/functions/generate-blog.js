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
          "content": `write a 1000 word extensive blog post for agriculture wiki in lithuanian about one of the topics from the available categories/subcategories - pick a random one\nauthor: Virtualus žemės ūkio ekspertas\n\nWrite in markdown format with proper headings, subheadings, and detailed content. The post should be educational, practical, and helpful for Lithuanian farmers and gardeners. Include specific tips, techniques, and best practices.\n\nMake sure to:\n- Use proper Lithuanian language\n- Include practical advice\n- Structure with clear headings\n- Write approximately 1000 words\n- Focus on actionable information\n- Use markdown formatting\n\nStart with a main heading (# Title) and include several subheadings (## and ###).`
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
