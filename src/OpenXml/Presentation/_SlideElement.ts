import type { Theme } from '../Drawing'
import type { Presentation } from './Presentation'
import type { SlideLayout } from './SlideLayout'
import type { SlideMaster } from './SlideMaster'
import { OOXML } from '../../core'

export interface SlideElementContext {
  theme?: Theme
  layout?: SlideLayout
  master?: SlideMaster
  presentation?: Presentation
}

export class _SlideElement extends OOXML {
  override toJSON(ctx?: SlideElementContext): any {
    return super.toJSON(ctx)
  }
}
