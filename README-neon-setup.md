# NeonDB Integration Setup Guide

This guide explains how to set up NeonDB integration for the Trasos.lt website to store generated articles.

## Prerequisites

1. A Neon account (https://neon.tech)
2. A Netlify account for deployment
3. OpenRouter API key for AI generation
4. Mega.nz account for image storage

## Database Setup

1. Create a new Neon project
2. Run the SQL schema from `neon-schema.sql` in your Neon console:

```sql
-- Copy and paste the contents of neon-schema.sql
```

3. Get your database connection string from Neon dashboard

## Environment Variables

Set up the following environment variables in your Netlify dashboard:

```
NETLIFY_DATABASE_URL=postgresql://username:password@hostname/database
NETLIFY_DATABASE_URL=postgresql://username:password@hostname/database
OPENROUTER_API_KEY=your_openrouter_api_key
SITE_URL=https://your-site.netlify.app
MEGA_EMAIL=your_mega_email@example.com
MEGA_PASSWORD=your_mega_password
```

## Features Added

### Database Integration
- **NeonDB**: Stores all generated articles with metadata
- **Schema**: Optimized for blog posts with categories, timestamps, and image URLs
- **Views**: Public posts view with computed fields for better performance

### AI Article Generation
- **Manual Generation**: `/netlify/functions/generate-blog` endpoint
- **Scheduled Generation**: Automatic article generation every 6 hours
- **Content**: 1000-word articles in Lithuanian about agriculture topics

### Image Storage
- **Mega.nz Integration**: Automatic image upload for each article
- **Image URLs**: Stored in database and displayed with articles

### API Endpoints
- `GET /netlify/functions/get-posts` - Fetch paginated posts
- `GET /netlify/functions/get-post?id=123` - Fetch single post
- `POST /netlify/functions/generate-blog` - Generate new article

## Deployment

1. Push your code to GitHub
2. Connect your repository to Netlify
3. Set environment variables in Netlify dashboard
4. Deploy the site

## Automated Scheduling

The `scheduled-blog-generator` function runs automatically every 6 hours based on the cron schedule in `netlify.toml`:

```toml
[functions."scheduled-blog-generator"]
  schedule = "0 */6 * * *"
```

## Usage

### Frontend Components
- `RecentPosts.jsx` - Displays recent articles from database
- `BlogPosts.jsx` - Shows paginated blog posts
- Updated `App.jsx` - Integrates with NeonDB API

### Manual Article Generation
Visit `/netlify/functions/generate-blog` to manually trigger article generation.

### Database Queries
The `neon.js` library provides helper functions:
- `postsApi.getRecentPosts(limit, offset)`
- `postsApi.getPostsByCategory(category, limit, offset)`
- `postsApi.getPost(id)`
- `postsApi.searchPosts(query, limit)`

## Monitoring

Check Netlify function logs to monitor:
- Scheduled article generation
- Database operations
- API endpoint usage
- Error handling

