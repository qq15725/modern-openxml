import type { AudioFromFile, ExtensionList, VideoFromFile } from '../Drawing'
import type { PlaceholderShape } from './PlaceholderShape'
import { defineAttribute, defineChild, defineElement, OXML } from '../../core'

/**
 * https://learn.microsoft.com/dotnet/api/documentformat.openxml.presentation.applicationnonvisualdrawingproperties
 */
@defineElement('p:nvPr')
export class ApplicationNonVisualDrawingProperties extends OXML {
  @defineAttribute('isPhoto') declare isPhoto?: boolean
  @defineAttribute('userDrawn') declare userDrawn?: boolean

  @defineChild('a:audioCd') declare audioCd?: OXML
  @defineChild('a:audioFile') declare audioFile?: AudioFromFile
  @defineChild('p:custDataLst') declare custDataLst?: OXML
  @defineChild('a:extLst') declare extLst?: ExtensionList
  @defineChild('p:ph') declare ph?: PlaceholderShape
  @defineChild('quickTimeFile') declare quickTimeFile?: OXML
  @defineChild('a:videoFile') declare videoFile?: VideoFromFile
  @defineChild('a:wavAudioFile') declare wavAudioFile?: OXML
}
