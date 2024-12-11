import type { AudioFromFile, ExtensionList, VideoFromFile } from '../Drawing'
import type { PlaceholderShape } from './PlaceholderShape'
import { defineAttribute, defineChild, defineElement, OOXML } from '../../core'

/**
 * https://learn.microsoft.com/dotnet/api/documentformat.openxml.presentation.applicationnonvisualdrawingproperties
 */
@defineElement('p:nvPr')
export class ApplicationNonVisualDrawingProperties extends OOXML {
  @defineAttribute('isPhoto') declare isPhoto?: boolean
  @defineAttribute('userDrawn') declare userDrawn?: boolean

  @defineChild('a:audioCd') declare audioCd?: OOXML
  @defineChild('a:audioFile') declare audioFile?: AudioFromFile
  @defineChild('p:custDataLst') declare custDataLst?: OOXML
  @defineChild('a:extLst') declare extLst?: ExtensionList
  @defineChild('p:ph') declare ph?: PlaceholderShape
  @defineChild('quickTimeFile') declare quickTimeFile?: OOXML
  @defineChild('a:videoFile') declare videoFile?: VideoFromFile
  @defineChild('a:wavAudioFile') declare wavAudioFile?: OOXML
}
