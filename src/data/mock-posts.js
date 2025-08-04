// Mock post data for local development
export const mockPosts = [
  {
    id: 1,
    title: 'Obelų tręšimas pavasarį: kada ir kaip tręšti',
    content: `# Obelų tręšimas pavasarį: kada ir kaip tręšti

Pavasaris yra kritiškai svarbus laikas obelų tręšimui. Tinkamas tręšimas šiuo metu gali lemti visų metų derliaus kokybę ir kiekį.

## Kada tręšti obeles pavasarį

Geriausias laikas obelų tręšimui yra ankstyvasis pavasaris, kai:
- Sniegas jau ištirpęs
- Dirvožemis pradėjo atšilti
- Pumpurai dar nėra išsiskleidę

## Kokias trąšas naudoti

### Azotinės trąšos
- **Karbamidas** - 20-30 g/m²
- **Amonio sulfatas** - 25-35 g/m²

### Kompleksinės trąšos
- NPK 16-16-16 - 40-50 g/m²
- NPK 20-10-10 - 30-40 g/m²

## Tręšimo metodai

1. **Išbarstymas aplink kamieną** - trąšas išbarstykite 1-2 m spinduliu nuo kamieno
2. **Įkasimas** - lengvai įkaskite trąšas 5-10 cm gylyje
3. **Laistymas** - po tręšimo gerai palaistykit

## Organinės trąšos

Organinės trąšos yra puikus papildymas prie mineralinių:
- **Kompostas** - 5-10 kg/medžiui
- **Puvęs mėšlas** - 3-5 kg/medžiui
- **Paukščių mėšlas** - 1-2 kg/medžiui

## Svarbu atsiminti

- Netręškite per šaltą orą
- Vengkite tręšimo žydėjimo metu
- Stebėkite medžių reakciją į trąšas`,
    category: 'Vaismedžiai',
    subcategory: 'Obelės',
    tags: ['obelės', 'pavasaris', 'tręšimas', 'azotinės trąšos'],
    author: 'Dr. Jonas Petraitis',
    date: '2024-03-15',
    image: '/images/apple-fertilizing.jpg',
    timestamp: '2024-03-15T10:00:00Z',
    excerpt: 'Pavasaris - svarbiausias laikas obelų tręšimui. Sužinokite, kokias trąšas naudoti ir kaip teisingai jas taikyti.'
  },
  {
    id: 2,
    title: 'Organinės trąšos vaismedžiams: privalumai ir trūkumai',
    content: `# Organinės trąšos vaismedžiams: privalumai ir trūkumai

Organinės trąšos gali būti puikus pasirinkimas vaismedžiams. Išnagrinėjame jų poveikį ir taikymo ypatumus.

## Organinių trąšų tipai

### Gyvūninės kilmės
- **Mėšlas** - universali organinė trąša
- **Kompostas** - subalansuotas maistingųjų medžiagų šaltinis
- **Paukščių mėšlas** - aukštas azoto kiekis

### Augalinės kilmės
- **Žalieji trąšai** - azoto fiksatoriai
- **Augalų kompostas** - lėtai skaidosi
- **Medienos pelenai** - kalio šaltinis

## Privalumai

1. **Ilgalaikis poveikis** - lėtai skaidosi ir maitina augalus ilgai
2. **Dirvožemio struktūros gerinimas** - didina humusingumo kiekį
3. **Mikroorganizmų aktyvumas** - skatina naudingų bakterijų veiklą
4. **Ekologiškumas** - natūralus ir saugus aplinkai

## Trūkumai

1. **Lėtas poveikis** - rezultatai matomi ne iš karto
2. **Netiksli sudėtis** - sunku tiksliai dozuoti
3. **Galimi kenkėjai** - gali būti ligų ir kenkėjų šaltinis
4. **Kvapas** - ne visada malonus

## Taikymo rekomendacijos

- Naudokite **gerai kompostuotą** organinę medžiagą
- Taikykite **rudenį** arba **ankstyvą pavasarį**
- Derinkit su **mineralinėmis trąšomis**
- Stebėkite augalų **reakciją**`,
    category: 'Vaismedžiai',
    subcategory: 'Bendrai',
    tags: ['organinės trąšos', 'vaismedžiai', 'kompostas', 'mėšlas'],
    author: 'Marija Kazlauskienė',
    date: '2024-03-10',
    image: '/images/organic-fertilizer.jpg',
    timestamp: '2024-03-10T10:00:00Z',
    excerpt: 'Organinės trąšos gali būti puikus pasirinkimas vaismedžiams. Išnagrinėjame jų poveikį ir taikymo ypatumus.'
  }
];

// Mock function to get post by ID
export const getMockPostById = (postId) => {
  return mockPosts.find(post => post.id === parseInt(postId));
};

// Mock function to get posts by category
export const getMockPostsByCategory = (category) => {
  return mockPosts.filter(post => 
    post.category.toLowerCase().includes(category.toLowerCase()) ||
    post.subcategory.toLowerCase().includes(category.toLowerCase())
  );
};

