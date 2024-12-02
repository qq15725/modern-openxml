import { defineProperty } from '../../core'
import { _Namespace } from './_Namespace'

/**
 * @link https://learn.microsoft.com/dotnet/api/documentformat.openxml.drawing.tile
 */
export class Tile extends _Namespace {
  readonly tag = 'tile'

  @defineProperty('sx', 'rate') declare sx: number
  @defineProperty('sy', 'rate') declare sy: number
  @defineProperty('tx', 'rate') declare tx: number
  @defineProperty('ty', 'rate') declare ty: number
  @defineProperty('algn', 'string') declare algn: string
  @defineProperty('flip', 'string') declare flip: string
}
