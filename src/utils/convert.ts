export function encodeForMap<T extends Record<string, any>>(value: any | undefined, map: T): keyof T | undefined {
  if (value === undefined) return undefined
  for (const [k, v] of Object.entries(map)) {
    if (v === value) return k
  }
  return value
}

export function decodeForMap<T extends Record<string, any>>(value: string | undefined, map: T): T[keyof T] | undefined {
  if (value === undefined) return undefined
  return map[value as keyof typeof map]
}

export const Alignment = {
  map: {
    ctr: 'center',
    dist: 'distributed',
    just: 'justified',
    justLow: 'justified-low',
    l: 'left',
    r: 'right',
    thaiDist: 'thai-distributed',
  },
  encode(value?: string) {
    return encodeForMap(value, this.map)
  },
  decode(value?: string) {
    return decodeForMap(value, this.map)
  },
}

export const Anchor = {
  map: {
    ctr: 'middle',
    b: 'bottom',
    t: 'top',
  },
  encode(value?: string) {
    return encodeForMap(value, this.map)
  },
  decode(value?: string) {
    return decodeForMap(value, this.map)
  },
}

export const Bool = {
  encode(value?: boolean) {
    return value === undefined ? undefined : value ? '1' : '0'
  },
  decode(value?: string) {
    return value === undefined ? undefined : value === '1'
  },
}

export const FontSize = {
  encode(value?: number) {
    return value === undefined ? undefined : value * 100
  },
  decode(value?: string) {
    return value === undefined ? undefined : Number(value) / 100
  },
}

export const Pixel = {
  encode(value: number | undefined, type: 'emu' | 'dxa' = 'emu') {
    if (value === undefined) return undefined
    if (type === 'emu') {
      value = value / 96 * 914400
    } else if (type === 'dxa') {
      value = value / 96 * 1440
    }
    return parseFloat(value.toFixed(0))
  },
  decode(value: string | number | undefined, type: 'emu' | 'dxa' = 'emu') {
    if (value === undefined) return undefined
    value = Number(value)
    if (type === 'emu') {
      value = value / 914400 * 96
    } else if (type === 'dxa') {
      value = value / 1440 * 96
    }
    return parseFloat(value.toFixed(2))
  },
}

export const Degree = {
  encode(value?: number) {
    return value === undefined ? undefined : parseFloat((Number(value) * 60000).toFixed(0))
  },
  decode(value?: string | number) {
    return value === undefined ? undefined : parseFloat((Number(value) / 60000).toFixed(2))
  },
}
