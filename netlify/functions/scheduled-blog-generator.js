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

// Extract metadata from generated markdown content
function extractMetadata(content, fallbackCategory) {
  const frontmatterMatch = content.match(/^---([\s\S]*?)---/);
  let metadata = {
    title: '',
    author: 'Virtualus žemės ūkio ekspertas',
    category: fallbackCategory,
    subcategory: '',
    tags: '',
    date: new Date().toISOString().slice(0, 10),
  };
  if (frontmatterMatch) {
    const fm = frontmatterMatch[1];
    fm.split('\n').forEach(line => {
      const [key, ...rest] = line.split(':');
      if (key && rest.length) {
        const value = rest.join(':').trim();
        if (key.trim() in metadata) metadata[key.trim()] = value;
      }
    });
  }
  if (!metadata.title) metadata.title = extractTitle(content);
  if (!metadata.category) metadata.category = fallbackCategory;
  return metadata;
}

// Fetch a free stock image from Unsplash using the official API (in English)
async function fetchStockImage(keyword) {
  try {
    const accessKey = process.env.UNSPLASH_ACCESS_KEY;
    if (!accessKey) {
      console.warn('No Unsplash access key set. Set UNSPLASH_ACCESS_KEY in your environment.');
      return null;
    }
    const query = encodeURIComponent(keyword);
    const response = await fetch(`https://api.unsplash.com/photos/random?query=${query}&orientation=landscape&client_id=${accessKey}`);
    if (!response.ok) return null;
    const data = await response.json();
    return data.urls && data.urls.regular ? data.urls.regular : null;
  } catch (e) {
    console.error('Error fetching stock image:', e);
    return null;
  }
}

// This function runs automatically based on cron schedule
export default async function handler(req, res) {
  try {
    console.log('Starting scheduled blog generation...');
    const randomCategory = allCategorySlugs[Math.floor(Math.random() * allCategorySlugs.length)];
    // Generate blog post content with YAML frontmatter
    const completion = await openai.chat.completions.create({
      model: "z-ai/glm-4.5-air:free",
      messages: [
        {
          "role": "user",
          "content": `Parašyk 1000 žodžių straipsnį lietuvių kalba žemės ūkio wiki blogui apie kategoriją \"${randomCategory}\". Sugeneruok Markdown failą su YAML frontmatter, kuriame būtų: title, author (\"Virtualus žemės ūkio ekspertas\"), category, subcategory (jei aktualu), tags (4-6 žodžiai), date (šiandienos data, YYYY-MM-DD). Po frontmatter pateik turinį su antraštėmis, sąrašais, pavyzdžiais. Naudok SEO raktažodžius, draugišką ir informatyvų toną. Struktūruok: įvadas, pagrindas, išvados, praktiniai patarimai.`
        },
        {
          "role": "system",
          "content": "Tu esi lietuvių žemės ūkio ekspertas, generuoji kokybiškus, SEO optimizuotus blogo įrašus aukšto lygio lietuvių kalba."
        }
      ],
      max_tokens: 4000,
      temperature: 1,
      top_p: 1,
      frequency_penalty: 0.0,
      presence_penalty: 0.0,
      repeat_penalty: 1.0
    });
    const content = completion.choices[0].message.content;
    const metadata = extractMetadata(content, randomCategory);
    // Fetch Unsplash image
    const imageUrl = await fetchStockImage(metadata.category || metadata.title || 'agriculture');
    // Save post to DB
    const postData = {
      title: metadata.title,
      content,
      category: metadata.category,
      subcategory: metadata.subcategory,
      tags: metadata.tags,
      author: metadata.author,
      date: metadata.date,
      published: true,
      image_url: imageUrl || null
    };
    await savePost(postData);
    res.status(200).json({ success: true, message: 'Scheduled blog post generated and saved.' });
  } catch (error) {
    console.error('Error in scheduled blog generation:', error);
    res.status(500).json({ success: false, error: error.message });
  }
}
