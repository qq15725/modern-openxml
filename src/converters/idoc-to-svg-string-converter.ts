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

  parseSlideElement(el: SlideElement, ctx: ParseSlideElementContext = {}): XMLNode {
    const { parent } = ctx

    const uuid = this._uuid()

    const {
      name = '',
      style = {},
      background,
      foreground,
      geometry,
      // video,
      fill,
      outline,
      effect = {},
      text,
      // meta,
      children,
    } = el

    const {
      softEdge,
    } = effect

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

    const container = {
      tag: 'g',
      attrs: { title: name, transform: transform.join(' '), visibility },
      children: [] as XMLNode[],
    }

    const defs = {
      tag: 'defs',
      children: [] as XMLNode[],
    }

    const pathUseAttrs: Record<string, any> = {
      fill: 'none',
      stroke: 'none',
    }

    function parseColor(val?: string): string {
      if (val?.startsWith('linear-gradient')) {
        const id = `linear-gradient-${uuid}`
        const match = val.match(/linear-gradient\((.*)\)$/)?.[1] as string | undefined
        const [deg, ..._colorStops] = match?.split(',rgba')?.map(v => v.trim()) ?? []
        const colorStops
          = _colorStops?.map((color_) => {
            const color = `rgba${color_}`
            const match = color.match(/(rgba\(.*\)) (.*)/) ?? []
            const offset = match.length > 2 ? match?.[2] : undefined
            const stopColor = match?.[1]
            return {
              tag: 'stop',
              attrs: {
                offset,
                'stop-color': stopColor,
              },
            }
          }) ?? []
        const degree = Number(deg.replace('deg', '')) || 0
        const radian = (degree * Math.PI) / 180
        const offsetX = 0.5 * Math.sin(radian)
        const offsetY = 0.5 * Math.cos(radian)
        const x1 = ~~((0.5 - offsetX) * 10000) / 100
        const y1 = ~~((0.5 + offsetY) * 10000) / 100
        const x2 = ~~((0.5 + offsetX) * 10000) / 100
        const y2 = ~~((0.5 - offsetY) * 10000) / 100
        defs.children.push({
          tag: 'linearGradient',
          attrs: {
            id,
            x1: `${x1}%`,
            y1: `${y1}%`,
            x2: `${x2}%`,
            y2: `${y2}%`,
          },
          children: colorStops,
        })
        return `url(#${id})`
      }
      else if (val?.startsWith('radial-gradient')) {
        const id = `radial-gradient-${uuid}`
        const match = val.match(/radial-gradient\((.*)\)$/)?.[1] as string | undefined
        const _colorStops = match?.split(',rgba')?.map(v => v.trim()) ?? []
        const colorStops
          = _colorStops?.map((color_) => {
            const color = `rgba${color_}`
            const match = color.match(/(rgba\(.*\)) (.*)/) ?? []
            const offset = match.length > 2 ? match?.[2] : undefined
            const stopColor = match?.[1]
            return {
              tag: 'stop',
              attrs: {
                offset,
                'stop-color': stopColor,
              },
            }
          }) ?? []
        defs.children.push({
          tag: 'radialGradient',
          attrs: {
            id,
            cx: '50%',
            cy: '50%',
            r: '50%',
            fx: '50%',
            fy: '50%',
          },
          children: colorStops,
        })
        return `url(#${id})`
      }
      else {
        return val ?? 'none'
      }
    }

    function parseRectFill(width: number, height: number, fill?: FillDeclaration): XMLNode[] {
      return [
        fill?.color && {
          tag: 'rect',
          attrs: {
            width,
            height,
            fill: fill.color,
          },
        },
        fill?.src && {
          tag: 'image',
          attrs: {
            width,
            height,
            href: fill.src,
            opacity: fill!.opacity,
            preserveAspectRatio: 'none',
          },
        },
      ].filter(Boolean) as XMLNode[]
    }

    const paths = geometry?.paths
      ? geometry.paths.map((path, idx) => {
          return {
            tag: 'path',
            attrs: {
              'title': geometry.name,
              'id': `geom-${uuid}-${idx}`,
              'd': path.data,
              'fill': path.fill,
              'stroke': path.stroke,
              'stroke-width': path.strokeWidth,
            },
          }
        })
      : [
          {
            tag: 'rect',
            attrs: { id: `geom-${uuid}-${0}`, width, height },
          },
        ]
    defs.children.push(...paths)

    // TODO tile
    // TODO stretch
    // TODO srcRect

    if (fill?.src) {
      defs.children.push({
        tag: 'pattern',
        attrs: { id: `fill-${uuid}`, left: 0, top: 0, width: '100%', height: '100%' },
        children: [
          { tag: 'image', attrs: { href: fill.src, width, height, preserveAspectRatio: 'none' } },
        ],
      })
      pathUseAttrs.fill = `url(#fill-${uuid})`
    }
    else if (fill?.color) {
      pathUseAttrs.fill = parseColor(fill.color as any)
    }

    if (outline?.src) {
      defs.children.push({
        tag: 'pattern',
        attrs: { id: `outline-${uuid}`, left: 0, top: 0, width: '100%', height: '100%' },
        children: [
          { tag: 'image', attrs: { href: outline.src, width, height, preserveAspectRatio: 'none' } },
        ],
      })
      pathUseAttrs.stroke = `url(#outline-${uuid})`
    }
    else if (outline?.color) {
      pathUseAttrs.stroke = parseColor(outline.color as any)
    }

    if (softEdge) {
      defs.children.push({
        tag: 'filter',
        attrs: { id: `soft-edge-${uuid}` },
        children: [
          {
            tag: 'feGaussianBlur',
            attrs: { in: 'SourceGraphic', stdDeviation: softEdge.radius / 3 },
          },
        ],
      })
      pathUseAttrs.filter = `url(#soft-edge-${uuid})`
      pathUseAttrs.transform = `matrix(0.8,0,0,0.8,${width * 0.1},${height * 0.1})`
    }

    container.children.push(
      defs,
      ...parseRectFill(width, height, background),
      {
        tag: 'g',
        children: [
          ...paths.map((_path, idx) => {
            return {
              tag: 'use',
              attrs: {
                'xlink:href': `#geom-${uuid}-${idx}`,
                ...pathUseAttrs,
              },
            }
          }),
        ],
      },
      ...parseRectFill(width, height, foreground),
    )

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
          if (!paragraph.fragments.flatMap(f => f.characters.map(c => c.content)).join('')) {
            return []
          }
          const { computedStyle: pStyle } = paragraph
          return paragraph.fragments
            .map((f) => {
              const { computedStyle: rStyle } = f
              return {
                tag: 'text',
                attrs: {
                  'fill': parseColor(rStyle.color as any),
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
          background,
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
            (background as any)?.color && {
              tag: 'rect',
              attrs: {
                x: 0,
                y: 0,
                width,
                height,
                fill: (background as any).color,
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
