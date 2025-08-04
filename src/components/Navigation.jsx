import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { ChevronDown, ChevronRight } from 'lucide-react'
import { navigationData } from '../data/categories'

function SubcategoryDropdown({ subcategories, mainCategory, parentSlug, isVisible, onItemClick }) {
  if (!subcategories || subcategories.length === 0 || !isVisible) return null

  return (
    <div className="absolute left-full -top-4 w-64 bg-white border border-gray-200 rounded-xl shadow-lg z-[60] overflow-hidden" style={{pointerEvents: 'auto'}}>
      {/* Optional bridge to prevent mouseout gap */}
      <div className="absolute -left-2 top-0 h-full w-2 bg-transparent" style={{pointerEvents: 'auto'}}></div>
      <div className="p-3">
        <div className="space-y-1">
          {subcategories.map((subcat, index) => (
            <Link
              key={index}
              to={`/${mainCategory.toLowerCase()}/${parentSlug}/${subcat.slug}`}
              className="block text-sm text-gray-600 hover:text-green-600 hover:bg-green-50 px-3 py-2 rounded transition-colors duration-150"
              onClick={onItemClick}
            >
              {subcat.name}
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}

function DropdownMenu({ title, data, isOpen, onToggle, closeDropdowns }) {
  const [hoveredItem, setHoveredItem] = useState(null)
  const IconComponent = data.icon
  const location = useLocation()
  
  // Check if current page is in this category
  const isCurrentCategory = location.pathname.startsWith(`/${title.toLowerCase()}`)

  const handleMouseEnter = () => {
    onToggle(true)
  }

  const handleMouseLeave = () => {
    onToggle(false)
    setHoveredItem(null)
  }

  return (
    <div 
      className="relative group"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <button
        className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200 font-medium ${
          isCurrentCategory 
            ? 'text-green-600 bg-green-50' 
            : 'text-gray-700 hover:text-green-600 hover:bg-green-50'
        }`}
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        <IconComponent size={18} />
        <span>{title}</span>
        <ChevronDown
          size={16}
          className={`transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>
      
      {isOpen && (
        <div className="absolute top-full left-0 mt-0 w-96 bg-white border border-gray-200 rounded-xl shadow-lg z-50">
          <div className="p-4">
            <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2">
              <IconComponent size={20} className="text-green-600" />
              {title}
            </h3>
            <div className="space-y-4">
              {data.categories.map((category, categoryIndex) => (
                <div key={categoryIndex} className="border-l-2 border-green-200 pl-3">
                  <h4 className="font-medium text-gray-700 mb-2 text-sm uppercase tracking-wide">
                    {category.title}
                  </h4>
                  <div className="grid grid-cols-1 gap-1">
                    {category.items.map((item, itemIndex) => (
                      <div
                        key={itemIndex}
                        className="relative"
                        onMouseEnter={() => setHoveredItem(`${categoryIndex}-${itemIndex}`)}
                        onMouseLeave={() => setHoveredItem(null)}
                      >
                        <Link
                          to={`/${title.toLowerCase()}/${item.slug}`}
                          className="flex items-center justify-between text-sm text-gray-600 hover:text-green-600 hover:bg-green-50 px-2 py-1 rounded transition-colors duration-150"
                          onClick={closeDropdowns}
                        >
                          <span>{item.name}</span>
                          {item.subcategories && item.subcategories.length > 0 && (
                            <ChevronRight size={14} className="text-gray-400" />
                          )}
                        </Link>
                        
                        <SubcategoryDropdown
                          subcategories={item.subcategories}
                          mainCategory={title}
                          parentSlug={item.slug}
                          isVisible={hoveredItem === `${categoryIndex}-${itemIndex}`}
                          onItemClick={closeDropdowns}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function CategorySidebar({ currentMainCategory, currentSubCategory, currentSubSubCategory }) {
  const location = useLocation()
  
  if (!currentMainCategory || !navigationData[currentMainCategory]) {
    return null
  }

  const categoryData = navigationData[currentMainCategory]

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 sticky top-8">
      <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
        <categoryData.icon size={20} className="text-green-600" />
        {currentMainCategory}
      </h3>
      
      <div className="space-y-4">
        {categoryData.categories.map((category, categoryIndex) => (
          <div key={categoryIndex}>
            <h4 className="font-medium text-gray-700 mb-2 text-sm uppercase tracking-wide">
              {category.title}
            </h4>
            <div className="space-y-1">
              {category.items.map((item, itemIndex) => {
                const isActiveItem = item.slug === currentSubCategory
                const hasSubcategories = item.subcategories && item.subcategories.length > 0
                
                return (
                  <div key={itemIndex}>
                    <Link
                      to={`/${currentMainCategory.toLowerCase()}/${item.slug}`}
                      className={`block text-sm px-2 py-1 rounded transition-colors duration-150 ${
                        isActiveItem 
                          ? 'bg-green-100 text-green-700 font-medium' 
                          : 'text-gray-600 hover:text-green-600 hover:bg-green-50'
                      }`}
                    >
                      {item.name}
                    </Link>
                    
                    {/* Show subcategories if this item is active and has subcategories */}
                    {isActiveItem && hasSubcategories && (
                      <div className="ml-4 mt-1 space-y-1">
                        {item.subcategories.map((subcat, subcatIndex) => {
                          const isActiveSubcat = subcat.slug === currentSubSubCategory
                          
                          return (
                            <Link
                              key={subcatIndex}
                              to={`/${currentMainCategory.toLowerCase()}/${item.slug}/${subcat.slug}`}
                              className={`block text-xs px-2 py-1 rounded transition-colors duration-150 ${
                                isActiveSubcat
                                  ? 'bg-green-50 text-green-600 font-medium'
                                  : 'text-gray-500 hover:text-green-600 hover:bg-green-50'
                              }`}
                            >
                              {subcat.name}
                            </Link>
                          )
                        })}
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export { DropdownMenu, CategorySidebar }
