export function parseDomFromString(xml: string): HTMLElement {
  const doc = new DOMParser().parseFromString(xml, 'text/xml') as XMLDocument
  const error = doc.querySelector('parsererror')
  if (error) {
    throw new Error(`${error.textContent ?? 'parser error'}\n${xml}`)
  }
  return doc.documentElement
}

export function joinPaths(...paths: string[]): string {
  const stack: string[] = []
  paths
    .filter(segment => segment.trim() !== '')
    .join('/')
    .replace(/\/{2,}/g, '/')
    .split('/')
    .forEach((segment) => {
      if (segment === '..') {
        if (stack.length > 0)
          stack.pop()
      }
      else if (segment !== '.') {
        stack.push(segment)
      }
    })
  return stack.join('/')
}
