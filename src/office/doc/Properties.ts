import { defineChild, defineElement, OXML } from '../../core'

@defineElement('Properties')
export class Properties extends OXML {
  attrs = {
    'xmlns': 'http://schemas.openxmlformats.org/officeDocument/2006/extended-properties',
    'xmlns:vt': 'http://schemas.openxmlformats.org/officeDocument/2006/docPropsVTypes',
    'xmlns:xml': 'http://www.w3.org/XML/1998/namespace',
  }

  @defineChild('Company', 'ModernOpenxml') declare company: string
  @defineChild('LinksUpToDate', false) declare linksUpToDate: number
  @defineChild('Application', 'ModernOpenxml') declare application: string
  @defineChild('AppVersion', '00.0001') declare appVersion: string
  @defineChild('DocSecurity', '0') declare docSecurity: string
}
