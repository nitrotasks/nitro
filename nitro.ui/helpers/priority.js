const priorityLevels = [
  'Zero',
  'Low',
  'Medium',
  'High'
]

export function formatPriority(level) {
  return priorityLevels[level] || 'Unknown'
}
