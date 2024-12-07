import type { Relationship } from './Relationship'
import { defineChildren, defineElement, OXML } from '../core'

const officeDocument = 'http://schemas.openxmlformats.org/officeDocument/2006/relationships'
const _package = 'http://schemas.openxmlformats.org/package/2006/relationships'

@defineElement('Relationships')
export class Relationships extends OXML {
  attrs = {
    xmlns: 'http://schemas.openxmlformats.org/package/2006/relationships',
  }

  static officeDocument = officeDocument
  static package = _package
  static types = {
    presentation: `${officeDocument}/officeDocument`,
    app: `${officeDocument}/extended-properties`,
    core: `${_package}/metadata/core-properties`,
    custom: `${officeDocument}/custom-properties`,
    slide: `${officeDocument}/slide`,
    slideLayout: `${officeDocument}/slideLayout`,
    slideMaster: `${officeDocument}/slideMaster`,
    theme: `${officeDocument}/theme`,
    tags: `${officeDocument}/tags`,
    tableStyles: `${officeDocument}/tableStyles`,
    presProps: `${officeDocument}/presProps`,
    viewProps: `${officeDocument}/viewProps`,
    notesMaster: `${officeDocument}/notesMaster`,
    handoutMaster: `${officeDocument}/handoutMaster`,
    commentAuthors: `${officeDocument}/commentAuthors`,
  }

  @defineChildren('Relationship') declare children: Relationship[]

  get value(): { id: string, type: string, target: string }[] {
    return this.children.map(v => ({ id: v.id, type: v.type, target: v.target }))
  }
}
