import type { NormalizedElement } from 'modern-idoc'
import type { OoxmlNode } from '../core'
import type { ColorMap } from './colorMap'
import type { SlideElement } from './slide'
import { idGenerator } from 'modern-idoc'
import { parseBackground } from './background'
import { parseColorMap } from './colorMap'
import { parseElement } from './slide'
import { parseTiming } from './timing'

export interface SlideMaster extends NormalizedElement {
  children: SlideElement[]
  meta: {
    inPptIs: 'SlideMaster'
    pptPath: string
    pptThemePath?: string
    colorMap?: ColorMap
  }
}

export function parseSlideMaster(slide: OoxmlNode, pptPath: string, ctx: any): SlideMaster {
  const meta: any = {
    inPptIs: 'SlideMaster',
    pptPath,
    pptThemePath: ctx.theme.meta.pptPath,
    ...parseTiming(slide.find('p:timing')),
    colorMap: parseColorMap(slide.find('p:clrMap')),
  }

  const newCtx = {
    ...ctx,
    master: {
      node: slide,
      meta,
    },
  }

  return {
    id: idGenerator(),
    style: {
      width: ctx.presentation.width,
      height: ctx.presentation.height,
    },
    background: parseBackground(slide.find('p:cSld/p:bg'), newCtx),
    children: slide
      .get('p:cSld/p:spTree/*')
      .map(item => parseElement(item, newCtx))
      .filter(Boolean) as SlideElement[],
    meta,
  }
}

export function stringifySlideMaster(): string {
  return `<p:sldMaster
  xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main"
  xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships"
  xmlns:p="http://schemas.openxmlformats.org/presentationml/2006/main"
>
  <p:cSld>
    <p:bg>
      <p:bgPr>
        <a:solidFill>
          <a:srgbClr val="FFFFFF"/>
        </a:solidFill>
        <a:effectLst/>
      </p:bgPr>
    </p:bg>
    <p:spTree>
      <p:nvGrpSpPr>
        <p:cNvPr id="1" name=""/>
        <p:cNvGrpSpPr/>
        <p:nvPr/>
      </p:nvGrpSpPr>
      <p:grpSpPr>
        <a:xfrm>
          <a:off x="0" y="0"/>
          <a:ext cx="0" cy="0"/>
          <a:chOff x="0" y="0"/>
          <a:chExt cx="0" cy="0"/>
        </a:xfrm>
      </p:grpSpPr>
    </p:spTree>
  </p:cSld>
  <p:clrMap bg1="lt1" tx1="dk1" bg2="lt2" tx2="dk2" accent1="accent1" accent2="accent2" accent3="accent3" accent4="accent4" accent5="accent5" accent6="accent6" hlink="hlink" folHlink="folHlink"/>
  <p:sldLayoutIdLst>
    <p:sldLayoutId id="2147483648" r:id="rId1"/>
  </p:sldLayoutIdLst>
  <p:txStyles>
    <p:titleStyle>
      <a:lvl1pPr algn="ctr" defTabSz="914400" rtl="0" eaLnBrk="1" latinLnBrk="0" hangingPunct="1">
        <a:spcBef>
          <a:spcPct val="0"/>
        </a:spcBef>
        <a:buNone/>
        <a:defRPr sz="4400" kern="1200">
          <a:solidFill>
            <a:schemeClr val="tx1"/>
          </a:solidFill>
          <a:latin typeface="+mj-lt"/>
          <a:ea typeface="+mj-ea"/>
          <a:cs typeface="+mj-cs"/>
        </a:defRPr>
      </a:lvl1pPr>
    </p:titleStyle>
    <p:bodyStyle>
      <a:lvl1pPr marL="342900" indent="-342900" algn="l" defTabSz="914400" rtl="0" eaLnBrk="1" latinLnBrk="0" hangingPunct="1">
        <a:spcBef>
          <a:spcPct val="20000"/>
        </a:spcBef>
        <a:buFont typeface="Arial" pitchFamily="34" charset="0"/>
        <a:buChar char="•"/>
        <a:defRPr sz="3200" kern="1200">
          <a:solidFill>
            <a:schemeClr val="tx1"/>
          </a:solidFill>
          <a:latin typeface="+mn-lt"/>
          <a:ea typeface="+mn-ea"/>
          <a:cs typeface="+mn-cs"/>
        </a:defRPr>
      </a:lvl1pPr>
      <a:lvl2pPr marL="742950" indent="-285750" algn="l" defTabSz="914400" rtl="0" eaLnBrk="1" latinLnBrk="0" hangingPunct="1">
        <a:spcBef>
          <a:spcPct val="20000"/>
        </a:spcBef>
        <a:buFont typeface="Arial" pitchFamily="34" charset="0"/>
        <a:buChar char="–"/>
        <a:defRPr sz="2800" kern="1200">
          <a:solidFill>
            <a:schemeClr val="tx1"/>
          </a:solidFill>
          <a:latin typeface="+mn-lt"/>
          <a:ea typeface="+mn-ea"/>
          <a:cs typeface="+mn-cs"/>
        </a:defRPr>
      </a:lvl2pPr>
      <a:lvl3pPr marL="1143000" indent="-228600" algn="l" defTabSz="914400" rtl="0" eaLnBrk="1" latinLnBrk="0" hangingPunct="1">
        <a:spcBef>
          <a:spcPct val="20000"/>
        </a:spcBef>
        <a:buFont typeface="Arial" pitchFamily="34" charset="0"/>
        <a:buChar char="•"/>
        <a:defRPr sz="2400" kern="1200">
          <a:solidFill>
            <a:schemeClr val="tx1"/>
          </a:solidFill>
          <a:latin typeface="+mn-lt"/>
          <a:ea typeface="+mn-ea"/>
          <a:cs typeface="+mn-cs"/>
        </a:defRPr>
      </a:lvl3pPr>
      <a:lvl4pPr marL="1600200" indent="-228600" algn="l" defTabSz="914400" rtl="0" eaLnBrk="1" latinLnBrk="0" hangingPunct="1">
        <a:spcBef>
          <a:spcPct val="20000"/>
        </a:spcBef>
        <a:buFont typeface="Arial" pitchFamily="34" charset="0"/>
        <a:buChar char="–"/>
        <a:defRPr sz="2000" kern="1200">
          <a:solidFill>
            <a:schemeClr val="tx1"/>
          </a:solidFill>
          <a:latin typeface="+mn-lt"/>
          <a:ea typeface="+mn-ea"/>
          <a:cs typeface="+mn-cs"/>
        </a:defRPr>
      </a:lvl4pPr>
      <a:lvl5pPr marL="2057400" indent="-228600" algn="l" defTabSz="914400" rtl="0" eaLnBrk="1" latinLnBrk="0" hangingPunct="1">
        <a:spcBef>
          <a:spcPct val="20000"/>
        </a:spcBef>
        <a:buFont typeface="Arial" pitchFamily="34" charset="0"/>
        <a:buChar char="»"/>
        <a:defRPr sz="2000" kern="1200">
          <a:solidFill>
            <a:schemeClr val="tx1"/>
          </a:solidFill>
          <a:latin typeface="+mn-lt"/>
          <a:ea typeface="+mn-ea"/>
          <a:cs typeface="+mn-cs"/>
        </a:defRPr>
      </a:lvl5pPr>
      <a:lvl6pPr marL="2514600" indent="-228600" algn="l" defTabSz="914400" rtl="0" eaLnBrk="1" latinLnBrk="0" hangingPunct="1">
        <a:spcBef>
          <a:spcPct val="20000"/>
        </a:spcBef>
        <a:buFont typeface="Arial" pitchFamily="34" charset="0"/>
        <a:buChar char="•"/>
        <a:defRPr sz="2000" kern="1200">
          <a:solidFill>
            <a:schemeClr val="tx1"/>
          </a:solidFill>
          <a:latin typeface="+mn-lt"/>
          <a:ea typeface="+mn-ea"/>
          <a:cs typeface="+mn-cs"/>
        </a:defRPr>
      </a:lvl6pPr>
      <a:lvl7pPr marL="2971800" indent="-228600" algn="l" defTabSz="914400" rtl="0" eaLnBrk="1" latinLnBrk="0" hangingPunct="1">
        <a:spcBef>
          <a:spcPct val="20000"/>
        </a:spcBef>
        <a:buFont typeface="Arial" pitchFamily="34" charset="0"/>
        <a:buChar char="•"/>
        <a:defRPr sz="2000" kern="1200">
          <a:solidFill>
            <a:schemeClr val="tx1"/>
          </a:solidFill>
          <a:latin typeface="+mn-lt"/>
          <a:ea typeface="+mn-ea"/>
          <a:cs typeface="+mn-cs"/>
        </a:defRPr>
      </a:lvl7pPr>
      <a:lvl8pPr marL="3429000" indent="-228600" algn="l" defTabSz="914400" rtl="0" eaLnBrk="1" latinLnBrk="0" hangingPunct="1">
        <a:spcBef>
          <a:spcPct val="20000"/>
        </a:spcBef>
        <a:buFont typeface="Arial" pitchFamily="34" charset="0"/>
        <a:buChar char="•"/>
        <a:defRPr sz="2000" kern="1200">
          <a:solidFill>
            <a:schemeClr val="tx1"/>
          </a:solidFill>
          <a:latin typeface="+mn-lt"/>
          <a:ea typeface="+mn-ea"/>
          <a:cs typeface="+mn-cs"/>
        </a:defRPr>
      </a:lvl8pPr>
      <a:lvl9pPr marL="3886200" indent="-228600" algn="l" defTabSz="914400" rtl="0" eaLnBrk="1" latinLnBrk="0" hangingPunct="1">
        <a:spcBef>
          <a:spcPct val="20000"/>
        </a:spcBef>
        <a:buFont typeface="Arial" pitchFamily="34" charset="0"/>
        <a:buChar char="•"/>
        <a:defRPr sz="2000" kern="1200">
          <a:solidFill>
            <a:schemeClr val="tx1"/>
          </a:solidFill>
          <a:latin typeface="+mn-lt"/>
          <a:ea typeface="+mn-ea"/>
          <a:cs typeface="+mn-cs"/>
        </a:defRPr>
      </a:lvl9pPr>
    </p:bodyStyle>
      <p:otherStyle>
        <a:defPPr>
          <a:defRPr lang="en-US"/>
        </a:defPPr>
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
      </p:otherStyle>
    </p:txStyles>
</p:sldMaster>`
}
