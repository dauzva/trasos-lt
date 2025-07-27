// src/lib/neon.js
import { neon } from '@neondatabase/serverless';

// Initialize Neon client
const sql = neon(import.meta.env.NETLIFY_DATABASE_URL);

// Helper functions for posts
export const postsApi = {
  // Get recent posts with pagination
  async getRecentPosts(limit = 10, offset = 0) {
    try {
      const posts = await sql`
        SELECT * FROM public_posts 
        LIMIT ${limit} OFFSET ${offset}
      `;
      
      const countResult = await sql`
        SELECT COUNT(*) as total FROM posts WHERE published = true
      `;
      
      return { 
        posts: posts, 
        total: parseInt(countResult[0].total) 
      };
    } catch (error) {
      console.error('Error fetching recent posts:', error);
      throw error;
    }
  },

  // Get posts by category
  async getPostsByCategory(category, limit = 10, offset = 0) {
    try {
      const posts = await sql`
        SELECT * FROM public_posts 
        WHERE category = ${category}
        LIMIT ${limit} OFFSET ${offset}
      `;
      
      const countResult = await sql`
        SELECT COUNT(*) as total FROM posts 
        WHERE published = true AND category = ${category}
      `;
      
      return { 
        posts: posts, 
        total: parseInt(countResult[0].total) 
      };
    } catch (error) {
      console.error('Error fetching posts by category:', error);
      throw error;
    }
  },

  // Get single post by ID
  async getPost(id) {
    try {
      const result = await sql`
        SELECT * FROM public_posts 
        WHERE id = ${id}
      `;
      
      if (result.length === 0) {
        throw new Error('Post not found');
      }
      
      return result[0];
    } catch (error) {
      console.error('Error fetching post:', error);
      throw error;
    }
  },

  // Search posts
  async searchPosts(query, limit = 10) {
    try {
      const posts = await sql`
        SELECT * FROM public_posts 
        WHERE title ILIKE ${'%' + query + '%'} 
           OR content ILIKE ${'%' + query + '%'}
        LIMIT ${limit}
      `;
      
      return posts;
    } catch (error) {
      console.error('Error searching posts:', error);
      throw error;
    }
  }
};

