export function calculateReadingTime(content: string, wordsPerMinute = 200): number {
  if (!content) return 0
  
  // Strip HTML tags if content is HTML
  const plainText = content.replace(/<[^>]*>?/gm, '')
  const words = plainText.trim().split(/\s+/).length
  
  return Math.ceil(words / wordsPerMinute)
}
