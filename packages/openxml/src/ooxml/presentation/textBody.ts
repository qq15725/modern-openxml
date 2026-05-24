import type {
  NormalizedColorFill,
  NormalizedFragment,
  NormalizedStyle,
  NormalizedText,
  TextAlign,
  TextDecoration,
  TextTransform,
  TextWrap,
  VerticalAlign,
  WritingMode,
} from 'modern-idoc'
import type { OoxmlNode, OOXMLQueryType } from '../core'
import { OoxmlValue } from '../core'
import { fillXPath, parseFill, parseOutline, stringifyFill, stringifyOutline } from '../drawing'
import { BiMap, escapeXml, withAttr, withAttrs, withIndents } from '../utils'

// —— 项目符号 / 列表 ↔ idoc listStyleType ——
// 解析:a:buAutoNum@type 取基础计数类型(后缀 .)/) 不在 idoc 表达,丢弃)
function autoNumToListType(type: string): string {
  if (type.startsWith('alphaUc'))
    return 'upper-alpha'
  if (type.startsWith('alphaLc'))
    return 'lower-alpha'
  if (type.startsWith('romanUc'))
    return 'upper-roman'
  if (type.startsWith('romanLc'))
    return 'lower-roman'
  return 'decimal' // arabic*, 及其它默认
}

// a:buChar@char 常见项目符号 -> idoc;其它字符原样保留(ListStyleType 允许任意字符串)
function charToListType(char: string): string {
  if (char === '◦' || char === 'o')
    return 'circle'
  if (char === '▪' || char === '§' || char === '')
    return 'square'
  if (char === '•')
    return 'disc'
  return char
}

const LIST_TYPE_TO_AUTONUM: Record<string, string> = {
  'decimal': 'arabicPeriod',
  'decimal-leading-zero': 'arabicPeriod',
  'lower-alpha': 'alphaLcPeriod',
  'upper-alpha': 'alphaUcPeriod',
  'lower-roman': 'romanLcPeriod',
  'upper-roman': 'romanUcPeriod',
}
const LIST_TYPE_TO_CHAR: Record<string, string> = {
  disc: '•',
  circle: '◦',
  square: '▪',
}

function stringifyBullet(listType: string): string {
  if (listType === 'none') {
    return '<a:buNone/>'
  }
  if (LIST_TYPE_TO_AUTONUM[listType]) {
    return `<a:buAutoNum type="${LIST_TYPE_TO_AUTONUM[listType]}"/>`
  }
  const char = LIST_TYPE_TO_CHAR[listType] ?? listType
  return `<a:buChar char="${escapeXml(char)}"/>`
}

export interface TextBody {
  style: NormalizedStyle
  text?: NormalizedText
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

const textWrapMap = new BiMap<any, TextWrap>({
  none: 'nowrap',
  square: 'wrap',
})

const textTransformMap = new BiMap<any, TextTransform>({
  all: 'uppercase',
  small: 'lowercase',
})

const textAlignMap = new BiMap<any, TextAlign>({
  l: 'left',
  r: 'right',
  justLow: 'justify',
  just: 'justify',
  dist: 'center',
  thaiDist: 'center',
  ctr: 'center',
})

const verticalAlignMap = new BiMap<any, VerticalAlign>({
  t: 'top',
  b: 'bottom',
  ctr: 'middle',
})

// p:txBody
export function parseTextBody(txBody?: OoxmlNode, ctx?: Record<string, any>): TextBody {
  const theme = ctx?.theme
  const master = ctx?.master
  const presentation = ctx?.presentation
  const placeholder = ctx?.placeholder
  const query = ctx?.query

  const content = txBody?.get('.//a:p').map((p) => {
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

    function parseStyle(r?: OoxmlNode): Record<string, any> {
      const queryRPr = <T>(path: string, type?: OOXMLQueryType): T | undefined => {
        return (
          r?.query(`a:rPr/${path}`, type)
          ?? queryPPr(`a:defRPr/${path}`, type)
        ) as T
      }
      const fill = parseFill(queryRPr(fillXPath), ctx) as NormalizedColorFill | undefined
      const outline = parseOutline(queryRPr('a:ln'), ctx)

      let fontFamily = queryRPr<string>('*[self::a:cs or self::a:ea or self::a:latin or self::a:sym]/@typeface', 'StringValue')
      if (fontFamily) {
        const fontScheme = ctx?.theme?.fontScheme
        const type = fontFamily.startsWith('+mn-')
          ? 'minor'
          : fontFamily.startsWith('+mj-')
            ? 'major'
            : undefined
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
        textTransform: textTransformMap.getValue(queryRPr('@cap', 'string')),
        textDecoration: toTextDecoration(queryRPr('@u', 'string')),
        fontSize: queryRPr('@sz', 'fontSize'),
        letterSpacing: queryRPr('@spc', 'fontSize'),
        lineHeight: queryRPr('a:lnSpc/a:spcPct/@val', 'ST_TextSpacingPercentOrPercentString'),
        color: fill?.color,
        fill: Object.keys(fill ?? {}).length ? fill : undefined,
        outline: Object.keys(outline ?? {}).length ? outline : undefined,
      }
    }

    let hasRunOrBr = false
    const fragments = p
      .get('*')
      .map((r) => {
        switch (r.name) {
          case 'a:r': {
            hasRunOrBr = true
            return {
              ...parseStyle(r),
              content: r.attr('a:t/text()', 'string')!,
            }
          }
          case 'a:br':
            hasRunOrBr = true
            return { ...parseStyle(r), content: '\n' }
          case 'a:endParaRPr':
            return hasRunOrBr
              ? undefined
              : { ...parseStyle(r), content: '\n' }
          default:
            return undefined
        }
      })
      .filter(Boolean) as NormalizedFragment[]

    // 项目符号:按继承链找到第一个定义了 buNone/buChar/buAutoNum 的 pPr(逐元素优先)
    let listStyleType: string | undefined
    for (const getPPr of pPrList) {
      const pPr = getPPr()
      if (!pPr) {
        continue
      }
      if (pPr.find('a:buNone')) {
        listStyleType = 'none'
        break
      }
      const autoNum = pPr.attr('a:buAutoNum/@type')
      if (autoNum) {
        listStyleType = autoNumToListType(autoNum)
        break
      }
      const buChar = pPr.attr('a:buChar/@char')
      if (buChar) {
        listStyleType = charToListType(buChar)
        break
      }
    }

    return {
      marginLeft: queryPPr('@marL', 'emu'),
      marginRight: queryPPr('@marR', 'emu'),
      textIndent: queryPPr('@indent', 'emu'),
      lineHeight: queryPPr('a:lnSpc/a:spcPct/@val', 'ST_TextSpacingPercentOrPercentString'),
      textAlign: textAlignMap.getValue(queryPPr('@algn', 'string')),
      listStyleType,
      fragments,
    }
  }) ?? []

  const paragraphs = content
  for (let i = 0; i < paragraphs.length; i++) {
    const paragraph = paragraphs[i]
    const fragments = paragraph.fragments
    const lastFragment = fragments.length ? fragments[fragments.length - 1] : undefined
    if (lastFragment?.content === '\n') {
      if (fragments.length > 1) {
        paragraphs.splice(i, 0, {
          ...paragraph,
          fragments: [fragments.pop()!],
        })
      }
    }
  }

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
      textWrap: textWrapMap.getValue(query('a:bodyPr/@wrap', 'string')),
      textAlign: query('a:bodyPr/anchorCtr', 'boolean') ? 'center' : 'left',
      verticalAlign: verticalAlignMap.getValue(query('a:bodyPr/@anchor', 'string')),
    },
    text: {
      enabled: true,
      content,
    },
  }
}

const isUserFont = (name?: string): name is string => !!name && !name.startsWith('+')
const fixTypeface = (name: string): string => name.replace(/"/g, '')

export function stringifyTextBody(txBody?: TextBody): string | undefined {
  if (!txBody)
    return undefined

  const {
    text,
    style = {},
  } = txBody

  const fill = text?.fill
  const outline = text?.outline
  const hasP = text?.enabled !== false && !!text?.content?.length

  const pList = text?.content?.map((p) => {
    const { fragments, fill: pFill, outline: pOutline, ...pStyle } = p
    // @ts-expect-error ignore
    const getPStyle = (key: string): any => pStyle[key] ?? style[key]

    const rList = fragments.map((f) => {
      const { content, fill: fFill, outline: fOutline, ...fStyle } = f
      // @ts-expect-error ignore
      const getFStyle = (key: string): any => fStyle[key] ?? getPStyle(key)

      const rPr = `<a:rPr${withAttrs([
        (getFStyle('fontWeight') === 700 || getFStyle('fontWeight') === 'bold') && withAttr('b', '1'),
        getFStyle('fontStyle') === 'italic' && withAttr('i', '1'),
        getFStyle('textDecoration') === 'underline' && withAttr('u', 'sng'),
        withAttr('sz', OoxmlValue.encode(getFStyle('fontSize'), 'fontSize')),
        withAttr('spc', OoxmlValue.encode(getFStyle('letterSpacing'), 'fontSize')),
      ])}>
  ${withIndents([
    stringifyFill(
      fFill ?? pFill ?? fill
      ?? (getFStyle('color') ? { color: getFStyle('color'), enabled: true } : undefined),
    ),
    stringifyOutline(fOutline ?? pOutline ?? outline),
    isUserFont(getFStyle('fontFamily')) && `<a:latin typeface="${fixTypeface(getFStyle('fontFamily'))}" />`,
    // isUserFont(fontEastasian) && `<a:ea typeface="${fixTypeface(fontEastasian)}" />`,
    // isUserFont(fontSymbol) && `<a:sym typeface="${fixTypeface(fontSymbol)}" />`,
    // isUserFont(fontComplexScript) && `<a:cs typeface="${fixTypeface(fontComplexScript)}" />`,
  ], 2)}
</a:rPr>`

      const text = characterEntities.reduce(
        (text, [char, entity]) => text.replace(new RegExp(char, 'g'), entity),
        f.content ?? '',
      )

      return f.content === '\n'
        ? '<a:br/>'
        : `<a:r>
  ${withIndents(rPr)}
  <a:t>${text}</a:t>
</a:r>`
    })

    const children: string[] = []

    if (getPStyle('lineHeight')) {
      children.push(`<a:lnSpc>
  <a:spcPct val="${OoxmlValue.encode(getPStyle('lineHeight'), 'ST_TextSpacingPercentOrPercentString')}" />
</a:lnSpc>`)
    }

    const listStyleType = getPStyle('listStyleType')
    if (listStyleType) {
      children.push(stringifyBullet(listStyleType))
    }

    const pPrAttrs = [
      !!pStyle.marginLeft && withAttr('marL', OoxmlValue.encode(pStyle.marginLeft, 'emu')),
      !!pStyle.marginRight && withAttr('marR', OoxmlValue.encode(pStyle.marginRight, 'emu')),
      !!getPStyle('textIndent') && withAttr('indent', OoxmlValue.encode(getPStyle('textIndent'), 'emu')),
      !!getPStyle('textAlign') && withAttr('algn', textAlignMap.getKey(getPStyle('textAlign'))),
      // withAttr('fontAlgn', p.fontAlign),
      // withAttr('rtl', p.rightToLeft),
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
    style.verticalAlign && withAttr('anchor', verticalAlignMap.getKey(style.verticalAlign)),
    style.textAlign === 'center' && withAttr('anchorCtr', '1'),
    // withAttr('spcFirstLastPara', OoxmlValue.encode(style.useParagraphSpacing, 'boolean')),
    style.paddingLeft !== undefined && withAttr('lIns', OoxmlValue.encode(style.paddingLeft, 'ST_Coordinate32')),
    style.paddingTop !== undefined && withAttr('tIns', OoxmlValue.encode(style.paddingTop, 'ST_Coordinate32')),
    style.paddingRight !== undefined && withAttr('rIns', OoxmlValue.encode(style.paddingRight, 'ST_Coordinate32')),
    style.paddingBottom !== undefined && withAttr('bIns', OoxmlValue.encode(style.paddingBottom, 'ST_Coordinate32')),
    // withAttr('rot', OoxmlValue.encode(style.textRotation, 'degree')),
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

function toTextDecoration(u?: string): TextDecoration | undefined {
  if (u && u !== 'none') {
    return 'underline'
  }
  else {
    return undefined
  }
}
