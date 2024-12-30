import type { SlideContext } from './_Slide'
import { OOXML } from '../../core'

export abstract class _SlideElement extends OOXML {
  hasPh(): boolean {
    return false
  }

  toIDOC(ctx?: SlideContext): any {
    return super.toIDOC(ctx)
  }
}
