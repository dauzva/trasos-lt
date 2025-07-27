import { Leaf, Sprout, TreePine, Shield } from 'lucide-react';

export const navigationData = {
  "Trąšos": {
    icon: Leaf,
    categories: [
      {
        title: "Pagal augalą",
        items: [
          {
            name: "Vaismedžiams",
            slug: "vaismedziams",
            subcategories: [
              { name: "Obelėms", slug: "obelems" },
              { name: "Kriaušėms", slug: "kriausems" },
              { name: "Vyšnioms", slug: "vysnioms" },
              { name: "Slyvoms", slug: "slyvoms" },
              { name: "Persikams", slug: "persikams" },
              { name: "Citrusams", slug: "citrusams" }
            ]
          },
          {
            name: "Daržovėms",
            slug: "darzovems",
            subcategories: [
              { name: "Pomidorams", slug: "pomidorams" },
              { name: "Agurkams", slug: "agurkams" },
              { name: "Kopūstams", slug: "kopustams" },
              { name: "Morkoms", slug: "morkoms" },
              { name: "Svogūnams", slug: "svogunams" },
              { name: "Bulvėms", slug: "bulvems" }
            ]
          },
          {
            name: "Gėlėms",
            slug: "gelems",
            subcategories: [
              { name: "Rožėms", slug: "rozems" },
              { name: "Tulpėms", slug: "tulpems" },
              { name: "Narcizams", slug: "narcizams" },
              { name: "Petunijoms", slug: "petunijoms" },
              { name: "Begonijoms", slug: "begonijoms" }
            ]
          },
          {
            name: "Uogakrūmiams",
            slug: "uogakrumiams",
            subcategories: [
              { name: "Braškėms", slug: "braskems" },
              { name: "Aviečių krūmams", slug: "avieciu-krumams" },
              { name: "Serbentams", slug: "serbentams" },
              { name: "Agriastams", slug: "agrastams" },
              { name: "Mėlynėms", slug: "melynems" }
            ]
          },
          {
            name: "Vejai",
            slug: "vejai",
            subcategories: [
              { name: "Sporto vejai", slug: "sporto-vejai" },
              { name: "Dekoratyvinėi vejai", slug: "dekoratyvinei-vejai" },
              { name: "Šesėlinei vejai", slug: "seselinei-vejai" }
            ]
          },
          {
            name: "Dekoratyviniams augalams",
            slug: "dekoratyviniams-augalams",
            subcategories: [
              { name: "Spygliuočiams", slug: "spygliuociams" },
              { name: "Lapuočiams", slug: "lapuociams" },
              { name: "Krūmams", slug: "krumams" }
            ]
          },
          {
            name: "Kambarinėms gėlėms",
            slug: "kambarinems-gelems",
            subcategories: [
              { name: "Fikusams", slug: "fikusams" },
              { name: "Orchidėjoms", slug: "orchidejoms" },
              { name: "Kaktusams", slug: "kaktusams" },
              { name: "Palmėms", slug: "palmems" }
            ]
          }
        ]
      },
      {
        title: "Pagal formą",
        items: [
          {
            name: "Skystos trąšos",
            slug: "skystos-trasos",
            subcategories: [
              { name: "Koncentruotos", slug: "koncentruotos" },
              { name: "Paruoštos naudoti", slug: "gatavos-naudoti" },
              { name: "Organinės skystos", slug: "organines-skystos" }
            ]
          },
          {
            name: "Granuliuotos trąšos",
            slug: "granuliuotos-trasos",
            subcategories: [
              { name: "Lėtai tirpstančios", slug: "letai-tirpstancios" },
              { name: "Greitai tirpstančios", slug: "greitai-tirpstancios" }
            ]
          },
          {
            name: "Birios trąšos",
            slug: "birios-trasos",
            subcategories: [
              { name: "Smulkios", slug: "smulkios" },
              { name: "Stambios", slug: "stambios" }
            ]
          },
          {
            name: "Lazdelės",
            slug: "lazdeles",
            subcategories: [
              { name: "Kambariniams augalams", slug: "kambariniams-augalams" },
              { name: "Lauko augalams", slug: "lauko-augalams" }
            ]
          },
          {
            name: "Tabletės",
            slug: "tabletes",
            subcategories: [
              { name: "Tirpstančios", slug: "tirpstancios" },
              { name: "Lėtai skaidančios", slug: "letai-skaidancios" }
            ]
          }
        ]
      },
      {
        title: "Pagal veikliąją medžiagą",
        items: [
          {
            name: "Azotinės",
            slug: "azotines",
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
            slug: "kompleksines-npk",
            subcategories: [
              { name: "Pavasarines", slug: "pavasarines" },
              { name: "Vasaros", slug: "vasaros" },
              { name: "Rudeninės", slug: "rudens" }
            ]
          },
          {
            name: "Mikroelementų",
            slug: "mikroelementu",
            subcategories: [
              { name: "Geležies", slug: "gelezies" },
              { name: "Magnio", slug: "magnio" },
              { name: "Cinko", slug: "cinko" },
              { name: "Boro", slug: "boro" }
            ]
          },
          {
            name: "Organinės",
            slug: "organines",
            subcategories: [
              { name: "Kompostas", slug: "kompostas" },
              { name: "Mėšlas", slug: "meslas" },
              { name: "Paukščių mėšlas", slug: "pauksciu-meslas" }
            ]
          },
          {
            name: "Mineralinės",
            slug: "mineralines",
            subcategories: [
              { name: "Vienkomponenčių", slug: "vienkompozites" },
              { name: "Kompleksinės", slug: "kompleksines" }
            ]
          },
          {
            name: "Biostimuliatoriai",
            slug: "biostimuliatoriai",
            subcategories: [
              { name: "Šaknų stimuliatoriai", slug: "saknu-stimuliatoriai" },
              { name: "Augimo stimuliatoriai", slug: "augimo-stimuliatoriai" }
            ]
          },
          {
            name: "Bakterinės",
            slug: "bakterines",
            subcategories: [
              { name: "Azoto fiksatoriai", slug: "azoto-fiksatoriai" },
              { name: "Fosforo mobilizatoriai", slug: "fosforo-mobilizatoriai" }
            ]
          },
          {
            name: "Organinės-mineralinės",
            slug: "organines-mineralines",
            subcategories: [
              { name: "Su humusais", slug: "su-humusais" },
              { name: "Su aminorūgštimis", slug: "su-aminorugstimis" }
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
        title: "Pagal augalo tipą",
        items: [
          {
            name: "Daržovių sėklos",
            slug: "darzoviu-seklos",
            subcategories: [
              { name: "Pomidorų", slug: "pomidoru" },
              { name: "Agurkų", slug: "agurku" },
              { name: "Kopūstų", slug: "kopustu" },
              { name: "Morkų", slug: "morku" },
              { name: "Svogūnų", slug: "svogunu" }
            ]
          },
          {
            name: "Žolelių sėklos",
            slug: "zoleliu-seklos",
            subcategories: [
              { name: "Baziliko", slug: "baziliko" },
              { name: "Petražolių", slug: "petrazoliu" },
              { name: "Krapų", slug: "krapu" },
              { name: "Rūtos", slug: "rutos" }
            ]
          },
          {
            name: "Gėlių sėklos",
            slug: "geliu-seklos",
            subcategories: [
              { name: "Vienmečių", slug: "vienmeciu" },
              { name: "Dvimečių", slug: "dvimeciu" },
              { name: "Daugiamečių", slug: "daugiameciu" }
            ]
          },
          {
            name: "Javų sėklos",
            slug: "javu-seklos",
            subcategories: [
              { name: "Kviečių", slug: "kvieciu" },
              { name: "Miežių", slug: "mieziu" },
              { name: "Avižų", slug: "avizu" },
              { name: "Rugių", slug: "rugiu" }
            ]
          },
          {
            name: "Ankstinių augalų sėklos",
            slug: "ankstiniu-augalu-seklos",
            subcategories: [
              { name: "Pupų", slug: "pupu" },
              { name: "Žirnių", slug: "zirniu" },
              { name: "Sojos", slug: "soju" }
            ]
          },
          {
            name: "Aliejinių augalų sėklos",
            slug: "aliejiniu-augalu-seklos",
            subcategories: [
              { name: "Rapsų", slug: "rapsu" },
              { name: "Saulėgrąžų", slug: "saulegrazu" }
            ]
          },
          {
            name: "Pašarinių augalų sėklos",
            slug: "pasariniu-augalu-seklos",
            subcategories: [
              { name: "Dobilų", slug: "dobilu" },
              { name: "Liučernos", slug: "liucernos" }
            ]
          }
        ]
      },
      {
        title: "Pagal sėklų kategoriją",
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
            slug: "ekologiskos",
            subcategories: [
              { name: "Ekologinio ūkio", slug: "ekologinio-ukio" },
              { name: "Biodinaminės", slug: "biodinamines" }
            ]
          },
          {
            name: "GMO-ne",
            slug: "gmo-ne",
            subcategories: [
              { name: "Tradicinės veislės", slug: "tradicines-veisles" },
              { name: "Senos veislės", slug: "senos-veisles" }
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
            name: "Atviram gruntu",
            slug: "atviram-gruntui",
            subcategories: [
              { name: "Ankstyvoms veislėms", slug: "ankstyvoms-veislems" },
              { name: "Vėlyvoms veislėms", slug: "velyvoms-veislems" }
            ]
          },
          {
            name: "Šiltnamiams",
            slug: "siltnamiams",
            subcategories: [
              { name: "Šiltiems šiltnamiams", slug: "siltiems-siltnamiams" },
              { name: "Šaltiems šiltnamiams", slug: "saltiems-siltnamiams" }
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
        title: "Pagal augalo tipą",
        items: [
          {
            name: "Vaismedžių sodinukai",
            slug: "vaismedziu-sodinukai",
            subcategories: [
              { name: "Obelų", slug: "obeliu" },
              { name: "Kriaušių", slug: "kriausiu" },
              { name: "Vyšnių", slug: "vysniu" },
              { name: "Slyvų", slug: "slyvu" }
            ]
          },
          {
            name: "Uogakrūmiai",
            slug: "uogakrumiai",
            subcategories: [
              { name: "Braškių", slug: "braskiu" },
              { name: "Aviečių", slug: "avieciu" },
              { name: "Serbentų", slug: "serbentu" }
            ]
          },
          {
            name: "Dekoratyviniai augalai",
            slug: "dekoratyviniai-augalai",
            subcategories: [
              { name: "Spygliuočiai", slug: "spygliuociai" },
              { name: "Lapuočiai", slug: "lapuociai" },
              { name: "Krūmai", slug: "krumai" }
            ]
          },
          {
            name: "Daržovių sodinukai",
            slug: "darzoviu-sodinukai",
            subcategories: [
              { name: "Pomidorų", slug: "pomidoru" },
              { name: "Agurkų", slug: "agurku" },
              { name: "Kopūstų", slug: "kopustu" }
            ]
          },
          {
            name: "Miško sodinukai",
            slug: "misko-sodinukai",
            subcategories: [
              { name: "Pušų", slug: "pusu" },
              { name: "Eglių", slug: "egliu" },
              { name: "Beržų", slug: "berzu" }
            ]
          }
        ]
      },
      {
        title: "Pagal auginimo būdą",
        items: [
          {
            name: "Atviram gruntu",
            slug: "atviram-gruntui",
            subcategories: [
              { name: "Atsparūs šalčiui", slug: "atsparus-salciui" },
              { name: "Šilumamėgiai", slug: "silumamegiai" }
            ]
          },
          {
            name: "Šiltnamiams",
            slug: "siltnamiams",
            subcategories: [
              { name: "Šiltiems šiltnamiams", slug: "siltiems-siltnamiams" },
              { name: "Šaltiems šiltnamiams", slug: "saltiems-siltnamiams" }
            ]
          },
          {
            name: "Vazonėliuose",
            slug: "vazoneliuose",
            subcategories: [
              { name: "Plastikiniai vazonėliai", slug: "plastikiniai-vazoneliai" },
              { name: "Torfinis substratas", slug: "torfinis-substratas" }
            ]
          },
          {
            name: "Plikomis šaknimis",
            slug: "plikomis-saknimis",
            subcategories: [
              { name: "Rudeninis sodinimas", slug: "rudens-sodinimas" },
              { name: "Pavasarinis sodinimas", slug: "pavasario-sodinimas" }
            ]
          }
        ]
      },
      {
        title: "Pagal amžių",
        items: [
          {
            name: "Vienmečiai",
            slug: "vienmeciai",
            subcategories: []
          },
          {
            name: "Dvimečiai",
            slug: "dvimeciai",
            subcategories: []
          },
          {
            name: "Daugiau nei dvimečiai",
            slug: "daugiau-nei-dvimeciai",
            subcategories: []
          }
        ]
      },
      {
        title: "Pagal kilmę",
        items: [
          {
            name: "Vietinės veislės",
            slug: "vietines-veisles",
            subcategories: [
              { name: "Lietuviškos veislės", slug: "lietuviskos-veisles" },
              { name: "Baltijos šalių", slug: "baltijos-saliu" }
            ]
          },
          {
            name: "Egzotiniai sodinukai",
            slug: "egzotiniai-sodinukai",
            subcategories: [
              { name: "Pietų šalių", slug: "pietu-saliu" },
              { name: "Azijos", slug: "azijos" }
            ]
          }
        ]
      }
    ]
  },
  "Augalų apsaugos priemonės": {
    icon: Shield,
    categories: [
      {
        title: "Pagal kenkėją/ligą",
        items: [
          {
            name: "Nuo kenkėjų",
            slug: "nuo-kenkeju",
            subcategories: [
              { name: "Nuo amarų", slug: "nuo-amaru" },
              { name: "Nuo triušių", slug: "nuo-tripu" },
              { name: "Nuo vikšrų", slug: "nuo-viksru" },
              { name: "Nuo skruzdžių", slug: "nuo-skruzdziu" }
            ]
          },
          {
            name: "Nuo ligų",
            slug: "nuo-ligu",
            subcategories: [
              { name: "Nuo pelėsių", slug: "nuo-peleses" },
              { name: "Nuo rūjos", slug: "nuo-rujos" },
              { name: "Nuo bakterijų", slug: "nuo-bakteriju" }
            ]
          }
        ]
      }
    ]
  }
};