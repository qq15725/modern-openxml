import type { PPTXDeclaration, SlideElement } from '../ooxml'
import type { XMLNode } from '../renderers'
import { measureText } from 'modern-text'
import { OOXMLValue } from '../ooxml'
import { XMLRenderer } from '../renderers'

export interface ParseSlideElementContext {
  parent?: SlideElement
}

export class IDocToSVGStringConverter {
  xmlRenderer = new XMLRenderer()

  parseSlideElement(element: SlideElement, ctx: ParseSlideElementContext = {}): XMLNode {
    const { parent } = ctx

    const {
      name = '',
      style = {},
      background,
      foreground,
      // video,
      text,
      geometry,
      // fill,
      // stroke,
      // meta,
      children,
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
      left -= Number(parent.style?.left ?? 0)
      top -= Number(parent.style?.top ?? 0)
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

    if (background) {
      elementG.children!.push({
        tag: 'image',
        attrs: {
          width,
          height,
          href: background.src,
          opacity: background.opacity,
          preserveAspectRatio: 'none',
        },
      })
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

    if (geometry?.paths) {
      elementG.children!.push(
        ...geometry.paths.map((path) => {
          return {
            tag: 'path',
            attrs: {
              'fill': path.fill,
              'stroke': path.stroke,
              'stroke-width': path.strokeWidth,
              'd': path.data,
            },
          }
        }),
      )
    }

    if (foreground) {
      elementG.children!.push({
        tag: 'image',
        attrs: {
          width,
          height,
          href: foreground.src,
          opacity: foreground.opacity,
          preserveAspectRatio: 'none',
        },
      })
    }

    if (text) {
      const measured = measureText({
        ...text,
        style: {
          paddingLeft: 0.25 * OOXMLValue.DPI / 2.54,
          paddingRight: 0.25 * OOXMLValue.DPI / 2.54,
          paddingTop: 0.13 * OOXMLValue.DPI / 2.54,
          paddingBottom: 0.13 * OOXMLValue.DPI / 2.54,
          ...style,
        },
      } as any)

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

    if (children) {
      elementG.children!.push(
        ...children.map((child) => {
          return this.parseSlideElement(child as any, {
            ...ctx,
            parent: element as any,
          })
        }),
      )
    }

    return elementG
  }

  parse(pptx: PPTXDeclaration): XMLNode {
    const {
      width,
      height,
    } = pptx.style

    const slides = pptx.children

    const {
      slideMasters,
      slideLayouts,
    } = pptx.meta

    const viewBoxHeight = height * slides.length

    return {
      tag: 'svg',
      attrs: {
        xmlns: 'http://www.w3.org/2000/svg',
        width,
        height: viewBoxHeight,
        viewBox: `0 0 ${width} ${viewBoxHeight}`,
      },
      children: slides.flatMap((slide, slideIndex) => {
        const top = height * slideIndex
        const layout = slideLayouts.find(v => v.meta.id === slide.meta.layoutId)
        const master = slideMasters.find(v => v.meta.id === layout?.meta.masterId)
        const items: XMLNode[] = []
        const {
          children = [],
          fill,
        } = slide

        if (master) {
          items.push({
            tag: 'g',
            attrs: {
              path: master.meta.id,
              title: master.name,
              transform: `translate(0, ${top})`,
            },
            children: [
              master
                .children
                .map(child => this.parseSlideElement(child)),
            ].filter(Boolean) as any[],
          })
        }

        if (layout) {
          items.push({
            tag: 'g',
            attrs: {
              path: layout.meta.id,
              title: layout.name,
              transform: `translate(0, ${top})`,
            },
            children: [
              layout
                .children
                .map(child => this.parseSlideElement(child)),
            ].filter(Boolean) as any[],
          })
        }

        items.push({
          tag: 'g',
          attrs: {
            path: slide.meta.id,
            title: slide.name,
            transform: `translate(0, ${top})`,
          },
          children: [
            (fill as any)?.color && {
              tag: 'rect',
              attrs: {
                x: 0,
                y: 0,
                width,
                height,
                fill: (fill as any).color,
              },
            },
            ...children
              .map(child => this.parseSlideElement(child as any)),
          ],
        })

        return items
      }),
    }
  }

  convertSlideElement(element: SlideElement, ctx: ParseSlideElementContext = {}): string {
    return this.xmlRenderer.render({
      tag: 'svg',
      attrs: {
        xmlns: 'http://www.w3.org/2000/svg',
        width: element.style.width,
        height: element.style.height,
        viewBox: `0 0 ${element.style.width} ${element.style.height}`,
      },
      children: [
        this.parseSlideElement(element, ctx),
      ],
    })
  }

  convert(pptx: PPTXDeclaration): string {
    return this.xmlRenderer.render(
      this.parse(pptx),
    )
  }
}
