import { useState, useEffect } from 'react'

// Custom hook for fetching posts with hierarchical category logic
export const useHierarchicalPosts = (mainCategory, subCategory, subSubCategory, limit = 10, offset = 0) => {
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
        
        if (mainCategory) {
          params.append('mainCategory', mainCategory)
        }
        if (subCategory) {
          params.append('subCategory', subCategory)
        }
        if (subSubCategory) {
          params.append('subSubCategory', subSubCategory)
        }
        
        const response = await fetch(`/netlify/functions/get-posts-hierarchical?${params}`)
        
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
        console.error('Error fetching hierarchical posts:', err)
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
  }, [mainCategory, subCategory, subSubCategory, limit, offset])

  return { posts, loading, error, total, hasMore }
}

