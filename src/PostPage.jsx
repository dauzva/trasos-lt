import React from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { ArrowLeft, Calendar, User, Clock, Tag, Share2, BookOpen } from 'lucide-react'
import { getPostById, getAllPosts } from './data/posts'
import PostCard from './components/PostCard'

function PostPage() {
  const { postId } = useParams()
  const navigate = useNavigate()
  const post = getPostById(postId)
  
  if (!post) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-200 text-center">
          <div className="text-gray-400 mb-4">
            <BookOpen className="w-16 h-16 mx-auto" />
          </div>
          <h1 className="text-2xl font-bold text-gray-800 mb-4">
            Straipsnis nerastas
          </h1>
          <p className="text-gray-600 mb-6">
            Atsiprašome, bet šis straipsnis neegzistuoja arba buvo pašalintas.
          </p>
          <Link 
            to="/"
            className="inline-flex items-center gap-2 bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors"
          >
            <ArrowLeft size={16} />
            Grįžti į pagrindinį
          </Link>
        </div>
      </div>
    )
  }

  // Get related posts (same category, excluding current post)
  const allPosts = getAllPosts()
  const relatedPosts = allPosts
    .filter(p => p.id !== post.id && p.category === post.category)
    .slice(0, 3)

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('lt-LT', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const estimateReadingTime = (content) => {
    const wordsPerMinute = 200
    const words = content.split(' ').length
    return Math.ceil(words / wordsPerMinute)
  }

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: post.title,
          text: post.excerpt,
          url: window.location.href,
        })
      } catch (err) {
        console.log('Error sharing:', err)
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href)
      alert('Nuoroda nukopijuota į iškarpinę!')
    }
  }

  // Convert markdown-like content to HTML (basic implementation)
  const formatContent = (content) => {
    return content
      .split('\n\n')
      .map((paragraph, index) => {
        if (paragraph.startsWith('# ')) {
          return <h1 key={index} className="text-3xl font-bold text-gray-800 mb-6 mt-8">{paragraph.slice(2)}</h1>
        }
        if (paragraph.startsWith('## ')) {
          return <h2 key={index} className="text-2xl font-semibold text-gray-800 mb-4 mt-6">{paragraph.slice(3)}</h2>
        }
        if (paragraph.startsWith('### ')) {
          return <h3 key={index} className="text-xl font-semibold text-gray-800 mb-3 mt-5">{paragraph.slice(4)}</h3>
        }
        if (paragraph.startsWith('- ')) {
          const items = paragraph.split('\n').filter(line => line.startsWith('- '))
          return (
            <ul key={index} className="list-disc list-inside mb-4 space-y-1">
              {items.map((item, i) => (
                <li key={i} className="text-gray-700">{item.slice(2)}</li>
              ))}
            </ul>
          )
        }
        if (paragraph.startsWith('1. ')) {
          const items = paragraph.split('\n').filter(line => /^\d+\. /.test(line))
          return (
            <ol key={index} className="list-decimal list-inside mb-4 space-y-1">
              {items.map((item, i) => (
                <li key={i} className="text-gray-700">{item.replace(/^\d+\. /, '')}</li>
              ))}
            </ol>
          )
        }
        if (paragraph.trim()) {
          return <p key={index} className="text-gray-700 leading-relaxed mb-4">{paragraph}</p>
        }
        return null
      })
      .filter(Boolean)
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Back button */}
      <button 
        onClick={() => navigate(-1)}
        className="inline-flex items-center gap-2 text-green-600 hover:text-green-700 mb-6 transition-colors"
      >
        <ArrowLeft size={16} />
        Grįžti atgal
      </button>

      {/* Article */}
      <article className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        {/* Hero image */}
        {post.image && (
          <div className="relative h-64 md:h-80 overflow-hidden">
            <img
              src={post.image}
              alt={post.title}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.target.parentElement.style.display = 'none'
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
            <div className="absolute bottom-6 left-6 right-6">
              <div className="flex items-center gap-2 mb-3">
                <span className="bg-green-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                  {post.category}
                </span>
                {post.tags && post.tags.slice(0, 2).map((tag, index) => (
                  <span key={index} className="bg-white/20 text-white px-2 py-1 rounded-full text-xs backdrop-blur-sm">
                    {tag}
                  </span>
                ))}
              </div>
              <h1 className="text-2xl md:text-3xl font-bold text-white leading-tight">
                {post.title}
              </h1>
            </div>
          </div>
        )}

        <div className="p-6 md:p-8">
          {/* Title (if no image) */}
          {!post.image && (
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-4">
                <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-medium">
                  {post.category}
                </span>
                {post.tags && post.tags.slice(0, 3).map((tag, index) => (
                  <span key={index} className="bg-gray-100 text-gray-600 px-2 py-1 rounded-full text-xs">
                    {tag}
                  </span>
                ))}
              </div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-800 leading-tight">
                {post.title}
              </h1>
            </div>
          )}

          {/* Meta information */}
          <div className="flex flex-wrap items-center gap-6 text-sm text-gray-500 mb-6 pb-6 border-b border-gray-200">
            <div className="flex items-center gap-2">
              <User size={16} />
              <span>{post.author}</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar size={16} />
              <span>{formatDate(post.date)}</span>
            </div>
            {post.content && (
              <div className="flex items-center gap-2">
                <Clock size={16} />
                <span>{estimateReadingTime(post.content)} min skaitymo</span>
              </div>
            )}
            <button
              onClick={handleShare}
              className="flex items-center gap-2 text-green-600 hover:text-green-700 transition-colors ml-auto"
            >
              <Share2 size={16} />
              <span>Dalintis</span>
            </button>
          </div>

          {/* Excerpt */}
          <div className="mb-8">
            <p className="text-lg text-gray-600 leading-relaxed font-medium">
              {post.excerpt}
            </p>
          </div>

          {/* Content */}
          {post.content && (
            <div className="prose prose-lg max-w-none">
              {formatContent(post.content)}
            </div>
          )}

          {/* Tags */}
          {post.tags && post.tags.length > 0 && (
            <div className="mt-8 pt-6 border-t border-gray-200">
              <div className="flex items-center gap-2 mb-3">
                <Tag size={16} className="text-gray-400" />
                <span className="text-sm font-medium text-gray-700">Žymos:</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {post.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm hover:bg-gray-200 transition-colors cursor-pointer"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </article>

      {/* Related posts */}
      {relatedPosts.length > 0 && (
        <div className="mt-12">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">
            Susiję straipsniai
          </h2>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {relatedPosts.map((relatedPost) => (
              <PostCard 
                key={relatedPost.id} 
                post={relatedPost} 
                showImage={true}
                size="compact"
              />
            ))}
          </div>
        </div>
      )}

      {/* Call to action */}
      <div className="mt-12 bg-green-50 rounded-xl p-6 text-center">
        <h3 className="text-lg font-semibold text-gray-800 mb-2">
          Norite sužinoti daugiau?
        </h3>
        <p className="text-gray-600 mb-4">
          Naršykite mūsų kategorijas ir raskite dar daugiau naudingos informacijos.
        </p>
        <Link 
          to="/"
          className="inline-flex items-center gap-2 bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors"
        >
          <BookOpen size={16} />
          Naršyti kategorijas
        </Link>
      </div>
    </div>
  )
}

export default PostPage

