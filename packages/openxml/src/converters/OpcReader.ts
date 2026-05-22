import type { Unzipped } from 'fflate'
import { unzipSync } from 'fflate'
import { OoxmlNode, pathJoin } from '../ooxml'

export type OpcSource
  = | string
    | number[]
    | Uint8Array
    | ArrayBuffer
    | Blob
    | NodeJS.ReadableStream

function isNodeReadableStream(obj: any): obj is NodeJS.ReadableStream {
  return obj && typeof obj.read === 'function' && typeof obj.on === 'function'
}

/**
 * OPC(Open Packaging Conventions)读取基类。
 *
 * 封装与具体 OOXML 格式无关的能力:把各种来源解成 Uint8Array、解压 zip、
 * 按部件路径读取文本/字节、定位 `_rels` 路径、构造 OoxmlNode。
 * pptx / xlsx 等具体解码器继承它即可复用。
 */
export class OpcReader {
  unzipped?: Unzipped

  protected async _resolveSource(source: OpcSource): Promise<Uint8Array> {
    if (typeof source === 'string') {
      return new TextEncoder().encode(source)
    }
    else if (Array.isArray(source)) {
      return new Uint8Array(source)
    }
    else if (source instanceof Uint8Array) {
      return source
    }
    else if (source instanceof ArrayBuffer) {
      return new Uint8Array(source)
    }
    else if (source instanceof Blob) {
      const arrayBuffer = await source.arrayBuffer()
      return new Uint8Array(arrayBuffer)
    }
    else if (isNodeReadableStream(source)) {
      const chunks: Uint8Array[] = []
      for await (const chunk of source) {
        chunks.push(typeof chunk === 'string' ? new TextEncoder().encode(chunk) : new Uint8Array(chunk))
      }
      const totalLength = chunks.reduce((acc, val) => acc + val.length, 0)
      const result = new Uint8Array(totalLength)
      let offset = 0
      for (const chunk of chunks) {
        result.set(chunk, offset)
        offset += chunk.length
      }
      return result
    }
    else {
      throw new Error('Unsupported source type')
    }
  }

  protected async _open(source: OpcSource): Promise<void> {
    this.unzipped = unzipSync(await this._resolveSource(source))
  }

  protected _resolvePath(path: string): string {
    return path.startsWith('/') ? path.substring(1) : path
  }

  protected _readFile(path?: string, type?: 'text' | 'base64'): any | undefined {
    const uint8Array = path ? this.unzipped?.[this._resolvePath(path)] : undefined
    if (uint8Array) {
      switch (type) {
        case 'text':
          return new TextDecoder().decode(uint8Array)
        case 'base64':
          // eslint-disable-next-line node/prefer-global/buffer
          if (typeof Buffer !== 'undefined') {
            // eslint-disable-next-line node/prefer-global/buffer
            return Buffer.from(uint8Array).toString('base64')
          }
          else if (typeof btoa !== 'undefined') {
            let binary = ''
            for (let i = 0; i < uint8Array.length; i++) {
              binary += String.fromCharCode(uint8Array[i])
            }
            return btoa(binary)
          }
          else {
            throw new TypeError('Failed readFile to base64')
          }
      }
    }
    return uint8Array
  }

  protected _createNode(xml?: string): OoxmlNode {
    return OoxmlNode.fromXML(xml)
  }

  protected _readNode(path?: string): OoxmlNode {
    return this._createNode(this._readFile(path, 'text'))
  }

  protected _getRelsPath(path = ''): string {
    const paths = path.split('/')
    const name = paths.pop()
    return pathJoin(...paths, '_rels', `${name}.rels`)
  }
}
