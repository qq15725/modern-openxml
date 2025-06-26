import type { OoxmlNode } from '../core'
import { OoxmlValue } from '../core'
import { withAttr, withAttrs, withChildren } from '../utils'

export interface CommonTimeNode {
  type: 'common-time-node'
  nodeType?: string
  mode?: string
  preset?: {
    id?: string
    subtype?: string
    groupId?: string
  }
  delay?: string
  children: TimingNode[]
}

interface Props {
  attribute?: string | null
  duration: number
  delay?: string
  fill?: string
  additive?: string
  id?: string
  mode?: string
}

export interface SetNode extends Props {
  type: 'set'
  value?: string
}

export interface AnimationNode extends Props {
  type: 'animation'
  calcmode?: string
  valueType?: string
  value: { time?: string, value?: string, floatValue?: string, fmla?: string }[]
}

export interface AnimationScaleNode extends Props {
  type: 'animation-scale'
  x: number
  y: number
}

export interface AnimationEffectNode extends Props {
  type: 'animation-effect'
  filter?: string
  transition?: string
}

export interface AnimationRotateNode extends Props {
  type: 'animation-rotate'
  rotate: number
}

export interface AudioNode extends Props {
  type: 'audio'
  crossSlides: number
  showWhenStopped: boolean
  repeatCount: number
  fill: string
  display: boolean
  shapeId: string
}

export interface CommandNode extends Props {
  type: 'command'
  cmd: string
  cmdType: string
}

export type TimingPartNode
  = | SetNode
    | AnimationNode
    | AnimationScaleNode
    | AnimationEffectNode
    | AnimationRotateNode
    | CommandNode

export type TimingNode = CommonTimeNode | TimingPartNode | AudioNode

// 嵌套依次为
// deep0: 点击执行顺序
// deep1: 单次点击的动画连续执行顺序
// deep2: 单次点击的单个连续动画序下并发执行所有动画
function parseNode(node: OoxmlNode, mode?: string): TimingNode {
  const name = node.name

  if (name === 'p:par') {
    node = node.find('p:cTn')!

    const mode = node.attr('@presetClass')
    const preset = {
      id: node.attr('@presetID'),
      subtype: node.attr('@presetSubtype'),
      groupId: node.attr('@grpId'),
    }

    return {
      type: 'common-time-node',
      nodeType: node.attr('@nodeType'),
      mode,
      preset,
      delay: node.attr('p:stCondLst/p:cond/@delay'),
      children: node.get('p:childTnLst/*').map(child => parseNode(child, mode)),
    }
  }

  if (name === 'p:audio') {
    node = node.find('p:cMediaNode')!
    return {
      type: 'audio',
      crossSlides: Number(node.attr('@numSld')),
      showWhenStopped: OoxmlValue.decode(node.attr('@showWhenStopped'), 'boolean'),
      repeatCount: Number(node.attr('p:cTn/@repeatCount')) || 0,
      fill: node.attr('p:cTn/@fill'),
      display: OoxmlValue.decode(node.attr('p:cTn/@display'), 'boolean'),
      shapeId: node.attr('p:tgtEl/p:spTgt/@spid')!,
    } as AudioNode
  }

  const sharedProps = {
    attribute: node.find('p:cBhvr/p:attrNameLst/p:attrName')?.dom.textContent,
    duration: node.attr<number>('p:cBhvr/p:cTn/@dur', 'number') ?? 0,
    delay: node.attr('p:cBhvr/p:cTn/p:stCondLst/p:cond/@delay'),
    fill: node.attr('p:cBhvr/p:cTn/@fill'),
    additive: node.attr('p:cBhvr/@additive'),
    id: node.attr('p:cBhvr/p:tgtEl/p:spTgt/@spid'),
    mode,
  }

  if (name === 'p:set') {
    return {
      ...sharedProps,
      type: 'set',
      value: node.attr('p:to/p:strVal/@val'),
    }
  }

  if (name === 'p:anim') {
    return {
      ...sharedProps,
      type: 'animation',
      calcmode: node.attr('@calcmode'),
      valueType: node.attr('@valueType'),
      value: node.get('p:tavLst/p:tav').map((tav) => {
        return {
          time: tav.attr('@tm'),
          value: tav.attr('p:val/p:strVal/@val'),
          floatValue: tav.attr('p:val/p:fltVal/@val'),
          fmla: tav.attr('@fmla'),
        }
      }),
    }
  }

  if (name === 'p:animScale') {
    return {
      ...sharedProps,
      type: 'animation-scale',
      x: Number(node.attr('p:by/@x')) / 100000,
      y: Number(node.attr('p:by/@y')) / 100000,
    }
  }

  if (name === 'p:animEffect') {
    return {
      ...sharedProps,
      type: 'animation-effect',
      filter: node.attr('@filter'),
      transition: node.attr('@transition'),
    }
  }

  if (name === 'p:animRot') {
    return {
      ...sharedProps,
      type: 'animation-rotate',
      rotate: Number(node.attr('@by')) / 100000,
    }
  }

  if (name === 'p:cmd') {
    return {
      ...sharedProps,
      type: 'command',
      cmd: node.attr('@cmd')!,
      cmdType: node.attr('@type')!,
    }
  }

  return {
    ...sharedProps,
    type: name,
  } as TimingNode
}

export interface Timing {
  mainSequence?: TimingNode[]
  interactiveSequence?: TimingNode[]
  bgmSequnces?: AudioNode[]
}

// p:timing
export function parseTiming(node: OoxmlNode | undefined): Timing | undefined {
  if (!node)
    return undefined

  const root = node.find('p:tnLst/p:par/p:cTn[@nodeType="tmRoot"]')
  const main = root?.find('p:childTnLst/p:seq/p:cTn[@nodeType="mainSeq"]')
  const interactive = root?.find('p:childTnLst/p:seq/p:cTn[@nodeType="interactiveSeq"]')

  return {
    // 主序列
    mainSequence: main?.get('p:childTnLst/*').map(child => parseNode(child)),
    // 触发序列
    interactiveSequence: interactive?.get('p:childTnLst/*').map(child => parseNode(child)),
    // 背景音乐
    bgmSequnces: root?.get('p:childTnLst/p:audio').map(child => parseNode(child) as AudioNode),
  }
}

let ctnId = 2
let grpId: string | undefined
const bldSet = new Set<string>()
function stringifyNode(node: TimingNode): string {
  if (node.type === 'audio') {
    return /* xml */ `
            <p:audio>
                <p:cMediaNode ${withAttrs([
                  withAttr('numSld', node.crossSlides),
                  withAttr('showWhenStopped', OoxmlValue.encode(node.showWhenStopped, 'boolean')),
                ])}>
                    <p:cTn ${withAttrs([
                      withAttr('id', ++ctnId),
                      withAttr('repeatCount', node.repeatCount ? node.repeatCount : 'indefinite'),
                      withAttr('fill', node.fill),
                      withAttr('display', OoxmlValue.encode(node.display, 'boolean')),
                    ])}>
                        <p:stCondLst>
                            <p:cond delay="indefinite"/>
                        </p:stCondLst>
                        <p:endCondLst>
                            <p:cond evt="onStopAudio">
                                <p:tgtEl>
                                    <p:sldTgt/>
                                </p:tgtEl>
                            </p:cond>
                        </p:endCondLst>
                    </p:cTn>
                    <p:tgtEl>
                        <p:spTgt ${withAttrs([withAttr('spid', node.shapeId)])} />
                    </p:tgtEl>
                </p:cMediaNode>
            </p:audio>`
  }
  if (node.type === 'common-time-node') {
    grpId = node.preset?.groupId
    return `
            <p:par>
                <p:cTn ${withAttrs([
                  withAttr('id', ++ctnId),
                  withAttr('presetID', node.preset?.id),
                  withAttr('presetClass', node.mode),
                  withAttr('presetSubtype', node.preset?.subtype),
                  withAttr('fill', 'hold'),
                  withAttr('grpId', node.preset?.groupId),
                  withAttr('nodeType', node.nodeType),
                ])}>
                    <p:stCondLst>
                        <p:cond delay="${ctnId === 3 ? 'indefinite' : node.delay ?? '0'}"/>
                        ${
                          ctnId === 3
                            ? `<p:cond evt="onBegin" delay="0">
                                        <p:tn val="2"/>
                                    </p:cond>`
                            : ''
                        }
                    </p:stCondLst>
                    ${withChildren('p:childTnLst', node.children.map(child => stringifyNode(child)).join(''))}
                </p:cTn>
            </p:par>`
  }
  const common = `
        <p:cBhvr ${withAttrs([withAttr('additive', node.additive)])}>
            <p:cTn ${withAttrs([
              withAttr('id', ++ctnId),
              withAttr('dur', node.duration ?? 'indefinite'),
              withAttr('fill', node.fill),
            ])}${
              typeof node.delay === 'undefined'
                ? '/>'
                : `>
                <p:stCondLst>
                    <p:cond delay="${node.delay}"/>
                </p:stCondLst>
            </p:cTn>`
            }
            <p:tgtEl>
                <p:spTgt ${withAttrs([withAttr('spid', node.id)])} />
            </p:tgtEl>
            ${withChildren('p:attrNameLst', withChildren('p:attrName', node.attribute))}
        </p:cBhvr>`
  if (node.type === 'command') {
    return `<p:cmd ${withAttrs([withAttr('type', node.cmdType), withAttr('cmd', node.cmd)])}>
  ${common}
</p:cmd>`
  }
  bldSet.add(`${node.id}-${grpId}`)
  if (node.type === 'set') {
    return `<p:set>
  ${common}
  <p:to>
      <p:strVal ${withAttrs([withAttr('val', node.value)])} />
  </p:to>
</p:set>`
  }
  if (node.type === 'animation') {
    return `<p:anim ${withAttrs([withAttr('calcmode', node.calcmode), withAttr('valueType', node.valueType)])}>
  ${common}
  <p:tavLst>
  ${node.value.map(item => `<p:tav ${withAttrs([withAttr('tm', item.time), withAttr('fmla', item.fmla)])}>
  <p:val>
    <p:${typeof item.floatValue === 'undefined' ? 'str' : 'flt'}Val ${withAttrs([
      withAttr('val', item.value ?? item.floatValue),
    ])} />
  </p:val>
</p:tav>`)
    .join('')}
  </p:tavLst>
</p:anim>`
  }
  if (node.type === 'animation-scale') {
    return `<p:animScale>
  ${common}
  <p:by ${withAttrs([withAttr('x', node.x * 100000), withAttr('y', node.y * 100000)])} />
</p:animScale>`
  }
  if (node.type === 'animation-effect') {
    return `<p:animEffect ${withAttrs([withAttr('transition', node.transition), withAttr('filter', node.filter)])}>
  ${common}
</p:animEffect>`
  }
  if (node.type === 'animation-rotate') {
    return `<p:animRot ${withAttrs([withAttr('by', node.rotate * 100000)])}>
  ${common}
</p:animRot>`
  }
  return ''
}

export function stringifyMainSeq(timing: Timing): string {
  return /* xml */ `<p:seq concurrent="1" nextAc="seek">
  <p:cTn id="2" dur="indefinite" nodeType="mainSeq">
    <p:childTnLst>
        ${timing.mainSequence?.map(node => stringifyNode(node)).join('')}
    </p:childTnLst>
  </p:cTn>
  <p:prevCondLst>
    <p:cond evt="onPrev" delay="0">
      <p:tgtEl>
        <p:sldTgt/>
      </p:tgtEl>
    </p:cond>
  </p:prevCondLst>
  <p:nextCondLst>
    <p:cond evt="onNext" delay="0">
      <p:tgtEl>
        <p:sldTgt/>
      </p:tgtEl>
    </p:cond>
  </p:nextCondLst>
</p:seq>`
}
export function stringifyAudio(timing: Timing): string {
  return timing.bgmSequnces?.map(node => stringifyNode(node)).join('') ?? ''
}
export function stringifyBldList(): string {
  return /* xml */ bldSet.size
    ? `
        <p:bldLst>
            ${[...bldSet]
              .map((item) => {
                const [spid, grpId] = item.split('-')
                return `<p:bldP spid="${spid}" grpId="${grpId}"/>`
              })
              .join('')}
        </p:bldLst>
    `
    : ''
}
export function stringifyTiming(timing: Timing): string {
  bldSet.clear()
  return timing.mainSequence?.length || timing.bgmSequnces?.length
    ? /* xml */ `
        <p:timing>
            <p:tnLst>
                <p:par>
                    <p:cTn id="1" dur="indefinite" restart="never" nodeType="tmRoot">
                        <p:childTnLst>
                            ${stringifyMainSeq(timing)}
                            ${stringifyAudio(timing)}
                        </p:childTnLst>
                    </p:cTn>
                </p:par>
            </p:tnLst>
            ${stringifyBldList()}
        </p:timing>
    `
    : ''
}
