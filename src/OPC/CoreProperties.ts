import type { DefineChildUsedOptions } from '../core'
import { defineChild, defineElement, OOXML } from '../core'

export interface toIDOCCoreProperties {
  title?: string
  creator?: string
  subject?: string
  description?: string
  created?: string
  modified?: string
  keywords?: string
  language?: string
  lastModifiedBy?: string
  revision?: string
}

const options: DefineChildUsedOptions = {
  isText: true,
  isProperty: true,
}

@defineElement('cp:coreProperties')
export class CoreProperties extends OOXML {
  attrs = {
    'xmlns': 'http://schemas.openxmlformats.org/package/2006/metadata/core-properties',
    'xmlns:cp': 'http://schemas.openxmlformats.org/package/2006/metadata/core-properties',
    'xmlns:dc': 'http://purl.org/dc/elements/1.1/',
    'xmlns:dcterms': 'http://purl.org/dc/terms/',
    'xmlns:xml': 'http://www.w3.org/XML/1998/namespace',
  }

  @defineChild('dc:title', options) declare title?: string
  @defineChild('dc:creator', options) declare creator?: string
  @defineChild('dc:subject', options) declare subject?: string
  @defineChild('dc:description', options) declare description?: string
  @defineChild('dc:created', options) declare created?: string
  @defineChild('dc:modified', options) declare modified?: string
  @defineChild('cp:keywords', options) declare keywords?: string
  @defineChild('cp:language', options) declare language?: string
  @defineChild('cp:lastModifiedBy', options) declare lastModifiedBy?: string
  @defineChild('cp:revision', options) declare revision?: string

  override toIDOC(): toIDOCCoreProperties {
    return super.toIDOC()
  }
}
