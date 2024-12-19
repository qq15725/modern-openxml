import type { DefineChildUsedOptions } from '../../core'
import { defineChild, defineElement, OOXML } from '../../core'

const options: DefineChildUsedOptions = {
  isText: true,
  isProperty: true,
}

export interface PropertiesJSON {
  application?: string
  appVersion?: string
  characters?: string
  charactersWithSpaces?: string
  company?: string
  digSig?: string
  docSecurity?: string
  headingPairs?: string
  hiddenSlides?: string
  hLinks?: string
  hyperlinkBase?: string
  hyperlinksChanged?: string
  lines?: string
  linksUpToDate?: string
  manager?: string
  mMClips?: string
  notes?: string
  pages?: string
  paragraphs?: string
  presentationFormat?: string
  scaleCrop?: string
  sharedDoc?: string
  slides?: string
  template?: string
  titlesOfParts?: string
  totalTime?: string
  words?: string
}

/**
 * @link https://learn.microsoft.com/dotnet/api/documentformat.openxml.extendedproperties.properties
 */
@defineElement('ap:Properties')
export class Properties extends OOXML {
  @defineChild('Application', options) declare application?: string
  @defineChild('AppVersion', options) declare appVersion?: string
  @defineChild('Characters', options) declare characters?: string
  @defineChild('CharactersWithSpaces', options) declare charactersWithSpaces?: string
  @defineChild('Company', options) declare company?: string
  @defineChild('DigSig', options) declare digSig?: string
  @defineChild('DocSecurity', options) declare docSecurity?: string
  @defineChild('HeadingPairs', options) declare headingPairs?: string
  @defineChild('HiddenSlides', options) declare hiddenSlides?: string
  @defineChild('HLinks', options) declare hLinks?: string
  @defineChild('HyperlinkBase', options) declare hyperlinkBase?: string
  @defineChild('HyperlinksChanged', options) declare hyperlinksChanged?: string
  @defineChild('Lines', options) declare lines?: string
  @defineChild('LinksUpToDate', options) declare linksUpToDate?: string
  @defineChild('Manager', options) declare manager?: string
  @defineChild('MMClips', options) declare mMClips?: string
  @defineChild('Notes', options) declare notes?: string
  @defineChild('Pages', options) declare pages?: string
  @defineChild('Paragraphs', options) declare paragraphs?: string
  @defineChild('PresentationFormat', options) declare presentationFormat?: string
  @defineChild('ScaleCrop', options) declare scaleCrop?: string
  @defineChild('SharedDoc', options) declare sharedDoc?: string
  @defineChild('Slides', options) declare slides?: string
  @defineChild('Template', options) declare template?: string
  @defineChild('TitlesOfParts', options) declare titlesOfParts?: string
  @defineChild('TotalTime', options) declare totalTime?: string
  @defineChild('Words', options) declare words?: string

  override toJSON(): PropertiesJSON {
    return super.toJSON()
  }
}
