// AUTOMATED CATEGORY MAPPING GENERATION
import { navigationData } from './categories';

function toDisplayCase(str) {
  // Capitalize first letter, lowercase the rest, and replace special Lithuanian letters with correct display form
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

function toSlug(str) {
  // Remove Lithuanian letters for slugs, but keep correct spelling (no diacritics)
  return str
    .toLowerCase()
    .replace(/ą/g, 'a')
    .replace(/č/g, 'c')
    .replace(/ę/g, 'e')
    .replace(/ė/g, 'e')
    .replace(/į/g, 'i')
    .replace(/š/g, 's')
    .replace(/ų/g, 'u')
    .replace(/ū/g, 'u')
    .replace(/ž/g, 'z');
}

function generateCategoryMapping() {
  const mapping = {};
  function traverse(items, path, prefix) {
    for (const item of items) {
      const slug = toSlug(item.slug);
      mapping[`${prefix ? prefix + '-' : ''}${slug}`] = {
        path: [...path.map(toDisplayCase), item.name],
        displayName: [...path.map(toDisplayCase), item.name].join(' → ')
      };
      if (item.subcategories) {
        for (const sub of item.subcategories) {
          const subSlug = `${slug}-${toSlug(sub.slug)}`;
          mapping[`${prefix ? prefix + '-' : ''}${subSlug}`] = {
            path: [...path.map(toDisplayCase), item.name, sub.name],
            displayName: [...path.map(toDisplayCase), item.name, sub.name].join(' → ')
          };
        }
      }
    }
  }
  for (const [sectionName, section] of Object.entries(navigationData)) {
    for (const categoryGroup of section.categories) {
      traverse(categoryGroup.items, [sectionName], toSlug(sectionName));
    }
  }
  return mapping;
}

export const categoryMapping = generateCategoryMapping();
export const allCategorySlugs = Object.keys(categoryMapping);

// Utility to get category mapping by key
export function getCategoryFromMapping(key) {
  return categoryMapping[key] || null;
}
