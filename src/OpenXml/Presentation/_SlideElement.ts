import type { SlideContext } from './_Slide'
import { OOXML } from '../../core'

export class _SlideElement extends OOXML {
  hasPh(): boolean {
    return false
  }

  override toJSON(ctx?: SlideContext): any {
    return super.toJSON(ctx)
  }
}
