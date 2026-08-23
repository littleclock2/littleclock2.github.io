import { existsSync, mkdirSync, writeFileSync } from 'node:fs'
import path from 'node:path'
import process from 'node:process'

const usage = [
  'Create a Markdown blog draft.',
  '',
  'Usage:',
  '  npm run new-post -- --title "文章标题" --slug "article-slug" --description "一句话摘要"',
  '    [--tags "STM32,嵌入式"] [--date "YYYY-MM-DD"]'
].join('\n')

function parseArgs(argv) {
  const result = {}

  for (let index = 0; index < argv.length; index += 1) {
    const token = argv[index]
    if (!token.startsWith('--')) continue

    const separator = token.indexOf('=')
    if (separator > -1) {
      result[token.slice(2, separator)] = token.slice(separator + 1)
      continue
    }

    const key = token.slice(2)
    const value = argv[index + 1]
    if (!value || value.startsWith('--')) result[key] = true
    else {
      result[key] = value
      index += 1
    }
  }

  return result
}

function oneLine(value, field) {
  const normalized = String(value || '').trim()
  if (/\r|\n/.test(normalized)) throw new Error(field + ' must be one line.')
  return normalized
}

function isRealDate(value) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false
  const parsed = new Date(value + 'T00:00:00Z')
  return !Number.isNaN(parsed.valueOf()) && parsed.toISOString().slice(0, 10) === value
}

function yamlString(value) {
  return JSON.stringify(String(value))
}

const args = parseArgs(process.argv.slice(2))

if (args.help || args.h) {
  console.log(usage)
  process.exit(0)
}

try {
  const title = oneLine(args.title, 'title')
  const slug = oneLine(args.slug, 'slug')
  const description = oneLine(args.description, 'description')
  const date = oneLine(args.date, 'date') || new Date().toISOString().slice(0, 10)
  const tags = oneLine(args.tags, 'tags')
    .split(',')
    .map((tag) => tag.trim())
    .filter(Boolean)

  if (!title || !slug || !description) {
    throw new Error('--title, --slug, and --description are required.')
  }
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) {
    throw new Error('slug must contain lowercase letters, numbers, and single hyphens only.')
  }
  if (!isRealDate(date)) throw new Error('date must be a real date in YYYY-MM-DD format.')

  const blogDirectory = path.resolve(process.cwd(), 'docs', 'blog')
  const outputPath = path.join(blogDirectory, slug + '.md')
  if (existsSync(outputPath)) throw new Error('Refusing to overwrite existing post: ' + outputPath)

  const introduction = description
  const content = [
    '---',
    'title: ' + yamlString(title),
    'date: ' + date,
    'description: ' + yamlString(description),
    'tags: ' + JSON.stringify(tags),
    '---',
    '',
    '# ' + title,
    '',
    introduction,
    '',
    '## 背景',
    '',
    '<!-- 说明问题、约束与目标。 -->',
    '',
    '## 实现',
    '',
    '<!-- 记录关键方案、代码或硬件设计。 -->',
    '',
    '## 验证',
    '',
    '<!-- 写明测试条件、结果与已知限制。 -->',
    ''
  ].join('\n')

  mkdirSync(blogDirectory, { recursive: true })
  writeFileSync(outputPath, content, { encoding: 'utf8', flag: 'wx' })
  console.log('Created ' + path.relative(process.cwd(), outputPath))
} catch (error) {
  console.error(error.message)
  console.error('')
  console.error(usage)
  process.exit(1)
}
