import type { FillDeclaration } from 'modern-idoc'
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

  protected _uuid(): number {
    return ~~(Math.random() * 1000000000)
  }

  protected _parseGeometry(el: SlideElement): XMLNode[] {
    const { style = {}, fill, outline, shadow } = el
    if (
      !fill?.color
      && !fill?.src
      && !outline?.src
      && !outline?.color
      && !shadow?.color
    ) {
      return []
    }
    const { width, height } = style
    const id = this._uuid()
    const paths = el.geometry?.paths?.map((path, idx) => {
      return {
        tag: 'path',
        attrs: {
          'id': `geom-${id}-${idx}`,
          'stroke-width': path.strokeWidth,
          'd': path.data,
        },
      }
    }) ?? [
      {
        tag: 'rect',
        attrs: {
          id: `geom-${id}-${0}`,
          width,
          height,
        },
      },
    ]

    // TODO tile
    // TODO stretch
    // TODO srcRect

    return [
      {
        tag: 'defs',
        children: [
          ...paths,
          fill?.src && {
            tag: 'pattern',
            attrs: {
              id: `fill-${id}`,
              left: 0,
              top: 0,
              width: '100%',
              height: '100%',
            },
            children: [
              {
                tag: 'image',
                attrs: {
                  href: fill.src,
                  width: el.style.width,
                  height: el.style.height,
                  preserveAspectRatio: 'none',
                },
              },
            ],
          },
        ].filter(Boolean),
      },
      ...paths.map((_path, idx) => {
        return {
          tag: 'use',
          attrs: {
            'xlink:href': `#geom-${id}-${idx}`,
            'fill': fill?.src ? `url(#fill-${id})` : fill?.color ?? 'none',
            'stroke': outline?.color ?? 'none',
          },
        }
      }),
    ]
  }

  protected _parseRectFill(width: number, height: number, fill?: FillDeclaration): XMLNode[] {
    if (!fill)
      return []
    return [
      fill.color && {
        tag: 'rect',
        attrs: {
          width,
          height,
          fill: fill.color,
        },
      },
      fill.src && {
        tag: 'image',
        attrs: {
          width,
          height,
          href: fill.src,
          opacity: fill.opacity,
          preserveAspectRatio: 'none',
        },
      },
    ].filter(Boolean) as XMLNode[]
  }

  parseSlideElement(el: SlideElement, ctx: ParseSlideElementContext = {}): XMLNode {
    const { parent } = ctx

    const {
      name = '',
      style = {},
      background,
      foreground,
      // video,
      text,
      // meta,
      children,
    } = el

    let {
      scaleX = 1,
      scaleY = 1,
      left = 0,
      top = 0,
      width = 0,
      height = 0,
      rotate = 0,
      visibility,
      // backgroundColor,
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

    const container: XMLNode = {
      tag: 'g',
      attrs: {
        title: name,
        transform: transform.join(' '),
        visibility,
      },
      children: [
        ...this._parseRectFill(width, height, background),
        ...this._parseGeometry(el),
        ...this._parseRectFill(width, height, foreground),
      ],
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

      container.children!.push(
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
      container.children!.push(
        ...children.map((child) => {
          return this.parseSlideElement(child as any, {
            ...ctx,
            parent: el as any,
          })
        }),
      )
    }

    return container
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
        'xmlns': 'http://www.w3.org/2000/svg',
        'xmlns:xlink': 'http://www.w3.org/1999/xlink',
        width,
        'height': viewBoxHeight,
        'viewBox': `0 0 ${width} ${viewBoxHeight}`,
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
        'xmlns': 'http://www.w3.org/2000/svg',
        'xmlns:xlink': 'http://www.w3.org/1999/xlink',
        'width': element.style.width,
        'height': element.style.height,
        'viewBox': `0 0 ${element.style.width} ${element.style.height}`,
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
