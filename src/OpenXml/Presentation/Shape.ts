import type { ParagraphContent } from 'modern-text'
import type {
  BlipFillJSON,
  CustomGeometry,
  CustomGeometryJSON,
  Fill,
  ParagraphProperties,
  PresetGeometry,
  PresetGeometryJSON,
  SolidFill,
} from '../Drawing'
import type { SlideContext } from './_Slide'
import type { NonVisualShapeProperties } from './NonVisualShapeProperties'
import type { PlaceholderShapeJSON } from './PlaceholderShape'
import type { ShapeProperties } from './ShapeProperties'
import type { ShapeStyle } from './ShapeStyle'
import type { TextBody } from './TextBody'
import { defineChild, defineElement, filterObjectEmptyAttr, getObjectValueByPath } from '../../core'
import {
  Run,
} from '../Drawing'
import { _SlideElement } from './_SlideElement'

export interface ShapeJSON {
  type: 'shape'
  name?: string
  placeholderShape?: PlaceholderShapeJSON
  geometry?: PresetGeometryJSON | CustomGeometryJSON
  background?: BlipFillJSON
  content?: ParagraphContent[]
  style: {
    visibility?: 'hidden'
    left?: number
    top?: number
    width?: number
    height?: number
    rotate?: number
    scaleX?: number
    scaleY?: number
    shadow?: string
    backgroundColor?: string
    borderColor?: string
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
  }
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

    const style: ShapeJSON['style'] = {
      visibility: inherited('nvSpPr.cNvPr.visibility'),
      left: inherited('spPr.xfrm.off.x'),
      top: inherited('spPr.xfrm.off.y'),
      width: inherited('spPr.xfrm.ext.cx'),
      height: inherited('spPr.xfrm.ext.cy'),
      rotate: inherited('spPr.xfrm.rot'),
      scaleX: inherited('spPr.xfrm.scaleX'),
      scaleY: inherited('spPr.xfrm.scaleY'),
      shadow: inherited('spPr.effectLst.shadow'),
      paddingLeft: inherited('txBody.bodyPr.lIns'),
      paddingTop: inherited('txBody.bodyPr.tIns'),
      paddingRight: inherited('txBody.bodyPr.rIns'),
      paddingBottom: inherited('txBody.bodyPr.bIns'),
      textRotate: inherited('txBody.bodyPr.rot'),
      writingMode: inherited('txBody.bodyPr.writingMode'),
      textWrap: inherited('txBody.bodyPr.textWrap'),
      textAlign: inherited('txBody.bodyPr.textAlign'),
      verticalAlign: inherited('txBody.bodyPr.verticalAlign'),
      backgroundColor: undefined,
      borderWidth: undefined,
      borderColor: undefined,
    }

    const fill = inherited<Fill>('spPr.fill')?.toJSON({
      ...ctx,
      color: this.spPr?.hasFill
        ? undefined
        : this.style?.fillRef?.color,
    })

    let fillColor
    let background: BlipFillJSON | undefined
    switch (fill?.type) {
      case 'solidFill':
        fillColor = fill.color
        break
      case 'blipFill':
        background = fill
        break
    }

    const outlineFill = inherited<Fill>('spPr.ln.fill')?.toJSON({
      ...ctx,
      color: this.spPr?.ln?.hasFill
        ? undefined
        : this.style?.lnRef?.color,
    })

    let outlineColor
    switch (outlineFill?.type) {
      case 'solidFill':
        outlineColor = outlineFill.color
        break
    }

    const prstGeom = inherited<PresetGeometry>('spPr.prstGeom')
    const custGeom = inherited<CustomGeometry>('spPr.custGeom')
    let geometry
    const outlineWidth = inherited('spPr.ln.w')
    if (prstGeom?.prst === 'rect' && !prstGeom?.avLst?.value.length) {
      style.backgroundColor = fillColor
      style.borderColor = outlineColor
      style.borderWidth = outlineWidth
    }
    else {
      geometry = (prstGeom ?? custGeom)?.toJSON({
        ...ctx,
        width: style.width || outlineWidth,
        height: style.height || outlineWidth,
        fill: fillColor,
        stroke: outlineColor,
        strokeWidth: outlineWidth,
      })
    }

    return filterObjectEmptyAttr({
      type: 'shape',
      name: inherited('nvSpPr.cNvPr.name'),
      placeholderShape: ph?.toJSON(),
      geometry,
      background,
      style,
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
                const inheritedRPr = <T>(path = ''): T | undefined => {
                  return r.offsetGet(`rPr.${path}`)
                    ?? inheritedPPr(`defRPr.${path}`) as T
                }
                return {
                  fontWeight: inheritedRPr('fontWeight'),
                  fontStyle: inheritedRPr('fontStyle'),
                  fontFamily: inheritedRPr('fontFamily'),
                  textTransform: inheritedRPr('textTransform'),
                  textDecoration: inheritedRPr('textDecoration'),
                  fontSize: inheritedRPr('fontSize'),
                  letterSpacing: inheritedRPr('letterSpacing'),
                  lineHeight: inheritedRPr('lineHeight'),
                  color: inheritedRPr<SolidFill>('fill')?.toJSON(ctx)?.color,
                  borderWidth: inheritedRPr('ln.w'),
                  borderColor: inheritedRPr<SolidFill>('ln.fill')?.toJSON(ctx)?.color,
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
