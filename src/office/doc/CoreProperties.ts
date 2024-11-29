import { XmlObject } from '../../core'

export class CoreProperties extends XmlObject {
  readonly tag = 'cp:coreProperties'

  attrs = {
    'xmlns': 'http://schemas.openxmlformats.org/package/2006/metadata/core-properties',
    'xmlns:cp': 'http://schemas.openxmlformats.org/package/2006/metadata/core-properties',
    'xmlns:dc': 'http://purl.org/dc/elements/1.1/',
    'xmlns:dcterms': 'http://purl.org/dc/terms/',
    'xmlns:xml': 'http://www.w3.org/XML/1998/namespace',
  }
}
