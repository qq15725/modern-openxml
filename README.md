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

## Methods

PPTX to other

- [pptxToIdoc](src/methods/pptx-to-idoc.ts)
- [pptxToSvg](src/methods/pptx-to-svg.ts)
- [pptxToSvgString](src/methods/pptx-to-svg-string.ts)

IDoc to other

- [idocToPptx](src/methods/idoc-to-pptx.ts)

preset shape definitions

- [parsePresetShapeDefinitions](src/methods/parse-preset-shape-definitions.ts)

utils

- [xmlToDom](src/methods/xml-to-dom.ts)

## PPTX to JSON

```ts
import { pptxToIdoc } from 'modern-openxml'
import presetShapeDefinitions from 'modern-openxml/presetShapeDefinitions'

fetch('./example.pptx')
  .then(rep => rep.arrayBuffer())
  .then(async (buffer) => {
    const pptx = await pptxToIdoc(new Uint8Array(buffer), { presetShapeDefinitions })
    console.log(pptx)
  })
```

## PPTX to SVG

```ts
import { pptxToSvg } from 'modern-openxml'
import presetShapeDefinitions from 'modern-openxml/presetShapeDefinitions'

fetch('./example.pptx')
  .then(rep => rep.arrayBuffer())
  .then(async (buffer) => {
    const pptxSVG = await pptxToSvg(new Uint8Array(buffer), { presetShapeDefinitions })
    console.log(pptxSVG)
    document.body.appendChild(pptxSVG)
  })
```

## Related

- [IDoc definition](https://github.com/qq15725/modern-idoc)
- [Office Open XML file formats (ECMA-376)](https://ecma-international.org/publications-and-standards/standards/ecma-376/)
- [Office Open XML validator](https://github.com/mikeebowen/OOXML-Validator)
- [Open XML SDK API](https://learn.microsoft.com/zh-cn/dotnet/api/documentformat.openxml)
