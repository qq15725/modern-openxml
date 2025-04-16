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

  genUUID(): number {
    return ~~(Math.random() * 1000000000)
  }

  parseColor(val: string, ctx: {
    defs: XMLNode
    uuid: number
    colorMap: Map<string, string>
  }): string {
    const { defs, uuid, colorMap } = ctx
    const id = `color-${this.genUUID()}-${uuid}`

    if (val && colorMap.has(val)) {
      return `url(#${colorMap.get(val)!})`
    }

    if (val?.startsWith('linear-gradient')) {
      colorMap.set(val, id)
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
      defs.children?.push({
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
      colorMap.set(val, id)
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
      defs.children?.push({
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

  parseFill(fill: FillDeclaration, ctx: {
    key: string
    attrs?: Record<string, any>
    width: number
    height: number
    defs: XMLNode
    uuid: number
    colorMap: Map<string, string>
    geometryPaths?: XMLNode[]
  }): XMLNode {
    const { key, attrs = {}, width, height, defs, uuid, colorMap, geometryPaths } = ctx

    const suffix = `${key}-${uuid}`

    if (fill?.src) {
      // TODO tile
      // TODO stretch
      const { src, srcRect, opacity = 1 } = fill

      const gAttrs: Record<string, any> = {}

      if (srcRect) {
        const { left = 0, top = 0, bottom = 0, right = 0 } = srcRect
        const srcWidth = width / (1 - right - left)
        const srcHeight = height / (1 - top - bottom)
        const tx = ((right - left) / 2) * srcWidth
        const ty = ((bottom - top) / 2) * srcHeight
        gAttrs['src-rect'] = JSON.stringify(srcRect).replace(/"/g, '\'')
        gAttrs.transform = [
          `translate(${tx},${ty})`,
          `translate(${width / 2},${height / 2})`,
          `scale(${srcWidth / width}, ${srcHeight / height})`,
          `translate(${-width / 2},${-height / 2})`,
        ].join(' ')
      }

      defs.children?.push({
        tag: 'pattern',
        // TODO 100% 会出现细线
        attrs: { id: `pattern-${suffix}`, left: 0, top: 0, width: '200%', height: '200%' },
        children: [
          {
            tag: 'g',
            attrs: {
              title: 'srcRect',
              ...gAttrs,
            },
            children: [
              {
                tag: 'image',
                attrs: {
                  href: src,
                  width,
                  height,
                  opacity,
                  preserveAspectRatio: 'none',
                },
              },
            ],
          },
        ],
      })
      attrs.fill = `url(#pattern-${suffix})`
    }
    else if (fill?.color) {
      attrs.fill = this.parseColor(fill.color as any, { defs, uuid, colorMap })
    }

    if (geometryPaths) {
      return {
        tag: 'g',
        attrs: { title: key },
        children: geometryPaths.map((path) => {
          return {
            tag: 'use',
            attrs: {
              'xlink:href': `#${path.attrs!.id}`,
              'stroke': 'none',
              'fill': 'none',
              ...attrs,
            },
          }
        }),
      }
    }

    return {
      tag: 'g',
      attrs: { title: key },
      children: [
        {
          tag: 'rect',
          attrs: { width, height, stroke: 'none', fill: 'none', ...attrs },
        },
      ],
    }
  }

  parseSlideElement(el: SlideElement, ctx: ParseSlideElementContext = {}): XMLNode {
    const { parent } = ctx

    const uuid = this.genUUID()

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
      outerShadow,
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

    const colorMap = new Map<string, string>()

    const geometryPaths = geometry?.paths
      ? geometry.paths.map((path, idx) => {
          return {
            tag: 'path',
            attrs: {
              'title': geometry.name,
              'id': `geometry-${idx}-${uuid}`,
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
            attrs: { id: `geometry-${0}-${uuid}`, width, height },
          },
        ]
    defs.children?.push(...geometryPaths)

    const geometryPathsAttrs: Record<string, any> = {
      fill: 'none',
      stroke: 'none',
    }

    if (fill) {
      this.parseFill(fill, {
        key: 'fill',
        attrs: geometryPathsAttrs,
        width,
        height,
        defs,
        uuid,
        colorMap,
      })
    }

    if (outline?.src) {
      defs.children?.push({
        tag: 'pattern',
        attrs: { id: `outline-${uuid}`, left: 0, top: 0, width: '100%', height: '100%' },
        children: [
          { tag: 'image', attrs: { href: outline.src, width, height, preserveAspectRatio: 'none' } },
        ],
      })
      geometryPathsAttrs.stroke = `url(#outline-${uuid})`
    }
    else if (outline?.color) {
      geometryPathsAttrs.stroke = this.parseColor(outline.color as any, { defs, uuid, colorMap })
    }

    if (softEdge) {
      defs.children?.push({
        tag: 'filter',
        attrs: { id: `soft-edge-${uuid}` },
        children: [
          {
            tag: 'feGaussianBlur',
            attrs: { in: 'SourceGraphic', stdDeviation: softEdge.radius / 3 },
          },
        ],
      })
      geometryPathsAttrs.filter = `url(#soft-edge-${uuid})`
      geometryPathsAttrs.transform = `matrix(0.8,0,0,0.8,${width * 0.1},${height * 0.1})`
    }

    container.children.push(defs)

    if (background) {
      container.children.push(this.parseFill(background, {
        key: 'background',
        width,
        height,
        defs,
        uuid,
        colorMap,
      }))
    }

    if (outerShadow) {
      const {
        color,
        offsetX = 0,
        offsetY = 0,
        scaleX = 1,
        scaleY = 1,
        blurRadius = 0,
      } = outerShadow
      const [r, g, b, a] = String(color).replace('rgba(', '').replace(')', '').split(',').map(v => Number(v))
      const filter = {
        x1: 0 - blurRadius,
        y1: 0 - blurRadius,
        x2: width + blurRadius * 2,
        y2: height + blurRadius * 2,
      }
      const t = height - (height * scaleY)
      const matrix = { a: scaleX, b: 0, c: 0, d: scaleY, e: offsetX, f: t + offsetY }

      defs.children.push({
        tag: 'filter',
        attrs: {
          id: `outerShadow-${uuid}`,
          filterUnits: 'userSpaceOnUse',
          x: filter.x1,
          y: filter.y1,
          width: filter.x2,
          height: filter.y2,
        },
        children: [
          {
            tag: 'feGaussianBlur',
            attrs: { in: 'SourceAlpha', result: 'blur', stdDeviation: ~~(blurRadius / 6) },
          },
          {
            tag: 'feComponentTransfer',
            attrs: { 'color-interpolation-filters': 'sRGB' },
            children: [
              { tag: 'feFuncR', attrs: { type: 'linear', slope: '0', intercept: r / 255 } },
              { tag: 'feFuncG', attrs: { type: 'linear', slope: '0', intercept: g / 255 } },
              { tag: 'feFuncB', attrs: { type: 'linear', slope: '0', intercept: b / 255 } },
              { tag: 'feFuncA', attrs: { type: 'linear', slope: a, intercept: 0 } },
            ],
          },
        ],
      })

      container.children.push({
        tag: 'g',
        attrs: {
          title: 'outerShadow',
          filter: `url(#outerShadow-${uuid})`,
          transform: `matrix(${matrix.a},${matrix.b},${matrix.c},${matrix.d},${matrix.e},${matrix.f})`,
        },
        children: geometryPaths.map((path) => {
          return {
            tag: 'use',
            attrs: {
              'xlink:href': `#${path.attrs.id}`,
              ...geometryPathsAttrs,
            },
          }
        }),
      })
    }

    container.children.push({
      tag: 'g',
      attrs: { title: 'geometry' },
      children: geometryPaths.map((path) => {
        return {
          tag: 'use',
          attrs: {
            'xlink:href': `#${path.attrs.id}`,
            ...geometryPathsAttrs,
          },
        }
      }),
    })

    if (foreground) {
      container.children.push(this.parseFill(foreground, {
        key: 'foreground',
        width,
        height,
        defs,
        uuid,
        colorMap,
        geometryPaths,
      }))
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
          scaleX: 1,
          scaleY: 1,
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
                  'fill': this.parseColor(rStyle.color as any, { defs, uuid, colorMap }),
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
              title: master.name,
              path: master.meta.id,
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
              title: layout.name,
              path: layout.meta.id,
              transform: `translate(0, ${top})`,
            },
            children: [
              layout
                .children
                .map(child => this.parseSlideElement(child)),
            ].filter(Boolean) as any[],
          })
        }

        const uuid = this.genUUID()

        const defs = {
          tag: 'defs',
          children: [] as XMLNode[],
        }

        const colorMap = new Map<string, string>()

        items.push({
          tag: 'g',
          attrs: {
            title: slide.name,
            path: slide.meta.id,
            transform: `translate(0, ${top})`,
          },
          children: [
            defs,
            ...(background
              ? [
                  this.parseFill(background, {
                    key: 'background',
                    width,
                    height,
                    defs,
                    uuid,
                    colorMap,
                  }),
                ]
              : []),
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
