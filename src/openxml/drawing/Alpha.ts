import { defineElement, defineProperty, OXML } from '../../core'

/**
 * @link https://learn.microsoft.com/dotnet/api/documentformat.openxml.drawing.alpha
 */
@defineElement('alpha', 'a')
export class Alpha extends OXML {
  @defineProperty('val', 'string') declare val: string
}
