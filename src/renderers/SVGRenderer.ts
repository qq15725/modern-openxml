import type { OXML } from '../core'
import type { PPTX } from '../extensions'
import type { XMLNode } from './XMLGen'
import { Text } from 'modern-text'
import { Run } from '../OpenXml/Drawing'
import { GroupShape, Picture, Shape } from '../OpenXml/Presentation'
import { parseDomFromString } from '../utils'
import { XMLGen } from './XMLGen'

export class SVGRenderer {
  render(pptx: PPTX): HTMLElement {
    const { width, height, slides } = pptx

    const viewBoxHeight = height * slides.length

    const svgNode = {
      tag: 'svg',
      attrs: {
        xmlns: 'http://www.w3.org/2000/svg',
        width,
        height: viewBoxHeight,
        viewBox: `0 0 ${width} ${viewBoxHeight}`,
      },
      children: slides.map((slide, slideIndex) => {
        const { elements, style: slideStyle } = slide
        const { backgroundColor } = slideStyle

        function parseElement(element: OXML): XMLNode {
          if (element instanceof Shape) {
            const { name, paragraphs, style } = element
            let dy = 0

            const measured = new Text({
              style: style.toJSON(),
              content: paragraphs?.map((p) => {
                return {
                  ...p.style.toJSON(),
                  fragments: p.children
                    .map((f) => {
                      if (f instanceof Run) {
                        return {
                          ...f.style.toJSON(),
                          content: f.content,
                        }
                      }
                      return undefined
                    })
                    .filter(Boolean),
                }
              }),
            }).measure()

            return {
              tag: 'g',
              attrs: {
                title: name,
                transform: `translate(${style.left}, ${style.top})`,
              },
              children: [
                {
                  tag: 'rect',
                  attrs: {
                    x: 0,
                    y: 0,
                    width: style.width,
                    height: style.height,
                    fill: 'none',
                    stroke: 'red',
                  },
                },
                ...measured.paragraphs.map((paragraph) => {
                  let maxLineHeight = 0
                  const { computedStyle: pStyle } = paragraph
                  const res = {
                    tag: 'g',
                    attrs: {
                      transform: `translate(${pStyle.marginLeft ?? 0}, ${pStyle.marginRight ?? 0})`,
                    },
                    children: paragraph.fragments
                      .map((f) => {
                        const { computedStyle: rStyle, inlineBox } = f
                        const fontSize = rStyle.fontSize ?? 12
                        const lineHeight = rStyle.lineHeight ?? pStyle.lineHeight ?? 1
                        maxLineHeight = Math.max(maxLineHeight, fontSize * lineHeight)
                        return {
                          tag: 'text',
                          attrs: {
                            // 'x': inlineBox.left,
                            // 'y': inlineBox.top,
                            'fill': rStyle.color,
                            'font-size': rStyle.fontSize,
                            'font-family': rStyle.fontFamily,
                            'letter-spacing': rStyle.letterSpacing,
                            'font-weight': rStyle.fontWeight,
                            'font-style': rStyle.fontStyle,
                            'text-transform': rStyle.textTransform,
                            'text-decoration': rStyle.textDecoration,
                            'style': {
                              'text-indent': pStyle.textIndent,
                            },
                          },
                          children: f.characters.map((c) => {
                            const { inlineBox, content } = c
                            return {
                              tag: 'tspan',
                              attrs: {
                                'dominant-baseline': 'middle',
                                'x': inlineBox.left,
                                'y': inlineBox.top + inlineBox.height / 2,
                              },
                              children: [content],
                            }
                          }),
                        }
                      }),
                  }

                  res.children.push({
                    tag: 'rect',
                    attrs: {
                      x: paragraph.lineBox.left,
                      y: paragraph.lineBox.top,
                      width: paragraph.lineBox.width,
                      height: paragraph.lineBox.height,
                      fill: 'none',
                      stroke: '#00FF00',
                    },
                  })

                  dy += maxLineHeight
                  return res
                }),
              ],
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
            const { name, elements } = element
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
    }

    const svgString = XMLGen.node(svgNode)

    return parseDomFromString(svgString)
  }
}
