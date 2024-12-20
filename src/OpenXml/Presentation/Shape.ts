import type { ParagraphContent } from 'modern-text'
import type {
  CustomGeometry,
  Fill,
  GeometryJSON,
  ParagraphProperties,
  PresetGeometry,
  PresetGeometryJSON,
} from '../Drawing'
import type { SlideContext } from './_Slide'
import type { NonVisualShapeProperties } from './NonVisualShapeProperties'
import type { PlaceholderShapeJSON } from './PlaceholderShape'
import type { ShapeProperties } from './ShapeProperties'
import type { ShapeStyle } from './ShapeStyle'
import type { TextBody } from './TextBody'
import { defineChild, defineElement, filterObjectEmptyAttr, getObjectValueByPath } from '../../core'
import { Run } from '../Drawing'
import { _SlideElement } from './_SlideElement'

export interface ShapeJSON {
  type: 'shape'
  name?: string
  placeholderShape?: PlaceholderShapeJSON
  geometry?: GeometryJSON | PresetGeometryJSON
  style: {
    visibility?: 'hidden'
    left?: number
    top?: number
    width?: number
    height?: number
    rotate?: number
    backgroundColor?: string
    backgroundImage?: string
    borderColor?: string
    borderImage?: string
    scaleX?: number
    scaleY?: number
    borderWidth?: number
    paddingLeft?: number
    paddingTop?: number
    paddingRight?: number
    paddingBottom?: number
    textRotate?: number
    writingMode?: 'horizontal-tb' | 'vertical-lr' | 'vertical-rl'
    textWrap?: 'wrap' | 'nowrap'
    textAlign?: 'center' | 'start'
    verticalAlign?: 'top' | 'middle' | 'bottom'
    shadow?: string
  }
  content?: ParagraphContent[]
}

/**
 * https://learn.microsoft.com/dotnet/api/documentformat.openxml.presentation.shape
 */
@defineElement('p:sp')
export class Shape extends _SlideElement {
  @defineChild('p:nvSpPr', { required: true }) declare nvSpPr: NonVisualShapeProperties
  @defineChild('p:spPr', { required: true }) declare spPr: ShapeProperties
  @defineChild('p:txBody') declare txBody?: TextBody
  @defineChild('p:style') declare style?: ShapeStyle

  override hasPh(): boolean {
    return Boolean(this.nvSpPr?.nvPr?.ph)
  }

  override toJSON(ctx: SlideContext = {}): ShapeJSON {
    const { theme, layout, presentation, master } = ctx

    // ph
    let _ph: Shape | undefined
    const ph = this.nvSpPr?.nvPr.ph
    if (ph) {
      _ph = (layout?.findPh(ph) ?? master?.findPh(ph)) as Shape | undefined
    }

    // style
    const _style = this.style?.parse(ctx)

    const inherited = <T = any>(path: string): T | undefined => {
      return this.offsetGet(path)
        ?? getObjectValueByPath(_style, path.replace('spPr.', ''))
        ?? _ph?.offsetGet(path)
    }

    const width = inherited('spPr.xfrm.ext.cx')
    const height = inherited('spPr.xfrm.ext.cy')
    const prstGeom = inherited<PresetGeometry>('spPr.prstGeom')
    const custGeom = inherited<CustomGeometry>('spPr.custGeom')
    let background
    let border
    let borderWidth
    let geometry
    const fill = inherited<Fill>('spPr.fill')?.toJSON({
      ...ctx,
      color: this.spPr?.fill ? undefined : this.style?.fillRef?.color,
    })
    const stroke = inherited<Fill>('spPr.ln.fill')?.toJSON({
      ...ctx,
      color: this.spPr?.ln?.fill ? undefined : this.style?.lnRef?.color,
    })
    const strokeWidth = inherited('spPr.ln.w')
    if (prstGeom?.prst === 'rect') {
      background = fill
      border = stroke
      borderWidth = strokeWidth
    }
    else {
      geometry = (prstGeom ?? custGeom)?.toJSON({
        ...ctx,
        width: width || strokeWidth,
        height: height || strokeWidth,
        fill: fill?.color,
        stroke: stroke?.color,
        strokeWidth,
      })
    }

    return filterObjectEmptyAttr({
      type: 'shape',
      name: inherited('nvSpPr.cNvPr.name'),
      placeholderShape: ph?.toJSON(),
      geometry,
      style: {
        visibility: inherited('nvSpPr.cNvPr.visibility'),
        left: inherited('spPr.xfrm.off.x'),
        top: inherited('spPr.xfrm.off.y'),
        width,
        height,
        rotate: inherited('spPr.xfrm.rot'),
        scaleX: inherited('spPr.xfrm.scaleX'),
        scaleY: inherited('spPr.xfrm.scaleY'),
        shadow: inherited('spPr.effectLst.shadow'),
        backgroundColor: background?.color,
        backgroundImage: background?.image,
        borderWidth,
        borderColor: border?.color,
        borderImage: border?.image,
        paddingLeft: inherited('txBody.bodyPr.lIns'),
        paddingTop: inherited('txBody.bodyPr.tIns'),
        paddingRight: inherited('txBody.bodyPr.rIns'),
        paddingBottom: inherited('txBody.bodyPr.bIns'),
        textRotate: inherited('txBody.bodyPr.rot'),
        writingMode: inherited('txBody.bodyPr.writingMode'),
        textWrap: inherited('txBody.bodyPr.textWrap'),
        textAlign: inherited('txBody.bodyPr.textAlign'),
        verticalAlign: inherited('txBody.bodyPr.verticalAlign'),
      },
      content: this.nvSpPr?.cNvSpPr.txBox
        ? this.txBody?.pList.map((p) => {
          const lvl = p.pPr?.lvl
          const hasLvl = lvl !== undefined
          const lvKey = hasLvl ? `lvl${lvl + 1}pPr` : ''
          const pPrList = [
            p.pPr,
            this.offsetGet('txBody.lstStyle.defPPr'),
            hasLvl && this.offsetGet(`txBody.lstStyle.${lvKey}`),
            _ph?.offsetGet('txBody.lstStyle.defPPr'),
            hasLvl && _ph?.offsetGet(`txBody.lstStyle.${lvKey}`),
            hasLvl && ph && master?.offsetGet(`txStyles.${ph.type}Style.${lvKey}`),
            hasLvl && master?.offsetGet(`txStyles.otherStyle.${lvKey}`),
            hasLvl && theme?.offsetGet(`objectDefaults.spDef.lstStyle.${lvKey}`),
            hasLvl && theme?.offsetGet(`objectDefaults.lnDef.lstStyle.${lvKey}`),
            hasLvl && theme?.offsetGet(`objectDefaults.txDef.lstStyle.${lvKey}`),
            hasLvl && presentation?.offsetGet(`defaultTextStyle.${lvKey}`),
            presentation?.offsetGet(`defaultTextStyle.defPPr`),
            presentation?.offsetGet(`defaultTextStyle.lvl1pPr`),
          ].filter(Boolean) as ParagraphProperties[]
          const inheritedPPr = (path: string): any => {
            return pPrList.reduce((res, pPr) => res ?? pPr.offsetGet(path), undefined)
          }
          return {
            marginLeft: inheritedPPr('marL'),
            marginRight: inheritedPPr('marR'),
            textIndent: inheritedPPr('indent'),
            lineHeight: inheritedPPr('lnSpc.spcPct.val'),
            textAlign: inheritedPPr('textAlign'),
            fragments: p.children.map((r) => {
              if (r instanceof Run) {
                const inheritedRPr = (path = ''): any => {
                  return r.offsetGet(`rPr.${path}`)
                    ?? inheritedPPr(`defRPr.${path}`)
                }
                const fill = inheritedRPr('fill')?.toJSON(ctx)
                const border = inheritedRPr('ln.fill')?.toJSON(ctx)
                return {
                  fontWeight: inheritedRPr('fontWeight'),
                  fontStyle: inheritedRPr('fontStyle'),
                  fontFamily: inheritedRPr('fontFamily'),
                  textTransform: inheritedRPr('textTransform'),
                  textDecoration: inheritedRPr('textDecoration'),
                  fontSize: inheritedRPr('fontSize'),
                  letterSpacing: inheritedRPr('letterSpacing'),
                  lineHeight: inheritedRPr('lineHeight'),
                  color: fill?.color,
                  borderWidth: inheritedRPr('ln.w'),
                  borderColor: border?.color,
                  borderImage: border?.image,
                  content: r.content,
                }
              }
              return {}
            }),
          }
        })
        : undefined,
    })
  }
}
