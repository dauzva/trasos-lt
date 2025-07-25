import React from 'react'
import { useParams, Link } from 'react-router-dom'
import { ChevronRight, Calendar, User, ArrowLeft } from 'lucide-react'

// Sample posts data - in a real app this would come from an API
const samplePosts = {
  'trąšos': {
    'vaismedžiams': [
      {
        id: 1,
        title: 'Obelų tręšimas pavasarį: kada ir kaip tręšti',
        excerpt: 'Pavasaris - svarbiausias laikas obelų tręšimui. Sužinokite, kokias trąšas naudoti ir kaip teisingai jas taikyti.',
        author: 'Dr. Jonas Petraitis',
        date: '2024-03-15',
        category: 'Vaismedžiai'
      },
      {
        id: 2,
        title: 'Organinės trąšos vaismedžiams: privalumai ir trūkumai',
        excerpt: 'Organinės trąšos gali būti puikus pasirinkimas vaismedžiams. Išnagrinėjame jų poveikį ir taikymo ypatumus.',
        author: 'Marija Kazlauskienė',
        date: '2024-03-10',
        category: 'Vaismedžiai'
      },
      {
        id: 3,
        title: 'Mikroelementų trūkumas vaismedžiuose: kaip atpažinti ir gydyti',
        excerpt: 'Mikroelementų trūkumas gali rimtai paveikti vaismedžių sveikatą. Mokykitės atpažinti simptomus.',
        author: 'Prof. Antanas Stankevičius',
        date: '2024-03-05',
        category: 'Vaismedžiai'
      }
    ],
    'daržovėms': [
      {
        id: 4,
        title: 'Pomidorų tręšimas šiltnamyje: geriausios praktikos',
        excerpt: 'Šiltnamio pomidorai reikalauja specialaus tręšimo režimo. Sužinokite apie efektyviausius metodus.',
        author: 'Rūta Vaitkienė',
        date: '2024-03-12',
        category: 'Daržovės'
      },
      {
        id: 5,
        title: 'Ekologiškas daržovių tręšimas: natūralūs sprendimai',
        excerpt: 'Ekologiškame ūkyje galima naudoti tik tam tikras trąšas. Apžvelgiame leistinus variantus.',
        author: 'Mindaugas Jonaitis',
        date: '2024-03-08',
        category: 'Daržovės'
      }
    ]
  },
  'sėklos': {
    'daržovių-sėklos': [
      {
        id: 6,
        title: 'Sėklų ruošimas sodinimui: beicavimas ir kietinimas',
        excerpt: 'Tinkamas sėklų paruošimas gali padvigubinti dygimo procentą. Mokykitės pagrindinių metodų.',
        author: 'Gintarė Petraitienė',
        date: '2024-03-14',
        category: 'Sėklos'
      }
    ]
  }
}

// Navigation data for sidebar
const navigationData = {
  "Trąšos": {
    categories: [
      {
        title: "Pagal augalą",
        items: [
          "Vaismedžiams",
          "Daržovėms", 
          "Gėlėms",
          "Uogakrūmiams",
          "Vejai",
          "Dekoratyviniams augalams",
          "Kambarinėms gėlėms"
        ]
      },
      {
        title: "Pagal formą",
        items: [
          "Skystos trąšos",
          "Granuliuotos trąšos",
          "Birios trąšos",
          "Lazdelės",
          "Tabletės"
        ]
      },
      {
        title: "Pagal veikliąją medžiagą",
        items: [
          "Azotinės",
          "Fosforo",
          "Kalio",
          "Kompleksinės (NPK)",
          "Mikroelementų",
          "Organinės",
          "Mineralinės",
          "Biostimuliatoriai",
          "Bakterinės",
          "Organinės-mineralinės"
        ]
      }
    ]
  },
  "Sėklos": {
    categories: [
      {
        title: "Pagal augalų tipą",
        items: [
          "Daržovių sėklos",
          "Žolelių sėklos",
          "Gėlių sėklos",
          "Javų sėklos",
          "Ankštinių augalų sėklos",
          "Aliejinių augalų sėklos",
          "Pašarinių augalų sėklos"
        ]
      },
      {
        title: "Pagal sėklos kategoriją",
        items: [
          "Sertifikuotos",
          "Ekologiškos",
          "GMO-ne",
          "Beicuotos",
          "Nekategorizuotos"
        ]
      },
      {
        title: "Pagal auginimo būdą",
        items: [
          "Atviram gruntui",
          "Šiltnamiams"
        ]
      }
    ]
  },
  "Sodinukai": {
    categories: [
      {
        title: "Pagal augalų tipą",
        items: [
          "Vaismedžių sodinukai",
          "Uogakrūmiai",
          "Dekoratyviniai augalai",
          "Daržovių sodinukai",
          "Miško sodinukai"
        ]
      },
      {
        title: "Pagal auginimo būdą",
        items: [
          "Atviram gruntui",
          "Šiltnamiams",
          "Vazonėliuose",
          "Plikomis šaknimis"
        ]
      },
      {
        title: "Pagal amžių",
        items: [
          "Vienmečiai",
          "Dvimečiai",
          "Daugiau nei dvimečiai"
        ]
      },
      {
        title: "Pagal kilmę",
        items: [
          "Vietinės veislės",
          "Egzotiniai sodinukai"
        ]
      }
    ]
  },
  "Apsaugos priemonės augalams": {
    categories: [
      {
        title: "Pagal kenkėją/ligą",
        items: [
          "Nuo kenkėjų",
          "Nuo ligų",
          "Nuo piktžolių",
          "Nuo graužikų"
        ]
      },
      {
        title: "Pagal veikimo būdą",
        items: [
          "Kontaktiniai",
          "Sistemininiai",
          "Translaminariniai",
          "Fumigantai"
        ]
      },
      {
        title: "Pagal kilmę",
        items: [
          "Ekologiškos priemonės",
          "Cheminės priemonės"
        ]
      },
      {
        title: "Pagal taikymo būdą",
        items: [
          "Purškimui",
          "Dirvožemiui",
          "Sėklų beicavimui",
          "Rūko generatoriai"
        ]
      },
      {
        title: "Fizinės apsaugos",
        items: [
          "Šiltnamių plėvelės",
          "Tinkliukai",
          "Agroplėvelės",
          "Mulčias",
          "Apsauginės dangos"
        ]
      }
    ]
  }
}

function CategoryPage() {
  const { mainCategory, subCategory } = useParams()
  
  // Get posts for this category
  const categoryKey = mainCategory?.toLowerCase()
  const subCategoryKey = subCategory?.toLowerCase()
  const posts = samplePosts[categoryKey]?.[subCategoryKey] || []
  
  // Get navigation data for sidebar
  const currentCategoryData = navigationData[mainCategory] || { categories: [] }
  
  // Format category names for display
  const formatCategoryName = (name) => {
    return name.charAt(0).toUpperCase() + name.slice(1).replace(/-/g, ' ')
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Breadcrumb */}
      <nav className="flex items-center space-x-2 text-sm text-gray-500 mb-6">
        <Link to="/" className="hover:text-green-600 transition-colors">
          Pagrindinis
        </Link>
        <ChevronRight size={16} />
        <span className="text-gray-700">{formatCategoryName(mainCategory)}</span>
        <ChevronRight size={16} />
        <span className="text-gray-900 font-medium">{formatCategoryName(subCategory)}</span>
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
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 sticky top-8">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              {formatCategoryName(mainCategory)} kategorijos
            </h3>
            <div className="space-y-4">
              {currentCategoryData.categories.map((category, categoryIndex) => (
                <div key={categoryIndex}>
                  <h4 className="font-medium text-gray-700 mb-2 text-sm uppercase tracking-wide">
                    {category.title}
                  </h4>
                  <div className="space-y-1">
                    {category.items.map((item, itemIndex) => {
                      const itemSlug = item.toLowerCase().replace(/\s+/g, '-')
                      const isActive = itemSlug === subCategoryKey
                      
                      return (
                        <Link
                          key={itemIndex}
                          to={`/${mainCategory.toLowerCase()}/${itemSlug}`}
                          className={`block text-sm px-2 py-1 rounded transition-colors duration-150 ${
                            isActive 
                              ? 'bg-green-100 text-green-700 font-medium' 
                              : 'text-gray-600 hover:text-green-600 hover:bg-green-50'
                          }`}
                        >
                          {item}
                        </Link>
                      )
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Main content */}
        <div className="lg:col-span-3">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-4">
              {formatCategoryName(subCategory)}
            </h1>
            <p className="text-lg text-gray-600">
              Raskite išsamią informaciją apie {formatCategoryName(subCategory).toLowerCase()}. 
              Čia pateikiami straipsniai, patarimai ir rekomendacijos nuo ekspertų.
            </p>
          </div>

          {/* Posts */}
          {posts.length > 0 ? (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">
                Straipsniai ({posts.length})
              </h2>
              {posts.map((post) => (
                <article key={post.id} className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
                  <h3 className="text-xl font-semibold text-gray-800 mb-3 hover:text-green-600 transition-colors cursor-pointer">
                    {post.title}
                  </h3>
                  <p className="text-gray-600 mb-4 leading-relaxed">
                    {post.excerpt}
                  </p>
                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-1">
                        <User size={14} />
                        <span>{post.author}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar size={14} />
                        <span>{new Date(post.date).toLocaleDateString('lt-LT')}</span>
                      </div>
                    </div>
                    <span className="bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs font-medium">
                      {post.category}
                    </span>
                  </div>
                </article>
              ))}
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
              <p className="text-gray-500">
                Šioje kategorijoje straipsnių dar nėra paskelbta. Grįžkite vėliau arba naršykite kitas kategorijas.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default CategoryPage


