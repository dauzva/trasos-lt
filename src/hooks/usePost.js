import { useState, useEffect, useRef } from 'react'

export const usePost = (postTitle) => {
  const [post, setPost] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const cacheRef = useRef({})
  const abortRef = useRef()
  const debounceRef = useRef()

  useEffect(() => {
    let didCancel = false
    if (!postTitle) {
      setPost(null)
      setLoading(false)
      setError(null)
      return
    }
    if (cacheRef.current[postTitle]) {
      setPost(cacheRef.current[postTitle])
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
      const fetchPost = async () => {
        try {
          const response = await fetch(`/.netlify/functions/get-post?title=${encodeURIComponent(postTitle)}`, { signal: controller.signal, cache: 'force-cache' })
          if (!response.ok) throw new Error('Tinklo klaida')
          const data = await response.json()
          if (data.success && data.post) {
            if (!didCancel) {
              setPost(data.post)
              cacheRef.current[postTitle] = data.post
            }
          } else {
            throw new Error(data.error || 'Post not found')
          }
        } catch (err) {
          if (err.name === 'AbortError') return
          if (!didCancel) {
            setError(err.message)
            setPost(null)
          }
        } finally {
          if (!didCancel) setLoading(false)
        }
      }
      fetchPost()
    }, 100)
    return () => {
      didCancel = true
      if (debounceRef.current) clearTimeout(debounceRef.current)
      if (abortRef.current) abortRef.current.abort()
    }
  }, [postTitle])

  return { post, loading, error }
}

