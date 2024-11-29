export const XML_HEADER = '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>'

export function withXmlHeader(str: string) {
  return `${ XML_HEADER }\n${ str }`
}

export function compressXml(str: string) {
  return str
    .replace(/\n/g, '')
    .replace(/> +</g, '><')
    .replace(/ +([:\w]+=".+?")/g, ' $1')
    .replace(/([:\w]+=".+?") +/g, '$1 ')
}
