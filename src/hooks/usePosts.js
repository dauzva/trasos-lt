import { useState, useEffect } from 'react'

// Custom hook for fetching posts from the API
export const usePosts = (category = null, limit = 10, offset = 0) => {
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [total, setTotal] = useState(0)
  const [hasMore, setHasMore] = useState(false)

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true)
        setError(null)
        
        const params = new URLSearchParams({
          limit: limit.toString(),
          offset: offset.toString()
        })
        
        if (category) {
          params.append('category', category)
        }
        
        const response = await fetch(`/netlify/functions/get-posts?${params}`)

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }
        
        const data = await response.json()
        
        if (data.success) {
          setPosts(data.posts)
          setTotal(data.total)
          setHasMore(data.hasMore)
        } else {
          throw new Error(data.error || 'Failed to fetch posts')
        }
      } catch (err) {
        console.error('Error fetching posts:', err)
        setError(err.message)
        // Fallback to empty array on error
        setPosts([])
        setTotal(0)
        setHasMore(false)
      } finally {
        setLoading(false)
      }
    }

    fetchPosts()
  }, [category, limit, offset])

  return { posts, loading, error, total, hasMore }
}

// Custom hook for fetching a single post by ID
export const usePost = (postId) => {
  const [post, setPost] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchPost = async () => {
      try {
        setLoading(true)
        setError(null)
        
        const response = await fetch(`/netlify/functions/get-post?id=${postId}`)

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }
        
        const data = await response.json()
        
        if (data.success) {
          setPost(data.post)
        } else {
          throw new Error(data.error || 'Failed to fetch post')
        }
      } catch (err) {
        console.error('Error fetching post:', err)
        setError(err.message)
        setPost(null)
      } finally {
        setLoading(false)
      }
    }

    if (postId) {
      fetchPost()
    }
  }, [postId])

  return { post, loading, error }
}

// Helper function to search posts (for future search functionality)
export const useSearchPosts = (query, limit = 10) => {
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!query || query.trim().length < 2) {
      setPosts([])
      setLoading(false)
      return
    }

    const searchPosts = async () => {
      try {
        setLoading(true)
        setError(null)
        
        const params = new URLSearchParams({
          q: query.trim(),
          limit: limit.toString()
        })
        
        // Note: This endpoint doesn't exist yet, will be implemented in search phase
        const response = await fetch(`/netlify/functions/search-posts?${params}`)

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }
        
        const data = await response.json()
        
        if (data.success) {
          setPosts(data.posts)
        } else {
          throw new Error(data.error || 'Failed to search posts')
        }
      } catch (err) {
        console.error('Error searching posts:', err)
        setError(err.message)
        setPosts([])
      } finally {
        setLoading(false)
      }
    }

    const timeoutId = setTimeout(searchPosts, 300) // Debounce search
    return () => clearTimeout(timeoutId)
  }, [query, limit])

  return { posts, loading, error }
}

