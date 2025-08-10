import React, { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { ChevronRight, ArrowLeft, Loader2 } from 'lucide-react'
import { CategorySidebar } from './components/Navigation'
import PostCard from './components/PostCard'
import { findCategoryBySlug } from './data/categories'
import { useHierarchicalPosts } from './hooks/useHierarchicalPosts'

function CategoryPage() {
  const { mainCategory, subCategory, subSubCategory } = useParams()
  
  // Get posts for this category using hierarchical logic
  const { posts, loading, error, total } = useHierarchicalPosts(
    mainCategory, 
    subCategory, 
    subSubCategory, 
    20, 
    0
  )
  
  // Find category information
  const categoryInfo = findCategoryBySlug(mainCategory, subSubCategory || subCategory)
  
  // Format category names for display
  const formatCategoryName = (name) => {
    return name.charAt(0).toUpperCase() + name.slice(1).replace(/-/g, ' ')
  }

  // Build breadcrumb
  const breadcrumbItems = [
    { name: 'Pagrindinis', path: '/' },
    { name: formatCategoryName(mainCategory), path: `/${mainCategory}` }
  ]
  
  if (subCategory) {
    breadcrumbItems.push({ 
      name: formatCategoryName(subCategory), 
      path: `/${mainCategory}/${subCategory}` 
    })
  }
  
  if (subSubCategory) {
    breadcrumbItems.push({ 
      name: formatCategoryName(subSubCategory), 
      path: `/${mainCategory}/${subCategory}/${subSubCategory}` 
    })
  }

  const currentCategoryName = subSubCategory 
    ? formatCategoryName(subSubCategory)
    : subCategory 
    ? formatCategoryName(subCategory)
    : formatCategoryName(mainCategory)

  // DEBUG: Log posts and error state
  console.log('CategoryPage posts:', posts)
  console.log('CategoryPage error:', error)

  // Normalize posts: map image_url to image, ensure tags is array
  const normalizedPosts = Array.isArray(posts)
    ? posts.map(post => ({
        ...post,
        image: post.image || post.image_url || '',
        tags: Array.isArray(post.tags)
          ? post.tags
          : typeof post.tags === 'string'
            ? post.tags.split(',').map(t => t.trim()).filter(Boolean)
            : []
      }))
    : [];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Breadcrumb */}
      <nav className="flex items-center space-x-2 text-sm text-gray-500 mb-6">
        {breadcrumbItems.map((item, index) => (
          <React.Fragment key={index}>
            {index > 0 && <ChevronRight size={16} />}
            {index === breadcrumbItems.length - 1 ? (
              <span className="text-gray-900 font-medium">{item.name}</span>
            ) : (
              <Link to={item.path} className="hover:text-green-600 transition-colors">
                {item.name}
              </Link>
            )}
          </React.Fragment>
        ))}
      </nav>

      {/* Back button */}
      <Link 
        to="/" 
        className="inline-flex items-center gap-2 text-green-600 hover:text-green-700 mb-6 transition-colors"
      >
        <ArrowLeft size={16} />
        Grįžti į pagrindinį puslapį
      </Link>

      <div className="grid lg:grid-cols-4 gap-8">
        {/* Sidebar */}
        <div className="lg:col-span-1">
          <CategorySidebar 
            currentMainCategory={formatCategoryName(mainCategory)}
            currentSubCategory={subCategory}
            currentSubSubCategory={subSubCategory}
          />
        </div>

        {/* Main content */}
        <div className="lg:col-span-3">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-4">
              {currentCategoryName}
            </h1>
            
            {categoryInfo && (
              <div className="mb-6">
                {categoryInfo.isSubcategory && (
                  <p className="text-sm text-gray-500 mb-2">
                    Kategorija: {categoryInfo.parentItem} → {categoryInfo.name}
                  </p>
                )}
                <p className="text-lg text-gray-600">
                  Raskite išsamią informaciją apie {currentCategoryName.toLowerCase()}. 
                  Čia pateikiami straipsniai, patarimai ir rekomendacijos nuo ekspertų.
                </p>
              </div>
            )}
          </div>

          {/* Loading state */}
          {loading && (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-green-600" />
              <span className="ml-2 text-gray-600">Kraunami straipsniai...</span>
            </div>
          )}

          {/* Error state */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
              <div className="text-red-600 mb-2">
                <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-red-800 mb-2">
                Klaida kraunant straipsnius
              </h3>
              <p className="text-red-600 mb-4">
                {error}
              </p>
              <button 
                onClick={() => window.location.reload()}
                className="inline-flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
              >
                Bandyti dar kartą
              </button>
            </div>
          )}

          {/* Posts */}
          {!loading && !error && (
            <>
              {normalizedPosts.length > 0 ? (
                <div className="space-y-6">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-semibold text-gray-800">
                      Straipsniai ({total || normalizedPosts.length})
                    </h2>
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <span>Rūšiuoti pagal:</span>
                      <select className="border border-gray-300 rounded px-2 py-1 text-sm">
                        <option value="date">Naujausius</option>
                        <option value="title">Pavadinimą</option>
                        <option value="author">Autorių</option>
                      </select>
                    </div>
                  </div>
                  
                  <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-1">
                    {normalizedPosts.map((post) => (
                      <PostCard
                        key={post.id} 
                        post={post} 
                        showImage={true}
                        size="default"
                      />
                    ))}
                  </div>
                </div>
              ) : (
                <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-200 text-center">
                  <div className="text-gray-400 mb-4">
                    <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-medium text-gray-700 mb-2">
                    Straipsnių kol kas nėra
                  </h3>
                  <p className="text-gray-500 mb-4">
                    Šioje kategorijoje straipsnių dar nėra paskelbta. Grįžkite vėliau arba naršykite kitas kategorijas.
                  </p>
                  <Link 
                    to="/"
                    className="inline-flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
                  >
                    <ArrowLeft size={16} />
                    Grįžti į pagrindinį
                  </Link>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default CategoryPage
