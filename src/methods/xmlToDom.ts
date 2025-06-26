export function xmlToDom<T = Element>(xml: string): T {
  const doc = new DOMParser().parseFromString(xml, 'application/xml') as XMLDocument
  const error = doc.querySelector('parsererror')
  if (error) {
    throw new Error(`${error.textContent ?? 'parser error'}\n${xml}`)
  }
  return doc.documentElement as T
}
