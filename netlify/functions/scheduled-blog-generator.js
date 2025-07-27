// netlify/functions/scheduled-blog-generator.js
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
      RETURNING id, title, category, created_at
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

// This function runs automatically based on cron schedule
export default async function handler(req, res) {
  try {
    console.log('Starting scheduled blog generation...');    // Randomly select a category for the blog post
    const randomCategory = allCategorySlugs[Math.floor(Math.random() * allCategorySlugs.length)];
    
    // Generate blog post content
    const completion = await openai.chat.completions.create({
      model: "qwen/qwen-2.5-72b-instruct",
      messages: [
        {
          "role": "user",
          "content": `write a 1000 word extensive blog post for agriculture wiki in lithuanian about one of the topics from the available categories/subcategories - pick a random one\nauthor: Virtualus žemės ūkio ekspertas\n\nWrite in markdown format with proper headings, subheadings, and detailed content. The post should be educational, practical, and helpful for Lithuanian farmers and gardeners. Include specific tips, techniques, and best practices.\n\nMake sure to:\n- Use proper Lithuanian language\n- Include practical advice\n- Structure with clear headings\n- Write approximately 1000 words\n- Focus on actionable information\n- Use markdown formatting\n\nStart with a main heading (# Title) and include several subheadings (## and ###).`
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
    
    console.log("Blog post generated and saved successfully:", savedPost.id);
    res.status(200).json({ 
      success: true, 
      message: "Blog post generated and saved to Neon DB",
      post: {
        id: savedPost.id,
        title: savedPost.title,
        category: savedPost.category,
        created_at: savedPost.created_at,
        image_url: savedPost.image_url
      }
    });  } catch (error) {
    console.error('Scheduled generation error:', error);
    res.status(500).json({ 
      error: error.message,
      success: false
    });
  }
}

