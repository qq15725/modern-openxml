import type { OoxmlNode } from '../core'
import { escapeXml } from '../utils'

// p:notes —— 解析备注正文(body 占位符)的纯文本,按段落以换行拼接
export function parseNotesSlide(node?: OoxmlNode): string | undefined {
  if (!node || !node.name) {
    return undefined
  }
  const body = node.find(`p:cSld/p:spTree/p:sp[p:nvSpPr/p:nvPr/p:ph/@type='body']/p:txBody`)
  if (!body) {
    return undefined
  }
  const text = body.get('.//a:p')
    .map(p => p.attr('.', 'string') ?? '')
    .join('\n')
    .trim()
  return text || undefined
}

export function stringifyNotesSlide(notes = ''): string {
  const paragraphs = notes.split('\n').map((line) => {
    return line
      ? `<a:p><a:r><a:rPr lang="zh-CN" altLang="en-US" dirty="0"/><a:t>${escapeXml(line)}</a:t></a:r></a:p>`
      : `<a:p><a:endParaRPr lang="zh-CN" altLang="en-US"/></a:p>`
  }).join('')

  return `<p:notes xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships" xmlns:p="http://schemas.openxmlformats.org/presentationml/2006/main">
  <p:cSld>
    <p:spTree>
      <p:nvGrpSpPr>
        <p:cNvPr id="1" name=""/>
        <p:cNvGrpSpPr/>
        <p:nvPr/>
      </p:nvGrpSpPr>
      <p:grpSpPr>
        <a:xfrm>
          <a:off x="0" y="0"/>
          <a:ext cx="0" cy="0"/>
          <a:chOff x="0" y="0"/>
          <a:chExt cx="0" cy="0"/>
        </a:xfrm>
      </p:grpSpPr>
      <p:sp>
        <p:nvSpPr>
          <p:cNvPr id="2" name="幻灯片图像占位符 1"/>
          <p:cNvSpPr>
            <a:spLocks noGrp="1" noRot="1" noChangeAspect="1"/>
          </p:cNvSpPr>
          <p:nvPr>
            <p:ph type="sldImg"/>
          </p:nvPr>
        </p:nvSpPr>
        <p:spPr/>
      </p:sp>
      <p:sp>
        <p:nvSpPr>
          <p:cNvPr id="3" name="备注占位符 2"/>
          <p:cNvSpPr>
            <a:spLocks noGrp="1"/>
          </p:cNvSpPr>
          <p:nvPr>
            <p:ph type="body" idx="1"/>
          </p:nvPr>
        </p:nvSpPr>
        <p:spPr/>
        <p:txBody>
          <a:bodyPr/>
          <a:lstStyle/>
          ${paragraphs || '<a:p><a:endParaRPr lang="zh-CN" altLang="en-US"/></a:p>'}
        </p:txBody>
      </p:sp>
      <p:sp>
        <p:nvSpPr>
          <p:cNvPr id="4" name="灯片编号占位符 3"/>
          <p:cNvSpPr>
            <a:spLocks noGrp="1"/>
          </p:cNvSpPr>
          <p:nvPr>
            <p:ph type="sldNum" sz="quarter" idx="5"/>
          </p:nvPr>
        </p:nvSpPr>
        <p:spPr/>
        <p:txBody>
          <a:bodyPr/>
          <a:lstStyle/>
          <a:p>
            <a:fld id="{85D0DACE-38E0-42D2-9336-2B707D34BC6D}" type="slidenum">
              <a:rPr lang="zh-CN" altLang="en-US" smtClean="0"/>
            </a:fld>
            <a:endParaRPr lang="zh-CN" altLang="en-US"/>
          </a:p>
        </p:txBody>
      </p:sp>
    </p:spTree>
  </p:cSld>
  <p:clrMapOvr>
    <a:masterClrMapping/>
  </p:clrMapOvr>
</p:notes>`
}
