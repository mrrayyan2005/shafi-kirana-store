import { CATEGORIES } from '../data/categories'

/**
 * Suggests a category from a product name.
 * Used by Quick Add so "Oreo" lands in Biscuits & Snacks, not Other.
 */
const KEYWORDS = {
  'atta-rice-dal': [
    'atta', 'flour', 'wheat', 'maida', 'rice', 'dal', 'dal', 'lentil', 'chana', 'toor', 'arhar',
    'moong', 'masoor', 'urad', 'rajma', 'chawal', 'basmati', 'sugar', 'sakkar', 'cheeni', 'poha', 'sabudana',
    'suji', 'rava', 'semolina', 'sooji', 'dalia', 'oats', 'cornflour', 'besan', 'gram flour',
  ],
  'oil-ghee': [
    'oil', 'tel', 'ghee', 'mustard', 'sunflower', 'coconut oil', 'groundnut', 'olive',
    'refined', 'vanaspati', 'butter', 'margarine',
  ],
  'spices-masala': [
    'spice', 'masala', 'haldi', 'turmeric', 'chilli', 'chili', 'mirch', 'pepper', 'kali mirch',
    'cumin', 'jeera', 'coriander', 'dhania', 'cardamom', 'elaichi', 'cinnamon', 'dalchini',
    'cloves', 'laung', 'mustard seed', 'rai', 'asafoetida', 'hing', 'salt', 'namak',
    'chat masala', 'garam', 'pav bhaji', 'kitchen king', 'jeeravan', 'kashmiri',
  ],
  'biscuits-snacks': [
    'biscuit', 'cookie', 'oreo', 'parle', 'britannia', 'marie', 'good day', 'dark fantasy',
    'monaco', 'krackjack', 'tiger', 'nutri choice', 'snack', 'namkeen', 'bhujia', 'sev',
    'mixture', 'chips', 'lays', 'kurkure', 'bingo', 'uncle chipps', 'popcorn', 'nachos',
    'rusk', 'toast', 'khari', 'papad', 'pickle', 'achar', 'murukku', 'chakli', 'mathri',
  ],
  'chocolates-confectionery': [
    'chocolate', 'dairy milk', 'cadbury', 'kitkat', '5 star', 'perk', 'munch', 'eclairs',
    'candy', 'toffee', 'sugar candy', 'gulab jamun mix', 'jam', 'jelly', 'gulab', 'son papdi',
    'barfi', 'laddu', 'halwa mix', 'hot chocolate', 'bournvita', 'horlicks', 'complan',
  ],
  'beverages': [
    'tea', 'chai', 'coffee', 'nescafe', 'bru', 'tetley', 'tata tea', 'red label',
    'juice', 'drink', 'sharbat', 'rooh afza', 'lemon', 'cola', 'pepsi', 'coke', 'sprite',
    'thums up', 'limca', 'maza', 'frooti', 'slice', 'lassi', 'milk powder', 'bournvita',
    'horlicks', 'complan', 'protein', 'boost',
  ],
  'dairy-products': [
    'milk', 'doodh', 'dahi', 'curd', 'yogurt', 'lassi', 'paneer', 'cheese', 'cream',
    'malai', 'buttermilk', 'chaas', 'amul', 'toned milk', 'full cream', 'ghee',
  ],
  'personal-care': [
    'shampoo', 'toothpaste', 'colgate', 'pepsodent', 'dabur',
    'toothbrush', 'face wash', 'facewash', 'deodorant',
    'perfume', 'talc', 'nycil', 'boroline', 'vaseline',
    'hair oil', 'conditioner', 'razor', 'blade', 'trimmer', 'sanitary',
    'diaper', 'huggies', 'pampers', 'wet wipe',
    'soap', 'cream', 'lotion', 'powder', 'oil', 'brush',
  ],
  'household-cleaning': [
    'surf', 'detergent', 'washing', 'rin', 'ariel', 'tide', 'vim', 'dish', 'bar',
    'dishwash', 'floor', 'phenyl', 'colin', 'lizol', 'domex', 'harpic', 'clean',
    'dettol', 'savelon', 'rooi', 'jhaadu', 'broom', 'mop', 'scrub', 'pad',
    'naphthalene', 'mothball', 'air freshener', 'odonil',
  ],
}

export function suggestCategory(name) {
  const lower = String(name || '').toLowerCase()

  // Longest matching keyword wins; on a tie the earliest word wins.
  // So "Dish Soap" → household-cleaning ("dish" at 0 beats "soap" at 5),
  // while "Shampoo Soap" → personal-care.
  let bestId = 'other-grocery'
  let bestLength = 0
  let bestIndex = Infinity

  for (const [categoryId, words] of Object.entries(KEYWORDS)) {
    for (const word of words) {
      const index = lower.indexOf(word)
      if (index === -1) continue

      const better =
        word.length > bestLength ||
        (word.length === bestLength && index < bestIndex)

      if (better) {
        bestId = categoryId
        bestLength = word.length
        bestIndex = index
      }
    }
  }

  return bestId
}

export function suggestCategoryLabel(name) {
  const id = suggestCategory(name)
  return CATEGORIES.find((c) => c.id === id)?.name || 'Other Grocery Items'
}
