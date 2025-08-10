import { useState, useEffect, useRef } from 'react'

// Custom hook for fetching posts with hierarchical category logic
export const useHierarchicalPosts = (mainCategory, subCategory, subSubCategory, limit = 10, offset = 0) => {
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [total, setTotal] = useState(0)
  const [hasMore, setHasMore] = useState(false)

  const cacheRef = useRef({})
  const debounceRef = useRef()
  const abortRef = useRef()

  useEffect(() => {
    let didCancel = false;
    const cacheKey = JSON.stringify({ mainCategory, subCategory, subSubCategory, limit, offset })
    if (cacheRef.current[cacheKey]) {
      const cached = cacheRef.current[cacheKey]
      setPosts(cached.posts)
      setTotal(cached.total)
      setHasMore(cached.hasMore)
      setLoading(false)
      setError(null)
      return
    }

    setLoading(true)
    setError(null)

    if (debounceRef.current) clearTimeout(debounceRef.current)
    if (abortRef.current) abortRef.current.abort()
    const controller = new AbortController()
    abortRef.current = controller

    debounceRef.current = setTimeout(() => {
      const fetchPosts = async () => {
        try {
          const params = new URLSearchParams({
            mainCategory: mainCategory || '',
            subCategory: subCategory || '',
            subSubCategory: subSubCategory || '',
            limit: limit.toString(),
            offset: offset.toString()
          })
          const response = await fetch(`/.netlify/functions/get-posts-hierarchical?${params}`, { signal: controller.signal, cache: 'force-cache' })
          if (!response.ok) throw new Error('Tinklo klaida')
          const data = await response.json()
          if (data.success) {
            if (!didCancel) {
              setPosts(data.posts)
              setTotal(data.total)
              setHasMore(data.hasMore)
              cacheRef.current[cacheKey] = {
                posts: data.posts,
                total: data.total,
                hasMore: data.hasMore
              }
            }
          } else {
            throw new Error(data.error || 'Failed to fetch posts')
          }
        } catch (err) {
          if (err.name === 'AbortError') return
          if (!didCancel) {
            console.error('Error fetching hierarchical posts:', err)
            setError(err.message)
            setPosts([])
            setTotal(0)
            setHasMore(false)
          }
        } finally {
          if (!didCancel) setLoading(false)
        }
      }
      fetchPosts()
    }, 100) // 100ms debounce for even faster response
    return () => {
      didCancel = true;
      if (debounceRef.current) clearTimeout(debounceRef.current)
      if (abortRef.current) abortRef.current.abort()
    }
  }, [mainCategory, subCategory, subSubCategory, limit, offset])

  return { posts, loading, error, total, hasMore }
}
