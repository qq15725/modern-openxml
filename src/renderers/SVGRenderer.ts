import type { PPTX } from '../extensions'
import { Break, Run } from '../OpenXml/Drawing'
import { Picture, Shape } from '../OpenXml/Presentation'
import { parseDomFromString } from '../utils'

export class XMLGen {
  static htmlEntities: Record<string, string> = {
    '<': '&lt;',
    '>': '&gt;',
    '&': '&amp;',
    '"': '&quot;',
    '\'': '&#39;',
    '`': '&#96;',
  }

  static encodeHtmlCustom(str: string): string {
    return str.replace(/[<>&"'`]/g, char => this.htmlEntities[char])
  }

  static attrs(attrs: Record<string, any>): string {
    return ` ${Object.keys(attrs).map((key) => {
      let value = attrs[key]
      if (value === undefined) {
        return undefined
      }
      else if (key === 'style') {
        value = Object.keys(value)
          .map((k) => {
            let v = value[k]
            if (v === undefined) {
              return undefined
            }
            if (typeof v === 'number') {
              v = `${v}px`
            }
            return `${k}: ${v};`
          })
          .filter(Boolean)
          .join(' ')
      }
      return `${key}="${value}"`
    }).filter(Boolean).join(' ')}`
  }

  static children(children: (Record<string, any> | string)[]): string {
    return children
      .map((child) => {
        if (typeof child === 'string') {
          return this.encodeHtmlCustom(child)
        }
        return this.node(child.tag, child.attrs ?? {}, child.children ?? [])
      })
      .join('\n')
  }

  static node(tag: string, attrs: Record<string, any> = {}, children: (Record<string, any> | string)[] = []): string {
    return `<${tag}${this.attrs(attrs)}>${this.children(children)}</${tag}>`
  }
}

export class SVGRenderer {
  render(pptx: PPTX): HTMLElement {
    const slides: any[] = []
    pptx.slides.forEach((slide, slideIndex) => {
      const elements: any[] = []
      const offsetTop = pptx.height * slideIndex
      slide.elements.forEach((element) => {
        if (element instanceof Shape) {
          const { name, paragraphs, style } = element
          const g = {
            tag: 'g',
            attrs: {
              title: name,
              transform: `translate(${style.left}, ${offsetTop + style.top})`,
            },
            children: [],
          }
          elements.push(g)

          if (paragraphs) {
            let dy = 0
            paragraphs.forEach((paragraph) => {
              const { style: pStyle } = paragraph
              const text = {
                tag: 'text',
                attrs: {
                  dy,
                  style: {
                    'margin-left': pStyle.marginLeft,
                    'margin-right': pStyle.marginRight,
                    'text-indent': pStyle.textIndent,
                    'line-height': pStyle.lineHeight,
                  },
                },
                children: [],
              }

              let fontSize = 12
              paragraph.children.forEach((child) => {
                if (child instanceof Run) {
                  const { style: rStyle, content } = child
                  fontSize = Math.max(fontSize, rStyle.fontSize ?? 0)
                  text.children.push({
                    tag: 'tspan',
                    attrs: {
                      style: {
                        'fill': rStyle.color,
                        'font-weight': rStyle.fontWeight,
                        'font-style': rStyle.fontStyle,
                        'font-family': rStyle.fontFamily,
                        'text-transform': rStyle.textTransform,
                        'text-decoration': rStyle.textDecoration,
                        'font-size': rStyle.fontSize,
                        'letter-spacing': rStyle.letterSpacing,
                      },
                    },
                    children: [content],
                  })
                }
                else if (child instanceof Break) {
                  text.children.push({
                    tag: 'tspan',
                    children: ['\n'],
                  })
                }
              })

              if (text.children.length) {
                g.children.push(text)
              }

              dy += fontSize
            })
          }
        }
        else if (element instanceof Picture) {
          const { name, style, src } = element
          const g = {
            tag: 'g',
            attrs: {
              title: name,
              transform: `translate(${style.left}, ${offsetTop + style.top})`,
            },
            children: [],
          }
          elements.push(g)
          g.children.push({
            tag: 'image',
            attrs: {
              width: style.width,
              height: style.height,
              href: pptx.readRid(src, 'slide', slideIndex),
            },
          })
        }
      })
      slides.push({
        tag: 'g',
        children: elements,
      })
    })

    // <!-- 背景 -->
    // <rect x="0" y="0" width="1920" height="1080" fill="#FFFFFF"/>
    //
    // <!-- 形状 -->
    // <g id="shapes">
    //   <rect x="100" y="100" width="400" height="300" fill="#FF5733" stroke="#000000" stroke-width="2"/>
    //   <ellipse cx="800" cy="400" rx="200" ry="100" fill="#33FF57"/>
    // </g>
    //
    // <!-- 动画 -->
    // <animateTransform attributeName="transform" type="translate" from="0,0" to="100,100" dur="2s" repeatCount="indefinite"/>

    const width = pptx.width
    const height = pptx.height * pptx.slides.length

    const svgString = XMLGen.node('svg', {
      xmlns: 'http://www.w3.org/2000/svg',
      width,
      height,
      viewBox: `0 0 ${width} ${height}`,
    }, slides)

    return parseDomFromString(svgString)
  }
}
