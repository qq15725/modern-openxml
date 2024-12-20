import type { PPTX } from '../extensions'
import type {
  GroupShapeJSON,
  SlideElementJSON,
} from '../OpenXml/Presentation'
import type { XMLNode } from './XMLGen'
import { pathCommandsToPathData } from 'modern-path2d'
import { measureText } from 'modern-text'
import { OOXMLValue } from '../core'
import { parseDomFromString } from '../utils'
import { XMLGen } from './XMLGen'

export interface ParseElementContext {
  read: (rid: string) => any
  parent?: GroupShapeJSON
}

function parseElement(
  element: SlideElementJSON,
  ctx: ParseElementContext,
): XMLNode | undefined {
  const { parent, read } = ctx

  const {
    name = '',
    style,
  } = element

  let {
    scaleX = 1,
    scaleY = 1,
    left = 0,
    top = 0,
    width = 0,
    height = 0,
    rotate = 0,
    visibility,
    backgroundColor,
  } = style as Record<string, any>

  if (parent) {
    const {
      childOffsetLeft = 0,
      childOffsetTop = 0,
    } = parent

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
      visibility,
    },
    children: [],
  }

  if (backgroundColor) {
    elementG.children!.push({
      tag: 'rect',
      attrs: {
        width,
        height,
        fill: backgroundColor,
      },
    })
  }

  if (element.type === 'shape') {
    const { content, style, geometry } = element

    const measured = measureText({
      style: {
        paddingLeft: 0.25 * OOXMLValue.DPI / 2.54,
        paddingRight: 0.25 * OOXMLValue.DPI / 2.54,
        paddingTop: 0.13 * OOXMLValue.DPI / 2.54,
        paddingBottom: 0.13 * OOXMLValue.DPI / 2.54,
        ...style,
      },
      content,
    })

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

    if (geometry) {
      elementG.children!.push(
        ...geometry.paths.map((path) => {
          return {
            tag: 'path',
            attrs: {
              fill: path.fill,
              stroke: path.stroke,
              d: pathCommandsToPathData(path.commands),
            },
          }
        }),
      )
    }
  }
  else if (element.type === 'picture') {
    const { style, image } = element
    elementG.children!.push({
      tag: 'image',
      attrs: {
        width: style.width,
        height: style.height,
        href: read(image.src),
        opacity: image.opacity,
        preserveAspectRatio: 'none',
      },
    })
  }
  else if (element.type === 'groupShape') {
    elementG.children!.push(
      ...element.elements.map((child) => {
        return parseElement(child, {
          ...ctx,
          parent: element,
        })
      }),
    )
  }
  else if (element.type === 'graphicFrame') {
    // TODO
  }
  else if (element.type === 'connectionShape') {
    const { geometry } = element

    if (geometry) {
      elementG.children!.push(
        ...geometry.paths.map((path) => {
          return {
            tag: 'path',
            attrs: {
              'fill': path.fill,
              'stroke': path.stroke,
              'stroke-width': path.strokeWidth,
              'd': pathCommandsToPathData(path.commands),
            },
          }
        }),
      )
    }
  }

  return elementG
}

export class SVGRenderer {
  render(pptx: PPTX): HTMLElement {
    const {
      width,
      height,
      slides,
      slideMasters,
      slideLayouts,
      themes,
      presentation,
      presetShapeDefinitions,
    } = pptx

    const viewBoxHeight = height * slides.length

    const svgNode = {
      tag: 'svg',
      attrs: {
        xmlns: 'http://www.w3.org/2000/svg',
        width,
        height: viewBoxHeight,
        viewBox: `0 0 ${width} ${viewBoxHeight}`,
      },
      children: slides.flatMap((slide, slideIndex) => {
        const top = height * slideIndex
        const layout = slideLayouts[slide.layoutIndex]
        const master = slideMasters[layout?.masterIndex]
        const theme = themes[master?.themeIndex]
        const items: XMLNode[] = []
        const { elements, style: slideStyle } = slide.toJSON({
          theme,
          layout,
          master,
          presentation,
          presetShapeDefinitions,
        })
        const { backgroundColor } = slideStyle

        if (master) {
          items.push({
            tag: 'g',
            attrs: {
              path: master.path,
              title: master.name,
              transform: `translate(0, ${top})`,
            },
            children: [
              ...master.toJSON({
                theme,
                presetShapeDefinitions,
              })
                .elements
                .map((child) => {
                  return parseElement(
                    child,
                    {
                      read: rId => pptx.readRid(rId, 'master', layout.masterIndex),
                    },
                  )
                }),
            ],
          })
        }

        if (layout) {
          items.push({
            tag: 'g',
            attrs: {
              path: layout.path,
              title: layout.name,
              transform: `translate(0, ${top})`,
            },
            children: [
              ...layout.toJSON({
                master,
                theme,
                presetShapeDefinitions,
              })
                .elements
                .map((child) => {
                  return parseElement(
                    child,
                    {
                      read: rId => pptx.readRid(rId, 'layout', slide.layoutIndex),
                    },
                  )
                }),
            ],
          })
        }

        items.push({
          tag: 'g',
          attrs: {
            path: slide.path,
            title: slide.name,
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
            ...elements
              .map((child) => {
                return parseElement(
                  child,
                  {
                    read: rId => pptx.readRid(rId, 'slide', slideIndex),
                  },
                )
              }),
          ],
        })

        return items
      }),
    }

    const svgString = XMLGen.node(svgNode)

    return parseDomFromString(svgString)
  }
}
