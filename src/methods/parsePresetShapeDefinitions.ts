import type { ShapePath } from 'modern-idoc'
import type { Path2DStyle } from 'modern-path2d'
import type {
  AdjustHandle,
  AdjustValue,
  Rectangle,
  ShapeGuide,
  ShapeGuideContext,
} from '../ooxml'
import { Path2D } from 'modern-path2d'
import {
  clearUndef,
  OoxmlNode,
  OoxmlValue,
  parseAdjustHandleList,
  parseAdjustValueList,
  parsePaths,
  parseRectangle,
  parseShapeGuideFmla,
  parseShapeGuideList,
  parseShapeGuideValue,
} from '../ooxml'
import { XmlRenderer } from '../renderers'

export interface GeneratedAdjustHandle {
  refX: string
  refY: string
  refXDefault?: number
  refYDefault?: number
  minX?: number
  minY?: number
  maxX?: number
  maxY?: number
  posX: number
  posY: number
}

export interface ParsedPresetShapeDefinition {
  name: string
  attrs?: Record<string, any>
  rect?: Rectangle
  adjustValues?: AdjustValue[]
  adjustHandles?: AdjustHandle[]
  shapeGuides?: ShapeGuide[]
  generatePaths: (options: Partial<ShapeGuideContext>) => ShapePath[]
  generateAdjustHandles: (options: Partial<ShapeGuideContext>) => GeneratedAdjustHandle[] | undefined
  generateSvgString: (options: Partial<ShapeGuideContext & Path2DStyle>) => string
}

export function parsePresetShapeDefinitions(
  presetShapeDefinitions: string,
): ParsedPresetShapeDefinition[] {
  return OoxmlNode.fromXML(presetShapeDefinitions)
    .get('*')
    .map(child => parsePresetShapeDefinition(child))
}

export function parsePresetShapeDefinition(node: OoxmlNode): ParsedPresetShapeDefinition {
  const name = node.name
  const avLst = node.find('avLst')
  const gdLst = node.find('gdLst')
  const ahLst = node.find('ahLst')
  // const cxnLst = node.find('cxnLst')
  const pathLst = node.find('pathLst')
  const rect = node.find('rect')
  const adjustValues = avLst ? parseAdjustValueList(avLst) : undefined
  const adjustHandles = ahLst ? parseAdjustHandleList(ahLst) : undefined
  const shapeGuides = gdLst ? parseShapeGuideList(gdLst) : undefined
  function loadVariables(ctx: ShapeGuideContext): void {
    Object.keys(ctx.variables).forEach((key) => {
      ctx.variables[key] = Number(OoxmlValue.encode(ctx.variables[key], 'emu'))
    })
    adjustValues?.forEach((gd) => {
      if (!ctx.variables[gd.name]) {
        ctx.variables[gd.name] = gd.value
      }
    })
    shapeGuides?.forEach((gd) => {
      ctx.variables[gd.name] = parseShapeGuideFmla(gd.fmla, ctx)
    })
  }
  const generatePaths = (options: Partial<ShapeGuideContext> = {}): ShapePath[] => {
    const ctx: ShapeGuideContext = {
      width: Number(OoxmlValue.encode(options.width ?? 0, 'emu')),
      height: Number(OoxmlValue.encode(options.height ?? 0, 'emu')),
      variables: options?.variables ?? {},
    }
    loadVariables(ctx)
    return parsePaths(pathLst, ctx)
  }
  const attrs: Record<string, any> = {}
  node.getDOM<Element>().getAttributeNames().forEach(key => attrs[key] = node.attr(`@${key}`))
  return clearUndef({
    name,
    attrs: Object.keys(attrs).length ? attrs : undefined,
    rect: parseRectangle(rect),
    adjustValues,
    adjustHandles,
    shapeGuides,
    generateAdjustHandles: (options: Partial<ShapeGuideContext> = {}) => {
      const ctx: ShapeGuideContext = {
        width: Number(OoxmlValue.encode(options.width ?? 0, 'emu')),
        height: Number(OoxmlValue.encode(options.height ?? 0, 'emu')),
        variables: options?.variables ?? {},
      }
      loadVariables(ctx)
      function convert(gdValue?: any): number | undefined {
        return gdValue
          ? OoxmlValue.decode(parseShapeGuideValue(gdValue, ctx), 'emu')
          : undefined
      }
      return adjustHandles?.map((adjustHandle) => {
        return clearUndef({
          refX: adjustHandle.gdRefX,
          refY: adjustHandle.gdRefY,
          refXDefault: convert(adjustHandle.gdRefX ? ctx.variables[adjustHandle.gdRefX] : undefined),
          refYDefault: convert(adjustHandle.gdRefY ? ctx.variables[adjustHandle.gdRefY] : undefined),
          minX: convert(adjustHandle.minX),
          minY: convert(adjustHandle.minY),
          maxX: convert(adjustHandle.maxX),
          maxY: convert(adjustHandle.maxY),
          posX: convert(adjustHandle.posX)!,
          posY: convert(adjustHandle.posY)!,
        }) as GeneratedAdjustHandle
      })
    },
    generatePaths,
    generateSvgString: (options: Partial<ShapeGuideContext & Path2DStyle> = {}): string => {
      const { width = 0, height = 0, variables: _variables, ...style } = options
      const strokeWidth = style.strokeWidth ?? 0
      const paths = generatePaths(options)
      const viewBox = {
        x1: [] as number[],
        y1: [] as number[],
        x2: [] as number[],
        y2: [] as number[],
      }
      paths.forEach((path) => {
        const { data, ...pathStyle } = path
        const _path = new Path2D(data, pathStyle)
        const { left, top, right, bottom } = _path.getBoundingBox()
        viewBox.x1.push(left)
        viewBox.y1.push(top)
        viewBox.x2.push(right)
        viewBox.y2.push(bottom)
      })
      const x1 = Math.min(...viewBox.x1.map(v => v - strokeWidth / 2))
      const y1 = Math.min(...viewBox.y1.map(v => v - strokeWidth / 2))
      return new XmlRenderer().render({
        tag: 'svg',
        attrs: {
          'data-title': name,
          'xmlns': 'http://www.w3.org/2000/svg',
          'width': width,
          'height': height,
          'viewBox': [
            x1,
            y1,
            Math.max(...viewBox.x2.map(v => v - x1 + strokeWidth)),
            Math.max(...viewBox.y2.map(v => v - y1 + strokeWidth)),
          ].join(' '),
        },
        children: paths.map((path) => {
          return {
            tag: 'path',
            attrs: {
              'd': path.data,
              'fill': path.fill ?? style.fill,
              'fill-rule': path.fillRule,
              'stroke': path.stroke ?? style.stroke,
              'stroke-width': style.strokeWidth,
            },
          }
        }),
      })
    },
  })
}
