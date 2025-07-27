// Simplified categorization system with ASCII-compatible URLs
// Two-level system: category -> subcategory

export const simplifiedCategories = {
  // Trąšos
  "trasos": {
    displayName: "Trąšos",
    subcategories: {
      "vaismedžiams": "Vaismedžiams",
      "darzovems": "Daržovėms", 
      "gelems": "Gėlėms",
      "uogakrumiams": "Uogakrūmiams",
      "vejai": "Vejai",
      "dekoratyviniams": "Dekoratyviniams augalams",
      "kambarinems": "Kambarinėms gėlėms",
      "skystos": "Skystos trąšos",
      "granuliuotos": "Granuliuotos trąšos",
      "birios": "Birios trąšos",
      "lazdelės": "Lazdelės",
      "tabletes": "Tabletės",
      "azotines": "Azotinės",
      "fosforo": "Fosforo",
      "kalio": "Kalio",
      "kompleksines": "Kompleksinės (NPK)",
      "mikroelementu": "Mikroelementų",
      "organines": "Organinės",
      "mineralines": "Mineralinės",
      "biostimuliatoriai": "Biostimuliatoriai",
      "bakterines": "Bakterinės",
      "organines-mineralines": "Organinės-mineralinės"
    }
  },
  
  // Sėklos
  "seklos": {
    displayName: "Sėklos",
    subcategories: {
      "darzoviu": "Daržovių sėklos",
      "zoleliuu": "Žolelių sėklos",
      "geliu": "Gėlių sėklos",
      "javu": "Javų sėklos",
      "ankstiniu": "Ankštinių augalų sėklos",
      "aliejinių": "Aliejinių augalų sėklos",
      "pasariniu": "Pašarinių augalų sėklos",
      "sertifikuotos": "Sertifikuotos",
      "ekologiskos": "Ekologiškos",
      "gmo-ne": "GMO-ne",
      "beicuotos": "Beicuotos",
      "nekategorizuotos": "Nekategorizuotos",
      "atviram-gruntui": "Atviram gruntui",
      "siltnamiams": "Šiltnamiams"
    }
  },
  
  // Sodinukai
  "sodinukai": {
    displayName: "Sodinukai",
    subcategories: {
      "vaismedziu": "Vaismedžių sodinukai",
      "uogakrumiai": "Uogakrūmiai",
      "dekoratyviniai": "Dekoratyviniai augalai",
      "darzoviu": "Daržovių sodinukai",
      "misko": "Miško sodinukai",
      "atviram-gruntui": "Atviram gruntui",
      "siltnamiams": "Šiltnamiams",
      "vazoneliuose": "Vazonėliuose",
      "plikomis-saknimis": "Plikomis šaknimis",
      "vienmetiai": "Vienmečiai",
      "dvimetiai": "Dvimečiai",
      "daugiau-nei-dvimetiai": "Daugiau nei dvimečiai",
      "vietines-veisles": "Vietinės veislės",
      "egzotiniai": "Egzotiniai sodinukai"
    }
  },
  
  // Apsaugos priemonės augalams
  "apsaugos-priemones": {
    displayName: "Apsaugos priemonės augalams",
    subcategories: {
      "nuo-kenkeju": "Nuo kenkėjų",
      "nuo-ligu": "Nuo ligų",
      "nuo-piktzoliu": "Nuo piktžolių",
      "nuo-grauziku": "Nuo graužikų",
      "kontaktiniai": "Kontaktiniai",
      "sistemininiai": "Sistemininiai",
      "translaminariniai": "Translaminariniai",
      "fumigantai": "Fumigantai",
      "ekologiskos": "Ekologiškos priemonės",
      "chemines": "Cheminės priemonės",
      "purskimui": "Purškimui",
      "dirvozemiui": "Dirvožemiui",
      "seklu-beicavimui": "Sėklų beicavimui",
      "rumo-generatoriai": "Rūmo generatoriai",
      "siltnamiu-pleveles": "Šiltnamių plėvelės",
      "tinkliukai": "Tinkliukai",
      "agroplevelės": "Agroplėvelės",
      "mulcias": "Mulčias",
      "apsaugines-dangos": "Apsauginės dangos"
    }
  }
};

// Helper function to get category and subcategory from URL
export function getCategoryFromUrl(categorySlug, subcategorySlug) {
  const category = simplifiedCategories[categorySlug];
  if (!category) return null;
  
  const subcategoryName = category.subcategories[subcategorySlug];
  if (!subcategoryName) return null;
  
  return {
    category: category.displayName,
    subcategory: subcategoryName,
    categorySlug,
    subcategorySlug
  };
}

// Helper function to get URL from category and subcategory names
export function getUrlFromCategory(categoryName, subcategoryName) {
  for (const [categorySlug, categoryData] of Object.entries(simplifiedCategories)) {
    if (categoryData.displayName === categoryName) {
      for (const [subcategorySlug, subcategoryDisplayName] of Object.entries(categoryData.subcategories)) {
        if (subcategoryDisplayName === subcategoryName) {
          return {
            categorySlug,
            subcategorySlug,
            url: `/${categorySlug}/${subcategorySlug}`
          };
        }
      }
    }
  }
  return null;
}

