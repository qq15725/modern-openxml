import type { ParagraphContent } from 'modern-text'
import type { GeometryPath, ParagraphProperties } from '../Drawing'
import type { SlideElementContext } from './_SlideElement'
import type { NonVisualShapeProperties } from './NonVisualShapeProperties'
import type { PlaceholderShape } from './PlaceholderShape'
import type { ShapeProperties } from './ShapeProperties'
import type { ShapeStyle } from './ShapeStyle'
import type { TextBody } from './TextBody'
import { defineChild, defineElement, defineProperty, filterObjectEmptyAttr } from '../../core'
import { getObjectValueByPath } from '../../core/utils'
import { _FillStyle, Run } from '../Drawing'
import { _SlideElement } from './_SlideElement'

export interface ShapeJSON {
  type: 'shape'
  name?: string
  geometry?: GeometryPath[]
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
  @defineChild('p:nvSpPr') declare nvSpPr?: NonVisualShapeProperties
  @defineChild('p:spPr') declare spPr: ShapeProperties
  @defineChild('p:txBody') declare txBody?: TextBody
  @defineChild('p:style') declare style?: ShapeStyle

  @defineProperty('nvSpPr.nvPr.ph') declare placeholder?: PlaceholderShape

  override toJSON(ctx: SlideElementContext = {}): ShapeJSON {
    const { theme, layout, presentation, master } = ctx

    // ph
    let _ph: Shape | undefined
    const ph = this.nvSpPr?.nvPr.ph
    if (ph) {
      _ph = (layout?.findPh(ph) ?? master?.findPh(ph)) as Shape | undefined
    }

    // style
    const _style = this.style?.parse(ctx)

    const inherited = (path: string): any => {
      return this.offsetGet(path)
        ?? getObjectValueByPath(_style, path.replace('spPr.', ''))
        ?? _ph?.offsetGet(path)
    }

    const width = inherited('spPr.xfrm.ext.cx')
    const height = inherited('spPr.xfrm.ext.cy')
    const background = _FillStyle.parseFill(inherited('spPr.fill'), theme)
    const border = _FillStyle.parseFill(inherited('spPr.ln.fill'), theme)

    return filterObjectEmptyAttr({
      type: 'shape',
      name: inherited('nvSpPr.cNvPr.name'),
      // TODO prstGeom
      geometry: inherited('spPr.custGeom')?.getPaths(
        width ?? 0,
        height ?? 0,
        inherited('spPr.custGeom.pathLst'),
        inherited('spPr.custGeom.avLst'),
        inherited('spPr.custGeom.gdLst'),
      ),
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
        backgroundColor: background.color,
        backgroundImage: background.image,
        borderWidth: inherited('spPr.ln.w'),
        borderColor: border.color,
        borderImage: border.image,
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
                const inheritedRPr = (path: string): any => {
                  return r.offsetGet(`rPr.${path}`)
                    ?? inheritedPPr(`defRPr.${path}`)
                }
                const fill = _FillStyle.parseFill(inheritedRPr('fill'), theme)
                const border = _FillStyle.parseFill(inheritedRPr('ln.fill'), theme)
                return {
                  fontWeight: inheritedRPr('fontWeight'),
                  fontStyle: inheritedRPr('fontStyle'),
                  fontFamily: inheritedRPr('fontFamily'),
                  textTransform: inheritedRPr('textTransform'),
                  textDecoration: inheritedRPr('textDecoration'),
                  fontSize: inheritedRPr('fontSize'),
                  letterSpacing: inheritedRPr('letterSpacing'),
                  lineHeight: inheritedRPr('lineHeight'),
                  color: fill.color,
                  borderWidth: inheritedRPr('ln.w'),
                  borderColor: border.color,
                  borderImage: border.image,
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
