import type { IDOCElement } from 'modern-idoc'
import type {
  CustomGeometry,
  Fill,
  PresetGeometry,
} from '../Drawing'
import type { SlideContext } from './_Slide'
import type { ExtensionList } from './ExtensionList'
import type { NonVisualConnectionShapeProperties } from './NonVisualConnectionShapeProperties'
import type { IDOCPlaceholderShape } from './PlaceholderShape'
import type { ShapeProperties } from './ShapeProperties'
import type { ShapeStyle } from './ShapeStyle'
import { clearEmptyAttrs, defineChild, defineElement, getObjectValueByPath } from '../../core'
import { _SlideElement } from './_SlideElement'

export interface IDOCConnectionShapeElementMeta {
  type: 'connectionShape'
  placeholderShape?: IDOCPlaceholderShape
}

export interface IDOCConnectionShapeElement extends IDOCElement {
  meta?: IDOCConnectionShapeElementMeta
}

/**
 * https://learn.microsoft.com/dotnet/api/documentformat.openxml.presentation.connectionshape
 */
@defineElement('p:cxnSp')
export class ConnectionShape extends _SlideElement {
  @defineChild('p:extLst') declare extLst?: ExtensionList
  @defineChild('p:nvCxnSpPr') declare nvCxnSpPr?: NonVisualConnectionShapeProperties
  @defineChild('p:spPr') declare spPr?: ShapeProperties
  @defineChild('p:style') declare style?: ShapeStyle

  override hasPh(): boolean {
    return Boolean(this.nvCxnSpPr?.nvPr?.ph)
  }

  override toIDOC(ctx: SlideContext = {}): IDOCConnectionShapeElement {
    const { layout, master } = ctx

    // ph
    let _ph: ConnectionShape | undefined
    const ph = this.nvCxnSpPr?.nvPr.ph
    if (ph) {
      _ph = (layout?.findPh(ph) ?? master?.findPh(ph)) as ConnectionShape | undefined
    }

    // style
    const _style = this.style?.parse(ctx)

    const inherited = <T = any>(path: string): T | undefined => {
      return this.offsetGet(path)
        ?? getObjectValueByPath(_style, path.replace('spPr.', ''))
        ?? _ph?.offsetGet(path)
    }

    const style: IDOCConnectionShapeElement['style'] = {
      visibility: inherited('nvCxnSpPr.cNvPr.visibility'),
      left: inherited('spPr.xfrm.off.x'),
      top: inherited('spPr.xfrm.off.y'),
      width: inherited('spPr.xfrm.ext.cx'),
      height: inherited('spPr.xfrm.ext.cy'),
      rotate: inherited('spPr.xfrm.rot'),
      scaleX: inherited('spPr.xfrm.scaleX'),
      scaleY: inherited('spPr.xfrm.scaleY'),
      shadow: inherited('spPr.effectLst.shadow'),
      backgroundColor: undefined,
      borderWidth: undefined,
      borderColor: undefined,
    }

    const fill = inherited<Fill>('spPr.fill')?.toIDOC({
      ...ctx,
      color: this.spPr?.hasFill
        ? undefined
        : this.style?.fillRef?.color,
    })

    const stroke = inherited<Fill>('spPr.ln.fill')?.toIDOC({
      ...ctx,
      color: this.spPr?.ln?.hasFill
        ? undefined
        : this.style?.lnRef?.color,
    })

    const prstGeom = inherited<PresetGeometry>('spPr.prstGeom')
    const custGeom = inherited<CustomGeometry>('spPr.custGeom')
    let geometry
    const outlineWidth = inherited('spPr.ln.w')
    if (prstGeom?.prst === 'rect' && !prstGeom?.avLst?.value.length) {
      style.borderWidth = outlineWidth
    }
    else {
      geometry = (prstGeom ?? custGeom)?.toIDOC({
        ...ctx,
        width: style.width || outlineWidth,
        height: style.height || outlineWidth,
        strokeWidth: outlineWidth,
      })
    }

    return clearEmptyAttrs({
      name: inherited('nvCxnSpPr.cNvPr.name'),
      geometry,
      fill,
      stroke,
      style,
      meta: {
        type: 'connectionShape',
        placeholderShape: ph?.toIDOC(),
      },
    })
  }
}
