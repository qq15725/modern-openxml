import type { PPTX } from '../extensions'
import type { XMLNode } from './XMLGen'
import { measureText } from 'modern-text'
import { OXML } from '../core'
import { Run } from '../OpenXml/Drawing'
import { type ConnectionShape, type GraphicFrame, GroupShape, Picture, Shape } from '../OpenXml/Presentation'
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

        function parseElement(
          element: Shape | GroupShape | Picture | ConnectionShape | GraphicFrame,
          parent?: GroupShape,
        ): XMLNode | undefined {
          const { name = '', style = {} } = element

          let {
            scaleX = 1,
            scaleY = 1,
            left = 0,
            top = 0,
            width = 0,
            height = 0,
            rotate = 0,
          } = style

          if (parent) {
            const { childOffsetLeft = 0, childOffsetTop = 0 } = parent.style
            left -= childOffsetLeft
            top -= childOffsetTop
          }

          const transform: string[] = []

          if (left !== 0 || top !== 0) {
            transform.push(`translate(${left}, ${top})`)
          }

          if (scaleX !== 1 || scaleY !== 1 || rotate !== 0) {
            const cx = width / 2
            const cy = height / 2
            transform.push(`translate(${cx}, ${cy})`)
            if (rotate !== 0) {
              transform.push(`rotate(${rotate})`)
            }
            transform.push(`scale(${scaleX}, ${scaleY})`)
            transform.push(`translate(${-cx}, ${-cy})`)
          }

          const elementG: XMLNode = {
            tag: 'g',
            attrs: {
              title: name,
              transform: transform.join(' '),
            },
            children: [],
          }

          if (element instanceof Shape) {
            const { paragraphs, style } = element

            const options = {
              style: {
                paddingLeft: 0.25 * OXML.DPI / 2.54,
                paddingRight: 0.25 * OXML.DPI / 2.54,
                paddingTop: 0.13 * OXML.DPI / 2.54,
                paddingBottom: 0.13 * OXML.DPI / 2.54,
                ...style.toJSON(),
              },
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
            }

            const measured = measureText(options)

            elementG.children!.push(
              ...measured.paragraphs.flatMap((paragraph) => {
                const { computedStyle: pStyle } = paragraph
                return paragraph.fragments
                  .map((f) => {
                    const { computedStyle: rStyle } = f
                    return {
                      tag: 'text',
                      attrs: {
                        'fill': rStyle.color,
                        'font-size': rStyle.fontSize,
                        'font-family': rStyle.fontFamily,
                        'letter-spacing': rStyle.letterSpacing,
                        'font-weight': rStyle.fontWeight,
                        'font-style': rStyle.fontStyle,
                        'text-transform': rStyle.textTransform,
                        'text-decoration': rStyle.textDecoration,
                        'dominant-baseline': 'middle',
                        'style': {
                          'text-indent': pStyle.textIndent,
                        },
                      },
                      children: f.characters.map((c) => {
                        const { inlineBox, content } = c
                        return {
                          tag: 'tspan',
                          attrs: {
                            x: inlineBox.left,
                            y: inlineBox.top + inlineBox.height / 2,
                          },
                          children: [content],
                        }
                      }),
                    }
                  })
              }),
            )
          }
          else if (element instanceof Picture) {
            const { style, src } = element
            elementG.children!.push({
              tag: 'image',
              attrs: {
                width: style.width,
                height: style.height,
                href: pptx.readRid(src, 'slide', slideIndex),
                preserveAspectRatio: 'none',
              },
            })
          }
          else if (element instanceof GroupShape) {
            const { elements } = element

            elementG.children!.push(...elements.map(child => parseElement(child, element)))
          }

          return elementG
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
            ...elements.map(child => parseElement(child)),
          ],
        }
      }),
    }

    const svgString = XMLGen.node(svgNode)

    return parseDomFromString(svgString)
  }
}
