<h1 align="center">modern-openxml</h1>

<p align="center">
  <a href="https://unpkg.com/modern-openxml">
    <img src="https://img.shields.io/bundlephobia/minzip/modern-openxml" alt="Minzip">
  </a>
  <a href="https://www.npmjs.com/package/modern-openxml">
    <img src="https://img.shields.io/npm/v/modern-openxml.svg" alt="Version">
  </a>
  <a href="https://www.npmjs.com/package/modern-openxml">
    <img src="https://img.shields.io/npm/dm/modern-openxml" alt="Downloads">
  </a>
  <a href="https://github.com/qq15725/modern-openxml/issues">
    <img src="https://img.shields.io/github/issues/qq15725/modern-openxml" alt="Issues">
  </a>
  <a href="https://github.com/qq15725/modern-openxml/blob/main/LICENSE">
    <img src="https://img.shields.io/npm/l/modern-openxml.svg" alt="License">
  </a>
</p>

## PPTX to JSON

```ts
import { PPTX } from 'modern-openxml'
import presetShapeDefinitions from 'modern-openxml/presetShapeDefinitions'

// buffer is PPTX file arrayBuffer
const pptx = new PPTX(buffer, { presetShapeDefinitions })
console.log(pptx.toJSON())
```

## PPTX to SVG

```ts
import { PPTX, PPTXToSVGRenderer } from 'modern-openxml'
import presetShapeDefinitions from 'modern-openxml/presetShapeDefinitions'

// buffer is PPTX file arrayBuffer
const pptx = new PPTX(buffer, { presetShapeDefinitions })
const svgRenderer = new PPTXToSVGRenderer(pptx)
document.body.appendChild(svgRenderer.toSVG())
console.log(svgRenderer.toSVGString())
```
