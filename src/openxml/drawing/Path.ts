import { defineAttribute, defineElement, OXML } from '../../core'
import { ArcTo } from './ArcTo'
import { CloseShapePath } from './CloseShapePath'
import { CubicBezierCurveTo } from './CubicBezierCurveTo'
import { LineTo } from './LineTo'
import { MoveTo } from './MoveTo'
import { QuadraticBezierCurveTo } from './QuadraticBezierCurveTo'

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

  get commands() {
    return Array.from(this.element.children).map((element) => {
      switch (element.tagName) {
        case 'a:arcTo':
          return new ArcTo().fromElement(element)
        case 'a:close':
          return new CloseShapePath().fromElement(element)
        case 'a:lnTo':
          return new LineTo().fromElement(element)
        case 'a:cubicBezTo':
          return new CubicBezierCurveTo().fromElement(element)
        case 'a:quadBezTo':
          return new QuadraticBezierCurveTo().fromElement(element)
        case 'a:moveTo':
        default:
          return new MoveTo().fromElement(element)
      }
    })
  }
}
