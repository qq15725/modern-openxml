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
