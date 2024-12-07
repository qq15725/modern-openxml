import type { VNode } from '../vnode'
import { defineElement, OXML } from '../../core'
import { withIndents } from '../utils'

/**
 * https://learn.microsoft.com/dotnet/api/documentformat.openxml.spreadsheet.sharedstringtable
 */
@defineElement('x:sst')
export class SharedStringTable extends OXML {
  parse(node: VNode) {
    return node.get('sst/si').map(v => v.findEl<Node>('t')?.textContent || '')
  }

  override toXmlString(strings: any = []) {
    const stringInners = strings.map((v) => {
      return `<si>
  <t>${v}</t>
</si>`
    })

    return `<sst
  xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main"
  count="${strings.length}"
  uniqueCount="${strings.length}"
>
  ${withIndents(stringInners)}
</sst>`
  }
}
