import type { BlipCompressionValues } from './_types'
import type { AlphaModulation } from './AlphaModulation'
import type { AlphaModulationFixed } from './AlphaModulationFixed'
import type { ExtensionList } from './ExtensionList'
import { defineAttribute, defineChild, defineElement, OOXML } from '../../core'

/**
 * @link https://learn.microsoft.com/dotnet/api/documentformat.openxml.drawing.blip
 */
@defineElement('a:blip')
export class Blip extends OOXML {
  @defineAttribute('cstate') declare cstate?: BlipCompressionValues
  @defineAttribute('r:embed') declare rEmbed?: string
  @defineAttribute('r:link') declare rLink?: string

  @defineChild('a:alphaBiLevel') declare alphaBiLevel?: OOXML
  @defineChild('a:alphaCeiling') declare alphaCeiling?: OOXML
  @defineChild('a:alphaFloor') declare alphaFloor?: OOXML
  @defineChild('a:alphaInv') declare alphaInv?: OOXML
  @defineChild('a:alphaMod') declare alphaMod?: AlphaModulation
  @defineChild('a:alphaModFix') declare alphaModFix?: AlphaModulationFixed
  @defineChild('a:alphaRepl') declare alphaRepl?: OOXML
  @defineChild('a:biLevel') declare biLevel?: OOXML
  @defineChild('a:blur') declare blur?: OOXML
  @defineChild('a:clrChange') declare clrChange?: OOXML
  @defineChild('a:clrRepl') declare clrRepl?: OOXML
  @defineChild('a:duotone') declare duotone?: OOXML
  @defineChild('a:extLst') declare extLst?: ExtensionList
  @defineChild('a:fillOverlay') declare fillOverlay?: OOXML
  @defineChild('a:grayscl') declare grayscl?: OOXML
  @defineChild('a:hsl') declare hsl?: OOXML
  @defineChild('a:lum') declare lum?: OOXML
  @defineChild('a:tint') declare tint?: OOXML
}
