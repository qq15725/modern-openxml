export const XML_HEADER = '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>'

export function withXmlHeader(str: string): string {
  return `${XML_HEADER}\n${str}`
}

export function compressXml(str: string): string {
  return str
    .replace(/\n/g, '')
    .replace(/> +</g, '><')
    .replace(/ +([:\w]+=".+?")/g, ' $1')
    .replace(/([:\w]+=".+?") +/g, '$1 ')
}

export function withAttr(name: string, value?: string | number): string {
  if (value === undefined)
    return ''
  return `${name}="${value}"`
}

export function withAttrs(attrs: (string | boolean | undefined)[]): string {
  return attrs.length ? ` ${attrs.filter(Boolean).join(' ')}` : ''
}

export function withIndents(str: string | (string | boolean | undefined)[] | undefined, deep = 1, ignoreFirstLine = true): string {
  if (str === undefined) {
    return ''
  }
  const spaces = Array.from({ length: deep }).map(() => '  ').join('')
  str = typeof str === 'string' ? str : str.join('\n')
  return str
    .split('\n')
    .filter(Boolean)
    .map((v, i) => {
      return ignoreFirstLine && i === 0 ? v : `${spaces}${v}`
    })
    .join('\n')
}

export function withChildren(tagName: string, content?: string | null): string {
  return content ? `<${tagName}>${content}</${tagName}>` : ''
}
