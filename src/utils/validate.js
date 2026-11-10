/** Validates the shared customer-details form. */
export function validateCustomer(c) {
  const errors = {}
  if (!c.name || !c.name.trim()) errors.name = 'Please enter customer name.'
  const mobile = String(c.mobile || '').replace(/\D/g, '')
  if (mobile.length < 10) errors.mobile = 'Please enter a valid mobile number.'
  if (!c.address || !c.address.trim()) errors.address = 'Please enter delivery address.'
  if (!c.area || !c.area.trim()) errors.area = 'Please enter area / locality.'
  return errors
}
