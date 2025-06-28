import type { LineEndSize, NormalizedFill, NormalizedGradientFill, NormalizedImageFill } from 'modern-idoc'
import type { NormalizedPptx, Slide, SlideElement, SlideLayout, SlideMaster } from '../ooxml'
import type { XmlNode } from '../renderers'
import { isNone, parseColor } from 'modern-idoc'
import { measureText } from 'modern-text'
import { OoxmlValue } from '../ooxml'
import { XmlRenderer } from '../renderers'

export interface ViewBox {
  x1: number
  y1: number
  x2: number
  y2: number
}

export interface ParseSlideElementContext {
  parent?: SlideElement
  onViewBox?: (viewBox: ViewBox) => void
}

export class IdocToSvgStringConverter {
  xmlRenderer = new XmlRenderer()

  genUUID(): number {
    return ~~(Math.random() * 1000000000)
  }

  parseGradientFill(fill: NormalizedGradientFill, ctx: {
    defs: XmlNode
    prefix: string
    fillMap: Map<string, string>
  }): string {
    const val = JSON.stringify(fill)
    const { defs, prefix, fillMap } = ctx
    const id = `${prefix}-gradient-${this.genUUID()}`

    if (val && fillMap.has(val)) {
      return `url(#${fillMap.get(val)!})`
    }

    const { linearGradient, radialGradient } = fill

    if (linearGradient) {
      const { angle, stops } = linearGradient
      fillMap.set(val, id)
      const radian = (angle * Math.PI) / 180
      const offsetX = 0.5 * Math.sin(radian)
      const offsetY = 0.5 * Math.cos(radian)
      const x1 = ~~((0.5 - offsetX) * 10000) / 100
      const y1 = ~~((0.5 + offsetY) * 10000) / 100
      const x2 = ~~((0.5 + offsetX) * 10000) / 100
      const y2 = ~~((0.5 - offsetY) * 10000) / 100
      defs.children?.push({
        tag: 'linearGradient',
        attrs: { id, x1: `${x1}%`, y1: `${y1}%`, x2: `${x2}%`, y2: `${y2}%` },
        children: stops.map((stop) => {
          return {
            tag: 'stop',
            attrs: {
              'offset': stop.offset,
              'stop-color': stop.color,
            },
          }
        }),
      })
      return `url(#${id})`
    }
    else if (radialGradient) {
      const { stops } = radialGradient
      fillMap.set(val, id)
      defs.children?.push({
        tag: 'radialGradient',
        attrs: { id, cx: '50%', cy: '50%', r: '50%', fx: '50%', fy: '50%' },
        children: stops.map((stop) => {
          return {
            tag: 'stop',
            attrs: {
              'offset': stop.offset,
              'stop-color': stop.color,
            },
          }
        }),
      })
      return `url(#${id})`
    }
    else {
      return 'none'
    }
  }

  parseImageFill(fill: NormalizedImageFill, ctx: {
    defs: XmlNode
    width: number
    height: number
    prefix: string
    rotate?: number
  }): string {
    // TODO tile
    const { rotateWithShape, image, cropRect, stretchRect, opacity = 1 } = fill
    const { prefix, defs, rotate } = ctx
    const id = `${prefix}-image-${this.genUUID()}`

    let { width, height } = ctx
    const rawWidth = width
    const rawHeight = height

    if (!rotateWithShape && rotate !== undefined) {
      const rad = (-rotate * Math.PI) / 180
      const sin = Math.sin(rad)
      const cos = Math.cos(rad)
      width = (cos * rawWidth) + (sin * rawHeight)
      height = (sin * rawWidth) + (cos * rawHeight)
    }

    const cropRectAttrs: Record<string, any> = {
      'style': { 'transform-box': 'fill-box' },
      'transform-origin': 'center',
    }

    if (cropRect) {
      const { left = 0, top = 0, bottom = 0, right = 0 } = cropRect
      const srcWidth = width / (1 - right - left)
      const srcHeight = height / (1 - top - bottom)
      const tx = ((right - left) / 2) * srcWidth
      const ty = ((bottom - top) / 2) * srcHeight
      cropRectAttrs['src-rect'] = JSON.stringify(cropRect).replace(/"/g, '\'')
      cropRectAttrs.transform = [
        `translate(${tx},${ty})`,
        `scale(${srcWidth / width}, ${srcHeight / height})`,
      ].join(' ')
    }

    const stretchRectAttrs: Record<string, any> = {
      'style': { 'transform-box': 'fill-box' },
      'transform-origin': 'left top',
    }

    if (stretchRect) {
      // TODO
      const { left = 0, top = 0, bottom = 0, right = 0 } = stretchRect
      const sx = 1 - right - left
      const sy = 1 - top - bottom
      const tx = left * width
      const ty = top * height
      stretchRectAttrs['stretch-rect'] = JSON.stringify(stretchRect).replace(/"/g, '\'')
      stretchRectAttrs.transform = [
        `scale(${sx}, ${sy})`,
        `translate(${tx},${ty})`,
      ].join(' ')
    }

    defs.children?.push({
      tag: 'pattern',
      // TODO 100% 会出现细线
      attrs: { id, left: 0, top: 0, width: '200%', height: '200%' },
      children: [
        {
          tag: 'g',
          attrs: {
            'style': { 'transform-box': 'fill-box' },
            'transform-origin': 'center',
            'transform': !rotateWithShape && rotate !== undefined
              ? `rotate(${-rotate})`
              : undefined,
          },
          children: [
            {
              tag: 'g',
              attrs: { 'data-title': 'cropRect', ...cropRectAttrs },
              children: [
                {
                  tag: 'g',
                  attrs: { 'data-title': 'stretchRect', ...stretchRectAttrs },
                  children: [
                    {
                      tag: 'image',
                      attrs: { href: image, width, height, opacity, preserveAspectRatio: 'none' },
                    },
                  ],
                },
              ],
            },
          ],
        },
      ],
    })

    return `url(#${id})`
  }

  _parseFill(fill: NormalizedFill, ctx: {
    prefix: string
    width: number
    height: number
    defs: XmlNode
    fillMap: Map<string, string>
    rotate?: number
  }): string | undefined {
    const { width, height, defs, prefix, fillMap, rotate } = ctx
    if (fill.linearGradient || fill.radialGradient) {
      return this.parseGradientFill(fill as any, { defs, prefix, fillMap })
    }
    else if (fill.image) {
      return this.parseImageFill(fill as any, { defs, prefix, width, height, rotate })
    }
    else if (fill.color) {
      return fill.color
    }
    return undefined
  }

  parseFill(fill: NormalizedFill, ctx: {
    key: string
    attrs?: Record<string, any>
    width: number
    height: number
    defs: XmlNode
    uuid: number
    fillMap: Map<string, string>
    shapePaths?: XmlNode[]
    rotate?: number
  }): XmlNode {
    const { key, attrs = {}, width, height, defs, uuid, fillMap, shapePaths, rotate } = ctx

    attrs.fill = this._parseFill(fill, { defs, prefix: `${uuid}-${key}`, fillMap, width, height, rotate })

    if (shapePaths) {
      return {
        tag: 'g',
        attrs: { 'data-title': key },
        children: shapePaths.map((path) => {
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
      attrs: { 'data-title': key },
      children: [
        {
          tag: 'rect',
          attrs: { width, height, stroke: 'none', fill: 'none', ...attrs },
        },
      ],
    }
  }

  parseMarker(lineEnd: any, stroke: any, strokeWidth: number): XmlNode {
    const le1px = strokeWidth <= 1

    const marker = {
      tag: 'marker',
      attrs: {
        'data-title': lineEnd.type,
        'viewBox': '0 0 10 10',
        'refX': 5,
        'refY': 5,
        'markerWidth': le1px ? 5 : 3,
        'markerHeight': le1px ? 5 : 3,
        'orient': 'auto-start-reverse',
      },
      children: [] as XmlNode[],
    }

    switch (lineEnd.type) {
      case 'oval':
        marker.children.push({
          tag: 'circle',
          attrs: { cx: 5, cy: 5, r: 5, fill: stroke },
        })
        break
      case 'stealth':
        marker.children.push({
          tag: 'path',
          attrs: { d: 'M 0 0 L 10 5 L 0 10 L 3 5', fill: stroke },
        })
        break
      case 'triangle':
        marker.children.push({
          tag: 'path',
          attrs: { d: 'M 0 0 L 10 5 L 0 10', fill: stroke },
        })
        break
      case 'arrow':
        marker.children.push({
          tag: 'polyline',
          attrs: {
            'points': '1 1 5 5 1 9',
            'stroke-linejoin': 'miter',
            'stroke-linecap': 'round',
            'stroke': stroke,
            'stroke-width': 1.5,
            'fill': 'none',
          },
        })
        marker.attrs.markerWidth = le1px ? 8 : 4
        marker.attrs.markerHeight = le1px ? 8 : 4
        break
      case 'diamond':
        marker.children.push({
          tag: 'path',
          attrs: { d: 'M 5 0 L 10 5 L 5 10 L 0 5 Z', fill: stroke },
        })
        break
    }

    function toScale(size?: LineEndSize): number {
      switch (size) {
        case 'sm':
          return 0.8
        case 'lg':
          return 1.6
        case 'md':
        default:
          return 1
      }
    }

    marker.attrs.markerWidth *= toScale(lineEnd.width)
    marker.attrs.markerHeight *= toScale(lineEnd.height)

    return marker
  }

  parseSlideElement(el: SlideElement, ctx: ParseSlideElementContext = {}): XmlNode {
    const uuid = this.genUUID()

    const {
      name = '',
      style = {},
      background,
      foreground,
      shape,
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

    const {
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

    const transform: string[] = []
    if (left !== 0 || top !== 0) {
      transform.push(`translate(${left}, ${top})`)
    }

    const container = {
      tag: 'g',
      attrs: { 'data-title': name, 'transform': transform.join(' '), visibility },
      children: [] as XmlNode[],
    }

    const shapeTransform: string[] = []
    if (scaleX !== 1 || scaleY !== 1 || rotate !== 0) {
      if (rotate !== 0) {
        shapeTransform.push(`rotate(${rotate})`)
      }
      shapeTransform.push(`scale(${scaleX}, ${scaleY})`)
    }

    const defs = {
      tag: 'defs',
      children: [] as XmlNode[],
    }

    const shapeContainer = {
      tag: 'g',
      attrs: {
        'data-title': 'shape',
        'style': { 'transform-box': 'fill-box' },
        'transform-origin': 'center',
        'transform': shapeTransform.join(' '),
        visibility,
      },
      children: [] as XmlNode[],
    }

    const fillMap = new Map<string, string>()

    const shapePaths: XmlNode[] = shape?.paths
      ? shape.paths.map((path, idx) => {
          return {
            tag: 'path',
            attrs: {
              'data-title': shape.preset,
              'id': `${uuid}-shape-${idx}`,
              'd': path.data,
              'fill': path.fill,
              'fill-rule': path.fillRule,
              'stroke': path.stroke,
              'stroke-width': path.strokeWidth,
            },
          }
        })
      : [
          {
            tag: 'rect',
            attrs: { id: `${uuid}-shape-${0}`, width, height },
          },
        ]
    defs.children.push(...shapePaths)

    const shapeAttrs: Record<string, any> = {
      fill: 'none',
      stroke: 'none',
    }

    if (fill) {
      this.parseFill(fill, {
        key: 'fill',
        attrs: shapeAttrs,
        width,
        height,
        defs,
        uuid,
        fillMap,
        rotate,
      })
    }

    if (outline) {
      const { color, headEnd, tailEnd } = outline

      shapeAttrs['stroke-width'] = outline.width || 1

      if (color) {
        shapeAttrs.stroke = color
      }

      if (headEnd) {
        const marker = this.parseMarker(headEnd, shapeAttrs.stroke, shapeAttrs['stroke-width'])
        marker.attrs!.id = `${uuid}-headEnd`
        defs.children.push(marker)
        shapeAttrs['marker-start'] = `url(#${marker.attrs!.id!})`
      }

      if (tailEnd) {
        const marker = this.parseMarker(tailEnd, shapeAttrs.stroke, shapeAttrs['stroke-width'])
        marker.attrs!.id = `${uuid}-tailEnd`
        defs.children.push(marker)
        shapeAttrs['marker-end'] = `url(#${marker.attrs!.id!})`
      }
    }

    if (softEdge) {
      defs.children.push({
        tag: 'filter',
        attrs: { id: `${uuid}-soft-edge` },
        children: [
          {
            tag: 'feGaussianBlur',
            attrs: { in: 'SourceGraphic', stdDeviation: softEdge.radius / 3 },
          },
        ],
      })
      shapeAttrs.filter = `url(#${uuid}-soft-edge)`
      shapeAttrs.transform = `matrix(0.8,0,0,0.8,${width * 0.1},${height * 0.1})`
    }

    if (background) {
      shapeContainer.children.push(this.parseFill(background, {
        key: 'background',
        width,
        height,
        defs,
        uuid,
        fillMap,
        rotate,
      }))
    }

    const shapeNodes = shapePaths.map((path) => {
      const { ...attrs } = shapeAttrs

      if (path.attrs!.stroke === 'none') {
        delete attrs['marker-start']
        delete attrs['marker-end']
      }

      return {
        tag: 'use',
        attrs: {
          'xlink:href': `#${path.attrs!.id}`,
          ...attrs,
        },
      }
    })

    if (outerShadow) {
      const {
        color,
        offsetX = 0,
        offsetY = 0,
        scaleX = 1,
        scaleY = 1,
        blurRadius = 0,
      } = outerShadow
      const { r, g, b, a } = parseColor(color).toRgb()
      const filter = {
        x1: 0 - blurRadius,
        y1: 0 - blurRadius,
        x2: width + blurRadius * 2,
        y2: height + blurRadius * 2,
      }
      const matrix = { a: scaleX, b: 0, c: 0, d: scaleY, e: offsetX, f: (height - (height * scaleY)) + offsetY }

      defs.children.push({
        tag: 'filter',
        attrs: {
          id: `${uuid}-outerShadow`,
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

      shapeContainer.children.push({
        tag: 'g',
        attrs: {
          'data-title': 'outerShadow',
          'filter': `url(#${uuid}-outerShadow)`,
          'transform': `matrix(${matrix.a},${matrix.b},${matrix.c},${matrix.d},${matrix.e},${matrix.f})`,
        },
        children: shapeNodes,
      })
    }

    shapeContainer.children.push(...shapeNodes)

    if (foreground) {
      shapeContainer.children.push(this.parseFill(foreground, {
        key: 'foreground',
        width,
        height,
        defs,
        uuid,
        fillMap,
        shapePaths,
        rotate,
      }))
    }

    if (defs.children.length) {
      container.children.push(defs)
    }

    if (shapeContainer.children.length) {
      container.children.push(shapeContainer)
    }

    if (text) {
      const paddingX = 0.25 * OoxmlValue.DPI / 2.54
      const paddingY = 0.13 * OoxmlValue.DPI / 2.54
      const content = text.content.map((p) => {
        let pFontSize = 0
        const fragments = p.fragments.map((f) => {
          pFontSize = Math.max(pFontSize, f.fontSize ?? 0)
          return {
            ...f,
            lineHeight: f.lineHeight && f.fontSize
              ? ((f.lineHeight * f.fontSize) + paddingY) / f.fontSize
              : f.lineHeight,
          }
        })
        return {
          ...p,
          fragments,
          lineHeight: p.lineHeight && pFontSize
            ? ((p.lineHeight * pFontSize) + paddingY) / pFontSize
            : p.lineHeight,
        }
      })
      const measured = measureText({
        ...text,
        content,
        style: {
          paddingLeft: paddingX,
          paddingRight: paddingX,
          paddingTop: paddingY,
          paddingBottom: paddingY,
          ...style,
          scaleX: 1,
          scaleY: 1,
        },
      } as any)

      const textNodes = measured.paragraphs.flatMap((paragraph) => {
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
                'fill': isNone(rStyle.fill)
                  ? isNone(rStyle.color)
                    ? undefined
                    : rStyle.color
                  : this._parseFill(rStyle.fill, {
                      defs,
                      prefix: `${uuid}-text`,
                      fillMap,
                      width,
                      height,
                      rotate,
                    }),
                'font-size': rStyle.fontSize,
                'font-family': rStyle.fontFamily,
                'letter-spacing': rStyle.letterSpacing,
                'font-weight': rStyle.fontWeight,
                'font-style': rStyle.fontStyle,
                'text-transform': rStyle.textTransform,
                'text-decoration': rStyle.textDecoration,
                'dominant-baseline': 'alphabetic',
                'style': {
                  'text-indent': pStyle.textIndent,
                },
              },
              children: f.characters.map((c) => {
                const { inlineBox, content, fontSize } = c
                // TODO glyphBox
                return {
                  tag: 'tspan',
                  attrs: {
                    x: inlineBox.left,
                    y: inlineBox.top + fontSize * 1.15,
                  },
                  children: [content],
                }
              }),
            }
          })
      })

      if (textNodes.length) {
        container.children!.push({
          tag: 'g',
          attrs: {
            'data-title': 'text',
            'style': { 'transform-box': 'fill-box' },
            'transform-origin': 'center',
            'transform': rotate !== 0 ? `rotate(${rotate})` : undefined,
          },
          children: textNodes,
        })
      }
    }

    if (children) {
      shapeContainer.children!.push(
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

  parseSlide(slide: Slide | SlideMaster | SlideLayout, slideIndex: number, width: number, height: number): XmlNode {
    const {
      children = [],
      background,
    } = slide

    const uuid = this.genUUID()

    const defs = {
      tag: 'defs',
      children: [] as XmlNode[],
    }

    const fillMap = new Map<string, string>()

    return {
      tag: 'g',
      attrs: {
        'data-title': slide.name,
        'data-path': slide.meta.id,
        'transform': `translate(0, ${height * slideIndex})`,
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
                fillMap,
              }),
            ]
          : []),
        ...children
          .map(child => this.parseSlideElement(child as any)),
      ],
    }
  }

  parse(pptx: NormalizedPptx): XmlNode {
    const {
      width,
      height,
    } = pptx.style

    const slides = pptx.children
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
        return [
          this.parseSlide(slide, slideIndex, width, height),
        ].filter(Boolean) as XmlNode[]
      }),
    }
  }

  getSlideElementViewBox(element: SlideElement): ViewBox {
    const width = Number(element.style?.width ?? 0)
    const height = Number(element.style?.height ?? 0)

    const viewBox = {
      x1: 0,
      y1: 0,
      x2: width,
      y2: height,
    }

    function addOutline(sizeX: number, sizeY: number): void {
      viewBox.x1 += -sizeX / 2
      viewBox.y1 += -sizeY / 2
      viewBox.x2 += sizeX
      viewBox.y2 += sizeY
    }

    if (element.outline) {
      const {
        width: outlineWidth = 1,
        tailEnd,
        headEnd,
      } = element.outline

      addOutline(outlineWidth, outlineWidth)

      if (tailEnd || headEnd) {
        addOutline(outlineWidth, outlineWidth) // TODO
      }
    }

    if (element.effect?.outerShadow) {
      const { offsetX = 0, offsetY = 0, scaleX = 1, scaleY = 1, blurRadius = 0 } = element.effect.outerShadow
      const filter = { x1: viewBox.x1 - blurRadius, y1: viewBox.y1 - blurRadius }
      const matrix = { e: offsetX, f: (height - (height * scaleY)) + offsetY }
      const x1 = filter.x1 * scaleX + matrix.e
      const y1 = filter.y1 * scaleY + matrix.f
      const x2 = (viewBox.x2 + blurRadius) * scaleX + matrix.e
      const y2 = (viewBox.y2 + blurRadius) * scaleY + matrix.f
      const oldViewBox = { ...viewBox }
      viewBox.x1 = Math.min(oldViewBox.x1, x1)
      viewBox.y1 = Math.min(oldViewBox.y1, y1)
      const diffX = viewBox.x1 - oldViewBox.x1
      const diffY = viewBox.y1 - oldViewBox.y1
      viewBox.x2 = Math.max(oldViewBox.x2, x2) + (diffX > 0 ? 0 : -diffX)
      viewBox.y2 = Math.max(oldViewBox.y2, y2) + (diffY > 0 ? 0 : -diffY)
    }

    return viewBox
  }

  convertSlideElement(element: SlideElement, ctx: ParseSlideElementContext = {}): string {
    const viewBox = this.getSlideElementViewBox(element)

    ctx.onViewBox?.(viewBox)

    return this.xmlRenderer.render({
      tag: 'svg',
      attrs: {
        'xmlns': 'http://www.w3.org/2000/svg',
        'xmlns:xlink': 'http://www.w3.org/1999/xlink',
        'width': viewBox.x2 - viewBox.x1,
        'height': viewBox.y2 - viewBox.y1,
        'viewBox': `${viewBox.x1} ${viewBox.y1} ${viewBox.x2} ${viewBox.y2}`,
        'preserveAspectRatio': 'none',
      },
      children: [
        this.parseSlideElement({
          ...element,
          style: {
            ...element.style,
            left: 0,
            top: 0,
          },
        }, ctx),
      ],
    })
  }

  convert(pptx: NormalizedPptx): string {
    return this.xmlRenderer.render(
      this.parse(pptx),
    )
  }
}
