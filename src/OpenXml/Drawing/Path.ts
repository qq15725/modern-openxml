import { defineAttribute, defineElement, OXML } from '../../core'
import { ArcTo } from './ArcTo'
import { CloseShapePath } from './CloseShapePath'
import { CubicBezierCurveTo } from './CubicBezierCurveTo'
import { LineTo } from './LineTo'
import { MoveTo } from './MoveTo'
import { QuadraticBezierCurveTo } from './QuadraticBezierCurveTo'

export type PathCommand =
  | { type: 'M', x: number, y: number }
  | { type: 'L', x: number, y: number }
  | { type: 'A', rx: number, ry: number, angle: number, largeArcFlag: number, sweepFlag: number, x: number, y: number }
  | { type: 'Q', x1: number, y1: number, x: number, y: number }
  | { type: 'C', x1: number, y1: number, x2: number, y2: number, x: number, y: number }
  | { type: 'Z' }

/**
 * https://learn.microsoft.com/dotnet/api/documentformat.openxml.drawing.path
 */
@defineElement('a:path')
export class Path extends OXML {
  @defineAttribute('extrusionOk', 'boolean') extrusionOk?: boolean
  @defineAttribute('fill', 'boolean') fill?: boolean
  @defineAttribute('stroke', 'boolean') stroke?: boolean
  @defineAttribute('w', 'ST_PositiveCoordinate') declare w: number
  @defineAttribute('h', 'ST_PositiveCoordinate') declare h: number

  get children(): (ArcTo | CloseShapePath | LineTo | CubicBezierCurveTo | QuadraticBezierCurveTo | MoveTo)[] {
    return Array.from(this.element.children).map((element) => {
      switch (element.tagName) {
        case 'a:arcTo':
        case 'a:close':
        case 'a:lnTo':
        case 'a:cubicBezTo':
        case 'a:quadBezTo':
        case 'a:moveTo':
        default:
          return OXML.make(element)
      }
    })
  }

  get commands(): PathCommand[] {
    const commands: PathCommand[] = []
    let prev = { x: 0, y: 0 }
    this.children.forEach((child) => {
      if (child instanceof MoveTo) {
        const { x, y } = child.pt
        commands.push({ type: 'M', x, y })
        prev = { x, y }
      }
      else if (child instanceof LineTo) {
        const { x, y } = child.pt
        commands.push({ type: 'L', x, y })
        prev = { x, y }
      }
      else if (child instanceof ArcTo) {
        // TODO
        const { hR, wR, stAng, swAng } = child
        const xAxisRotation = 0
        const largeArcFlag = Math.abs(swAng) >= Math.PI ? 1 : 0
        const sweepFlag = swAng > 0 ? 1 : 0
        commands.push({ type: 'A', rx: wR, ry: hR, xAxisRotation, largeArcFlag, sweepFlag, x: prev.x, y: prev.y })
      }
      else if (child instanceof CubicBezierCurveTo) {
        const [x1, y1, x2, y2, x, y] = child.value
        commands.push({ type: 'C', x1, y1, x2, y2, x, y })
      }
      else if (child instanceof QuadraticBezierCurveTo) {
        const [x1, y1, x, y] = child.value
        commands.push({ type: 'Q', x1, y1, x, y })
      }
      else if (child instanceof CloseShapePath) {
        commands.push({ type: 'Z' })
      }
    })
    return commands
  }
}
