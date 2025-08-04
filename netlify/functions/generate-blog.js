// netlify/functions/generate-blog.js
import OpenAI from 'openai';
import { neon } from '@netlify/neon';
import { categoryMapping } from '../../src/data/category-mapping.js';

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
      INSERT INTO posts (
        id, slug, title, excerpt, content, category, subcategory, tags, english_title, author, date, published, image_url
      ) VALUES (
        ${postData.id},
        ${postData.slug},
        ${postData.title},
        ${postData.excerpt},
        ${postData.content},
        ${postData.category},
        ${postData.subcategory},
        ${postData.tags},
        ${postData.english_title},
        ${postData.author},
        ${postData.date},
        ${postData.published},
        ${postData.image_url}
      )
      RETURNING id, slug, title, content, category, created_at
    `;
    
    console.log('Post saved to Neon DB:', result[0].id);
    return result[0];
  } catch (error) {
    console.error('Error saving post to Neon DB:', error);
    throw error;
  }
}

/**
 * Extracts the H1 title from Markdown content.
 * Falls back to a default if no H1 is found.
 */
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

/**
 * Extracts metadata from content using frontmatter or fallbacks.
 * Ensures required fields are present.
 */
function extractMetadata(content, fallbackCategory) {
  const { frontMatter } = parseFrontMatter(content);

  // Default values
  const metadata = {
    title: '',
    author: 'Virtualus žemės ūkio ekspertas',
    category: fallbackCategory,
    subcategory: '',
    tags: '',
    english_title: '',
    date: new Date().toISOString().slice(0, 10),
  };

  // Populate from frontmatter if available
  Object.keys(metadata).forEach(key => {
    if (frontMatter[key] && frontMatter[key].trim() !== '') {
      metadata[key] = frontMatter[key].trim();
    }
  });

  // Fallback: extract title from H1 if not in frontmatter
  if (!metadata.title) {
    metadata.title = extractTitle(content);
  }

  // Normalize tags: ensure string
  if (Array.isArray(metadata.tags)) {
    metadata.tags = metadata.tags.join(', ');
  }

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
    // Use Unsplash API to search for a relevant photo in English
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

/**
 * Robustly parses YAML frontmatter from Markdown content.
 * Handles inconsistent line breaks and whitespace.
 */
function parseFrontMatter(content) {
  // Trim and normalize line endings
  const trimmed = content.trim();
  const lines = trimmed.split(/\r?\n/);

  // Look for the first and second '---' delimiters
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

  // Parse frontmatter line by line
  const frontMatter = {};
  frontMatterText.split('\n').forEach(line => {
    const match = line.trim().match(/^([^:]+):\s*(.*)$/);
    if (match) {
      const key = match[1].trim();
      let value = match[2].trim();
      // Remove surrounding quotes if present
      value = value.replace(/^['"](.*)['"]$/, '$1');
      frontMatter[key] = value;
    }
  });

  return { frontMatter, body };
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
  const cleanContent = content
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

// Helper to get a random category and subcategory
function getRandomCategoryAndSubcategory(categoryMap) {
  const categories = Object.keys(categoryMap);
  const randomCategory = categories[Math.floor(Math.random() * categories.length)];
  // Try to extract subcategory from mapping path if available
  const mapping = categoryMap[randomCategory];
  let randomSubcategory = '';
  if (mapping && mapping.path && mapping.path.length > 1) {
    randomSubcategory = mapping.path[mapping.path.length - 1];
  }
  return { randomCategory, randomSubcategory };
}

export default async function handler(event) {
  try {
    // Pick random category and subcategory
    const { randomCategory, randomSubcategory } = getRandomCategoryAndSubcategory(categoryMapping);
    // const categories = allCategorySlugs;
    // const randomCategory = categories[Math.floor(Math.random() * categories.length)];

    // Prepare OpenAI streaming request
    // Assume these are provided by your code
    const today = new Date().toISOString().split("T")[0]; // YYYY-MM-DD

    // Prepare OpenAI streaming request
    const stream = await openai.chat.completions.create({
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
    english_title: [Natural English translation of the title]
    date: ${today}
    ---

    # [Same as title]

    ## Introduction
    ...

    ## Main Information
    ...

    ## Conclusions
    ...

    ## Practical Tips
    - Tip 1
    - Tip 2
    ...
    \`\`\`

    ### CONTENT STRUCTURE
    1. **Introduction** – Explain why this topic matters in Lithuanian gardening or farming.
    2. **Main Information** – Cover types, methods, timing, best practices, and science-based advice.
    3. **Conclusions** – Summarize key benefits and outcomes.
    4. **Practical Tips** – Provide 5 actionable, real-world tips in a bullet list.

    ### TECHNICAL RULES
    - Language: Lithuanian for title, content, and \`tags\`.
    - \`english_title\`: A fluent, accurate English translation of the title — used to generate images (e.g., via DALL·E).
    - Use Markdown: at least two H2 headings (##), and lists where helpful.
    - \`tags\`: 4–6 Lithuanian SEO keywords (e.g., „obuoliai, tręšimas, pavasaris“).
    - Do **not** include: image, slug, excerpt — these are auto-generated later.
    - Never add comments, disclaimers, or text outside the Markdown block.

    ### SEO & STYLE
    - Use natural keyword integration (category, subcategory, season, methods).
    - Title should be compelling and search-friendly.
    - Tone: friendly, informative, trustworthy — like a local expert advising a farmer or gardener.

    ### EXAMPLE (reference only — do not copy)
    \`\`\`markdown
    ---
    title: Kaip tinkamai tręšti obelis pavasarį: efektyvūs būdai ir geriausios trąšos
    author: Virtualus žemės ūkio ekspertas
    category: Trąšos
    subcategory: obelėms
    tags: obelės, tręšimas, pavasaris, organinės trąšos, NPK, sodininkystė
    english_title: How to Properly Fertilize Apple Trees in Spring: Effective Methods and Best Fertilizers
    date: 2025-04-05
    ---

    # Kaip tinkamai tręšti obelis pavasarį: efektyvūs būdai ir geriausios trąšos

    ## Įvadas
    Pavasaris – svarbiausias metų laikas obelių priežiūrai. Šiuo metu medžiai atsigauna po žiemos, formuojasi žiedai ir prasideda aktyvi augimo faza...

    ## Kodėl pavasario tręšimas yra svarbus
    Obelims reikia didelio azoto kiekio ankstyvą pavasarį, kad skatintų lapų ir jaunų ūglių augimą...

    ### Geriausios trąšos obelims pavasarį
    - Skystos azoto trąšos – greitas poveikis
    - Kompleksinės NPK 15-5-15 formulės – subalansuotas mitybos šaltinis
    - Kompostas – organinis variantas, pagerinantis dirvožemio struktūrą

    ## Išvados
    Teisingas tręšimo grafikas ir trąšų pasirinkimas yra esminiai obelių sveikatai ir derlingumui...

    ## Praktiniai patarimai
    - Tręškite obelis kovo–balandžio mėn., kol dar nėra žydėjimo.
    - Venkite perdozavimo azotu – tai gali sumažinti žydėjimą.
    - Po tręšimo būtinai uždirbkite trąšas arba gerai laistykit.
    - Naudokite lietaus ar balto vandens maišymui, kad išvengtumėte cheminės reakcijos.
    - Reguliariai stebėkite lapų spalvą – pagal ją galima nustatyti trūkstamas maistines medžiagas.
    \`\`\`

    Now generate the blog post for category: "${randomCategory}", subcategory: "${randomSubcategory}". Output only the Markdown block.`
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

    let fullContent = '';
    const encoder = new TextEncoder();
    const readable = new ReadableStream({
      async start(controller) {
        let chunkCount = 0;
        for await (const chunk of stream) {
          const content = chunk.choices?.[0]?.delta?.content || '';
          if (content) {
            controller.enqueue(encoder.encode(content));
            fullContent += content;
            chunkCount++;
            console.log(`[STREAM] Received chunk #${chunkCount}:`, content.slice(0, 50));
          } else {
            console.log(`[STREAM] Empty chunk received.`);
          }
        }
        console.log(`[STREAM] Stream ended. Total chunks: ${chunkCount}`);
        // Use markdown processor logic
        const { frontMatter, body } = parseFrontMatter(fullContent);
        const metadata = extractMetadata(fullContent, randomCategory);
        const title = metadata.title;
        // Generate slug from title if not present
        const safeTitle = title || metadata.title || 'straipsnis';
        const slug = (frontMatter.slug && String(frontMatter.slug).trim()) || generateSlug(safeTitle);
        // Use only the body (no frontmatter) for content
        const contentBody = body || fullContent.replace(/^---[\s\S]*?---/, '').trim();
        const excerpt = frontMatter.excerpt || extractExcerpt(contentBody);
        const id = frontMatter.id || generatePostId();
        // Use only the english_title for Unsplash image search if available, fallback to category/title
        let imageSearch = metadata.english_title || metadata.category || title || 'agriculture';
        imageSearch = Array.isArray(imageSearch) ? imageSearch.join(',') : imageSearch;
        const imageUrl = await fetchStockImage(imageSearch);
        const postData = {
          id,
          title: safeTitle,
          slug,
          excerpt,
          content: contentBody, // Only the article body, not full markdown
          category: metadata.category || randomCategory,
          subcategory: metadata.subcategory || randomSubcategory,
          tags: metadata.tags || '',
          english_title: metadata.english_title || '',
          author: metadata.author || 'Virtualus žemės ūkio ekspertas',
          date: metadata.date || new Date().toISOString().slice(0, 10),
          published: true,
          image_url: imageUrl || null
        };
        // Format the post for PostPage consumption
        const formattedPost = {
          id,
          title: safeTitle,
          content: contentBody,
          category: metadata.category || randomCategory,
          subcategory: metadata.subcategory || randomSubcategory,
          tags: (metadata.tags || '').split(',').map(t => t.trim()).filter(Boolean),
          author: metadata.author || 'Virtualus žemės ūkio ekspertas',
          date: metadata.date || new Date().toISOString().slice(0, 10),
          image: imageUrl || null,
          timestamp: new Date().toISOString(),
          excerpt
        };
        await savePost(postData);
        controller.close();
      }
    });

    return new Response(readable, {
      status: 200,
      headers: { 'Content-Type': 'text/markdown; charset=utf-8', 'Transfer-Encoding': 'chunked' }
    });
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
