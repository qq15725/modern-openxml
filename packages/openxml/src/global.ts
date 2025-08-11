export type CustomDomParser = (string: string, type: DOMParserSupportedType) => Document

let customDomParser: CustomDomParser | undefined

export function useCustomDomParser(parser: CustomDomParser): void {
  customDomParser = parser
}

export function parseDomFromString(string: string, type: DOMParserSupportedType): Document {
  if (customDomParser) {
    return customDomParser(string, type)
  }
  return new globalThis.DOMParser().parseFromString(string, type)
}
