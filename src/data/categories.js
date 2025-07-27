import { Leaf, Sprout, TreePine, Shield } from 'lucide-react'

export const navigationData = {
  "Trąšos": {
    icon: Leaf,
    categories: [
      {
        title: "Pagal augalą",
        items: [
          {
            name: "Vaismedžiams",
            slug: "vaismedžiams",
            subcategories: [
              { name: "Obelėms", slug: "obelėms" },
              { name: "Kriaušėms", slug: "kriaušėms" },
              { name: "Vyšnioms", slug: "vyšnioms" },
              { name: "Slyvoms", slug: "slyvoms" },
              { name: "Persikams", slug: "persikams" },
              { name: "Citrusams", slug: "citrusams" }
            ]
          },
          {
            name: "Daržovėms",
            slug: "daržovėms",
            subcategories: [
              { name: "Pomidorams", slug: "pomidorams" },
              { name: "Agurkams", slug: "agurkams" },
              { name: "Kopūstams", slug: "kopūstams" },
              { name: "Morkoms", slug: "morkoms" },
              { name: "Svogūnams", slug: "svogūnams" },
              { name: "Bulvėms", slug: "bulvėms" }
            ]
          },
          {
            name: "Gėlėms",
            slug: "gėlėms",
            subcategories: [
              { name: "Rožėms", slug: "rožėms" },
              { name: "Tulpėms", slug: "tulpėms" },
              { name: "Narcizams", slug: "narcizams" },
              { name: "Petunijoms", slug: "petunijoms" },
              { name: "Begonijoms", slug: "begonijoms" }
            ]
          },
          {
            name: "Uogakrūmiams",
            slug: "uogakrūmiams",
            subcategories: [
              { name: "Braškėms", slug: "braškėms" },
              { name: "Aviečių krūmams", slug: "aviečių-krūmams" },
              { name: "Serbentams", slug: "serbentams" },
              { name: "Agrastams", slug: "agrastams" },
              { name: "Mėlynėms", slug: "mėlynėms" }
            ]
          },
          {
            name: "Vejai",
            slug: "vejai",
            subcategories: [
              { name: "Sporto vejai", slug: "sporto-vejai" },
              { name: "Dekoratyvinei vejai", slug: "dekoratyvinei-vejai" },
              { name: "Šešėlinei vejai", slug: "šešėlinei-vejai" }
            ]
          },
          {
            name: "Dekoratyviniams augalams",
            slug: "dekoratyviniams-augalams",
            subcategories: [
              { name: "Spygliuočiams", slug: "spygliuočiams" },
              { name: "Lapuočiams", slug: "lapuočiams" },
              { name: "Krūmams", slug: "krūmams" }
            ]
          },
          {
            name: "Kambarinėms gėlėms",
            slug: "kambarinėms-gėlėms",
            subcategories: [
              { name: "Fikusams", slug: "fikusams" },
              { name: "Orchidėjoms", slug: "orchidėjoms" },
              { name: "Kaktusams", slug: "kaktusams" },
              { name: "Palmėms", slug: "palmėms" }
            ]
          }
        ]
      },
      {
        title: "Pagal formą",
        items: [
          {
            name: "Skystos trąšos",
            slug: "skystos-trąšos",
            subcategories: [
              { name: "Koncentruotos", slug: "koncentruotos" },
              { name: "Gatavos naudoti", slug: "gatavos-naudoti" },
              { name: "Organinės skystos", slug: "organinės-skystos" }
            ]
          },
          {
            name: "Granuliuotos trąšos",
            slug: "granuliuotos-trąšos",
            subcategories: [
              { name: "Lėtai tirpstančios", slug: "lėtai-tirpstančios" },
              { name: "Greitai tirpstančios", slug: "greitai-tirpstančios" }
            ]
          },
          {
            name: "Birios trąšos",
            slug: "birios-trąšos",
            subcategories: [
              { name: "Smulkios", slug: "smulkios" },
              { name: "Stambios", slug: "stambios" }
            ]
          },
          {
            name: "Lazdelės",
            slug: "lazdelės",
            subcategories: [
              { name: "Kambariniams augalams", slug: "kambariniams-augalams" },
              { name: "Lauko augalams", slug: "lauko-augalams" }
            ]
          },
          {
            name: "Tabletės",
            slug: "tabletės",
            subcategories: [
              { name: "Tirpstančios", slug: "tirpstančios" },
              { name: "Lėtai skaidančios", slug: "lėtai-skaidančios" }
            ]
          }
        ]
      },
      {
        title: "Pagal veikliąją medžiagą",
        items: [
          {
            name: "Azotinės",
            slug: "azotinės",
            subcategories: [
              { name: "Karbamidas", slug: "karbamidas" },
              { name: "Amonio sulfatas", slug: "amonio-sulfatas" },
              { name: "Amonio nitratas", slug: "amonio-nitratas" }
            ]
          },
          {
            name: "Fosforo",
            slug: "fosforo",
            subcategories: [
              { name: "Superfosfatas", slug: "superfosfatas" },
              { name: "Dvigubas superfosfatas", slug: "dvigubas-superfosfatas" }
            ]
          },
          {
            name: "Kalio",
            slug: "kalio",
            subcategories: [
              { name: "Kalio chloridas", slug: "kalio-chloridas" },
              { name: "Kalio sulfatas", slug: "kalio-sulfatas" }
            ]
          },
          {
            name: "Kompleksinės (NPK)",
            slug: "kompleksinės-npk",
            subcategories: [
              { name: "Pavasarinės", slug: "pavasarinės" },
              { name: "Vasaros", slug: "vasaros" },
              { name: "Rudens", slug: "rudens" }
            ]
          },
          {
            name: "Mikroelementų",
            slug: "mikroelementų",
            subcategories: [
              { name: "Geležies", slug: "geležies" },
              { name: "Magnio", slug: "magnio" },
              { name: "Cinko", slug: "cinko" },
              { name: "Boro", slug: "boro" }
            ]
          },
          {
            name: "Organinės",
            slug: "organinės",
            subcategories: [
              { name: "Kompostas", slug: "kompostas" },
              { name: "Mėšlas", slug: "mėšlas" },
              { name: "Paukščių mėšlas", slug: "paukščių-mėšlas" }
            ]
          },
          {
            name: "Mineralinės",
            slug: "mineralinės",
            subcategories: [
              { name: "Vienkompozitės", slug: "vienkompozitės" },
              { name: "Kompleksinės", slug: "kompleksinės" }
            ]
          },
          {
            name: "Biostimuliatoriai",
            slug: "biostimuliatoriai",
            subcategories: [
              { name: "Šaknų stimuliatoriai", slug: "šaknų-stimuliatoriai" },
              { name: "Augimo stimuliatoriai", slug: "augimo-stimuliatoriai" }
            ]
          },
          {
            name: "Bakterinės",
            slug: "bakterinės",
            subcategories: [
              { name: "Azoto fiksatoriai", slug: "azoto-fiksatoriai" },
              { name: "Fosforo mobilizatoriai", slug: "fosforo-mobilizatoriai" }
            ]
          },
          {
            name: "Organinės-mineralinės",
            slug: "organinės-mineralinės",
            subcategories: [
              { name: "Su humusais", slug: "su-humusais" },
              { name: "Su aminorūgštimis", slug: "su-aminorūgštimis" }
            ]
          }
        ]
      }
    ]
  },
  "Sėklos": {
    icon: Sprout,
    categories: [
      {
        title: "Pagal augalų tipą",
        items: [
          {
            name: "Daržovių sėklos",
            slug: "daržovių-sėklos",
            subcategories: [
              { name: "Pomidorų", slug: "pomidorų" },
              { name: "Agurkų", slug: "agurkų" },
              { name: "Kopūstų", slug: "kopūstų" },
              { name: "Morkų", slug: "morkų" },
              { name: "Svogūnų", slug: "svogūnų" }
            ]
          },
          {
            name: "Žolelių sėklos",
            slug: "žolelių-sėklos",
            subcategories: [
              { name: "Baziliko", slug: "baziliko" },
              { name: "Petražolių", slug: "petražolių" },
              { name: "Krapų", slug: "krapų" },
              { name: "Rūtos", slug: "rūtos" }
            ]
          },
          {
            name: "Gėlių sėklos",
            slug: "gėlių-sėklos",
            subcategories: [
              { name: "Vienmečių", slug: "vienmečių" },
              { name: "Dvimečių", slug: "dvimečių" },
              { name: "Daugiamečių", slug: "daugiamečių" }
            ]
          },
          {
            name: "Javų sėklos",
            slug: "javų-sėklos",
            subcategories: [
              { name: "Kviečių", slug: "kviečių" },
              { name: "Miežių", slug: "miežių" },
              { name: "Avižų", slug: "avižų" },
              { name: "Rugių", slug: "rugių" }
            ]
          },
          {
            name: "Ankštinių augalų sėklos",
            slug: "ankštinių-augalų-sėklos",
            subcategories: [
              { name: "Pupų", slug: "pupų" },
              { name: "Žirnių", slug: "žirnių" },
              { name: "Sojų", slug: "sojų" }
            ]
          },
          {
            name: "Aliejinių augalų sėklos",
            slug: "aliejinių-augalų-sėklos",
            subcategories: [
              { name: "Rapsų", slug: "rapsų" },
              { name: "Saulėgrąžų", slug: "saulėgrąžų" }
            ]
          },
          {
            name: "Pašarinių augalų sėklos",
            slug: "pašarinių-augalų-sėklos",
            subcategories: [
              { name: "Dobilų", slug: "dobilų" },
              { name: "Liucernos", slug: "liucernos" }
            ]
          }
        ]
      },
      {
        title: "Pagal sėklos kategoriją",
        items: [
          {
            name: "Sertifikuotos",
            slug: "sertifikuotos",
            subcategories: [
              { name: "ES sertifikuotos", slug: "es-sertifikuotos" },
              { name: "Lietuvos sertifikuotos", slug: "lietuvos-sertifikuotos" }
            ]
          },
          {
            name: "Ekologiškos",
            slug: "ekologiškos",
            subcategories: [
              { name: "Ekologinio ūkio", slug: "ekologinio-ūkio" },
              { name: "Biodinaminės", slug: "biodinaminės" }
            ]
          },
          {
            name: "GMO-ne",
            slug: "gmo-ne",
            subcategories: [
              { name: "Tradicinės veislės", slug: "tradicinės-veislės" },
              { name: "Senos veislės", slug: "senos-veislės" }
            ]
          },
          {
            name: "Beicuotos",
            slug: "beicuotos",
            subcategories: [
              { name: "Fungicidais", slug: "fungicidais" },
              { name: "Insekticidais", slug: "insekticidais" }
            ]
          },
          {
            name: "Nekategorizuotos",
            slug: "nekategorizuotos",
            subcategories: []
          }
        ]
      },
      {
        title: "Pagal auginimo būdą",
        items: [
          {
            name: "Atviram gruntui",
            slug: "atviram-gruntui",
            subcategories: [
              { name: "Ankstyvoms veislėms", slug: "ankstyvoms-veislėms" },
              { name: "Vėlyvoms veislėms", slug: "vėlyvoms-veislėms" }
            ]
          },
          {
            name: "Šiltnamiams",
            slug: "šiltnamiams",
            subcategories: [
              { name: "Šiltiems šiltnamiams", slug: "šiltiems-šiltnamiams" },
              { name: "Šaltiems šiltnamiams", slug: "šaltiems-šiltnamiams" }
            ]
          }
        ]
      }
    ]
  },
  "Sodinukai": {
    icon: TreePine,
    categories: [
      {
        title: "Pagal augalų tipą",
        items: [
          {
            name: "Vaismedžių sodinukai",
            slug: "vaismedžių-sodinukai",
            subcategories: [
              { name: "Obelių", slug: "obelių" },
              { name: "Kriaušių", slug: "kriaušių" },
              { name: "Vyšnių", slug: "vyšnių" },
              { name: "Slyvų", slug: "slyvų" }
            ]
          },
          {
            name: "Uogakrūmiai",
            slug: "uogakrūmiai",
            subcategories: [
              { name: "Braškių", slug: "braškių" },
              { name: "Aviečių", slug: "aviečių" },
              { name: "Serbentų", slug: "serbentų" }
            ]
          },
          {
            name: "Dekoratyviniai augalai",
            slug: "dekoratyviniai-augalai",
            subcategories: [
              { name: "Spygliuočiai", slug: "spygliuočiai" },
              { name: "Lapuočiai", slug: "lapuočiai" },
              { name: "Krūmai", slug: "krūmai" }
            ]
          },
          {
            name: "Daržovių sodinukai",
            slug: "daržovių-sodinukai",
            subcategories: [
              { name: "Pomidorų", slug: "pomidorų" },
              { name: "Agurkų", slug: "agurkų" },
              { name: "Kopūstų", slug: "kopūstų" }
            ]
          },
          {
            name: "Miško sodinukai",
            slug: "miško-sodinukai",
            subcategories: [
              { name: "Pušų", slug: "pušų" },
              { name: "Eglių", slug: "eglių" },
              { name: "Beržų", slug: "beržų" }
            ]
          }
        ]
      },
      {
        title: "Pagal auginimo būdą",
        items: [
          {
            name: "Atviram gruntui",
            slug: "atviram-gruntui",
            subcategories: [
              { name: "Atsparūs šalčiui", slug: "atsparūs-šalčiui" },
              { name: "Šilumamėgiai", slug: "šilumamėgiai" }
            ]
          },
          {
            name: "Šiltnamiams",
            slug: "šiltnamiams",
            subcategories: [
              { name: "Šiltiems šiltnamiams", slug: "šiltiems-šiltnamiams" },
              { name: "Šaltiems šiltnamiams", slug: "šaltiems-šiltnamiams" }
            ]
          },
          {
            name: "Vazonėliuose",
            slug: "vazonėliuose",
            subcategories: [
              { name: "Plastikiniai vazonėliai", slug: "plastikiniai-vazonėliai" },
              { name: "Torfinis substratas", slug: "torfinis-substratas" }
            ]
          },
          {
            name: "Plikomis šaknimis",
            slug: "plikomis-šaknimis",
            subcategories: [
              { name: "Rudens sodinimas", slug: "rudens-sodinimas" },
              { name: "Pavasario sodinimas", slug: "pavasario-sodinimas" }
            ]
          }
        ]
      },
      {
        title: "Pagal amžių",
        items: [
          {
            name: "Vienmečiai",
            slug: "vienmečiai",
            subcategories: []
          },
          {
            name: "Dvimečiai",
            slug: "dvimečiai",
            subcategories: []
          },
          {
            name: "Daugiau nei dvimečiai",
            slug: "daugiau-nei-dvimečiai",
            subcategories: []
          }
        ]
      },
      {
        title: "Pagal kilmę",
        items: [
          {
            name: "Vietinės veislės",
            slug: "vietinės-veislės",
            subcategories: [
              { name: "Lietuviškos veislės", slug: "lietuviškos-veislės" },
              { name: "Baltijos šalių", slug: "baltijos-šalių" }
            ]
          },
          {
            name: "Egzotiniai sodinukai",
            slug: "egzotiniai-sodinukai",
            subcategories: [
              { name: "Pietų šalių", slug: "pietų-šalių" },
              { name: "Azijos", slug: "azijos" }
            ]
          }
        ]
      }
    ]
  },
  "Apsaugos priemonės augalams": {
    icon: Shield,
    categories: [
      {
        title: "Pagal kenkėją/ligą",
        items: [
          {
            name: "Nuo kenkėjų",
            slug: "nuo-kenkėjų",
            subcategories: [
              { name: "Nuo amarų", slug: "nuo-amarų" },
              { name: "Nuo tripų", slug: "nuo-tripų" },
              { name: "Nuo vikšrų", slug: "nuo-vikšrų" },
              { name: "Nuo skruzdžių", slug: "nuo-skruzdžių" }
            ]
          },
          {
            name: "Nuo ligų",
            slug: "nuo-ligų",
            subcategories: [
              { name: "Nuo grybinių ligų", slug: "nuo-grybinių-ligų" },
              { name: "Nuo bakterinių ligų", slug: "nuo-bakterinių-ligų" },
              { name: "Nuo virusinių ligų", slug: "nuo-virusinių-ligų" }
            ]
          },
          {
            name: "Nuo piktžolių",
            slug: "nuo-piktžolių",
            subcategories: [
              { name: "Selektyvūs herbicidai", slug: "selektyvūs-herbicidai" },
              { name: "Totalūs herbicidai", slug: "totalūs-herbicidai" }
            ]
          },
          {
            name: "Nuo graužikų",
            slug: "nuo-graužikų",
            subcategories: [
              { name: "Nuo pelių", slug: "nuo-pelių" },
              { name: "Nuo žiurkių", slug: "nuo-žiurkių" },
              { name: "Nuo kurmių", slug: "nuo-kurmių" }
            ]
          }
        ]
      },
      {
        title: "Pagal veikimo būdą",
        items: [
          {
            name: "Kontaktiniai",
            slug: "kontaktiniai",
            subcategories: [
              { name: "Greitai veikiantys", slug: "greitai-veikiantys" },
              { name: "Ilgai veikiantys", slug: "ilgai-veikiantys" }
            ]
          },
          {
            name: "Sistemininiai",
            slug: "sistemininiai",
            subcategories: [
              { name: "Šaknų absorbcija", slug: "šaknų-absorbcija" },
              { name: "Lapų absorbcija", slug: "lapų-absorbcija" }
            ]
          },
          {
            name: "Translaminariniai",
            slug: "translaminariniai",
            subcategories: []
          },
          {
            name: "Fumigantai",
            slug: "fumigantai",
            subcategories: [
              { name: "Dirvožemio fumigantai", slug: "dirvožemio-fumigantai" },
              { name: "Sandėlių fumigantai", slug: "sandėlių-fumigantai" }
            ]
          }
        ]
      },
      {
        title: "Pagal kilmę",
        items: [
          {
            name: "Ekologiškos priemonės",
            slug: "ekologiškos-priemonės",
            subcategories: [
              { name: "Augalinės kilmės", slug: "augalinės-kilmės" },
              { name: "Mineralinės kilmės", slug: "mineralinės-kilmės" },
              { name: "Biologinės", slug: "biologinės" }
            ]
          },
          {
            name: "Cheminės priemonės",
            slug: "cheminės-priemonės",
            subcategories: [
              { name: "Sintetinės", slug: "sintetinės" },
              { name: "Pusiau sintetinės", slug: "pusiau-sintetinės" }
            ]
          }
        ]
      },
      {
        title: "Pagal taikymo būdą",
        items: [
          {
            name: "Purškimui",
            slug: "purškimui",
            subcategories: [
              { name: "Lapų purškimui", slug: "lapų-purškimui" },
              { name: "Dirvožemio purškimui", slug: "dirvožemio-purškimui" }
            ]
          },
          {
            name: "Dirvožemiui",
            slug: "dirvožemiui",
            subcategories: [
              { name: "Granulės", slug: "granulės" },
              { name: "Milteliai", slug: "milteliai" }
            ]
          },
          {
            name: "Sėklų beicavimui",
            slug: "sėklų-beicavimui",
            subcategories: [
              { name: "Skystas beicas", slug: "skystas-beicas" },
              { name: "Sausas beicas", slug: "sausas-beicas" }
            ]
          },
          {
            name: "Rūko generatoriai",
            slug: "rūko-generatoriai",
            subcategories: [
              { name: "Šiltnamių rūkas", slug: "šiltnamių-rūkas" },
              { name: "Sandėlių rūkas", slug: "sandėlių-rūkas" }
            ]
          }
        ]
      },
      {
        title: "Fizinės apsaugos",
        items: [
          {
            name: "Šiltnamių plėvelės",
            slug: "šiltnamių-plėvelės",
            subcategories: [
              { name: "PE plėvelės", slug: "pe-plėvelės" },
              { name: "PVC plėvelės", slug: "pvc-plėvelės" },
              { name: "Polikarbonato plokštės", slug: "polikarbonato-plokštės" }
            ]
          },
          {
            name: "Tinkliukai",
            slug: "tinkliukai",
            subcategories: [
              { name: "Nuo vabzdžių", slug: "nuo-vabzdžių" },
              { name: "Nuo paukščių", slug: "nuo-paukščių" },
              { name: "Šešėlių tinkliukai", slug: "šešėlių-tinkliukai" }
            ]
          },
          {
            name: "Agroplėvelės",
            slug: "agroplėvelės",
            subcategories: [
              { name: "Baltos", slug: "baltos" },
              { name: "Juodos", slug: "juodos" },
              { name: "Perforuotos", slug: "perforuotos" }
            ]
          },
          {
            name: "Mulčias",
            slug: "mulčias",
            subcategories: [
              { name: "Organinis mulčias", slug: "organinis-mulčias" },
              { name: "Neorganinis mulčias", slug: "neorganinis-mulčias" }
            ]
          },
          {
            name: "Apsauginės dangos",
            slug: "apsauginės-dangos",
            subcategories: [
              { name: "Nuo šalnos", slug: "nuo-šalnos" },
              { name: "Nuo saulės", slug: "nuo-saulės" }
            ]
          }
        ]
      }
    ]
  }
}

// Helper function to get all items with subcategories flattened
export const getAllCategoryItems = () => {
  const allItems = []
  
  Object.entries(navigationData).forEach(([mainCategory, data]) => {
    data.categories.forEach(category => {
      category.items.forEach(item => {
        allItems.push({
          mainCategory,
          categoryTitle: category.title,
          ...item
        })
        
        // Add subcategories as separate items
        if (item.subcategories && item.subcategories.length > 0) {
          item.subcategories.forEach(subcat => {
            allItems.push({
              mainCategory,
              categoryTitle: category.title,
              parentItem: item.name,
              parentSlug: item.slug,
              name: subcat.name,
              slug: subcat.slug,
              isSubcategory: true
            })
          })
        }
      })
    })
  })
  
  return allItems
}

// Helper function to find category data by slug
export const findCategoryBySlug = (mainCategory, slug) => {
  const categoryData = navigationData[mainCategory]
  if (!categoryData) return null
  
  for (const category of categoryData.categories) {
    for (const item of category.items) {
      if (item.slug === slug) {
        return { ...item, categoryTitle: category.title }
      }
      
      // Check subcategories
      if (item.subcategories) {
        for (const subcat of item.subcategories) {
          if (subcat.slug === slug) {
            return {
              ...subcat,
              categoryTitle: category.title,
              parentItem: item.name,
              parentSlug: item.slug,
              isSubcategory: true
            }
          }
        }
      }
    }
  }
  
  return null
}

