import { defineChild, XmlObject } from '../../core'

export class Properties extends XmlObject {
  readonly tag = 'Properties'

  attrs = {
    'xmlns': 'http://schemas.openxmlformats.org/officeDocument/2006/extended-properties',
    'xmlns:vt': 'http://schemas.openxmlformats.org/officeDocument/2006/docPropsVTypes',
    'xmlns:xml': 'http://www.w3.org/XML/1998/namespace',
  }

  @defineChild('Company', XmlObject, 'ModernOpenxml') declare company: string
  @defineChild('LinksUpToDate', XmlObject, false) declare linksUpToDate: number
  @defineChild('Application', XmlObject, 'ModernOpenxml') declare application: string
  @defineChild('AppVersion', XmlObject, '00.0001') declare appVersion: string
  @defineChild('DocSecurity', XmlObject, '0') declare docSecurity: string
}
