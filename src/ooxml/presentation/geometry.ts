import type { GeometryDeclaration } from 'modern-idoc'
import type { OOXMLNode } from '../core'
import { svgPathCommandsToData } from 'modern-path2d'
import { OOXMLValue } from '../core'

function parseGdList(gdList?: OOXMLNode): Record<string, any>[] {
  return gdList?.get('*[(self::a:gd or self::gd)]').map(gd => ({ name: gd.attr('@name'), fmla: gd.attr('@fmla') })) ?? []
}

export function parseGeometry(geom?: OOXMLNode, ctx?: Record<string, any>): GeometryDeclaration | undefined {
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
      ctx = {
        ...ctx,
        preset,
        avLst: [
          ...parseGdList(node?.find('avLst')),
          ...parseGdList(prstGeom?.find('a:avLst')),
        ],
        gdLst: parseGdList(node?.find('gdLst')),
        pathLst: node?.find('pathLst'),
      }
      return {
        name: preset,
        paths: getPaths(ctx as any).map((path) => {
          const { commands, ...props } = path
          return {
            ...props,
            data: svgPathCommandsToData(commands),
          }
        }),
      }
    }
    else if (custGeom) {
      ctx = {
        ...ctx,
        avLst: parseGdList(custGeom.find('a:avLst')),
        gdLst: parseGdList(custGeom.find('a:gdLst')),
        pathLst: custGeom.find('a:pathLst'),
      }
      return {
        paths: getPaths(ctx as any).map((path) => {
          const { commands, ...props } = path
          return {
            ...props,
            data: svgPathCommandsToData(commands),
          }
        }),
      }
    }
  }
}

export function stringifyGeometry(geometry?: GeometryDeclaration): string {
  if (geometry?.name && geometry.name !== 'custom') {
    return `<a:prstGeom prst="${geometry.name}">
  <a:avLst/>
</a:prstGeom>`
  }

  return `<a:prstGeom prst="rect">
  <a:avLst/>
</a:prstGeom>`
}

type GeometryPathCommand =
  | { type: 'M', x: number, y: number }
  | { type: 'L', x: number, y: number }
  | { type: 'A', rx: number, ry: number, angle: number, largeArcFlag: number, sweepFlag: number, x: number, y: number }
  | { type: 'Q', x1: number, y1: number, x: number, y: number }
  | { type: 'C', x1: number, y1: number, x2: number, y2: number, x: number, y: number }
  | { type: 'Z' }

interface GeometryContext {
  width: number
  height: number
  avLst?: OOXMLNode
  gdLst?: OOXMLNode
  pathLst?: OOXMLNode
}

interface GeometryPath {
  commands: GeometryPathCommand[]
  fill?: string
  stroke?: string
}

function parseVariables(
  width: number,
  height: number,
  vars: string[][],
): Record<string, number> {
  width = Number(OOXMLValue.encode(width, 'emu'))
  height = Number(OOXMLValue.encode(height, 'emu'))

  const max = Math.max(width, height)
  const min = Math.min(width, height)

  const variables: Record<string, number> = {
    'l': 0,
    'r': width,
    'w': width,
    'wd2': width / 2,
    'wd4': width / 4,
    'wd5': width / 5,
    'wd6': width / 6,
    'wd8': width / 8,
    'wd10': width / 10,
    'hc': width / 2,
    't': 0,
    'b': height,
    'h': height,
    'hd2': height / 2,
    'hd4': height / 4,
    'hd5': height / 5,
    'hd6': height / 6,
    'hd8': height / 8,
    'hd10': height / 10,
    'vc': height / 2,
    'ls': max,
    'ss': min,
    'ssd2': min / 2,
    'ssd4': min / 4,
    'ssd5': min / 5,
    'ssd6': min / 6,
    'ssd8': min / 8,
    'ssd10': min / 10,
    'ssd16': min / 16,
    'ssd32': min / 32,
    '3cd4': Number(OOXMLValue.encode((360 * 3) / 4, 'degree')),
    '3cd8': Number(OOXMLValue.encode((360 * 3) / 8, 'degree')),
    '5cd8': Number(OOXMLValue.encode((360 * 5) / 8, 'degree')),
    '7cd8': Number(OOXMLValue.encode((360 * 7) / 8, 'degree')),
    'cd2': Number(OOXMLValue.encode(360 / 2, 'degree')),
    'cd4': Number(OOXMLValue.encode(360 / 4, 'degree')),
    'cd8': Number(OOXMLValue.encode(360 / 8, 'degree')),
  }

  function parse(variable: string): number {
    if (variable in variables) {
      return variables[variable]
    }

    const after = vars.find(item => item[0] === variable)
    if (after) {
      return parse(after[1])
    }

    const [cmd, ...args] = variable.split(' ').filter(v => v !== '')

    let res: number
    if (cmd === '*/') {
      res = (parse(args[0]) * parse(args[1])) / parse(args[2])
    }
    else if (cmd === '+-') {
      res = parse(args[0]) + parse(args[1]) - parse(args[2])
    }
    else if (cmd === '+/') {
      res = (parse(args[0]) + parse(args[1])) / parse(args[2])
    }
    else if (cmd === '?:') {
      res = parse(args[0]) > 0 ? parse(args[1]) : parse(args[2])
    }
    else if (cmd === 'abs') {
      res = Math.abs(parse(args[0]))
    }
    else if (cmd === 'max') {
      res = Math.max(parse(args[0]), parse(args[1]))
    }
    else if (cmd === 'min') {
      res = Math.min(parse(args[0]), parse(args[1]))
    }
    else if (cmd === 'mod') {
      res = Math.sqrt(
        parse(args[0]) * parse(args[0]) + parse(args[1]) * parse(args[1]) + parse(args[2]) * parse(args[2]),
      )
    }
    else if (cmd === 'pin') {
      res
        = parse(args[1]) < parse(args[0])
          ? parse(args[0])
          : parse(args[1]) > parse(args[2])
            ? parse(args[2])
            : parse(args[1])
    }
    else if (cmd === 'sqrt') {
      res = Math.sqrt(parse(args[0]))
    }
    else if (cmd === 'val') {
      res = Number(args[0])
    }
    else if (cmd === 'at2') {
      res = Number(OOXMLValue.encode((Math.atan2(parse(args[1]), parse(args[0])) / Math.PI) * 180, 'degree'))
    }
    else if (cmd === 'cat2') {
      res = parse(args[0]) * Math.cos(Math.atan2(parse(args[2]), parse(args[1])))
    }
    else if (cmd === 'sat2') {
      res = parse(args[0]) * Math.sin(Math.atan2(parse(args[2]), parse(args[1])))
    }
    else if (cmd === 'cos') {
      res = parse(args[0]) * Math.cos((OOXMLValue.decode(String(parse(args[1])), 'degree') / 180) * Math.PI)
    }
    else if (cmd === 'sin') {
      res = parse(args[0]) * Math.sin((OOXMLValue.decode(String(parse(args[1])), 'degree') / 180) * Math.PI)
    }
    else if (cmd === 'tan') {
      res = parse(args[0]) * Math.tan((OOXMLValue.decode(String(parse(args[1])), 'degree') / 180) * Math.PI)
    }
    else {
      res = Number(variable)
    }
    variables[variable] = res
    return res
  }

  for (const item of vars) {
    const [name, value] = item
    variables[name] = parse(value)
  }

  return variables
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

function getPaths(ctx: GeometryContext): GeometryPath[] {
  const {
    width,
    height,
    pathLst,
    avLst = [],
    gdLst = [],
  } = ctx

  const prestVars = [...(avLst as any[]), ...(gdLst as any[])].reduce(
    (vars, gd) => {
      const name = gd.name
      const fmla = gd.fmla
      if (name && fmla) {
        const index = fmla.startsWith('val ') ? 0 : 1
        vars[index].push([name, fmla])
      }
      return vars
    },
    [[], []] as string[][][],
  )

  const variables = parseVariables(width, height, [
    ...(prestVars[0] || []),
    ...(prestVars[1] || []),
  ])

  return pathLst?.get('*[(self::a:path or self::path)]').map((path) => {
    path.attr('@extrusionOk', 'boolean')
    const needsFill = path.attr<boolean>('@fill', 'boolean') ?? true
    const needsStroke = path.attr<boolean>('@stroke', 'boolean') ?? true
    const w = path.attr<number>('@w', 'ST_PositiveCoordinate')
    const h = path.attr<number>('@h', 'ST_PositiveCoordinate')

    const rateX = w ? width / w : 1
    const rateY = h ? height / h : 1

    function convert(value: string | number, isX: boolean, type: 'emu' | 'degree' = 'emu'): number {
      let newValue: number
      value = variables[value] ?? value
      if (Number.isNaN(value)) {
        newValue = Number(
          // eslint-disable-next-line no-new-func
          new Function(
            [`const width=${width}`, `const height=${height}`, `return (${value})`].join(';'),
          )(),
        )
      }
      else {
        if (type === 'emu') {
          newValue = OOXMLValue.decode(value, 'emu')
        }
        else {
          return (OOXMLValue.decode(value, 'degree') / 180) * Math.PI
        }
      }
      return isX ? newValue * rateX : newValue * rateY
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
        const swAng = convert(child.attr('@swAng')!, false, 'degree')
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

    return {
      fill: needsFill ? undefined : 'none',
      stroke: needsStroke ? undefined : 'none',
      commands,
    }
  }) ?? []
}
