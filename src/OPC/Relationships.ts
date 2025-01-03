import type { Relationship } from './Relationship'
import { defineElement, OOXML } from '../core'

const officeDocument = 'http://schemas.openxmlformats.org/officeDocument/2006/relationships'
const _package = 'http://schemas.openxmlformats.org/package/2006/relationships'

@defineElement('Relationships')
export class Relationships extends OOXML {
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

  override get children(): Relationship[] {
    return super.children.filter(child => child.tag === 'Relationship') as any[]
  }

  get value(): Record<string, { type: string, target: string }> {
    return Object.fromEntries(
      this.children.map(v => [v.id, {
        type: v.type,
        target: v.target,
      }]),
    )
  }
}
