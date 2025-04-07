import type { OOXMLNode } from '../core'
import type { SlideMaster } from '../presentation'
import type { Theme } from './theme'
import { OOXMLValue } from '../core'
import { withAttr, withAttrs, withIndents } from '../utils'

interface SysColors {
  [key: string]: string
}

const presetColorMap: Map<string, string> = new Map([
  ['aliceBlue', '#F0F8FF'],
  ['antiqueWhite', '#FAEBD7'],
  ['aqua', '#00FFFF'],
  ['aquamarine', '#7FFFD4'],
  ['azure', '#F0FFFF'],
  ['beige', '#F5F5DC'],
  ['bisque', '#FFE4C4'],
  ['black', '#000000'],
  ['blanchedAlmond', '#FFEBCD'],
  ['blue', '#0000FF'],
  ['blueViolet', '#8A2BE2'],
  ['brown', '#A52A2A'],
  ['burlyWood', '#DEB887'],
  ['cadetBlue', '#5F9EA0'],
  ['chartreuse', '#7FFF00'],
  ['chocolate', '#D2691E'],
  ['coral', '#FF7F50'],
  ['cornflowerBlue', '#6495ED'],
  ['cornsilk', '#FFF8DC'],
  ['crimson', '#DC143C'],
  ['cyan', '#00FFFF'],
  ['darkBlue', '#00008B'],
  ['darkCyan', '#008B8B'],
  ['darkGoldenrod', '#B8860B'],
  ['darkGray', '#A9A9A9'],
  ['darkGreen', '#006400'],
  ['darkKhaki', '#BDB76B'],
  ['darkMagenta', '#8B008B'],
  ['darkOliveGreen', '#556B2F'],
  ['darkOrange', '#FF8C00'],
  ['darkOrchid', '#9932CC'],
  ['darkRed', '#8B0000'],
  ['darkSalmon', '#E9967A'],
  ['darkSeaGreen', '#8FBC8F'],
  ['darkSlateBlue', '#483D8B'],
  ['darkSlateGray', '#2F4F4F'],
  ['darkTurquoise', '#00CED1'],
  ['darkViolet', '#9400D3'],
  ['deepPink', '#FF1493'],
  ['deepSkyBlue', '#00BFFF'],
  ['dimGray', '#696969'],
  ['dodgerBlue', '#1E90FF'],
  ['firebrick', '#B22222'],
  ['floralWhite', '#FFFAF0'],
  ['forestGreen', '#228B22'],
  ['fuchsia', '#FF00FF'],
  ['gainsboro', '#DCDCDC'],
  ['ghostWhite', '#F8F8FF'],
  ['gold', '#FFD700'],
  ['goldenrod', '#DAA520'],
  ['gray', '#808080'],
  ['green', '#008000'],
  ['greenYellow', '#ADFF2F'],
  ['honeydew', '#F0FFF0'],
  ['hotPink', '#FF69B4'],
  ['indianRed', '#CD5C5C'],
  ['indigo', '#4B0082'],
  ['ivory', '#FFFFF0'],
  ['khaki', '#F0E68C'],
  ['lavender', '#E6E6FA'],
  ['lavenderBlush', '#FFF0F5'],
  ['lawnGreen', '#7CFC00'],
  ['lemonChiffon', '#FFFACD'],
  ['lightBlue', '#ADD8E6'],
  ['lightCoral', '#F08080'],
  ['lightCyan', '#E0FFFF'],
  ['lightGoldenrodYellow', '#FAFAD2'],
  ['lightGray', '#D3D3D3'],
  ['lightGreen', '#90EE90'],
  ['lightPink', '#FFB6C1'],
  ['lightSalmon', '#FFA07A'],
  ['lightSeaGreen', '#20B2AA'],
  ['lightSkyBlue', '#87CEFA'],
  ['lightSlateGray', '#778899'],
  ['lightSteelBlue', '#B0C4DE'],
  ['lightYellow', '#FFFFE0'],
  ['lime', '#00FF00'],
  ['limeGreen', '#32CD32'],
  ['linen', '#FAF0E6'],
  ['magenta', '#FF00FF'],
  ['maroon', '#800000'],
  ['mediumAquamarine', '#66CDAA'],
  ['mediumBlue', '#0000CD'],
  ['mediumOrchid', '#BA55D3'],
  ['mediumPurple', '#9370DB'],
  ['mediumSeaGreen', '#3CB371'],
  ['mediumSlateBlue', '#7B68EE'],
  ['mediumSpringGreen', '#00FA9A'],
  ['mediumTurquoise', '#48D1CC'],
  ['mediumVioletRed', '#C71585'],
  ['midnightBlue', '#191970'],
  ['mintCream', '#F5FFFA'],
  ['mistyRose', '#FFE4E1'],
  ['moccasin', '#FFE4B5'],
  ['navajoWhite', '#FFDEAD'],
  ['navy', '#000080'],
  ['oldLace', '#FDF5E6'],
  ['olive', '#808000'],
  ['oliveDrab', '#6B8E23'],
  ['orange', '#FFA500'],
  ['orangeRed', '#FF4500'],
  ['orchid', '#DA70D6'],
  ['paleGoldenrod', '#EEE8AA'],
  ['paleGreen', '#98FB98'],
  ['paleTurquoise', '#AFEEEE'],
  ['paleVioletRed', '#DB7093'],
  ['papayaWhip', '#FFEFD5'],
  ['peachPuff', '#FFDAB9'],
  ['peru', '#CD853F'],
  ['pink', '#FFC0CB'],
  ['plum', '#DDA0DD'],
  ['powderBlue', '#B0E0E6'],
  ['purple', '#800080'],
  ['red', '#FF0000'],
  ['rosyBrown', '#BC8F8F'],
  ['royalBlue', '#4169E1'],
  ['saddleBrown', '#8B4513'],
  ['salmon', '#FA8072'],
  ['sandyBrown', '#F4A460'],
  ['seaGreen', '#2E8B57'],
  ['seaShell', '#FFF5EE'],
  ['sienna', '#A0522D'],
  ['silver', '#C0C0C0'],
  ['skyBlue', '#87CEEB'],
  ['slateBlue', '#6A5ACD'],
  ['slateGray', '#708090'],
  ['snow', '#FFFAFA'],
  ['springGreen', '#00FF7F'],
  ['steelBlue', '#4682B4'],
  ['tan', '#D2B48C'],
  ['teal', '#008080'],
  ['thistle', '#D8BFD8'],
  ['tomato', '#FF6347'],
  ['turquoise', '#40E0D0'],
  ['violet', '#EE82EE'],
  ['wheat', '#F5DEB3'],
  ['white', '#FFFFFF'],
  ['whiteSmoke', '#F5F5F5'],
  ['yellow', '#FFFF00'],
  ['yellowGreen', '#9ACD32'],
])

const sysColors: SysColors = {
  windowText: '#000000',
  window: '#FFFFFF',
  menu: '#F0F0F0',
  buttonFace: '#F0F0F0',
  buttonText: '#000000',
  highlight: '#3399FF',
  highlightText: '#FFFFFF',
}

export interface RGBA {
  r: number
  g: number
  b: number
  a: number
}

export type RGB = Omit<RGBA, 'a'>

const tags = [
  'a:hslClr',
  'a:prstClr',
  'a:schemeClr',
  'a:scrgbClr',
  'a:srgbClr',
  'a:sysClr',
]

export const colorXPath = `*[(${tags.map(v => `self::${v}`).join(' or ')})]`

export function parseColor(node?: OOXMLNode, ctx?: Record<string, any>): string | undefined {
  if (node && !tags.includes(node?.name)) {
    node = node.find(colorXPath)
  }

  if (!node)
    return undefined

  switch (node.name) {
    case 'a:hslClr':
      return toHex(hslToRgb(
        node.attr<number>('@hue', 'ST_PositiveFixedAngle')!,
        node.attr<number>('@sat', 'ST_Percentage')!,
        node.attr<number>('@lum', 'ST_Percentage')!,
      ))
    case 'a:prstClr': {
      const val = node.attr('@val')!
      return toHex(presetColorMap.get(val) ?? val)
    }
    case 'a:schemeClr': {
      const master = ctx?.master as SlideMaster | undefined
      const theme = ctx?.theme as Theme | undefined
      let key = node.attr('@val')!
      key = master?.meta?.colorMap?.[key] ?? key
      let colorScheme = theme?.colorScheme?.[key]
      if (!colorScheme) {
        key = theme?.extraColorMap?.[key] ?? key
        colorScheme = theme?.extraColorScheme?.[key]
      }
      return toHex(colorScheme ?? '#000000')
    }
    case 'a:scrgbClr':
      return toHex({
        r: node.attr<number>('@r', 'ST_Percentage')!,
        g: node.attr<number>('@g', 'ST_Percentage')!,
        b: node.attr<number>('@b', 'ST_Percentage')!,
      })
    case 'a:srgbClr':
      return toHex(node.attr('@val')!)
    case 'a:sysClr':
      return toHex(sysColors[node.attr('@val')!] ?? '#000000')
  }
}

export function stringifyColor(color?: string): string {
  if (!color)
    return ''

  if (color.startsWith('linear-gradient')) {
    const str = color.match(/linear-gradient\((.+)\)$/)?.[1] ?? ''
    const first = str.split(',')[0]
    const deg = first.includes('deg') ? first : '0deg'
    let degree = Number(deg.replace('deg', ''))
    degree = degree ? (degree + 270) % 360 : degree
    const ang = OOXMLValue.encode(degree, 'positiveFixedAngle')
    const matched = str
      .replace(deg, '')
      .matchAll(/(#|rgba|rgb)(.+?) ([\d.]+%)/gi)
    const gs = Array.from(matched).map((res) => {
      let color = res[2]
      if (color.startsWith('(')) {
        color = color.split(',').length > 3 ? `rgba${color}` : `rgb${color}`
      }
      else {
        color = `#${color}`
      }
      return `<a:gs pos="${Number(res[3]?.replace('%', '') ?? 0) * 1000}">
    ${withIndents(_stringifyColor(color))}
</a:gs>`
    })
    return `<a:gradFill>
  <a:gsLst>
    ${withIndents(gs, 2)}
  </a:gsLst>
  <a:lin${withAttrs([withAttr('ang', ang), withAttr('scaled', 0)])}/>
</a:gradFill>`
  }

  return `<a:solidFill>
  ${withIndents(_stringifyColor(color))}
</a:solidFill>`
}

function _stringifyColor(color: string): string {
  let alpha = 100000
  if (color === 'transparent') {
    color = '#0000'
  }
  if (color.startsWith('#')) {
    color = color.substring(1)
    if (color.length === 3 || color.length === 4) {
      color = color
        .split('')
        .map(v => v + v)
        .join('')
    }
    if (color.length === 8) {
      alpha *= Number(`0x${color.substring(6, 8)}`) / 255
      color = color.substring(0, 6)
    }
  }
  else if (color.startsWith('rgba')) {
    const rgba = color
      .match(/rgba\((.+)\)/)?.[1]
      ?.split(',')
      .map(v => Number(v.trim()))
    if (rgba) {
      color = rgbToHex(rgba[0], rgba[1], rgba[2])
      if (rgba[3] > 1) {
        rgba[3] /= 255
      }
      alpha = rgba[3] * 100000
    }
  }
  else if (color.startsWith('rgb')) {
    const rgb = color
      .match(/rgb\((.+)\)/)?.[1]
      ?.split(',')
      .map(v => Number(v.trim()))
    if (rgb)
      color = rgbToHex(rgb[0], rgb[1], rgb[2])
  }
  return `<a:srgbClr val="${color}">
  <a:alpha val="${Math.floor(alpha)}"/>
</a:srgbClr>`
}

function toHex(value: string | RGB): string {
  if (typeof value === 'object') {
    return `#${value.r}${value.g}${value.b}`
  }
  return value.startsWith('#') ? value : `#${value}`
}

function hslToRgb(h: number, s: number, l: number): RGB {
  h = ((h % 360) + 360) % 360
  const c = (1 - Math.abs(2 * l - 1)) * s // Chroma
  const x = c * (1 - Math.abs((h / 60) % 2 - 1)) // Intermediate value
  const m = l - c / 2 // Adjustment for lightness
  let r, g, b
  if (h < 60) {
    // eslint-disable-next-line style/max-statements-per-line
    r = c; g = x; b = 0
  }
  else if (h < 120) {
    // eslint-disable-next-line style/max-statements-per-line
    r = x; g = c; b = 0
  }
  else if (h < 180) {
    // eslint-disable-next-line style/max-statements-per-line
    r = 0; g = c; b = x
  }
  else if (h < 240) {
    // eslint-disable-next-line style/max-statements-per-line
    r = 0; g = x; b = c
  }
  else if (h < 300) {
    // eslint-disable-next-line style/max-statements-per-line
    r = x; g = 0; b = c
  }
  else {
    // eslint-disable-next-line style/max-statements-per-line
    r = c; g = 0; b = x
  }
  r = Math.round((r + m) * 255)
  g = Math.round((g + m) * 255)
  b = Math.round((b + m) * 255)
  return { r, g, b }
}

export function rgbToHex(r: number, g: number, b: number): string {
  return ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)
}
