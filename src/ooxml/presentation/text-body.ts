import type {
  SolidFillDeclaration,
  StyleDeclaration,
  TextAlign,
  TextDeclaration,
  TextDecoration,
  TextTransform,
  TextWrap,
  VerticalAlign,
  WritingMode,
} from 'modern-idoc'
import type { OOXMLNode, OOXMLQueryType } from '../core'
import { OOXMLValue } from '../core'
import { fillXPath, parseFill, parseOutline, stringifyColor } from '../drawing'
import { Alignment, withAttr, withAttrs, withIndents } from '../utils'

export interface TextBody {
  style: Partial<StyleDeclaration>
  text?: TextDeclaration
}

const characterEntities = Object.entries({
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  '\'': '&apos;',
  // '‚': '&sbquo;',
  // '„': '&bdquo;',
  // '…': '&hellip;',
  // '‰': '&permil;',
  // ˆ: '&circ;',
  // '￠': '&cent;',
  // '£': '&pound;',
  // '¥': '&yen;',
  // '€': '&euro;',
  // '§': '&sect;',
  // '©': '&copy;',
  // '®': '&reg;',
  // '™': '&trade;',
  // '×': '&times;',
  // '÷': '&divide;',
  // ƒ: '&fnof;',
})

// p:txBody
export function parseTextBody(txBody?: OOXMLNode, ctx?: Record<string, any>): TextBody {
  const theme = ctx?.theme
  const master = ctx?.master
  const presentation = ctx?.presentation
  const placeholder = ctx?.placeholder
  const query = ctx?.query

  return {
    style: {
      paddingLeft: query('a:bodyPr/@lIns', 'ST_Coordinate32'),
      paddingTop: query('a:bodyPr/@tIns', 'ST_Coordinate32'),
      paddingRight: query('a:bodyPr/@rIns', 'ST_Coordinate32'),
      paddingBottom: query('a:bodyPr/@bIns', 'ST_Coordinate32'),
      // textRotate: query('a:bodyPr/@rot', 'ST_Angle'),
      writingMode: toWritingMode(
        query('a:bodyPr/@vert', 'string'),
        query('a:bodyPr/@upright', 'boolean'),
      ),
      textWrap: toTextWrap(query('a:bodyPr/@wrap', 'string')),
      textAlign: query('a:bodyPr/anchorCtr', 'boolean') ? 'center' : 'left',
      verticalAlign: toVerticalAlign(query('a:bodyPr/@anchor', 'string')),
    },
    text: {
      content: txBody?.get('.//a:p').map((p) => {
        const lvl = p.attr<number>('a:pPr/@lvl', 'number') ?? 0
        const lvKey = `a:lvl${lvl + 1}pPr`
        const pPrList = [
          () => p.find('a:pPr'),
          () => p.find('../a:lstStyle/a:defPPr'),
          () => p.find(`../a:lstStyle/${lvKey}`),
          () => placeholder?.node?.find('p:txBody/a:lstStyle/a:defPPr'),
          () => placeholder?.node?.find(`p:txBody/a:lstStyle/${lvKey}`),
          () => placeholder && master?.node?.find(`p:txStyles/p:${placeholder.type}Style/${lvKey}`),
          () => master?.node?.find(`p:txStyles/otherStyle/${lvKey}`),
          () => theme?.node?.find(`p:objectDefaults/a:spDef/a:lstStyle/${lvKey}`),
          () => theme?.node?.find(`p:objectDefaults/a:lnDef/a:lstStyle/${lvKey}`),
          () => theme?.node?.find(`p:objectDefaults/a:txDef/a:lstStyle/${lvKey}`),
          () => presentation?.node?.find(`p:defaultTextStyle/${lvKey}`),
          () => presentation?.node?.find(`p:defaultTextStyle/a:defPPr`),
          () => presentation?.node?.find(`p:defaultTextStyle/a:lvl1pPr`),
        ]

        const queryPPr = (path: string, type?: string): any => {
          return pPrList.reduce((res, pPr) => res ?? pPr()?.query(path, type), undefined)
        }

        return {
          marginLeft: queryPPr('@marL', 'emu'),
          marginRight: queryPPr('@marR', 'emu'),
          textIndent: queryPPr('@indent', 'emu'),
          lineHeight: queryPPr('a:lnSpc/a:spcPct/@val', 'ST_TextSpacingPercentOrPercentString'),
          textAlign: toTextAlign(queryPPr('@algn', 'string')),
          fragments: p.get('*').map((r) => {
            if (r.name === 'a:r') {
              const queryRPr = <T>(path: string, type?: OOXMLQueryType): T | undefined => {
                return (
                  r.query(`a:rPr/${path}`, type)
                  ?? queryPPr(`a:defRPr/${path}`, type)
                ) as T
              }
              const fill = parseFill(queryRPr(fillXPath), ctx) as SolidFillDeclaration | undefined
              const outline = parseOutline(queryRPr('a:ln'), ctx)

              let fontFamily = queryRPr<string>('*[self::a:cs or self::a:ea or self::a:latin or self::a:sym]/@typeface', 'StringValue')
              if (fontFamily) {
                const fontScheme = ctx?.theme?.fontScheme
                let type: string | undefined
                if (fontFamily.startsWith('+mn-')) {
                  type = 'minor'
                }
                else if (fontFamily.startsWith('+mj-')) {
                  type = 'major'
                }
                if (fontScheme && type) {
                  switch (fontFamily.substring(4)) {
                    case 'lt':
                      fontFamily = fontScheme[type]?.latin
                      break
                    case 'ea':
                      fontFamily = fontScheme[type]?.eastasian
                      break
                    case 'cs':
                      fontFamily = fontScheme[type]?.complexScript
                      break
                  }
                }
              }

              return {
                fontWeight: queryRPr('@b', 'boolean') ? 700 : undefined,
                fontStyle: queryRPr('@i', 'boolean') ? 'italic' : undefined,
                fontFamily,
                textTransform: toTextTransform(queryRPr('@cap', 'string')),
                textDecoration: toTextDecoration(queryRPr('@u', 'string')),
                fontSize: queryRPr('@sz', 'fontSize'),
                letterSpacing: queryRPr('@spc', 'fontSize'),
                lineHeight: queryRPr('a:lnSpc/a:spcPct/@val', 'ST_TextSpacingPercentOrPercentString'),
                color: fill?.color,
                outline,
                content: r.attr('a:t/text()', 'string')!,
              }
            }
            return {
              content: '',
            }
          }),
        }
      }) ?? [],
    },
  }
}

export function stringifyTextBody(txBody?: TextBody): string | undefined {
  if (!txBody)
    return undefined

  const { text, style } = txBody

  const hasP = !!text?.content.length
  const pList = text?.content.map((p: any) => {
    const rList = p.runs.map((r: any) => {
      const { fontLatin, fontEastasian, fontSymbol, fontComplexScript } = r
      const isUserFont = (name?: string): name is string => !!name && !name.startsWith('+')
      const fixTypeface = (name: string): string => name.replace(/"/g, '')
      const rPr = `<a:rPr${withAttrs([
        withAttr('b', OOXMLValue.encode(r.bold, 'boolean')),
        withAttr('i', OOXMLValue.encode(r.italic, 'boolean')),
        withAttr('u', r.underline ? 'sng' : 'none'),
        withAttr('sz', OOXMLValue.encode(r.fontSize, 'fontSize')),
        withAttr('indent', OOXMLValue.encode(r.textIndent, 'emu')),
        withAttr('spc', OOXMLValue.encode(r.letterSpacing, 'fontSize')),
      ])}>
  ${withIndents([
    stringifyColor(String(r.color)),
    isUserFont(fontLatin) && `<a:latin typeface="${fixTypeface(fontLatin)}" />`,
    isUserFont(fontEastasian) && `<a:ea typeface="${fixTypeface(fontEastasian)}" />`,
    isUserFont(fontSymbol) && `<a:sym typeface="${fixTypeface(fontSymbol)}" />`,
    isUserFont(fontComplexScript) && `<a:cs typeface="${fixTypeface(fontComplexScript)}" />`,
  ], 2)}
</a:rPr>`

      const text = characterEntities.reduce(
        (text, [char, entity]) => text.replace(new RegExp(char, 'g'), entity),
        r.text ?? '',
      )

      return r.isBreak
        ? '<a:br/>'
        : `<a:r>
  ${withIndents(rPr)}
  <a:t>${text}</a:t>
</a:r>`
    })

    const children: string[] = []

    if ((p as any).lineHeight) {
      children.push(`<a:lnSpc>
  <a:spcPct val="${OOXMLValue.encode((p as any).lineHeight, 'ST_TextSpacingPercentOrPercentString')}" />
</a:lnSpc>`)
    }

    const pPrAttrs = [
      withAttr('marL', OOXMLValue.encode(p.marginLeft, 'emu')),
      withAttr('marR', OOXMLValue.encode(p.marginRight, 'emu')),
      // withAttr('indent', Pixel.encode(p.textIndent)),
      withAttr('algn', Alignment.encode(p.textAlign)),
      withAttr('fontAlgn', p.fontAlign),
      withAttr('rtl', p.rightToLeft),
    ]

    const pPr = children.length
      ? `<a:pPr${withAttrs(pPrAttrs)}>
  ${withIndents(children)}
</a:pPr>`
      : `<a:pPr${withAttrs(pPrAttrs)}/>`

    return `<a:p>
  ${withIndents(pPr)}
  ${withIndents(rList)}
  <a:endParaRPr lang="zh-CN" altLang="en-US"/>
</a:p>`
  }) || []

  const bodyPr = `<a:bodyPr${withAttrs([
    withAttr('anchor', style.verticalAlign),
    withAttr('anchorCtr', OOXMLValue.encode(style.textAlign === 'center', 'boolean')),
    // withAttr('spcFirstLastPara', OOXMLValue.encode(style.useParagraphSpacing, 'boolean')),
    withAttr('lIns', OOXMLValue.encode(style?.paddingLeft, 'ST_Coordinate32')),
    withAttr('tIns', OOXMLValue.encode(style?.paddingTop, 'ST_Coordinate32')),
    withAttr('rIns', OOXMLValue.encode(style?.paddingRight, 'ST_Coordinate32')),
    withAttr('bIns', OOXMLValue.encode(style?.paddingBottom, 'ST_Coordinate32')),
    // withAttr('rot', OOXMLValue.encode(style.textRotation, 'degree')),
    style.textWrap === 'nowrap' && withAttr('wrap', 'none'),
    style.writingMode?.startsWith('vertical') && withAttr('upright', '1'),
    style.writingMode?.startsWith('vertical') && withAttr('vert', 'vert'),
  ])}>
  <a:noAutofit/>
</a:bodyPr>`

  return `<p:txBody>
    ${withIndents(bodyPr, 2)}
    <a:lstStyle/>
    ${withIndents(hasP ? pList : '<a:p><a:endParaRPr/></a:p>', 2)}
  </p:txBody>`
}

function toWritingMode(vert?: string, upright?: boolean): WritingMode | undefined {
  switch (vert) {
    case 'eaVert':
    case 'mongolianVert':
    case 'vert':
    case 'vert270':
    case 'wordArtVertRtl':
    case 'wordArtVert':
      return 'vertical-rl'
    case 'horz':
      return 'horizontal-tb'
  }

  switch (upright) {
    case true:
      return 'vertical-rl'
    case false:
      return 'horizontal-tb'
  }
}

function toTextWrap(wrap?: string): TextWrap | undefined {
  switch (wrap) {
    case 'none':
      return 'nowrap'
    case 'square':
      return 'wrap'
    default:
      return undefined
  }
}

function toTextDecoration(u?: string): TextDecoration | undefined {
  if (u && u !== 'none') {
    return 'underline'
  }
  else {
    return undefined
  }
}

function toTextTransform(cap?: string): TextTransform | undefined {
  switch (cap) {
    case 'all':
      return 'uppercase'
    case 'small':
      return 'lowercase'
    case 'none':
    default:
      return undefined
  }
}

function toTextAlign(algn?: string): TextAlign | undefined {
  switch (algn) {
    case 'l':
      return 'left'
    case 'r':
      return 'right'
    case 'ctr':
      return 'center'
    case 'dist':
    case 'thaiDist':
    case 'just':
    case 'justLow':
      return 'center' // TODO justify
    default:
      return undefined
  }
}

function toVerticalAlign(anchor?: string): VerticalAlign | undefined {
  switch (anchor) {
    case 't':
      return 'top'
    case 'b':
      return 'bottom'
    case 'ctr':
      return 'middle'
    default:
      return undefined
  }
}
