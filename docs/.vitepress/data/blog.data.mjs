import { createContentLoader } from 'vitepress'

function normalizeDate(value) {
  if (!value) return ''
  if (value instanceof Date) return value.toISOString().slice(0, 10)
  return String(value).slice(0, 10)
}

export default createContentLoader('blog/*.md', {
  transform(pages) {
    return pages
      .filter(({ url }) => url !== '/blog/')
      .map(({ url, frontmatter }) => ({
        url,
        title: frontmatter.title || '',
        description: frontmatter.description || '',
        date: normalizeDate(frontmatter.date),
        tags: Array.isArray(frontmatter.tags) ? frontmatter.tags : [],
      }))
      .filter((post) => post.title && post.date)
      .sort((a, b) => b.date.localeCompare(a.date) || a.title.localeCompare(b.title, 'zh-CN'))
  },
})
