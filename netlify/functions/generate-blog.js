// netlify/functions/generate-blog.js
import OpenAI from 'openai';
import { neon } from '@neondatabase/serverless';

const openai = new OpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: process.env.OPENROUTER_API_KEY,
  defaultHeaders: {
    "HTTP-Referer": process.env.SITE_URL,
    "X-Title": "Trasos.lt Blog Generator",
  },
});

// Initialize Neon client
const sql = neon(process.env.NETLIFY_DATABASE_URL);

// Available categories for random selection (ASCII-compatible)
import { allCategorySlugs } from '../../src/data/category-mapping.js';
import { uploadImage } from '../../src/lib/mega.js';

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

export default async function handler(req, res) {
  try {
    // Randomly select a category for the blog post
    const randomCategory = categories[Math.floor(Math.random() * categories.length)];
    
    // Generate blog post content
    const completion = await openai.chat.completions.create({
      model: "qwen/qwen3-235b-a22b-2507:free",
      messages: [
        {
          "role": "user",
          "content": `write a 1000 word extensive blog post for agriculture wiki in lithuanian about one of the topics from the available categories/subcategories - pick a random one
author: Virtualus žemės ūkio ekspertas

Write in markdown format with proper headings, subheadings, and detailed content. The post should be educational, practical, and helpful for Lithuanian farmers and gardeners. Include specific tips, techniques, and best practices.

Make sure to:
- Use proper Lithuanian language
- Include practical advice
- Structure with clear headings
- Write approximately 1000 words
- Focus on actionable information
- Use markdown formatting

Start with a main heading (# Title) and include several subheadings (## and ###).`
        }
      ],
    });

    const content = completion.choices[0].message.content;
    const title = extractTitle(content);
    
    // Generate a dummy image buffer for Mega upload (replace with actual image generation)
    const dummyImageBuffer = Buffer.from("This is a dummy image content for " + title);
    const fileName = `${Date.now()}.jpg`; // Unique filename
    
    // Upload image to Mega.nz
    const megaImageUrl = await uploadImage(fileName, dummyImageBuffer);

    // Create compact post object
    const postData = {
      title: title,
      content: content,
      category: randomCategory,
      published: true,
      image_url: megaImageUrl
    };
    
    // Save to Neon DB
    const savedPost = await savePost(postData);
    
    res.status(200).json({
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
    });
  } catch (error) {
    console.error('Error generating blog post:', error);
    res.status(500).json({ error: error.message });
  }
}

