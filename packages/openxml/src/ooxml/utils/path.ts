export function pathJoin(...segments: string[]): string {
  const parts: string[] = []
  for (let segment of segments) {
    if (typeof segment !== 'string') {
      throw new TypeError('All arguments to pathJoin must be strings')
    }
    segment = segment.trim()
    if (segment === '')
      continue
    segment = segment.replace(/^\/+|\/+$/g, '')
    if (segment) {
      parts.push(segment)
    }
  }
  const joined = parts.join('/')
  return normalizePath(joined)
}

export function normalizePath(path: string): string {
  const isAbsolute = path.startsWith('/')
  const segments = path.split('/')
  const stack: string[] = []
  for (const segment of segments) {
    if (segment === '' || segment === '.') {
      continue
    }
    else if (segment === '..') {
      if (stack.length > 0 && stack[stack.length - 1] !== '..') {
        stack.pop()
      }
      else if (!isAbsolute) {
        stack.push('..')
      }
    }
    else {
      stack.push(segment)
    }
  }
  const normalized = (isAbsolute ? '/' : '') + stack.join('/')
  return normalized || (isAbsolute ? '/' : '.')
}
