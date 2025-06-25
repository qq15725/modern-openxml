import type { ParsedPresetShapeDefinition } from './parse-preset-shape-definitions'
import { parsePresetShapeDefinitions } from './parse-preset-shape-definitions'

export interface ParsedPresetTextWarpDefinition extends ParsedPresetShapeDefinition {
  //
}

export function parsePresetTextWarpDefinitions(
  presetTextWarpDefinitions: string,
): ParsedPresetTextWarpDefinition[] {
  return parsePresetShapeDefinitions(presetTextWarpDefinitions)
}
