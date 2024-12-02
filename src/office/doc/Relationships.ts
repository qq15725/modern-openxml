import { defineChild, defineNode, XmlObject } from '../../core'
import { Relationship } from './Relationship'

@defineNode('Relationships')
export class Relationships extends XmlObject {
  static officeDocument = 'http://schemas.openxmlformats.org/officeDocument/2006/relationships'
  static package = 'http://schemas.openxmlformats.org/package/2006/relationships'
  static types = {
    presentation: `${this.officeDocument}/officeDocument`,
    app: `${this.officeDocument}/extended-properties`,
    core: `${this.package}/metadata/core-properties`,
    custom: `${this.officeDocument}/custom-properties`,
    slide: `${this.officeDocument}/slide`,
    slideLayout: `${this.officeDocument}/slideLayout`,
    slideMaster: `${this.officeDocument}/slideMaster`,
    theme: `${this.officeDocument}/theme`,
    tags: `${this.officeDocument}/tags`,
    tableStyles: `${this.officeDocument}/tableStyles`,
    presProps: `${this.officeDocument}/presProps`,
    viewProps: `${this.officeDocument}/viewProps`,
    notesMaster: `${this.officeDocument}/notesMaster`,
    handoutMaster: `${this.officeDocument}/handoutMaster`,
    commentAuthors: `${this.officeDocument}/commentAuthors`,
  }

  attrs = {
    xmlns: 'http://schemas.openxmlformats.org/package/2006/relationships',
  }

  @defineChild('Relationship', Relationship, true) declare children: Relationship[]

  get value(): { id: string, type: string, target: string }[] {
    return this.children.map(v => ({ id: v.id, type: v.type, target: v.target }))
  }
}
