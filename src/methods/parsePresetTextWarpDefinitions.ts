import type { ParsedPresetShapeDefinition } from './parsePresetShapeDefinitions'
import { parsePresetShapeDefinitions } from './parsePresetShapeDefinitions'

export interface ParsedPresetTextWarpDefinition extends ParsedPresetShapeDefinition {
  //
}

export function parsePresetTextWarpDefinitions(
  presetTextWarpDefinitions: string,
): ParsedPresetTextWarpDefinition[] {
  return parsePresetShapeDefinitions(presetTextWarpDefinitions)
}
