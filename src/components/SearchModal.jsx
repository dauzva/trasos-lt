import React, { useState, useEffect, useRef } from 'react'
import { Search, X, Loader2, FileText, Folder } from 'lucide-react'
import { Link } from 'react-router-dom'

function SearchModal({ isOpen, onClose }) {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState({ posts: [], categories: [] })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const inputRef = useRef(null)

  // Focus input when modal opens
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus()
    }
  }, [isOpen])

  // Search function with debouncing
  useEffect(() => {
    if (!query || query.trim().length < 2) {
      setResults({ posts: [], categories: [] })
      setLoading(false)
      return
    }

    const searchPosts = async () => {
      try {
        setLoading(true)
        setError(null)
        
        const params = new URLSearchParams({
          q: query.trim(),
          limit: '8'
        })
        
        const response = await fetch(`/netlify/functions/search-posts?${params}`)

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }
        
        const data = await response.json()
        
        if (data.success) {
          setResults({
            posts: data.posts || [],
            categories: data.categories || []
          })
        } else {
          throw new Error(data.error || 'Failed to search')
        }
      } catch (err) {
        console.error('Error searching:', err)
        setError(err.message)
        setResults({ posts: [], categories: [] })
      } finally {
        setLoading(false)
      }
    }

    const timeoutId = setTimeout(searchPosts, 300) // Debounce search
    return () => clearTimeout(timeoutId)
  }, [query])

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        onClose()
      }
    }

    if (isOpen) {
      document.addEventListener('keydown', handleEscape)
      return () => document.removeEventListener('keydown', handleEscape)
    }
  }, [isOpen, onClose])

  if (!isOpen) return null

  const handleResultClick = () => {
    setQuery('')
    setResults({ posts: [], categories: [] })
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-start justify-center pt-20">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl mx-4 max-h-[80vh] overflow-hidden">
        {/* Search Header */}
        <div className="p-4 border-b border-gray-200">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              ref={inputRef}
              type="text"
              placeholder="Ieškoti straipsnių ir kategorijų..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none text-lg"
            />
            <button
              onClick={onClose}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Search Results */}
        <div className="max-h-96 overflow-y-auto">
          {loading && (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="w-6 h-6 animate-spin text-green-600" />
              <span className="ml-2 text-gray-600">Ieškoma...</span>
            </div>
          )}

          {error && (
            <div className="p-4 text-center text-red-600">
              <p>Klaida ieškant: {error}</p>
            </div>
          )}

          {!loading && !error && query.trim().length >= 2 && (
            <>
              {/* Categories */}
              {results.categories.length > 0 && (
                <div className="p-4 border-b border-gray-100">
                  <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                    <Folder className="w-4 h-4" />
                    Kategorijos
                  </h3>
                  <div className="space-y-2">
                    {results.categories.map((category, index) => (
                      <Link
                        key={index}
                        to={`/${category.slug}`}
                        onClick={handleResultClick}
                        className="block p-2 rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                            <Folder className="w-4 h-4 text-green-600" />
                          </div>
                          <div>
                            <p className="font-medium text-gray-800">{category.name}</p>
                            <p className="text-sm text-gray-500">Kategorija</p>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* Posts */}
              {results.posts.length > 0 && (
                <div className="p-4">
                  <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                    <FileText className="w-4 h-4" />
                    Straipsniai ({results.posts.length})
                  </h3>
                  <div className="space-y-3">
                    {results.posts.map((post) => (
                      <Link
                        key={post.id}
                        to={`/post/${post.slug || post.id}`}
                        onClick={handleResultClick}
                        className="block p-3 rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        <div className="flex gap-3">
                          {post.image_url && (
                            <img
                              src={post.image_url}
                              alt={post.title}
                              className="w-12 h-12 rounded-lg object-cover flex-shrink-0"
                            />
                          )}
                          <div className="flex-1 min-w-0">
                            <h4 className="font-medium text-gray-800 line-clamp-1">
                              {post.title}
                            </h4>
                            <p className="text-sm text-gray-600 line-clamp-2 mt-1">
                              {post.excerpt}
                            </p>
                            <div className="flex items-center gap-2 mt-2 text-xs text-gray-500">
                              <span>{post.category}</span>
                              {post.subcategory && (
                                <>
                                  <span>→</span>
                                  <span>{post.subcategory}</span>
                                </>
                              )}
                              <span>•</span>
                              <span>{post.author}</span>
                            </div>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* No results */}
              {results.posts.length === 0 && results.categories.length === 0 && (
                <div className="p-8 text-center">
                  <div className="text-gray-400 mb-4">
                    <Search className="w-12 h-12 mx-auto" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-700 mb-2">
                    Nieko nerasta
                  </h3>
                  <p className="text-gray-500">
                    Bandykite kitus paieškos žodžius arba naršykite kategorijas
                  </p>
                </div>
              )}
            </>
          )}

          {/* Initial state */}
          {!loading && !error && query.trim().length < 2 && (
            <div className="p-8 text-center">
              <div className="text-gray-400 mb-4">
                <Search className="w-12 h-12 mx-auto" />
              </div>
              <h3 className="text-lg font-medium text-gray-700 mb-2">
                Pradėkite ieškoti
              </h3>
              <p className="text-gray-500">
                Įveskite bent 2 simbolius, kad pradėtumėte paiešką
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default SearchModal

