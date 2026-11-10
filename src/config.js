// ============================================================
// STORE CONFIGURATION — change these values only
// ============================================================

// Your father's WhatsApp number in international format
// (NO + sign, NO spaces, NO dashes)
// Example for India: 919876543210
export const WHATSAPP_NUMBER = '919897700760'

export const STORE_NAME = 'Shafi Kirana Store'

// Shop address (shown in footer / on the site)
export const SHOP_ADDRESS = 'Hazrat Nagar, Noorpur Bijnor, Uttar Pradesh 246734'
export const SHOP_LANDMARK = 'KMM Memorial Hospital, Noorpur, Bijnor'

// Shop Instagram page (shown in the header)
export const INSTAGRAM_URL = 'https://www.instagram.com/shafi_kirana_store'

// Shop contact number (shown in the header)
export const CONTACT_NUMBER = '7668042924'

// Shop owner photo used as the store logo.
// Put your photo file at: public/owner.jpg  (jpg / png / webp all work)
// If the file is missing, the site falls back to a green "S" logo.
export const OWNER_PHOTO = '/owner.jpg'

// Store owner login is stored in MongoDB (role: "owner").
// Create it with: node scripts/seed-mongo.mjs  (see MONGODB.md)
// Do NOT put the password here — it is hashed in the database.

// Used when a product has no image (sharp 5:3 crop for product cards)
export const PLACEHOLDER_IMAGE =
  'https://images.unsplash.com/photo-1542838132-92c53300491e?w=1200&h=720&fit=crop&q=80'
