import type { ShapePath } from 'modern-idoc'
import type {
  OptionsForParseShapePaths,
  Rectangle,
  ShapeAdjustHandle,
  ShapeGuide,
} from '../ooxml'
import {
  clearUndef,
  namespaces,
  OOXMLNode,
  parsePaths,
  parseRectangle,
  parseShapeAdjustHandles,
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
  generate: (options: OptionsForParseShapePaths) => ShapePath[]
  generateSVGString: (options: OptionsForParseShapePaths) => string
}

export function parsePresetShapeDefinitions(
  presetShapeDefinitions: string,
): ParsedPresetShapeDefinition[] {
  const xmlRenderer = new XMLRenderer()

  return OOXMLNode.fromXML(presetShapeDefinitions, namespaces)
    .get('*')
    .map((child) => {
      const name = child.name
      const adjustValues = parseShapeGuides(child.find('avLst'))
      const shapeGuides = parseShapeGuides(child.find('gdLst'))
      const generate = (options: OptionsForParseShapePaths): ShapePath[] => {
        return parsePaths(child.find('pathLst'), {
          adjustValues,
          shapeGuides,
          ...options,
        })
      }
      const attrs: Record<string, any> = {}
      child.getDOM<Element>().getAttributeNames().forEach((key) => {
        attrs[key] = child.attr(`@${key}`)
      })
      return clearUndef({
        name,
        attrs: Object.keys(attrs).length ? attrs : undefined,
        rect: parseRectangle(child.find('rect')),
        adjustValues,
        shapeGuides,
        shapeAdjustHandles: parseShapeAdjustHandles(child.find('ahLst')),
        // cxnLst: child.find('cxnLst'),
        generate,
        generateSVGString: (options: OptionsForParseShapePaths): string => {
          const { width, height } = options
          return xmlRenderer.render({
            tag: 'svg',
            attrs: {
              'data-title': name,
              'xmlns': 'http://www.w3.org/2000/svg',
              'xmlns:xlink': 'http://www.w3.org/1999/xlink',
              'width': width,
              'height': height,
              'viewBox': `0 0 ${width} ${height}`,
              'preserveAspectRatio': 'none',
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
