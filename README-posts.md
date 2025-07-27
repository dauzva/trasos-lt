# Markdown Post System

This system allows you to easily add new posts to the website by writing them in Markdown format and automatically converting them to the required data structure.

## Quick Start

1. Create a markdown file with front matter
2. Run the processor script
3. The post will be automatically added to the website

## Markdown File Format

Create a `.md` file with the following structure:

```markdown
---
title: Your Post Title
author: Author Name
category: Category Name
image: /images/your-image.jpg
tags: tag1, tag2, tag3
date: 2024-03-15
---

# Your Post Title

Your post content goes here in Markdown format.

## Subheading

More content...

### Sub-subheading

- List item 1
- List item 2

1. Numbered item 1
2. Numbered item 2
```

## Front Matter Fields

| Field | Required | Description | Example |
|-------|----------|-------------|---------|
| `title` | Yes | Post title | `"Obelų tręšimas pavasarį"` |
| `author` | No | Author name | `"Dr. Jonas Petraitis"` |
| `category` | No | Display category | `"Vaismedžiai"` |
| `image` | No | Featured image path | `"/images/apple-fertilizing.jpg"` |
| `tags` | No | Comma-separated tags | `"obelės, pavasaris, tręšimas"` |
| `date` | No | Publication date | `"2024-03-15"` |
| `slug` | No | URL slug (auto-generated if not provided) | `"obelu-tresimas-pavasari"` |
| `excerpt` | No | Short description (auto-generated if not provided) | `"Pavasaris - svarbiausias laikas..."` |

## Processing Script

Use the `markdown-processor.cjs` script to convert markdown files to posts:

```bash
node scripts/markdown-processor.cjs <markdown-file> [options]
```

### Options

| Option | Description | Example |
|--------|-------------|---------|
| `--category` | Main category | `--category trąšos` |
| `--subcategory` | Subcategory slug | `--subcategory vaismedžiams` |
| `--author` | Override author | `--author "Dr. Jonas Petraitis"` |
| `--image` | Override image | `--image "/images/my-image.jpg"` |
| `--tags` | Override tags | `--tags "tag1,tag2,tag3"` |
| `--title` | Override title | `--title "My Custom Title"` |

### Example Usage

```bash
# Basic usage
node scripts/markdown-processor.cjs my-post.md --category trąšos --subcategory vaismedžiams

# With additional options
node scripts/markdown-processor.cjs my-post.md \
  --category trąšos \
  --subcategory vaismedžiams \
  --author "Dr. Jonas Petraitis" \
  --tags "obelės,pavasaris,tręšimas"
```

## Available Categories and Subcategories

### Trąšos (trąšos)
- vaismedžiams
- daržovėms
- gėlėms
- uogakrūmiams
- vejai
- dekoratyviniams-augalams
- kambarinėms-gėlėms
- skystos-trąšos
- granuliuotos-trąšos
- birios-trąšos
- lazdelės
- tabletės
- azotinės
- fosforo
- kalio
- kompleksinės-npk
- mikroelementų
- organinės
- mineralinės
- biostimuliatoriai
- bakterinės
- organinės-mineralinės
- obelėms
- kriaušėms
- vyšnioms
- slyvoms
- persikams
- citrusams
- pomidorams
- agurkams
- kopūstams
- morkoms
- svogūnams
- bulvėms
- rožėms
- tulpėms
- narcizams
- petunijoms
- begonijoms
- braškėms
- aviečių-krūmams
- serbentams
- agrastams
- mėlynėms
- sporto-vejai
- dekoratyvinei-vejai
- šešėlinei-vejai
- spygliuočiams
- lapuočiams
- krūmams
- fikusams
- orchidėjoms
- kaktusams
- palmėms

### Sėklos (sėklos)
- daržovių-sėklos
- žolelių-sėklos
- gėlių-sėklos
- javų-sėklos
- ankštinių-augalų-sėklos
- aliejinių-augalų-sėklos
- pašarinių-augalų-sėklos
- sertifikuotos
- ekologiškos
- gmo-ne
- beicuotos
- nekategorizuotos
- atviram-gruntui
- šiltnamiams
- pomidorų
- agurkų
- kopūstų
- morkų
- svogūnų
- baziliko
- petražolių
- krapų
- rūtos
- vienmečių
- dvimečių
- daugiamečių
- kviečių
- miežių
- avižų
- rugių
- pupų
- žirnių
- sojų
- rapsų
- saulėgrąžų
- dobilų
- liucernos

### Sodinukai (sodinukai)
- vaismedžių-sodinukai
- uogakrūmiai
- dekoratyviniai-augalai
- daržovių-sodinukai
- miško-sodinukai
- atviram-gruntui
- šiltnamiams
- vazonėliuose
- plikomis-šaknimis
- vienmečiai
- dvimečiai
- daugiau-nei-dvimečiai
- vietinės-veislės
- egzotiniai-sodinukai
- obelių
- kriaušių
- vyšnių
- slyvų
- braškių
- aviečių
- serbentų
- spygliuočiai
- lapuočiai
- krūmai
- pomidorų
- agurkų
- kopūstų
- pušų
- eglių
- beržų

### Apsaugos priemonės augalams (apsaugos-priemonės-augalams)
- nuo-kenkėjų
- nuo-ligų
- nuo-piktžolių
- nuo-graužikų
- kontaktiniai
- sistemininiai
- translaminariniai
- fumigantai
- ekologiškos-priemonės
- cheminės-priemonės
- purškimui
- dirvožemiui
- sėklų-beicavimui
- rūko-generatoriai
- šiltnamių-plėvelės
- tinkliukai
- agroplėvelės
- mulčias
- apsauginės-dangos

## Workflow

1. **Create markdown file**: Write your post in markdown format with proper front matter
2. **Process the file**: Run the script to convert it to a post object
3. **Automatic integration**: The post is automatically added to the posts data file
4. **Restart development server**: If running in development, restart to see changes

## Tips

- Use descriptive filenames for your markdown files
- Include high-quality images and reference them in the front matter
- Write clear, informative excerpts or let the system auto-generate them
- Use relevant tags to help with categorization
- Follow Lithuanian naming conventions for consistency

## Troubleshooting

### Common Issues

1. **"Posts data file not found"**: Make sure you're running the script from the project root directory
2. **"Category not found"**: Ensure the category exists in the posts.js file structure
3. **Invalid markdown**: Check your front matter syntax and markdown formatting

### Getting Help

Run the script with `--help` to see all available options:

```bash
node scripts/markdown-processor.cjs --help
```

