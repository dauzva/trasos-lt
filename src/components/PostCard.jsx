import React from 'react'
import { Link } from 'react-router-dom'
import { Calendar, User, Clock, ArrowRight } from 'lucide-react'

function PostCard({ post, showImage = true, size = 'default' }) {
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

  if (size === 'compact') {
    return (
      <article className="bg-white rounded-lg p-4 shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
        <div className="flex gap-4">
          {showImage && post.image && (
            <div className="flex-shrink-0">
              <img
                src={post.image}
                alt={post.title}
                className="w-20 h-20 object-cover rounded-lg"
                onError={(e) => {
                  e.target.style.display = 'none'
                }}
              />
            </div>
          )}
          <div className="flex-1 min-w-0">
            <Link to={`/post/${post.id}`}>
              <h3 className="text-lg font-semibold text-gray-800 mb-2 hover:text-green-600 transition-colors line-clamp-2">
                {post.title}
              </h3>
            </Link>
            <p className="text-gray-600 text-sm mb-3 line-clamp-2">
              {post.excerpt}
            </p>
            <div className="flex items-center gap-4 text-xs text-gray-500">
              <div className="flex items-center gap-1">
                <User size={12} />
                <span>{post.author}</span>
              </div>
              <div className="flex items-center gap-1">
                <Calendar size={12} />
                <span>{formatDate(post.date)}</span>
              </div>
            </div>
          </div>
        </div>
      </article>
    )
  }

  return (
    <article className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-all duration-300 overflow-hidden group">
      {showImage && post.image && (
        <div className="relative overflow-hidden">
          <img
            src={post.image}
            alt={post.title}
            className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
            onError={(e) => {
              e.target.parentElement.style.display = 'none'
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        </div>
      )}
      
      <div className="p-6">
        <div className="flex items-center gap-2 mb-3">
          <span className="bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs font-medium">
            {post.category}
          </span>
          {post.tags && post.tags.length > 0 && (
            <div className="flex gap-1">
              {post.tags.slice(0, 2).map((tag, index) => (
                <span key={index} className="bg-gray-100 text-gray-600 px-2 py-1 rounded-full text-xs">
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>

        <Link to={`/post/${post.id}`}>
          <h3 className="text-xl font-semibold text-gray-800 mb-3 hover:text-green-600 transition-colors line-clamp-2 group-hover:text-green-600">
            {post.title}
          </h3>
        </Link>

        <p className="text-gray-600 mb-4 leading-relaxed line-clamp-3">
          {post.excerpt}
        </p>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4 text-sm text-gray-500">
            <div className="flex items-center gap-1">
              <User size={14} />
              <span>{post.author}</span>
            </div>
            <div className="flex items-center gap-1">
              <Calendar size={14} />
              <span>{formatDate(post.date)}</span>
            </div>
            {post.content && (
              <div className="flex items-center gap-1">
                <Clock size={14} />
                <span>{estimateReadingTime(post.content)} min</span>
              </div>
            )}
          </div>

          <Link 
            to={`/post/${post.id}`}
            className="flex items-center gap-1 text-green-600 hover:text-green-700 font-medium text-sm group-hover:gap-2 transition-all duration-200"
          >
            <span>Skaityti</span>
            <ArrowRight size={14} />
          </Link>
        </div>
      </div>
    </article>
  )
}

export default PostCard

