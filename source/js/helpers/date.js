export function formatDate(date, type) {
  // ???
  if (type === 'next' && date === null) {
    return 'Next'
  }
  
  if (typeof date === 'undefined' || date === null) {
    return ''
  }

  if (typeof date === 'string') {
    return date
  }
  return date.toLocaleDateString()
}
