import type { ChartGrouping, ChartLegend, ChartType, NormalizedChart, NormalizedChartSeries } from 'modern-idoc'
import type { OoxmlNode } from '../core'
import { parseFill } from '../drawing'
import { escapeXml } from '../utils'

// ppt/charts/chartN.xml(c:chartSpace)
//
// 数据走缓存(c:numCache/c:strCache),不解析内嵌 xlsx;c 命名空间已在 namespaces 注册。

const CHART_TAGS: { tag: string, type: ChartType }[] = [
  { tag: 'c:barChart', type: 'column' }, // 方向另判
  { tag: 'c:lineChart', type: 'line' },
  { tag: 'c:pieChart', type: 'pie' },
  { tag: 'c:doughnutChart', type: 'doughnut' },
  { tag: 'c:areaChart', type: 'area' },
  { tag: 'c:scatterChart', type: 'scatter' },
  { tag: 'c:radarChart', type: 'radar' },
]

const LEGEND_POS: Record<string, ChartLegend> = { r: 'right', l: 'left', t: 'top', b: 'bottom' }

// 读 c:cat / c:val 下的 c:pt(兼容 numRef/strRef/numLit),按 idx 排序
function readPoints(node: OoxmlNode | undefined): string[] {
  if (!node) {
    return []
  }
  const pts = node.get('.//c:pt')
    .map(pt => ({ idx: pt.attr<number>('@idx', 'number') ?? 0, v: pt.attr('c:v', 'string') ?? '' }))
    .sort((a, b) => a.idx - b.idx)
  return pts.map(p => p.v)
}

function parseSeries(ser: OoxmlNode, ctx?: any): NormalizedChartSeries {
  const series: NormalizedChartSeries = {
    values: readPoints(ser.find('c:val')).map(Number),
  }
  const name = ser.attr('c:tx//c:pt/c:v', 'string') ?? ser.attr('c:tx/c:v', 'string')
  if (name) {
    series.name = name
  }
  const xValues = readPoints(ser.find('c:xVal'))
  if (xValues.length) {
    series.xValues = xValues.map(Number)
    // scatter:yVal 才是数值
    const yValues = readPoints(ser.find('c:yVal'))
    if (yValues.length) {
      series.values = yValues.map(Number)
    }
  }
  const color = parseFill(ser.find('c:spPr'), ctx)?.color
  if (color) {
    series.color = color
  }
  return series
}

export function parseChart(node: OoxmlNode | undefined, ctx?: any): NormalizedChart | undefined {
  if (!node || !node.name) {
    return undefined
  }
  const plotArea = node.find('c:chart/c:plotArea')
  if (!plotArea) {
    return undefined
  }

  const found = CHART_TAGS.find(({ tag }) => plotArea.find(tag))
  if (!found) {
    return undefined
  }
  const chartNode = plotArea.find(found.tag)!

  let type = found.type
  if (found.tag === 'c:barChart') {
    type = chartNode.attr('c:barDir/@val') === 'bar' ? 'bar' : 'column'
  }

  const seriesNodes = chartNode.get('c:ser')
  const series = seriesNodes.map(s => parseSeries(s, ctx))
  const categories = readPoints(seriesNodes[0]?.find('c:cat'))

  const chart: NormalizedChart = {
    enabled: true,
    type,
    categories,
    series,
  }

  const grouping = chartNode.attr('c:grouping/@val') as ChartGrouping | undefined
  if (grouping) {
    chart.grouping = grouping
  }

  const legend = node.find('c:chart/c:legend')
  chart.legend = legend ? (LEGEND_POS[legend.attr('c:legendPos/@val') ?? 'r'] ?? 'right') : false

  const titleText = node.find('c:chart/c:title')?.attr('.//a:t/text()', 'string')
    ?? node.find('c:chart/c:title')?.attr('.', 'string')
  if (titleText?.trim()) {
    chart.title = titleText.trim()
  }

  return chart
}

// ───────────── stringify ─────────────

const CHART_NS = 'http://schemas.openxmlformats.org/drawingml/2006/chart'
const A_NS = 'http://schemas.openxmlformats.org/drawingml/2006/main'
const R_NS = 'http://schemas.openxmlformats.org/officeDocument/2006/relationships'
const LEGEND_POS_REV: Record<string, string> = { right: 'r', left: 'l', top: 't', bottom: 'b' }
const CAT_AX_ID = 111111111
const VAL_AX_ID = 222222222

function pts(values: (string | number)[]): string {
  return `<c:ptCount val="${values.length}"/>${values
    .map((v, i) => `<c:pt idx="${i}"><c:v>${escapeXml(String(v))}</c:v></c:pt>`)
    .join('')}`
}

function seriesXml(series: NormalizedChartSeries, categories: string[], i: number): string {
  const name = series.name
    ? `<c:tx><c:strRef><c:f></c:f><c:strCache><c:ptCount val="1"/><c:pt idx="0"><c:v>${escapeXml(series.name)}</c:v></c:pt></c:strCache></c:strRef></c:tx>`
    : ''
  const spPr = series.color
    ? `<c:spPr><a:solidFill><a:srgbClr val="${escapeXml(series.color.replace('#', '').slice(0, 6))}"/></a:solidFill></c:spPr>`
    : ''
  const cat = categories.length
    ? `<c:cat><c:strRef><c:f></c:f><c:strCache>${pts(categories)}</c:strCache></c:strRef></c:cat>`
    : ''
  const val = `<c:val><c:numRef><c:f></c:f><c:numCache><c:formatCode>General</c:formatCode>${pts(series.values)}</c:numCache></c:numRef></c:val>`
  return `<c:ser><c:idx val="${i}"/><c:order val="${i}"/>${name}${spPr}${cat}${val}</c:ser>`
}

function axesXml(): string {
  return `<c:catAx><c:axId val="${CAT_AX_ID}"/><c:scaling><c:orientation val="minMax"/></c:scaling><c:delete val="0"/><c:axPos val="b"/><c:crossAx val="${VAL_AX_ID}"/></c:catAx>`
    + `<c:valAx><c:axId val="${VAL_AX_ID}"/><c:scaling><c:orientation val="minMax"/></c:scaling><c:delete val="0"/><c:axPos val="l"/><c:crossAx val="${CAT_AX_ID}"/></c:valAx>`
}

export function stringifyChart(chart: NormalizedChart): string {
  const categories = chart.categories ?? []
  const sers = (chart.series ?? []).map((s, i) => seriesXml(s, categories, i)).join('')
  const grouping = chart.grouping ?? (chart.type === 'area' ? 'standard' : 'clustered')

  let plot: string
  let withAxes = true
  switch (chart.type) {
    case 'pie':
      plot = `<c:pieChart><c:varyColors val="1"/>${sers}</c:pieChart>`
      withAxes = false
      break
    case 'doughnut':
      plot = `<c:doughnutChart><c:varyColors val="1"/>${sers}<c:holeSize val="50"/></c:doughnutChart>`
      withAxes = false
      break
    case 'line':
      plot = `<c:lineChart><c:grouping val="${grouping}"/><c:varyColors val="0"/>${sers}<c:axId val="${CAT_AX_ID}"/><c:axId val="${VAL_AX_ID}"/></c:lineChart>`
      break
    case 'area':
      plot = `<c:areaChart><c:grouping val="${grouping}"/><c:varyColors val="0"/>${sers}<c:axId val="${CAT_AX_ID}"/><c:axId val="${VAL_AX_ID}"/></c:areaChart>`
      break
    case 'radar':
      plot = `<c:radarChart><c:radarStyle val="standard"/>${sers}<c:axId val="${CAT_AX_ID}"/><c:axId val="${VAL_AX_ID}"/></c:radarChart>`
      break
    case 'bar':
    case 'column':
    default:
      plot = `<c:barChart><c:barDir val="${chart.type === 'bar' ? 'bar' : 'col'}"/><c:grouping val="${grouping}"/><c:varyColors val="0"/>${sers}<c:axId val="${CAT_AX_ID}"/><c:axId val="${VAL_AX_ID}"/></c:barChart>`
      break
  }

  const title = chart.title
    ? `<c:title><c:tx><c:rich><a:bodyPr/><a:lstStyle/><a:p><a:r><a:t>${escapeXml(chart.title)}</a:t></a:r></a:p></c:rich></c:tx><c:overlay val="0"/></c:title><c:autoTitleDeleted val="0"/>`
    : `<c:autoTitleDeleted val="1"/>`
  const legend = chart.legend
    ? `<c:legend><c:legendPos val="${LEGEND_POS_REV[chart.legend] ?? 'r'}"/><c:overlay val="0"/></c:legend>`
    : ''

  return `<c:chartSpace xmlns:c="${CHART_NS}" xmlns:a="${A_NS}" xmlns:r="${R_NS}">`
    + `<c:chart>${title}<c:plotArea><c:layout/>${plot}${withAxes ? axesXml() : ''}</c:plotArea>${legend}<c:plotVisOnly val="1"/></c:chart>`
    + `</c:chartSpace>`
}
