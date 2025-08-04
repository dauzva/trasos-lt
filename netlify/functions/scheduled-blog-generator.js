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
import { categoryMapping } from '../../src/data/category-mapping.js';

// Utility functions from generate-blog.js
function parseFrontMatter(content) {
  const trimmed = content.trim();
  const lines = trimmed.split(/\r?\n/);
  let start = -1, end = -1;
  for (let i = 0; i < lines.length; i++) {
    if (lines[i].trim() === '---') {
      if (start === -1) {
        start = i;
      } else {
        end = i;
        break;
      }
    }
  }
  if (start === -1 || end === -1 || end <= start + 1) {
    return { frontMatter: {}, body: trimmed };
  }
  const frontMatterText = lines.slice(start + 1, end).join('\n');
  const body = lines.slice(end + 1).join('\n').trim();
  const frontMatter = {};
  frontMatterText.split('\n').forEach(line => {
    const match = line.trim().match(/^([^:]+):\s*(.*)$/);
    if (match) {
      const key = match[1].trim();
      let value = match[2].trim();
      value = value.replace(/^['\"](.*)['\"]$/, '$1');
      frontMatter[key] = value;
    }
  });
  return { frontMatter, body };
}

function extractTitle(content) {
  const lines = content.split(/\r?\n/);
  for (const line of lines) {
    const match = line.trim().match(/^#\s+(.+)$/);
    if (match) {
      return match[1].trim();
    }
  }
  return 'Naujas straipsnis';
}

function extractMetadata(content, fallbackCategory) {
  const { frontMatter } = parseFrontMatter(content);
  const metadata = {
    title: '',
    author: 'Virtualus žemės ūkio ekspertas',
    category: fallbackCategory,
    subcategory: '',
    tags: '',
    english_title: '',
    date: new Date().toISOString().slice(0, 10),
  };
  Object.keys(metadata).forEach(key => {
    if (frontMatter[key] && frontMatter[key].trim() !== '') {
      metadata[key] = frontMatter[key].trim();
    }
  });
  if (!metadata.title) {
    metadata.title = extractTitle(content);
  }
  if (Array.isArray(metadata.tags)) {
    metadata.tags = metadata.tags.join(', ');
  }
  return metadata;
}

function generateSlug(title) {
  return title
    .toLowerCase()
    .replace(/[ąčęėįšųūž]/g, match => ({'ą':'a','č':'c','ę':'e','ė':'e','į':'i','š':'s','ų':'u','ū':'u','ž':'z'}[match]||match))
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

function extractExcerpt(content, maxLength = 200) {
  let afterTitle = content;
  const h1Match = content.match(/^# .+$/m);
  if (h1Match) {
    const idx = content.indexOf(h1Match[0]) + h1Match[0].length;
    afterTitle = content.slice(idx).replace(/^\s+/, '');
  }
  const cleanContent = afterTitle
    .replace(/^#+\s+/gm, '')
    .replace(/\*\*(.*?)\*\*/g, '$1')
    .replace(/\*(.*?)\*/g, '$1')
    .replace(/`(.*?)`/g, '$1')
    .replace(/\[(.*?)\]\(.*?\)/g, '$1')
    .replace(/\n+/g, ' ')
    .trim();
  if (cleanContent.length <= maxLength) return cleanContent;
  return cleanContent.substring(0, maxLength).replace(/\s+\S*$/, '') + '...';
}

function generatePostId() {
  const timestamp = Date.now();
  const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
  return parseInt(`${timestamp.toString().slice(-6)}${random}`);
}

function getRandomCategoryAndSubcategory(categoryMap) {
  const categories = Object.keys(categoryMap);
  const randomCategory = categories[Math.floor(Math.random() * categories.length)];
  const mapping = categoryMap[randomCategory];
  let randomSubcategory = '';
  if (mapping && mapping.path && mapping.path.length > 1) {
    randomSubcategory = mapping.path[mapping.path.length - 1];
  }
  return { randomCategory, randomSubcategory };
}

function stripCodeBlockMarkers(md) {
  return md
    .replace(/^```markdown\s*/i, '')
    .replace(/^```\s*/i, '')
    .replace(/```\s*$/i, '')
    .trim();
}

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
    const { randomCategory, randomSubcategory } = getRandomCategoryAndSubcategory(categoryMapping);
    const today = new Date().toISOString().split("T")[0];
    const completion = await openai.chat.completions.create({
                             model: "openrouter/horizon-beta",
                             messages: [
                               {
                                 "role": "system",
                                 "content": `You are "Virtualus žemės ūkio ekspertas" — a professional Lithuanian-language content creator for an agricultural wiki.

                           ### TASK
                           Write a 1000-word blog post in Lithuanian about a specific agricultural topic defined by:
                           - Category: "${randomCategory}"
                           - Subcategory: "${randomSubcategory}"

                           Generate a complete Markdown file with YAML frontmatter and content. Output only the Markdown block — no explanations, no extra text.

                           ### OUTPUT FORMAT
                           \`\`\`markdown
                           ---
                           title: [Natural Lithuanian title]
                           author: Virtualus žemės ūkio ekspertas
                           category: ${randomCategory}
                           subcategory: ${randomSubcategory}
                           tags: [4–6 Lithuanian SEO keywords, comma-separated]
                           english_title: [Natural English translation of the title for image generation]
                           date: ${today}
                           ---

                           # [Same as title]

                           [Introduction paragraph explaining importance and context]

                           ## [Section heading 1]
                           [Detailed information with practical advice]

                           ### [Subsection if needed]
                           [More specific details]

                           ## [Section heading 2]
                           [Additional important information]

                           ### [Another subsection]
                           - **Bold item**: Description
                           - **Another item**: Description

                           ## [Section heading 3]
                           [Practical methods or techniques]

                           1. **Step one** - detailed explanation
                           2. **Step two** - detailed explanation
                           3. **Step three** - detailed explanation

                           ## Svarbu atsiminti

                           - Important point 1
                           - Important point 2
                           - Important point 3
                           - Important point 4
                           - Important point 5
                           \`\`\`

                           ### CONTENT REQUIREMENTS
                           1. **Length**: 800-1200 words of substantial, informative content
                           2. **Structure**: Use proper markdown with headers (##, ###), bold text (**text**), and lists
                           3. **Language**: All content in Lithuanian except english_title
                           4. **english_title**: Must be accurate English translation for image generation (e.g., "Apple Tree Fertilization in Spring")
                           5. **Tone**: Professional but accessible, like an experienced farmer sharing knowledge
                           6. **Content**: Science-based advice with practical applications

                           ### TECHNICAL RULES
                           - Remove ALL frontmatter metadata from the main content body
                           - Use proper markdown formatting: headers, bold text, lists
                           - Include seasonal timing, specific products, dosages, and methods
                           - End with "Svarbu atsiminti" section with 5 practical tips
                           - Tags should be relevant Lithuanian SEO keywords
                           - Never include image URLs, slugs, or excerpts in frontmatter

                           ### CONTENT FOCUS
                           - Provide specific, actionable advice
                           - Include timing recommendations (seasons, months)
                           - Mention specific fertilizer types, application rates
                           - Address common problems and solutions
                           - Use scientific backing but explain in simple terms

                           Now generate a blog post for category: "${randomCategory}", subcategory: "${randomSubcategory}". Output ONLY the markdown block with no additional text.`
                               },
                               {
                                 "role": "user",
                                 "content": `Parašyk 1000 žodžių straipsnį lietuvių kalba žemės ūkio wiki blogui apie temą: kategorija – "${randomCategory}", subkategorija – "${randomSubcategory}". Sugeneruok pilną Markdown failo turinį su frontmatter ir straipsniu. Laikykis visų nurodytų taisyklių.`
                               }
                             ],
                             max_tokens: 4000,
                             temperature: 0.75,
                             top_p: 0.95,
                             frequency_penalty: 0.2,
                             presence_penalty: 0.2,
                             repeat_penalty: 1.0,
                             stream: true
                           });

    let fullContent = completion.choices[0].message.content;
    const aiContent = stripCodeBlockMarkers(fullContent);
    const { frontMatter, body } = parseFrontMatter(aiContent);
    const metadata = extractMetadata(aiContent, randomCategory);
    const title = metadata.title;
    const safeTitle = title || metadata.title || 'straipsnis';
    const slug = (frontMatter.slug && String(frontMatter.slug).trim()) || generateSlug(safeTitle);
    const contentBody = body || aiContent.replace(/^---[\s\S]*?---/, '').trim();
    const excerpt = frontMatter.excerpt || extractExcerpt(contentBody);
    const id = frontMatter.id || generatePostId();
    let imageSearch = metadata.english_title || metadata.category || title || 'agriculture';
    imageSearch = Array.isArray(imageSearch) ? imageSearch.join(',') : imageSearch;
    const imageUrl = await fetchStockImage(imageSearch);
    const cleanContent = body || aiContent.replace(/^---[\s\S]*?---\s*/, '');
    const postData = {
      id,
      title: metadata.title || title,
      slug,
      excerpt,
      content: cleanContent,
      category: metadata.category || randomCategory,
      subcategory: metadata.subcategory || randomSubcategory,
      tags: metadata.tags || '',
      english_title: metadata.english_title || '',
      author: metadata.author || 'Virtualus žemės ūkio ekspertas',
      date: metadata.date || new Date().toISOString().slice(0, 10),
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
