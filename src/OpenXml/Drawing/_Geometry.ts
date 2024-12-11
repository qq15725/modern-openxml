import type { AdjustValueList } from './AdjustValueList'
import type { PathList } from './PathList'
import type { ShapeGuideList } from './ShapeGuideList'
import { defineChild, OOXML, OOXMLValue } from '../../core'
import { ArcTo } from './ArcTo'
import { CubicBezierCurveTo } from './CubicBezierCurveTo'
import { LineTo } from './LineTo'
import { MoveTo } from './MoveTo'
import { QuadraticBezierCurveTo } from './QuadraticBezierCurveTo'

export type GeometryPathCommand =
  | { type: 'M', x: number, y: number }
  | { type: 'L', x: number, y: number }
  | { type: 'A', rx: number, ry: number, angle: number, largeArcFlag: number, sweepFlag: number, x: number, y: number }
  | { type: 'Q', x1: number, y1: number, x: number, y: number }
  | { type: 'C', x1: number, y1: number, x2: number, y2: number, x: number, y: number }
  | { type: 'Z' }

export interface GeometryPath {
  commands: GeometryPathCommand[]
  fill: boolean | undefined
  stroke: boolean | undefined
}

function parseVariables(
  width: number,
  height: number,
  vars: string[][],
): Record<string, number> {
  width = OOXMLValue.parse(width, 'emu')
  height = OOXMLValue.parse(height, 'emu')

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
    '3cd4': Number(OOXMLValue.stringify((360 * 3) / 4, 'degree')),
    '3cd8': Number(OOXMLValue.stringify((360 * 3) / 8, 'degree')),
    '5cd8': Number(OOXMLValue.stringify((360 * 5) / 8, 'degree')),
    '7cd8': Number(OOXMLValue.stringify((360 * 7) / 8, 'degree')),
    'cd2': Number(OOXMLValue.stringify(360 / 2, 'degree')),
    'cd4': Number(OOXMLValue.stringify(360 / 4, 'degree')),
    'cd8': Number(OOXMLValue.stringify(360 / 8, 'degree')),
  }

  function parse(variable: string): number {
    if (variable in variables) {
      return variables[variable]
    }

    const after = vars.find(item => item[0] === variable)
    if (after) {
      return parse(after[1])
    }

    const [cmd, ...args] = variable.split(' ')

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
      res = Number(OOXMLValue.stringify((Math.atan2(parse(args[1]), parse(args[0])) / Math.PI) * 180, 'degree'))
    }
    else if (cmd === 'cat2') {
      res = parse(args[0]) * Math.cos(Math.atan2(parse(args[2]), parse(args[1])))
    }
    else if (cmd === 'sat2') {
      res = parse(args[0]) * Math.sin(Math.atan2(parse(args[2]), parse(args[1])))
    }
    else if (cmd === 'cos') {
      res = parse(args[0]) * Math.cos((OOXMLValue.parse(String(parse(args[1])), 'degree') / 180) * Math.PI)
    }
    else if (cmd === 'sin') {
      res = parse(args[0]) * Math.sin((OOXMLValue.parse(String(parse(args[1])), 'degree') / 180) * Math.PI)
    }
    else if (cmd === 'tan') {
      res = parse(args[0]) * Math.tan((OOXMLValue.parse(String(parse(args[1])), 'degree') / 180) * Math.PI)
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

export class _Geometry extends OOXML {
  @defineChild('a:avLst') declare avLst?: AdjustValueList

  getPaths(
    width: number,
    height: number,
    pathLst?: PathList,
    avLst?: AdjustValueList,
    gdLst?: ShapeGuideList,
  ): GeometryPath[] {
    const av = avLst?.value.map(gd => ({ name: gd.name, fmla: gd.fmla }))
    const gd = gdLst?.value.map(gd => ({ name: gd.name, fmla: gd.fmla }))

    const prestVars = [...av, ...gd].reduce(
      (vars, gd) => {
        const name = gd.name
        const fmla = gd.fmla
        if (name && fmla)
          vars[fmla.startsWith('val ') ? 0 : 1].push([name, fmla])
        return vars
      },
      [[], []] as string[][],
    )

    const variables = parseVariables(width, height, [
      ...(prestVars[0] || []),
      ...(prestVars[1] || []),
    ])

    return pathLst?.value.map((path) => {
      const { w, h, children, fill, stroke } = path

      const rateX = w ? width / w : 1
      const rateY = h ? height / h : 1

      function convert(value: string | number, isX: boolean, type: 'pixel' | 'degree' = 'pixel'): number {
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
          if (type === 'pixel') {
            newValue = OOXMLValue.parse(value, 'emu')
          }
          else {
            return (OOXMLValue.parse(value, 'degree') / 180) * Math.PI
          }
        }
        return isX ? newValue * rateX : newValue * rateY
      }

      let currentPoint: { x: any, y: any }
      const commands: GeometryPathCommand[] = children.map((child) => {
        if (child instanceof MoveTo) {
          const x = convert(child.pt.x, true)
          const y = convert(child.pt.y, false)
          currentPoint = { x, y }
          return { type: 'M', x, y }
        }
        else if (child instanceof LineTo) {
          const x = convert(child.pt.x, true)
          const y = convert(child.pt.y, false)
          currentPoint = { x, y }
          return { type: 'L', x, y }
        }
        else if (child instanceof ArcTo) {
          const wr = convert(child.wR, true)
          const hr = convert(child.hR, false)
          const stAng = convert(child.stAng, true, 'degree')
          const swAng = convert(child.swAng, false, 'degree')
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
            wr,
            hr,
            xAxisRotation,
            largeArcFlag,
            sweepFlag,
            x: currentPoint.x,
            y: currentPoint.y,
          }
        }
        else if (child instanceof CubicBezierCurveTo) {
          const points = child.value
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
        else if (child instanceof QuadraticBezierCurveTo) {
          const points = child.value
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
        fill,
        stroke,
        commands,
      }
    }) ?? []
  }
}
