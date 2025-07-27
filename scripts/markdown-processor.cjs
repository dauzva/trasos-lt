#!/usr/bin/env node

const fs = require('fs')
const path = require('path')
const crypto = require('crypto')

/**
 * Markdown to Post Processor
 * 
 * This script processes markdown files and converts them into post objects
 * that can be imported into the React application.
 * 
 * Usage:
 * node markdown-processor.js <markdown-file> [options]
 * 
 * Options:
 * --output-dir: Directory to save the processed post (default: src/data/posts)
 * --category: Main category (trąšos, sėklos, sodinukai, apsaugos-priemonės)
 * --subcategory: Subcategory slug
 * --author: Author name
 * --image: Image path/URL
 * --tags: Comma-separated tags
 */

class MarkdownProcessor {
  constructor() {
    this.outputDir = 'src/data/posts'
    this.postsDataFile = 'src/data/posts.js'
  }

  parseMarkdownFile(filePath) {
    if (!fs.existsSync(filePath)) {
      throw new Error(`Markdown file not found: ${filePath}`)
    }

    const content = fs.readFileSync(filePath, 'utf-8')
    const { frontMatter, body } = this.parseFrontMatter(content)
    
    return {
      frontMatter,
      content: body
    }
  }

  parseFrontMatter(content) {
    const frontMatterRegex = /^---\s*\n([\s\S]*?)\n---\s*\n([\s\S]*)$/
    const match = content.match(frontMatterRegex)
    
    if (!match) {
      return {
        frontMatter: {},
        body: content
      }
    }

    const frontMatterText = match[1]
    const body = match[2]
    
    const frontMatter = {}
    frontMatterText.split('\n').forEach(line => {
      const colonIndex = line.indexOf(':')
      if (colonIndex > 0) {
        const key = line.substring(0, colonIndex).trim()
        const value = line.substring(colonIndex + 1).trim().replace(/^["']|["']$/g, '')
        frontMatter[key] = value
      }
    })

    return { frontMatter, body }
  }

  generateSlug(title) {
    return title
      .toLowerCase()
      .replace(/[ąčęėįšųūž]/g, (match) => {
        const map = {
          'ą': 'a', 'č': 'c', 'ę': 'e', 'ė': 'e', 'į': 'i',
          'š': 's', 'ų': 'u', 'ū': 'u', 'ž': 'z'
        }
        return map[match] || match
      })
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim('-')
  }

  extractExcerpt(content, maxLength = 200) {
    // Remove markdown headers and formatting
    const cleanContent = content
      .replace(/^#+\s+/gm, '') // Remove headers
      .replace(/\*\*(.*?)\*\*/g, '$1') // Remove bold
      .replace(/\*(.*?)\*/g, '$1') // Remove italic
      .replace(/`(.*?)`/g, '$1') // Remove code
      .replace(/\[(.*?)\]\(.*?\)/g, '$1') // Remove links
      .replace(/\n+/g, ' ') // Replace newlines with spaces
      .trim()

    if (cleanContent.length <= maxLength) {
      return cleanContent
    }

    return cleanContent.substring(0, maxLength).replace(/\s+\S*$/, '') + '...'
  }

  generatePostId() {
    // Generate a unique ID based on timestamp and random bytes
    const timestamp = Date.now()
    const random = crypto.randomBytes(2).toString('hex')
    return parseInt(`${timestamp.toString().slice(-6)}${parseInt(random, 16)}`)
  }

  createPostObject(markdownData, options = {}) {
    const { frontMatter, content } = markdownData
    
    const title = frontMatter.title || options.title || 'Untitled Post'
    const slug = frontMatter.slug || this.generateSlug(title)
    const excerpt = frontMatter.excerpt || this.extractExcerpt(content)
    
    return {
      id: frontMatter.id || this.generatePostId(),
      title,
      slug,
      excerpt,
      content,
      author: frontMatter.author || options.author || 'Anonymous',
      date: frontMatter.date || new Date().toISOString().split('T')[0],
      category: frontMatter.category || options.category || 'General',
      image: frontMatter.image || options.image || null,
      tags: frontMatter.tags 
        ? frontMatter.tags.split(',').map(tag => tag.trim())
        : (options.tags ? options.tags.split(',').map(tag => tag.trim()) : [])
    }
  }

  updatePostsDataFile(newPost, category, subcategory) {
    if (!fs.existsSync(this.postsDataFile)) {
      console.error(`Posts data file not found: ${this.postsDataFile}`)
      return false
    }

    let postsContent = fs.readFileSync(this.postsDataFile, 'utf-8')
    
    // Find the category and subcategory in the file
    const categoryKey = category.toLowerCase()
    const subcategoryKey = subcategory.toLowerCase()
    
    // Look for the subcategory array
    const subcategoryRegex = new RegExp(
      `'${subcategoryKey}':\\s*\\[([\\s\\S]*?)\\](?=\\s*[,}])`,
      'g'
    )
    
    const match = subcategoryRegex.exec(postsContent)
    
    if (match) {
      // Add the new post to existing array
      const existingPosts = match[1].trim()
      const newPostStr = JSON.stringify(newPost, null, 6)
        .split('\n')
        .map((line, index) => index === 0 ? '      ' + line : '      ' + line)
        .join('\n')
      
      const updatedArray = existingPosts 
        ? `[\n${existingPosts.replace(/\s+$/, '')},\n${newPostStr}\n    ]`
        : `[\n${newPostStr}\n    ]`
      
      postsContent = postsContent.replace(match[0], `'${subcategoryKey}': ${updatedArray}`)
    } else {
      // Create new subcategory
      const categoryRegex = new RegExp(
        `'${categoryKey}':\\s*{([\\s\\S]*?)}(?=\\s*[,}])`,
        'g'
      )
      
      const categoryMatch = categoryRegex.exec(postsContent)
      
      if (categoryMatch) {
        const newPostStr = JSON.stringify(newPost, null, 6)
          .split('\n')
          .map((line, index) => index === 0 ? '      ' + line : '      ' + line)
          .join('\n')
        
        const newSubcategory = `    '${subcategoryKey}': [\n${newPostStr}\n    ]`
        
        const existingContent = categoryMatch[1].trim()
        const updatedCategory = existingContent
          ? `{\n${existingContent.replace(/\s+$/, '')},\n${newSubcategory}\n  }`
          : `{\n${newSubcategory}\n  }`
        
        postsContent = postsContent.replace(categoryMatch[0], `'${categoryKey}': ${updatedCategory}`)
      } else {
        console.error(`Category '${categoryKey}' not found in posts data file`)
        return false
      }
    }
    
    fs.writeFileSync(this.postsDataFile, postsContent, 'utf-8')
    return true
  }

  processMarkdownFile(filePath, options = {}) {
    try {
      console.log(`Processing markdown file: ${filePath}`)
      
      const markdownData = this.parseMarkdownFile(filePath)
      const post = this.createPostObject(markdownData, options)
      
      console.log(`Generated post:`)
      console.log(`- ID: ${post.id}`)
      console.log(`- Title: ${post.title}`)
      console.log(`- Slug: ${post.slug}`)
      console.log(`- Author: ${post.author}`)
      console.log(`- Category: ${post.category}`)
      console.log(`- Tags: ${post.tags.join(', ')}`)
      
      if (options.category && options.subcategory) {
        const success = this.updatePostsDataFile(post, options.category, options.subcategory)
        if (success) {
          console.log(`✅ Post added to ${options.category}/${options.subcategory}`)
        } else {
          console.log(`❌ Failed to add post to data file`)
        }
      } else {
        console.log(`⚠️  Category and subcategory not specified. Post object created but not added to data file.`)
        console.log(`Post object:`)
        console.log(JSON.stringify(post, null, 2))
      }
      
      return post
    } catch (error) {
      console.error(`Error processing markdown file: ${error.message}`)
      return null
    }
  }
}

// CLI interface
function main() {
  const args = process.argv.slice(2)
  
  if (args.length === 0 || args.includes('--help') || args.includes('-h')) {
    console.log(`
Markdown to Post Processor

Usage:
  node markdown-processor.js <markdown-file> [options]

Options:
  --category <category>      Main category (trąšos, sėklos, sodinukai, apsaugos-priemonės)
  --subcategory <subcategory> Subcategory slug
  --author <author>          Author name
  --image <image>            Image path/URL
  --tags <tags>              Comma-separated tags
  --title <title>            Override title from markdown
  --help, -h                 Show this help message

Example:
  node markdown-processor.js my-post.md --category trąšos --subcategory vaismedžiams --author "Dr. Jonas Petraitis" --tags "obelės,pavasaris,tręšimas"
    `)
    return
  }

  const filePath = args[0]
  const options = {}
  
  for (let i = 1; i < args.length; i += 2) {
    const flag = args[i]
    const value = args[i + 1]
    
    switch (flag) {
      case '--category':
        options.category = value
        break
      case '--subcategory':
        options.subcategory = value
        break
      case '--author':
        options.author = value
        break
      case '--image':
        options.image = value
        break
      case '--tags':
        options.tags = value
        break
      case '--title':
        options.title = value
        break
    }
  }
  
  const processor = new MarkdownProcessor()
  processor.processMarkdownFile(filePath, options)
}

if (require.main === module) {
  main()
}

module.exports = MarkdownProcessor

