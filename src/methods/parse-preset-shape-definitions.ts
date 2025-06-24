import type { ShapePath } from 'modern-idoc'
import type {
  Rectangle,
  ShapeAdjustHandle,
  ShapeGuide,
  ShapeGuideContext,
} from '../ooxml'
import {
  clearUndef,
  namespaces,
  OOXMLNode,
  OOXMLValue,
  parsePaths,
  parseRectangle,
  parseShapeAdjustHandles,
  parseShapeGuideFmla,
  parseShapeGuides,
} from '../ooxml'
import { XMLRenderer } from '../renderers'

export interface ParsedPresetShapeDefinition {
  name: string
  attrs?: Record<string, any>
  rect?: Rectangle
  adjustValues?: ShapeGuide[]
  shapeGuides?: ShapeGuide[]
  shapeAdjustHandles?: ShapeAdjustHandle[]
  generate: (options: Partial<ShapeGuideContext>) => ShapePath[]
  generateSVGString: (options: Partial<ShapeGuideContext>) => string
}

export function parsePresetShapeDefinitions(
  presetShapeDefinitions: string,
): ParsedPresetShapeDefinition[] {
  const xmlRenderer = new XMLRenderer()

  return OOXMLNode.fromXML(presetShapeDefinitions, namespaces)
    .get('*')
    .map((child) => {
      const name = child.name
      const avLst = child.find('avLst')
      const gdLst = child.find('gdLst')
      const ahLst = child.find('ahLst')
      const adjustValues = avLst ? parseShapeGuides(avLst) : undefined
      const shapeGuides = gdLst ? parseShapeGuides(gdLst) : undefined
      const generate = (options: Partial<ShapeGuideContext> = {}): ShapePath[] => {
        const ctx: ShapeGuideContext = {
          variables: options?.variables ?? {},
          width: Number(OOXMLValue.encode(options.width ?? 0, 'emu')),
          height: Number(OOXMLValue.encode(options.height ?? 0, 'emu')),
        }
        adjustValues?.forEach((gd) => {
          ctx.variables[gd.name] = parseShapeGuideFmla(gd.fmla, ctx)
        })
        shapeGuides?.forEach((gd) => {
          ctx.variables[gd.name] = parseShapeGuideFmla(gd.fmla, ctx)
        })
        return parsePaths(child.find('pathLst'), ctx)
      }
      const attrs: Record<string, any> = {}
      child.getDOM<Element>().getAttributeNames().forEach(key => attrs[key] = child.attr(`@${key}`))
      return clearUndef({
        name,
        attrs: Object.keys(attrs).length ? attrs : undefined,
        rect: parseRectangle(child.find('rect')),
        adjustValues,
        shapeGuides,
        shapeAdjustHandles: ahLst ? parseShapeAdjustHandles(ahLst) : undefined,
        // cxnLst: child.find('cxnLst'),
        generate,
        generateSVGString: (options: Partial<ShapeGuideContext>): string => {
          const { width, height } = options
          return xmlRenderer.render({
            tag: 'svg',
            attrs: {
              'data-title': name,
              'xmlns': 'http://www.w3.org/2000/svg',
              'width': width,
              'height': height,
              'viewBox': `0 0 ${width} ${height}`,
            },
            children: generate(options).map((path) => {
              return {
                tag: 'path',
                attrs: {
                  'd': path.data,
                  'fill': path.fill,
                  'fill-rule': path.fillRule,
                  'stroke': path.stroke,
                  'stroke-width': path.strokeWidth,
                },
              }
            }),
          })
        },
      })
    })
}
