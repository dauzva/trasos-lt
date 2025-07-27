# Netlify Automation Guide for Trasos.lt

## Overview

Yes, you **do need to use Netlify's servers** to run AI automation periodically. Here's why and how to set it up:

## Why Netlify for Automation?

### 1. **Serverless Functions**
- Netlify provides serverless functions that can run your AI generation code
- No need to maintain a separate server infrastructure
- Automatic scaling and cost-effective (pay per execution)

### 2. **Built-in Scheduling**
- Netlify supports cron-based scheduling through `netlify.toml`
- Your `scheduled-blog-generator.js` will run automatically every 6 hours
- No external cron services needed

### 3. **Environment Variables**
- Secure storage for API keys and database credentials
- Easy management through Netlify dashboard
- Automatic injection into function runtime

## Setup Steps

### 1. Deploy to Netlify

```bash
# Push your code to GitHub first
git add .
git commit -m "Add NeonDB integration and AI automation"
git push origin main

# Then connect to Netlify:
# 1. Go to netlify.com
# 2. Click "New site from Git"
# 3. Connect your GitHub repository
# 4. Deploy settings will be auto-detected from netlify.toml
```

### 2. Configure Environment Variables

In your Netlify dashboard, go to Site Settings → Environment Variables and add:

```
NETLIFY_DATABASE_URL=postgresql://username:password@hostname/database
NETLIFY_DATABASE_URL=postgresql://username:password@hostname/database
OPENROUTER_API_KEY=your_openrouter_api_key
SITE_URL=https://your-site.netlify.app
MEGA_EMAIL=your_mega_email@example.com
MEGA_PASSWORD=your_mega_password
```

### 3. Database Setup

Run this SQL in your Neon console:

```sql
-- Create posts table
CREATE TABLE posts (
  id BIGSERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  content TEXT NOT NULL,
  category VARCHAR(50) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  published BOOLEAN DEFAULT true,
  image_url VARCHAR(255) DEFAULT NULL
);

-- Create indexes
CREATE INDEX idx_posts_category ON posts(category);
CREATE INDEX idx_posts_created_at ON posts(created_at DESC);
CREATE INDEX idx_posts_published ON posts(published);
CREATE INDEX idx_posts_published_created ON posts(published, created_at DESC);

-- Create public view
CREATE VIEW public_posts AS
SELECT 
  id, title, content, category, created_at, image_url,
  CASE 
    WHEN LENGTH(content) > 200 THEN 
      SUBSTRING(content FROM 1 FOR 200) || '...'
    ELSE content
  END as excerpt,
  CASE 
    WHEN title = '' OR title IS NULL THEN 
      TRIM(REGEXP_REPLACE(SPLIT_PART(content, E'\n', 1), '^#+\s*', ''))
    ELSE title
  END as display_title
FROM posts 
WHERE published = true
ORDER BY created_at DESC;
```

## How Automation Works

### 1. **Scheduled Function**
- `netlify/functions/scheduled-blog-generator.js` runs every 6 hours
- Configured in `netlify.toml`: `schedule = "0 */6 * * *"`
- Generates Lithuanian agriculture articles automatically

### 2. **Manual Trigger**
- `netlify/functions/generate-blog.js` can be called manually
- Visit: `https://your-site.netlify.app/.netlify/functions/generate-blog`
- Useful for testing or generating content on-demand

### 3. **API Endpoints**
- `/.netlify/functions/get-posts` - Fetch paginated posts
- `/.netlify/functions/get-post?id=123` - Get single post
- Used by your React frontend to display content

## Content Generation Process

1. **AI Generation**: Uses OpenRouter API with Qwen model
2. **Content Creation**: Generates 1000-word articles in Lithuanian
3. **Image Upload**: Creates placeholder images and uploads to Mega.nz
4. **Database Storage**: Saves article with metadata to NeonDB
5. **Frontend Display**: React components fetch and display content

## Monitoring and Maintenance

### 1. **Function Logs**
- Check Netlify dashboard → Functions tab
- Monitor execution logs and errors
- Set up notifications for failures

### 2. **Database Monitoring**
- Use Neon dashboard to monitor database usage
- Check query performance and storage
- Set up alerts for connection issues

### 3. **Content Quality**
- Review generated articles periodically
- Adjust AI prompts if needed
- Monitor category distribution

## Alternative Approaches

If you don't want to use Netlify automation, alternatives include:

### 1. **GitHub Actions**
- Run scheduled workflows
- Requires separate hosting for the website
- More complex setup but more control

### 2. **Vercel Functions**
- Similar to Netlify but different platform
- Good integration with Next.js
- Cron jobs available in Pro plan

### 3. **Traditional VPS**
- Full control over scheduling
- Requires server maintenance
- Higher costs and complexity

## Cost Considerations

### Netlify Pricing
- **Free tier**: 125,000 function invocations/month
- **Pro tier**: $19/month for more invocations
- Your 6-hour schedule = ~120 invocations/month (well within free tier)

### NeonDB Pricing
- **Free tier**: 0.5GB storage, 100 hours compute/month
- **Pro tier**: $19/month for more resources

## Recommended Setup

For your use case, **Netlify + NeonDB is the optimal choice** because:

1. ✅ **Cost-effective**: Free tiers cover your needs
2. ✅ **Maintenance-free**: No server management
3. ✅ **Reliable**: Enterprise-grade infrastructure
4. ✅ **Scalable**: Grows with your content needs
5. ✅ **Integrated**: Everything works together seamlessly

## Next Steps

1. **Deploy to Netlify** using the provided files
2. **Set up environment variables** in Netlify dashboard
3. **Create NeonDB database** and run the schema
4. **Test the automation** by checking function logs
5. **Monitor content generation** and adjust as needed

The automation will start working immediately after deployment, generating high-quality Lithuanian agriculture content every 6 hours automatically.

