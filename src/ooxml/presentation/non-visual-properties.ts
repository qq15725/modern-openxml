import type { AudioDeclaration, VideoDeclaration } from 'modern-idoc'
import type { OOXMLNode } from '../core'
import type { Placeholder } from './placeholder'
import { parsePlaceholder } from './placeholder'

export interface NonVisualProperties {
  audio?: AudioDeclaration
  video?: VideoDeclaration
  placeholder?: Placeholder
}

export function parseNonVisualProperties(nvPr?: OOXMLNode, ctx?: any): NonVisualProperties | undefined {
  if (!nvPr)
    return undefined
  const audioId = nvPr.attr('a:audioFile/@r:link')
  const videoId = nvPr.attr('a:videoFile/@r:link')
  const audio = ctx?.rels?.find((v: any) => v.id === audioId)?.path
  const video = ctx?.rels?.find((v: any) => v.id === videoId)?.path
  // const mediaId = nvPr.attr('p:extLst/p:ext/p14:media/@r:embed')
  // const media = ctx?.rels?.find((v: any) => v.id === mediaId)?.path
  const placeholder = parsePlaceholder(nvPr.find('p:ph'), ctx)
  return {
    audio: audio ? { url: audio } : undefined,
    video: video ? { url: video } : undefined,
    placeholder,
  }
}

// const nextRId = (rid: string): string => `rId${Number.parseInt(rid.slice(3)) + 1}`

export function stringifyNonVisualProperties(_nvPr: NonVisualProperties): string {
  return '<p:nvPr/>'
// TODO media
//   return nvPr.audio || nvPr.video
//     ? `<p:nvPr>
//   ${nvPr.audio ? `<a:audioFile r:link="${nextRId(nvPr.media)}"/>` : ''}
//   ${nvPr.video ? `<a:videoFile r:link="${nextRId(nvPr.media)}"/>` : ''}
//   <p:extLst>
//     <p:ext uri="{DAA4B4D4-6D71-4841-9C94-3DE7FCFB9230}">
//       <p14:media xmlns:p14="http://schemas.microsoft.com/office/powerpoint/2010/main" r:embed="${nvPr.media}"/>
//     </p:ext>
//   </p:extLst>
// </p:nvPr>`
//     : '<p:nvPr/>'
}
