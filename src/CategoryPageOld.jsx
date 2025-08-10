import React from 'react'
import { useParams, Link } from 'react-router-dom'
import { ChevronRight, ArrowLeft } from 'lucide-react'
import { CategorySidebar } from './components/Navigation'
import PostCard from './components/PostCard'
import { findCategoryBySlug } from './data/categories'
import { getPostsByCategory } from './data/posts'

function CategoryPage() {
  const { mainCategory, subCategory, subSubCategory } = useParams()
  
  // Get posts for this category
  const posts = getPostsByCategory(mainCategory, subCategory, subSubCategory)
  
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
    : formatCategoryName(subCategory)

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

          {/* Posts */}
          {posts.length > 0 ? (
            <div className="space-y-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-800">
                  Straipsniai ({posts.length})
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
                {posts.map((post) => (
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
        </div>
      </div>
    </div>
  )
}

export default CategoryPage


