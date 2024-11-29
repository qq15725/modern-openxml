import { defineProperty } from '../../core'
import { _Namespace } from './_Namespace'

/**
 * @link https://learn.microsoft.com/dotnet/api/documentformat.openxml.drawing.blip
 */
export class Blip extends _Namespace {
  readonly tag = 'blip'

  @defineProperty('r:embed', 'string') declare rEmbed: string
}
