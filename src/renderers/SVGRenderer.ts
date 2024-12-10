import type { OXML } from '../core'
import type { PPTX } from '../extensions'
import type { XMLNode } from './XMLGen'
import { Break, Run } from '../OpenXml/Drawing'
import { GroupShape, Picture, Shape } from '../OpenXml/Presentation'
import { parseDomFromString } from '../utils'
import { XMLGen } from './XMLGen'

export class SVGRenderer {
  render(pptx: PPTX): HTMLElement {
    const { width, height, slides } = pptx

    const viewBoxHeight = height * slides.length

    const svgString = XMLGen.node({
      tag: 'svg',
      attrs: {
        xmlns: 'http://www.w3.org/2000/svg',
        width,
        height: viewBoxHeight,
        viewBox: `0 0 ${width} ${viewBoxHeight}`,
      },
      children: slides.map((slide, slideIndex) => {
        const { elements, style: slideStyle } = slide
        const { backgroundColor, backgroundImage } = slideStyle

        function parseElement(element: OXML): XMLNode {
          if (element instanceof Shape) {
            const { name, paragraphs, style } = element
            let dy = 0
            return {
              tag: 'g',
              attrs: {
                title: name,
                transform: `translate(${style.left}, ${style.top})`,
              },
              children: paragraphs?.map((paragraph) => {
                let maxLineHeight = 0
                const { style: pStyle } = paragraph
                const text = {
                  tag: 'g',
                  attrs: {
                    transform: `translate(${pStyle.marginLeft ?? 0}, ${pStyle.marginRight ?? 0})`,
                  },
                  children: [
                    {
                      tag: 'text',
                      attrs: {
                        dy,
                        style: {
                          'text-indent': pStyle.textIndent,
                        },
                      },
                      children: paragraph.children
                        .map((child) => {
                          if (child instanceof Run) {
                            const { style: rStyle, content } = child
                            const fontSize = rStyle.fontSize ?? 12
                            const lineHeight = rStyle.lineHeight ?? pStyle.lineHeight ?? 1
                            maxLineHeight = Math.max(maxLineHeight, fontSize * lineHeight)
                            return {
                              tag: 'tspan',
                              attrs: {
                                'fill': rStyle.color,
                                'font-size': rStyle.fontSize,
                                'font-family': rStyle.fontFamily,
                                'letter-spacing': rStyle.letterSpacing,
                                'font-weight': rStyle.fontWeight,
                                'font-style': rStyle.fontStyle,
                                'text-transform': rStyle.textTransform,
                                'text-decoration': rStyle.textDecoration,
                              },
                              children: [content],
                            }
                          }
                          else if (child instanceof Break) {
                            // TODO
                          }
                        }),
                    },
                  ],
                }
                dy += maxLineHeight
                return text
              }),
            }
          }
          else if (element instanceof Picture) {
            const { name, style, src } = element
            return {
              tag: 'g',
              attrs: {
                title: name,
                transform: `translate(${style.left}, ${style.top})`,
              },
              children: [
                {
                  tag: 'image',
                  attrs: {
                    width: style.width,
                    height: style.height,
                    href: pptx.readRid(src, 'slide', slideIndex),
                    preserveAspectRatio: 'none',
                  },
                },
              ],
            }
          }
          else if (element instanceof GroupShape) {
            const { name, elements, style } = element
            return {
              tag: 'g',
              attrs: {
                title: name,
              },
              children: elements.map(parseElement),
            }
          }
        }

        const top = height * slideIndex

        return {
          tag: 'g',
          attrs: {
            transform: `translate(0, ${top})`,
          },
          children: [
            backgroundColor && {
              tag: 'rect',
              attrs: {
                x: 0,
                y: 0,
                width,
                height,
                fill: backgroundColor,
              },
            },
            ...elements.map(parseElement),
          ],
        }
      }),
    })

    return parseDomFromString(svgString)
  }
}
