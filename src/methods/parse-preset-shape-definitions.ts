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

export interface ParsedPresetShapeDefinition {
  name: string
  rect?: Rectangle
  adjustValues?: ShapeGuide[]
  shapeGuides?: ShapeGuide[]
  shapeAdjustHandles?: ShapeAdjustHandle[]
  generate: (options: OptionsForParseShapePaths) => ShapePath[]
}

export function parsePresetShapeDefinitions(
  presetShapeDefinitions: string,
): ParsedPresetShapeDefinition[] {
  return OOXMLNode.fromXML(presetShapeDefinitions, namespaces)
    .get('*')
    .map((child) => {
      const adjustValues = parseShapeGuides(child.find('avLst'))
      const shapeGuides = parseShapeGuides(child.find('gdLst'))
      return clearUndef({
        name: child.name,
        rect: parseRectangle(child.find('rect')),
        adjustValues,
        shapeGuides,
        shapeAdjustHandles: parseShapeAdjustHandles(child.find('ahLst')),
        // cxnLst: child.find('cxnLst'),
        generate: (options: OptionsForParseShapePaths) => parsePaths(child.find('pathLst'), {
          adjustValues,
          shapeGuides,
          ...options,
        }),
      })
    })
}
