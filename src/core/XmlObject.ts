export function defineProperty(name: string, type: any) {
  return function (proto: any, name: any) {
    // TODO
  }
}

export function defineChild(tag: string, object: new () => XmlObject) {
  return function (proto: any, name: any) {
    // TODO
  }
}

export abstract class XmlObject {
  readonly namespace?: string
  abstract readonly tag: string

  properties: Record<string, any> = {}
  children: XmlObject[] = []

  get textContent(): string {
    // TODO
    return ''
  }

  setProperties(properties: Record<string, any>): this {
    for (const key in properties) {
      this.properties[key] = properties[key]
    }
    return this
  }

  toXmlString(): string {
    // TODO
    return ''
  }
}
