import type { ArcTo } from './ArcTo'
import type { CloseShapePath } from './CloseShapePath'
import type { CubicBezierCurveTo } from './CubicBezierCurveTo'
import type { LineTo } from './LineTo'
import type { MoveTo } from './MoveTo'
import type { QuadraticBezierCurveTo } from './QuadraticBezierCurveTo'
import { defineAttribute, defineElement, OXML } from '../../core'

export type PathCommandOXML =
  | ArcTo
  | CloseShapePath
  | LineTo
  | CubicBezierCurveTo
  | QuadraticBezierCurveTo
  | MoveTo

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

  get commands(): PathCommandOXML[] {
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
}
