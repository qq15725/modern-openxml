import type { AudioFromFile, ExtensionList, VideoFromFile } from '../drawing'
import type { PlaceholderShape } from './PlaceholderShape'
import { defineChild, defineElement, OXML } from '../../core'

/**
 * https://learn.microsoft.com/dotnet/api/documentformat.openxml.presentation.applicationnonvisualdrawingproperties
 */
@defineElement('p:nvPr')
export class ApplicationNonVisualDrawingProperties extends OXML {
  @defineChild('a:audioCd') audioCd?: OXML
  @defineChild('a:audioFile') audioFile?: AudioFromFile
  @defineChild('a:custDataLst') custDataLst?: OXML
  @defineChild('a:extLst') extLst?: ExtensionList
  @defineChild('p:ph') ph?: PlaceholderShape
  @defineChild('quickTimeFile') quickTimeFile?: OXML
  @defineChild('a:videoFile') videoFile?: VideoFromFile
  @defineChild('a:wavAudioFile') wavAudioFile?: OXML
}
