import { defineChild, defineElement, defineProperty, OXML } from '../../core'

/**
 * @link https://learn.microsoft.com/dotnet/api/documentformat.openxml.extendedproperties.properties
 */
@defineElement('ap:Properties')
export class Properties extends OXML {
  @defineChild('Company') protected declare _company: OXML
  @defineChild('LinksUpToDate') protected declare _linksUpToDate: OXML
  @defineChild('Application') protected declare _application: OXML
  @defineChild('AppVersion') protected declare _appVersion: OXML
  @defineChild('DocSecurity') protected declare _docSecurity: OXML

  @defineProperty('_company.textContent') declare company: string
  @defineProperty('_linksUpToDate.textContent') declare linksUpToDate: string
  @defineProperty('_application.textContent') declare application: string
  @defineProperty('_appVersion.textContent') declare appVersion: string
  @defineProperty('_docSecurity.textContent') declare docSecurity: string
}
