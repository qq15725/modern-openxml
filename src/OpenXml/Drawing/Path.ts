import { defineAttribute, defineElement, OOXML } from '../../core'
import { ArcTo } from './ArcTo'
import { CloseShapePath } from './CloseShapePath'
import { CubicBezierCurveTo } from './CubicBezierCurveTo'
import { LineTo } from './LineTo'
import { MoveTo } from './MoveTo'
import { QuadraticBezierCurveTo } from './QuadraticBezierCurveTo'

export type RawPathCommand =
  | { type: 'M', x: string, y: string }
  | { type: 'L', x: string, y: string }
  | { type: 'A', rx: string, ry: string, stAng: string, swAng: string, x: string, y: string }
  | { type: 'Q', x1: string, y1: string, x: string, y: string }
  | { type: 'C', x1: string, y1: string, x2: string, y2: string, x: string, y: string }
  | { type: 'Z' }

/**
 * https://learn.microsoft.com/dotnet/api/documentformat.openxml.drawing.path
 */
@defineElement('a:path')
export class Path extends OOXML {
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
          return OOXML.make(element)
      }
    })
  }

  get commands(): RawPathCommand[] {
    const commands: RawPathCommand[] = []
    let prev: { x: string, y: string } | undefined
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
        const { hR, wR, stAng, swAng } = child
        commands.push({ type: 'A', rx: wR, ry: hR, stAng, swAng, x: prev!.x, y: prev!.y })
      }
      else if (child instanceof CubicBezierCurveTo) {
        const [p1, p2, p] = child.value
        commands.push({ type: 'C', x1: p1.x, y1: p1.y, x2: p2.x, y2: p2.y, x: p.x, y: p.y })
      }
      else if (child instanceof QuadraticBezierCurveTo) {
        const [p1, p] = child.value
        commands.push({ type: 'Q', x1: p1.x, y1: p1.y, x: p.x, y: p.y })
      }
      else if (child instanceof CloseShapePath) {
        commands.push({ type: 'Z' })
      }
    })
    return commands
  }
}
