import type { OOXMLNode } from '../core'
import type { NormalizedPPTX } from '../types'
import { OOXMLValue } from '../core'
import { withAttr, withAttrs, withIndents } from '../utils'

export interface Presentation {
  width: number
  height: number
  slides: { id: string, rId: string }[]
  slideMasters: { id: string, rId: string }[]
}

export function parsePresentation(node?: OOXMLNode): Presentation | undefined {
  if (!node)
    return undefined

  return {
    width: node.attr('p:sldSz/@cx', 'emu')!,
    height: node.attr('p:sldSz/@cy', 'emu')!,
    slides: node.get('p:sldIdLst//p:sldId').map((v) => {
      return {
        id: v.attr('@id')!,
        rId: v.attr('@r:id')!,
      }
    }),
    slideMasters: node.get('p:sldMasterIdLst//sldMasterId').map((v) => {
      return {
        id: v.attr('@id')!,
        rId: v.attr('@r:id')!,
      }
    }),
  }
}

export function stringifyPresentation(props: NormalizedPPTX, slides: string[], slideMasters: string[]): string {
  const slideIds = slides.map((id, i) => {
    return `<p:sldId id="${256 + i}" r:id="${id}"/>`
  })
  const slideMasterIds = slideMasters.map((id, i) => {
    return `<p:sldMasterId id="${2147483659 + i}" r:id="${id}"/>`
  })

  return `<p:presentation
  xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main"
  xmlns:p="http://schemas.openxmlformats.org/presentationml/2006/main"
  xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships"
>
  <p:sldMasterIdLst>
     ${withIndents(slideMasterIds, 2)}
  </p:sldMasterIdLst>
  <p:sldIdLst>
    ${withIndents(slideIds, 2)}
  </p:sldIdLst>
  <p:sldSz${withAttrs([withAttr('cx', OOXMLValue.encode(props.style.width, 'emu')), withAttr('cy', OOXMLValue.encode(props.style.height, 'emu'))])}/>
  <p:notesSz cx="5143500" cy="9144000"/>
  <p:defaultTextStyle>
    <a:lvl1pPr marL="0" algn="l" defTabSz="914400" rtl="0" eaLnBrk="1" latinLnBrk="0" hangingPunct="1">
      <a:defRPr sz="1800" kern="1200">
        <a:solidFill>
          <a:schemeClr val="tx1"/>
        </a:solidFill>
        <a:latin typeface="+mn-lt"/>
        <a:ea typeface="+mn-ea"/>
        <a:cs typeface="+mn-cs"/>
      </a:defRPr>
    </a:lvl1pPr>
    <a:lvl2pPr marL="457200" algn="l" defTabSz="914400" rtl="0" eaLnBrk="1" latinLnBrk="0" hangingPunct="1">
      <a:defRPr sz="1800" kern="1200">
        <a:solidFill>
          <a:schemeClr val="tx1"/>
        </a:solidFill>
        <a:latin typeface="+mn-lt"/>
        <a:ea typeface="+mn-ea"/>
        <a:cs typeface="+mn-cs"/>
      </a:defRPr>
    </a:lvl2pPr>
    <a:lvl3pPr marL="914400" algn="l" defTabSz="914400" rtl="0" eaLnBrk="1" latinLnBrk="0" hangingPunct="1">
      <a:defRPr sz="1800" kern="1200">
        <a:solidFill>
          <a:schemeClr val="tx1"/>
        </a:solidFill>
        <a:latin typeface="+mn-lt"/>
        <a:ea typeface="+mn-ea"/>
        <a:cs typeface="+mn-cs"/>
      </a:defRPr>
    </a:lvl3pPr>
    <a:lvl4pPr marL="1371600" algn="l" defTabSz="914400" rtl="0" eaLnBrk="1" latinLnBrk="0" hangingPunct="1">
      <a:defRPr sz="1800" kern="1200">
        <a:solidFill>
          <a:schemeClr val="tx1"/>
        </a:solidFill>
        <a:latin typeface="+mn-lt"/>
        <a:ea typeface="+mn-ea"/>
        <a:cs typeface="+mn-cs"/>
      </a:defRPr>
    </a:lvl4pPr>
    <a:lvl5pPr marL="1828800" algn="l" defTabSz="914400" rtl="0" eaLnBrk="1" latinLnBrk="0" hangingPunct="1">
      <a:defRPr sz="1800" kern="1200">
        <a:solidFill>
          <a:schemeClr val="tx1"/>
        </a:solidFill>
        <a:latin typeface="+mn-lt"/>
        <a:ea typeface="+mn-ea"/>
        <a:cs typeface="+mn-cs"/>
      </a:defRPr>
    </a:lvl5pPr>
    <a:lvl6pPr marL="2286000" algn="l" defTabSz="914400" rtl="0" eaLnBrk="1" latinLnBrk="0" hangingPunct="1">
      <a:defRPr sz="1800" kern="1200">
        <a:solidFill>
          <a:schemeClr val="tx1"/>
        </a:solidFill>
        <a:latin typeface="+mn-lt"/>
        <a:ea typeface="+mn-ea"/>
        <a:cs typeface="+mn-cs"/>
      </a:defRPr>
    </a:lvl6pPr>
    <a:lvl7pPr marL="2743200" algn="l" defTabSz="914400" rtl="0" eaLnBrk="1" latinLnBrk="0" hangingPunct="1">
      <a:defRPr sz="1800" kern="1200">
        <a:solidFill>
          <a:schemeClr val="tx1"/>
        </a:solidFill>
        <a:latin typeface="+mn-lt"/>
        <a:ea typeface="+mn-ea"/>
        <a:cs typeface="+mn-cs"/>
      </a:defRPr>
    </a:lvl7pPr>
    <a:lvl8pPr marL="3200400" algn="l" defTabSz="914400" rtl="0" eaLnBrk="1" latinLnBrk="0" hangingPunct="1">
      <a:defRPr sz="1800" kern="1200">
        <a:solidFill>
          <a:schemeClr val="tx1"/>
        </a:solidFill>
        <a:latin typeface="+mn-lt"/>
        <a:ea typeface="+mn-ea"/>
        <a:cs typeface="+mn-cs"/>
      </a:defRPr>
    </a:lvl8pPr>
    <a:lvl9pPr marL="3657600" algn="l" defTabSz="914400" rtl="0" eaLnBrk="1" latinLnBrk="0" hangingPunct="1">
      <a:defRPr sz="1800" kern="1200">
        <a:solidFill>
          <a:schemeClr val="tx1"/>
        </a:solidFill>
        <a:latin typeface="+mn-lt"/>
        <a:ea typeface="+mn-ea"/>
        <a:cs typeface="+mn-cs"/>
      </a:defRPr>
    </a:lvl9pPr>
  </p:defaultTextStyle>
</p:presentation>`
}
