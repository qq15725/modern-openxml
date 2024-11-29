import type { SelectedValue, XPathSelect } from 'xpath'
import { DOMParser } from 'xmldom'
import { useNamespaces } from 'xpath'

interface Namespaces {
  [name: string]: string
}

export class VNode {
  el: Node

  _namespaces: Namespaces

  _select: XPathSelect

  constructor(el: string | Node, namespaces: Namespaces = {}) {
    if (typeof el === 'string') {
      for (const [, key, value] of el.matchAll(/xmlns:(\w)="(.+?)"/g)) {
        namespaces[key] = value
      }
      this.el = new DOMParser().parseFromString(el)
    }
    else {
      this.el = el
    }
    this._namespaces = namespaces
    this._select = useNamespaces(this._namespaces)
  }

  getEl<T extends Node>() {
    return this.el as T
  }

  getParent() {
    return this.el.parentNode ? new VNode(this.el.parentNode, this._namespaces) : undefined
  }

  findEl<T extends SelectedValue>(selector: string) {
    return this._select(selector, this.el, true) as T | undefined
  }

  attr(selector: string) {
    return this.findEl<Attr>(selector)?.value
  }

  find(selector: string) {
    const el = this.findEl<Node>(selector)
    return el ? new VNode(el, this._namespaces) : undefined
  }

  getEls<T extends SelectedValue>(selector: string) {
    return this._select(selector, this.el) as T[]
  }

  get(selector: string) {
    return this.getEls<Node>(selector).map(el => new VNode(el, this._namespaces))
  }

  toString() {
    return this.getEl().toString()
  }
}

export function createVNode(el: string | Node, namespaces: Namespaces = {}) {
  return new VNode(el, namespaces)
}
