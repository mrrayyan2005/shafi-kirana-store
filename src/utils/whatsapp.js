import { WHATSAPP_NUMBER, STORE_NAME } from '../config'

/**
 * Builds the formatted WhatsApp order message.
 * Used by BOTH ordering options so the format is always identical.
 */
export function buildOrderMessage({ customer, items, notes, orderType }) {
  const lines = []
  lines.push(`NEW ORDER – ${STORE_NAME.toUpperCase()}`)
  lines.push('')
  lines.push(`Customer Name: ${customer.name || '-'}`)
  lines.push(`Mobile: ${customer.mobile || '-'}`)
  lines.push('')
  lines.push('Delivery Address:')
  lines.push(customer.address || '-')
  lines.push(`Area: ${customer.area || '-'}`)
  if (customer.landmark) lines.push(`Landmark: ${customer.landmark}`)
  lines.push('')
  lines.push(orderType === 'custom' ? 'GROCERY LIST:' : 'ORDER ITEMS:')

  items.forEach((item, i) => {
    lines.push(`${i + 1}. ${item.name} – ${item.qty}`)
  })

  lines.push('')
  if (notes && notes.trim()) {
    lines.push('─────────────────')
    lines.push('💬 MESSAGE FROM CUSTOMER:')
    lines.push(notes.trim())
    lines.push('─────────────────')
    lines.push('')
  }

  lines.push('Please confirm availability and pricing with the customer.')
  return lines.join('\n')
}

/** Opens WhatsApp click-to-chat with a URL-encoded prefilled message. */
export function openWhatsApp(message) {
  const phone = String(WHATSAPP_NUMBER).replace(/\D/g, '')
  const encoded = encodeURIComponent(message)
  const url = `https://wa.me/${phone}?text=${encoded}`
  window.open(url, '_blank', 'noopener,noreferrer')
  return url
}
