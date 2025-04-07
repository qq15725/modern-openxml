import type { StyleDeclaration } from 'modern-idoc'
import type { OOXMLNode } from '../core'
import { withAttr, withAttrs } from '../utils'

export interface NonVisualDrawingPropertiesMeta {
  id?: string
  desc?: string
  click?: string // pptaction://media
}

export interface NonVisualDrawingProperties {
  name?: string
  meta: NonVisualDrawingPropertiesMeta
  style: Partial<StyleDeclaration>
}

export function parseNonVisualDrawingProperties(cNvPr?: OOXMLNode): NonVisualDrawingProperties | undefined {
  if (!cNvPr)
    return undefined

  return {
    name: cNvPr.attr('@name'),
    meta: {
      id: cNvPr.attr('@id'),
      desc: cNvPr.attr('@descr'),
      click: cNvPr.attr('a:hlinkClick/@action'),
    },
    style: {
      visibility: cNvPr.attr('@hidden', 'boolean') ? 'hidden' : undefined,
    },
  }
}

export function stringifyNonVisualDrawingProperties(cNvPr: NonVisualDrawingProperties): string {
  return cNvPr.meta.click
    ? `<p:cNvPr${withAttrs([
      withAttr('id', cNvPr.meta.id),
      withAttr('name', cNvPr.name ?? ''),
    ])}>
  <a:hlinkClick${withAttrs([
    withAttr('r:id', ''),
    withAttr('action', cNvPr.meta.click),
  ])}/>
</p:cNvPr>`
    : `<p:cNvPr${withAttrs([
      withAttr('id', cNvPr.meta.id),
      withAttr('name', cNvPr.name ?? ''),
    ])}/>`
}
