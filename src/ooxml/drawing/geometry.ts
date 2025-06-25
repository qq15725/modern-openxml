import type { NormalizedShape, ShapePath } from 'modern-idoc'
import type { OOXMLNode } from '../core'
import { svgPathCommandsToData, svgPathDataToCommands } from 'modern-path2d'
import { OOXMLValue } from '../core'
import { clearUndef, withAttr, withAttrs, withIndents } from '../utils'

export interface Rectangle {
  left?: string
  top?: string
  right?: string
  bottom?: string
}

export interface ShapeGuide {
  name: string
  fmla: string
}

export interface AdjustValue {
  name: string
  value: number
}

export interface AdjustHandle {
  gdRefX?: string
  gdRefY?: string
  minX?: string
  maxX?: string
  minY?: string
  maxY?: string
  posX: string
  posY: string
}

type GeometryPathCommand
  = | { type: 'M', x: number, y: number }
    | { type: 'L', x: number, y: number }
    | { type: 'A', rx: number, ry: number, angle: number, largeArcFlag: number, sweepFlag: number, x: number, y: number }
    | { type: 'Q', x1: number, y1: number, x: number, y: number }
    | { type: 'C', x1: number, y1: number, x2: number, y2: number, x: number, y: number }
    | { type: 'Z' }

export interface ShapeGuideContext {
  width: number
  height: number
  variables: Record<string, number>
}

export function parseRectangle(rect?: OOXMLNode): Rectangle | undefined {
  const res = {
    left: rect?.attr('@l'),
    top: rect?.attr('@t'),
    right: rect?.attr('@r'),
    bottom: rect?.attr('@b'),
  }
  return Object.keys(res).length ? res : undefined
}

export function parseAdjustValueList(avLst: OOXMLNode): AdjustValue[] {
  return avLst.get('*[(self::a:gd or self::gd)]').map(gd => parseAdjustValue(gd))
}

export function parseShapeGuideList(gdLst: OOXMLNode): ShapeGuide[] {
  return gdLst.get('*[(self::a:gd or self::gd)]').map(gd => parseShapeGuide(gd))
}

export function parseAdjustValue(gd: OOXMLNode): AdjustValue {
  const fmla = gd.attr('@fmla')!
  if (!fmla.startsWith('val ')) {
    console.warn('Failed to parse constant shape guide')
  }
  const value = parseShapeGuideFmla(fmla, {
    width: 0,
    height: 0,
    variables: {},
  })
  if (Number.isNaN(value)) {
    console.warn('Failed to parse constant shape guide')
  }
  return {
    name: gd.attr('@name')!,
    value,
  }
}

export function parseShapeGuide(gd: OOXMLNode): ShapeGuide {
  return {
    name: gd.attr('@name')!,
    fmla: gd.attr('@fmla')!,
  }
}

export function parseAdjustHandleList(ahLst: OOXMLNode): AdjustHandle[] {
  return ahLst.get('*[(self::a:ahXY or self::ahXY)]').map(ahXY => clearUndef({
    gdRefX: ahXY.attr('@gdRefX'),
    gdRefY: ahXY.attr('@gdRefY'),
    minX: ahXY.attr('@minX'),
    maxX: ahXY.attr('@maxX'),
    minY: ahXY.attr('@minY'),
    maxY: ahXY.attr('@maxY'),
    posX: ahXY.attr('pos/@x')!,
    posY: ahXY.attr('pos/@y')!,
  }))
}

export function parseShapeGuideValue(value: string, ctx: ShapeGuideContext, parent?: OOXMLNode): number {
  if (!Number.isNaN(Number(value))) {
    return Number(value)
  }
  if (value in ctx.variables) {
    return ctx.variables[value]
  }
  const fmla = parent?.find(`gd[@name='${value}']`)?.attr('@fmla') ?? value
  return (ctx.variables[value] = parseShapeGuideFmla(fmla, ctx, parent))
}

export function parseShapeGuideFmla(fmla: string, ctx: ShapeGuideContext, parent?: OOXMLNode): number {
  switch (fmla) {
    case 'l':
    case 't':
      return 0
    case 'r':
    case 'w':
      return ctx.width
    case 'b':
    case 'h':
      return ctx.height
    case 'hc':
      return ctx.width / 2
    case 'vc':
      return ctx.height / 2
    case 'ls':
      return Math.max(ctx.width, ctx.height)
    case 'ss':
      return Math.min(ctx.width, ctx.height)
  }

  if (fmla.startsWith('val')) {
    // val xxx
    return parseShapeGuideValue(fmla.substring(4), ctx, parent)
  }
  else if (fmla.startsWith('wd')) {
    // wd2 wd3 wd4 wd5 wd6 wd8 wd10 wd32...
    return ctx.width / Number(fmla.substring(2))
  }
  else if (fmla.startsWith('hd')) {
    // hd2 hd3 hd4 hd5 hd6 hd8 hd10...
    return ctx.height / Number(fmla.substring(2))
  }
  else if (fmla.startsWith('ssd')) {
    // ssd2 ssd4 ssd5 ssd6 ssd8 ssd10 ssd16 ssd32
    return Math.min(ctx.width, ctx.height) / Number(fmla.substring(3))
  }
  else if (fmla.startsWith('cd')) {
    // cd2 cd4 cd8
    return Number(OOXMLValue.encode(360 / Number(fmla.substring(2)), 'degree'))
  }
  else if (/^\d+cd\d+$/.test(fmla)) {
    // 3cd4 3cd8 5cd8 7cd8
    const match = fmla.match(/^(\d+)cd(\d+)$/)
    if (match && match[1] && match[2]) {
      return Number(OOXMLValue.encode((360 * Number(match[1])) / Number(match[2]), 'degree'))
    }
  }

  const [op, ..._args] = fmla.split(' ')

  const args = _args
    .map(v => v.trim())
    .filter(v => v !== '')
    .map(arg => parseShapeGuideValue(arg, ctx, parent))

  switch (op) {
    case '*/':
      return (args[0] * args[1]) / args[2]
    case '+-':
      return args[0] + args[1] - args[2]
    case '+/':
      return (args[0] + args[1]) / args[2]
    case '?:':
      return args[0] > 0 ? args[1] : args[2]
    case 'abs':
      return Math.abs(args[0])
    case 'max':
      return Math.max(args[0], args[1])
    case 'min':
      return Math.min(args[0], args[1])
    case 'mod':
      return Math.sqrt(args[0] * args[0] + args[1] * args[1] + args[2] * args[2])
    case 'pin':
      return args[1] < args[0] ? args[0] : args[1] > args[2] ? args[2] : args[1]
    case 'sqrt':
      return Math.sqrt(args[0])
    case 'val':
      return args[0]
    case 'at2':
      return Number(OOXMLValue.encode((Math.atan2(args[1], args[0]) / Math.PI) * 180, 'degree'))
    case 'cat2':
      return args[0] * Math.cos(Math.atan2(args[2], args[1]))
    case 'sat2':
      return args[0] * Math.sin(Math.atan2(args[2], args[1]))
    case 'cos':
      return args[0] * Math.cos((OOXMLValue.decode(String(args[1]), 'degree') / 180) * Math.PI)
    case 'sin':
      return args[0] * Math.sin((OOXMLValue.decode(String(args[1]), 'degree') / 180) * Math.PI)
    case 'tan':
      return args[0] * Math.tan((OOXMLValue.decode(String(args[1]), 'degree') / 180) * Math.PI)
    default:
      return Number(fmla)
  }
}

function getEllipsePoint(a: number, b: number, theta: number): { x: number, y: number } {
  const aSinTheta = a * Math.sin(theta)
  const bCosTheta = b * Math.cos(theta)
  const circleRadius = Math.sqrt(aSinTheta * aSinTheta + bCosTheta * bCosTheta)
  if (!circleRadius) {
    return { x: 0, y: 0 }
  }
  return {
    x: a * (bCosTheta / circleRadius),
    y: b * (aSinTheta / circleRadius),
  }
}

export function parsePaths(pathLst: OOXMLNode | undefined, ctx: ShapeGuideContext): ShapePath[] {
  const {
    width,
    height,
  } = ctx

  return pathLst?.get('*[(self::a:path or self::path)]').map((path) => {
    path.attr('@extrusionOk', 'boolean')
    const needsFill = path.attr<boolean>('@fill', 'boolean') ?? true
    const needsStroke = path.attr<boolean>('@stroke', 'boolean') ?? true
    const w = path.attr<number>('@w', 'number')
    const h = path.attr<number>('@h', 'number')

    const rateX = w ? width / w : 1
    const rateY = h ? height / h : 1

    function convert(gdValue: string, isX: boolean, type: 'emu' | 'degree' = 'emu'): number {
      const value = parseShapeGuideValue(gdValue, ctx)
      if (type === 'emu') {
        return OOXMLValue.decode(isX ? value * rateX : value * rateY, 'emu')
      }
      else {
        return (OOXMLValue.decode(value, 'degree') / 180) * Math.PI
      }
    }

    let currentPoint: { x: any, y: any }
    const commands: GeometryPathCommand[] = path.get('*').map((child) => {
      const name = child.name
      if (name.endsWith('moveTo')) {
        const pt = child.query('*[self::a:pt or self::pt]')
        const x = convert(pt?.attr('@x'), true)
        const y = convert(pt?.attr('@y'), false)
        currentPoint = { x, y }
        return { type: 'M', x, y }
      }
      else if (name.endsWith('lnTo')) {
        const pt = child.query('*[self::a:pt or self::pt]')!
        const x = convert(pt.attr('@x')!, true)
        const y = convert(pt.attr('@y')!, false)
        currentPoint = { x, y }
        return { type: 'L', x, y }
      }
      else if (name.endsWith('arcTo')) {
        const wr = convert(child.attr('@wR')!, true)
        const hr = convert(child.attr('@hR')!, false)
        const stAng = convert(child.attr('@stAng')!, true, 'degree')
        let swAng = convert(child.attr('@swAng')!, false, 'degree')
        if (Math.abs(swAng) === 2 * Math.PI) {
          swAng = swAng - swAng / 360
        }
        const p1 = getEllipsePoint(wr, hr, stAng)
        const p2 = getEllipsePoint(wr, hr, stAng + swAng)
        currentPoint = {
          x: currentPoint.x - p1.x + p2.x,
          y: currentPoint.y - p1.y + p2.y,
        }
        const xAxisRotation = 0
        const largeArcFlag = Math.abs(swAng) >= Math.PI ? 1 : 0
        const sweepFlag = swAng > 0 ? 1 : 0
        return {
          type: 'A',
          rx: wr,
          ry: hr,
          angle: xAxisRotation,
          largeArcFlag,
          sweepFlag,
          x: currentPoint.x,
          y: currentPoint.y,
        }
      }
      else if (name.endsWith('cubicBezTo')) {
        const points = child.get('*[self::a:pt or self::pt]').map(p => ({
          x: p.attr('@x')!,
          y: p.attr('@y')!,
        }))
        const x = convert(points[2].x, true)
        const y = convert(points[2].y, false)
        currentPoint = { x, y }
        return {
          type: 'C',
          x1: convert(points[0].x, true),
          y1: convert(points[0].y, false),
          x2: convert(points[1].x, true),
          y2: convert(points[1].y, false),
          x,
          y,
        }
      }
      else if (name.endsWith('quadBezTo')) {
        const points = child.get('*[(self::a:pt or self::pt)]').map(p => ({
          x: p.attr('@x')!,
          y: p.attr('@y')!,
        }))
        const x = convert(points[1].x, true)
        const y = convert(points[1].y, false)
        currentPoint = { x, y }
        return {
          type: 'Q',
          x1: convert(points[0].x, true),
          y1: convert(points[0].y, false),
          x,
          y,
        }
      }
      else {
        return {
          type: 'Z',
        }
      }
    })

    return clearUndef({
      data: svgPathCommandsToData(commands),
      fill: needsFill ? undefined : 'none',
      fillRule: 'evenodd',
      stroke: needsStroke ? undefined : 'none',
    })
  }) ?? []
}

export function parseGeometry(geom?: OOXMLNode, ctx?: Record<string, any>): NormalizedShape | undefined {
  if (!geom)
    return undefined
  let prstGeom, custGeom
  switch (geom.name) {
    case 'a:prstGeom':
      prstGeom = geom
      break
    case 'a:custGeom':
      custGeom = geom
      break
  }
  const preset = prstGeom?.attr('@prst')
  if (preset === 'rect' && !prstGeom?.get('a:avLst//a:gd')?.length) {
    // skip
  }
  else {
    if (preset) {
      const node = ctx?.presetShapeDefinitions?.find(preset)
      const avLst = node?.find('avLst')
      const gdLst = node?.find('gdLst')
      const overlayAvLst = prstGeom?.find('a:avLst')
      const _ctx: ShapeGuideContext = {
        width: Number(OOXMLValue.encode(ctx?.width ?? 0, 'emu')),
        height: Number(OOXMLValue.encode(ctx?.height ?? 0, 'emu')),
        variables: {},
      }
      if (avLst) {
        parseAdjustValueList(avLst).forEach((gd) => {
          _ctx.variables[gd.name] = gd.value
        })
      }
      if (overlayAvLst) {
        parseAdjustValueList(overlayAvLst).forEach((gd) => {
          _ctx.variables[gd.name] = gd.value
        })
      }
      if (gdLst) {
        parseShapeGuideList(gdLst).forEach((gd) => {
          _ctx.variables[gd.name] = parseShapeGuideFmla(gd.fmla, _ctx as any)
        })
      }
      return {
        preset,
        paths: parsePaths(node?.find('pathLst'), _ctx as any),
      }
    }
    else if (custGeom) {
      const avLst = custGeom?.find('avLst')
      const gdLst = custGeom?.find('gdLst')
      const _ctx: ShapeGuideContext = {
        width: Number(OOXMLValue.encode(ctx?.width ?? 0, 'emu')),
        height: Number(OOXMLValue.encode(ctx?.height ?? 0, 'emu')),
        variables: {},
      }
      if (avLst) {
        parseAdjustValueList(avLst).forEach((gd) => {
          _ctx.variables[gd.name] = gd.value
        })
      }
      if (gdLst) {
        parseShapeGuideList(gdLst).forEach((gd) => {
          _ctx.variables[gd.name] = parseShapeGuideFmla(gd.fmla, _ctx as any)
        })
      }
      return {
        paths: parsePaths(custGeom.find('a:pathLst'), _ctx as any),
      }
    }
  }
}

export function stringifyGeometry(shape?: NormalizedShape): string {
  // TODO !shape?.name
  if (shape?.paths?.length) {
    return `<a:custGeom>
  <a:avLst/>
  <a:gdLst/>
  <a:ahLst/>
  <a:cxnLst/>
  <a:rect l="l" t="t" r="r" b="b"/>
  <a:pathLst>
  ${withIndents(shape.paths.map((path) => {
    let currentPoint: { x: number, y: number }
    return `<a:path>
      ${withIndents(svgPathDataToCommands(path.data).map((cmd) => {
        switch (cmd.type) {
          case 'm':
          case 'M':
            currentPoint = { x: cmd.x, y: cmd.y }
            return `<a:moveTo>
  <a:pt${withAttrs([
    withAttr('x', OOXMLValue.encode(cmd.x, 'emu')),
    withAttr('y', OOXMLValue.encode(cmd.y, 'emu')),
  ])}/>
</a:moveTo>`
          case 'l':
          case 'L':
            currentPoint = { x: cmd.x, y: cmd.y }
            return `<a:lnTo>
  <a:pt${withAttrs([
    withAttr('x', OOXMLValue.encode(cmd.x, 'emu')),
    withAttr('y', OOXMLValue.encode(cmd.y, 'emu')),
  ])}/>
</a:lnTo>`
          case 'a':
          case 'A': {
            const startX = currentPoint.x
            const startY = currentPoint.y
            let { rx, ry, angle, largeArcFlag, sweepFlag, x: endX, y: endY } = cmd
            const phi = angle * (Math.PI / 180)
            const dx = (startX - endX) / 2
            const dy = (startY - endY) / 2
            const x1p = Math.cos(phi) * dx + Math.sin(phi) * dy
            const y1p = -Math.sin(phi) * dx + Math.cos(phi) * dy
            let rx_sq = rx * rx
            let ry_sq = ry * ry
            const x1p_sq = x1p * x1p
            const y1p_sq = y1p * y1p
            const lambda = x1p_sq / rx_sq + y1p_sq / ry_sq
            if (lambda > 1) {
              const factor = Math.sqrt(lambda)
              rx *= factor
              ry *= factor
              rx_sq = rx * rx
              ry_sq = ry * ry
            }
            const sign = (largeArcFlag === sweepFlag) ? -1 : 1
            const coef = sign * Math.sqrt(
              (rx_sq * ry_sq - rx_sq * y1p_sq - ry_sq * x1p_sq)
              / (rx_sq * y1p_sq + ry_sq * x1p_sq),
            )
            const cxp = coef * (rx * y1p) / ry
            const cyp = coef * (-ry * x1p) / rx
            const vectorU = [(x1p - cxp) / rx, (y1p - cyp) / ry]
            const vectorV = [(-x1p - cxp) / rx, (-y1p - cyp) / ry]
            const startAngle = Math.atan2(vectorU[1], vectorU[0])
            let deltaAngle = Math.atan2(
              vectorU[0] * vectorV[1] - vectorU[1] * vectorV[0],
              vectorU[0] * vectorV[0] + vectorU[1] * vectorV[1],
            )
            if (!sweepFlag && deltaAngle > 0) {
              deltaAngle -= 2 * Math.PI
            }
            else if (sweepFlag && deltaAngle < 0) {
              deltaAngle += 2 * Math.PI
            }
            const stAng = (startAngle * 180 / Math.PI)
            const swAng = (deltaAngle * 180 / Math.PI)
            currentPoint = { x: cmd.x, y: cmd.y }
            return `<a:arcTo${withAttrs([
              withAttr('wR', OOXMLValue.encode(rx, 'emu')),
              withAttr('hR', OOXMLValue.encode(ry, 'emu')),
              withAttr('stAng', OOXMLValue.encode(stAng, 'degree')),
              withAttr('swAng', OOXMLValue.encode(swAng, 'degree')),
            ])}/>`
          }
          case 'c':
          case 'C':
            currentPoint = { x: cmd.x, y: cmd.y }
            return `<a:cubicBezTo>
  <a:pt${withAttrs([
    withAttr('x', OOXMLValue.encode(cmd.x1, 'emu')),
    withAttr('y', OOXMLValue.encode(cmd.y1, 'emu')),
  ])}/>
  <a:pt${withAttrs([
    withAttr('x', OOXMLValue.encode(cmd.x2, 'emu')),
    withAttr('y', OOXMLValue.encode(cmd.y2, 'emu')),
  ])}/>
  <a:pt${withAttrs([
    withAttr('x', OOXMLValue.encode(cmd.x, 'emu')),
    withAttr('y', OOXMLValue.encode(cmd.y, 'emu')),
  ])}/>
</a:cubicBezTo>`
          case 'q':
          case 'Q':
            currentPoint = { x: cmd.x, y: cmd.y }
            return `<a:quadBezTo>
  <a:pt${withAttrs([
    withAttr('x', OOXMLValue.encode(cmd.x1, 'emu')),
    withAttr('y', OOXMLValue.encode(cmd.y1, 'emu')),
  ])}/>
  <a:pt${withAttrs([
    withAttr('x', OOXMLValue.encode(cmd.x, 'emu')),
    withAttr('y', OOXMLValue.encode(cmd.y, 'emu')),
  ])}/>
</a:quadBezTo>`
          case 'z':
          case 'Z':
            return `<a:close/>`
        }
        return ''
      }), 2)}
    </a:path>`
  }), 2)}
  </a:pathLst>
</a:custGeom>`
  }
  else {
    return `<a:prstGeom prst="${shape?.preset ?? 'rect'}">
  <a:avLst/>
</a:prstGeom>`
  }
}
