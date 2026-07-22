export function truncateText(text: string, maxLength: number, suffix = '...'): string {
  if (!text) return ''
  if (text.length <= maxLength) return text
  
  // Try to truncate at a word boundary
  const truncated = text.substring(0, maxLength)
  const lastSpace = truncated.lastIndexOf(' ')
  
  if (lastSpace > 0) {
    return truncated.substring(0, lastSpace) + suffix
  }
  
  return truncated + suffix
}
