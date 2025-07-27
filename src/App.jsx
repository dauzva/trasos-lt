import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom'
import CategoryPage from './CategoryPage'
import PostPage from './PostPage'
import { Menu, X, Search, Leaf, Shield } from 'lucide-react'
import { Button } from '@/components/ui/button.jsx'
import { DropdownMenu } from './components/Navigation'
import { navigationData } from './data/categories'
import { DisplayAd, MultiplexAd } from './components/GoogleAds'
import './App.css'

function MobileMenu({ isOpen, onClose }) {
  return (
    <div className={`fixed inset-0 z-50 lg:hidden ${isOpen ? 'block' : 'hidden'}`}>
      <div className="fixed inset-0 bg-black bg-opacity-50" onClick={onClose}></div>
      <div className="fixed top-0 right-0 h-full w-80 bg-white shadow-xl overflow-y-auto">
        <div className="p-4">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-gray-800">Kategorijos</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              aria-label="Uždaryti meniu"
            >
              <X size={20} />
            </button>
          </div>
          <div className="space-y-4">
            {Object.entries(navigationData).map(([title, data]) => {
              const IconComponent = data.icon
              return (
                <div key={title} className="border-b border-gray-200 pb-4">
                  <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                    <IconComponent size={18} className="text-green-600" />
                    {title}
                  </h3>
                  {data.categories.map((category, categoryIndex) => (
                    <div key={categoryIndex} className="ml-6 mb-3">
                      <h4 className="font-medium text-gray-700 mb-2 text-sm">
                        {category.title}
                      </h4>
                      <div className="space-y-1">
                        {category.items.map((item, itemIndex) => (
                          <Link
                            key={itemIndex}
                            to={`/${title.toLowerCase()}/${item.slug}`}
                            className="block text-sm text-gray-600 hover:text-green-600 py-1 transition-colors"
                            onClick={onClose}
                          >
                            {item.name}
                          </Link>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}

function App() {
  const [openDropdown, setOpenDropdown] = useState(null)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const handleDropdownToggle = (title, shouldOpen) => {
    setOpenDropdown(shouldOpen ? title : null)
  }

  const closeDropdowns = () => {
    setOpenDropdown(null)
  }

  return (
    <Router>
      <div className="min-h-screen bg-gray-50" onClick={closeDropdowns}>
        {/* Header */}
        <header className="bg-white shadow-sm border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              {/* Logo */}
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center">
                  <Leaf className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-gray-800">Trąšos.lt</h1>
                  <p className="text-xs text-gray-500">Lietuvos žemės ūkio enciklopedija</p>
                </div>
              </div>
              {/* Desktop Navigation */}
              <nav className="hidden lg:flex items-center space-x-1" onClick={(e) => e.stopPropagation()}>
                {Object.entries(navigationData).map(([title, data]) => (
                  <DropdownMenu
                    key={title}
                    title={title}
                    data={data}
                    isOpen={openDropdown === title}
                    onToggle={(shouldOpen) => handleDropdownToggle(title, shouldOpen)}
                    // 4. Fix: Pass the closeDropdowns function as a prop
                    closeDropdowns={closeDropdowns}
                  />
                ))}
              </nav>
              {/* Search and Mobile Menu */}
              <div className="flex items-center gap-3">
                <Button variant="outline" size="sm" className="hidden sm:flex items-center gap-2">
                  <Search size={16} />
                  Paieška
                </Button>
                {/* Mobile menu button */}
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    setMobileMenuOpen(true)
                  }}
                  className="lg:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  aria-label="Atidaryti meniu"
                >
                  <Menu size={20} />
                </button>
              </div>
            </div>
          </div>
        </header>
        {/* Mobile Menu */}
        <MobileMenu
          isOpen={mobileMenuOpen}
          onClose={() => setMobileMenuOpen(false)}
        />
        {/* Main Content */}
        <Routes>
          <Route path="/" element={
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-gray-800 mb-4">
                  Sveiki atvykę į Lietuvos žemės ūkio enciklopediją
                </h2>
                <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                  Čia rasite išsamią informaciją apie trąšas, sėklas, sodinukus ir augalų apsaugos priemones.
                  Naršykite kategorijas aukščiau esančiame meniu arba naudokite paiešką.
                </p>
              </div>
              
              {/* Display Ad */}
              <div className="mb-12">
                <DisplayAd />
              </div>
              {/* Category Cards */}
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                {Object.entries(navigationData).map(([title, data]) => {
                  const IconComponent = data.icon
                  const totalItems = data.categories.reduce((sum, cat) => sum + cat.items.length, 0)
                  return (
                    <div key={title} className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                          <IconComponent className="w-5 h-5 text-green-600" />
                        </div>
                        <h3 className="font-semibold text-gray-800">{title}</h3>
                      </div>
                      <p className="text-sm text-gray-600 mb-3">
                        {totalItems} subkategorijos su išsamia informacija
                      </p>
                      <div className="space-y-1">
                        {data.categories.slice(0, 2).map((category, index) => (
                          <p key={index} className="text-xs text-gray-500">
                            • {category.title}
                          </p>
                        ))}
                        {data.categories.length > 2 && (
                          <p className="text-xs text-gray-400">
                            ir dar {data.categories.length - 2} kategorijos...
                          </p>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
              {/* Features */}
              <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-200">
                <h3 className="text-2xl font-bold text-gray-800 mb-6 text-center">
                  Kodėl rinktis mūsų enciklopediją?
                </h3>
                <div className="grid md:grid-cols-3 gap-6">
                  <div className="text-center">
                    <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                      <Search className="w-6 h-6 text-green-600" />
                    </div>
                    <h4 className="font-semibold text-gray-800 mb-2">Lengva paieška</h4>
                    <p className="text-sm text-gray-600">
                      Greitai raskite reikiamą informaciją naudodami patogų kategorijų medį
                    </p>
                  </div>
                  <div className="text-center">
                    <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                      <Leaf className="w-6 h-6 text-green-600" />
                    </div>
                    <h4 className="font-semibold text-gray-800 mb-2">Išsami informacija</h4>
                    <p className="text-sm text-gray-600">
                      Kiekviena kategorija turi detalizuotą aprašymą ir praktiškas rekomendacijas
                    </p>
                  </div>
                  <div className="text-center">
                    <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                      <Shield className="w-6 h-6 text-green-600" />
                    </div>
                    <h4 className="font-semibold text-gray-800 mb-2">Patikima informacija</h4>
                    <p className="text-sm text-gray-600">
                      Visa informacija pagrįsta moksliniais tyrimais ir praktine patirtimi
                    </p>
                  </div>
                </div>
              </div>
              
              {/* Multiplex Ad */}
              <div className="mb-12">
                <MultiplexAd />
              </div>
            </main>
          } />
          <Route path="/:mainCategory/:subCategory" element={<CategoryPage />} />
          <Route path="/:mainCategory/:subCategory/:subSubCategory" element={<CategoryPage />} />
          <Route path="/post/:postId" element={<PostPage />} />
        </Routes>
        {/* Footer */}
        <footer className="bg-gray-800 text-white py-8 mt-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <div className="flex items-center justify-center gap-3 mb-4">
                <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center">
                  <Leaf className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-xl font-bold">Trąšos.lt</h3>
              </div>
              <p className="text-gray-400">
                © 2024 Lietuvos žemės ūkio enciklopedija. Visos teisės saugomos.
              </p>
            </div>
          </div>
        </footer>
      </div>
    </Router>
  )
}

export default App