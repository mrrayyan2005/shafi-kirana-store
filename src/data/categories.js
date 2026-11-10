// Product categories + emoji + fallback colour + category image
export const CATEGORIES = [
  {
    id: 'atta-rice-dal',
    name: 'Atta, Rice & Dal',
    emoji: '🌾',
    color: 'bg-amber-100',
    image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=600&h=600&fit=crop',
  },
  {
    id: 'oil-ghee',
    name: 'Oil & Ghee',
    emoji: '🫒',
    color: 'bg-yellow-100',
    image: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=600&h=600&fit=crop',
  },
  {
    id: 'spices-masala',
    name: 'Spices & Masala',
    emoji: '🌶️',
    color: 'bg-red-100',
    image: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=600&h=600&fit=crop',
  },
  {
    id: 'biscuits-snacks',
    name: 'Biscuits & Snacks',
    emoji: '🍪',
    color: 'bg-orange-100',
    image: 'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=600&h=600&fit=crop',
  },
  {
    id: 'chocolates-confectionery',
    name: 'Chocolates & Confectionery',
    emoji: '🍫',
    color: 'bg-pink-100',
    image: 'https://images.unsplash.com/photo-1511381939415-e44015466834?w=600&h=600&fit=crop',
  },
  {
    id: 'beverages',
    name: 'Beverages',
    emoji: '🥤',
    color: 'bg-blue-100',
    image: 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=600&h=600&fit=crop',
  },
  {
    id: 'dairy-products',
    name: 'Dairy Products',
    emoji: '🥛',
    color: 'bg-sky-100',
    image: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?w=600&h=600&fit=crop',
  },
  {
    id: 'personal-care',
    name: 'Personal Care',
    emoji: '🧴',
    color: 'bg-purple-100',
    image: 'https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=600&h=600&fit=crop',
  },
  {
    id: 'household-cleaning',
    name: 'Household Cleaning',
    emoji: '🧹',
    color: 'bg-teal-100',
    image: 'https://images.unsplash.com/photo-1563453392212-326f5e854473?w=600&h=600&fit=crop',
  },
  {
    id: 'other-grocery',
    name: 'Other Grocery Items',
    emoji: '🛒',
    color: 'bg-green-100',
    image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=600&h=600&fit=crop',
  },
]

export function getCategory(id) {
  return CATEGORIES.find((c) => c.id === id) || CATEGORIES[CATEGORIES.length - 1]
}

export function getCategoryName(id) {
  return getCategory(id).name
}

export function getCategoryImage(id) {
  return getCategory(id).image
}
