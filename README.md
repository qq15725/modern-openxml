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
import { decodePPTX } from 'modern-openxml'
import presetShapeDefinitions from 'modern-openxml/presetShapeDefinitions'

// buffer is PPTX file arrayBuffer
const pptx = await decodePPTX(new Uint8Array(buffer), { presetShapeDefinitions })
console.log(pptx)
```

## PPTX to SVG

```ts
import { decodePPTX, pptxToSVG } from 'modern-openxml'
import presetShapeDefinitions from 'modern-openxml/presetShapeDefinitions'

// buffer is PPTX file arrayBuffer
const pptx = await decodePPTX(new Uint8Array(buffer), { presetShapeDefinitions })
const svgXML = pptxToSVG(pptx)
const svgDOM = new DOMParser().parseFromString(svgXML, 'application/xml').documentElement
document.body.appendChild(svgDOM)
console.log(svgXML)
```
