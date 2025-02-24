export function stringifyCoreProperties(): string {
  const d = new Date()
  const str = `${d.getFullYear()}-${
    d.getMonth() + 1
  }-${d.getDate()}T${d.getHours()}:${d.getMinutes()}:${d.getSeconds()}Z`
  return `<cp:coreProperties
  xmlns:cp="http://schemas.openxmlformats.org/package/2006/metadata/core-properties"
  xmlns:dc="http://purl.org/dc/elements/1.1/"
  xmlns:dcterms="http://purl.org/dc/terms/"
  xmlns:dcmitype="http://purl.org/dc/dcmitype/"
  xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
>
  <dc:title>modern-openxml</dc:title>
  <dc:subject>modern-openxml</dc:subject>
  <dc:creator>modern-openxml</dc:creator>
  <cp:lastModifiedBy>modern-openxml</cp:lastModifiedBy>
  <cp:revision>1</cp:revision>
  <dcterms:modified xsi:type="dcterms:W3CDTF">${str}</dcterms:modified>
</cp:coreProperties>`
}
