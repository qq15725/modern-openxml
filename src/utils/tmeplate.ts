export function withAttr(name: string, value?: string | number) {
  if (value === undefined) return ''
  return `${ name }="${ value }"`
}

export function withAttrs(attrs: string[]) {
  return attrs.length ? ` ${ attrs.filter(Boolean).join(' ') }` : ''
}

export function withIndents(str: string | string[], deep = 1, ignoreFirstLine = true) {
  const spaces = [...Array(deep)].map(_ => '  ').join('')
  str = typeof str === 'string' ? str : str.join('\n')
  return str.split('\n').map((v, i) => {
    return ignoreFirstLine && i === 0 ? v : `${ spaces }${ v }`
  }).join('\n')
}
