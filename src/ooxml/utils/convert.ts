export const EXT_TO_MIMES = {
  jpeg: 'image/jpeg',
  jpg: 'image/jpeg',
  png: 'image/png',
  webp: 'image/webp',
  svg: 'image/svg+xml',
  mp3: 'audio/mpeg',
  mp4: 'video/mp4',
  mov: 'video/quicktime',
} as const
export const MINES_TO_EXT = Object.fromEntries(Object.entries(EXT_TO_MIMES).map(([k, v]) => [v, k]))

export function encodeForMap<T extends Record<string, any>>(value: any | undefined, map: T): keyof T | undefined {
  if (value === undefined)
    return undefined
  for (const [k, v] of Object.entries(map)) {
    if (v === value)
      return k
  }
  return value
}

export function decodeForMap<T extends Record<string, any>>(value: string | undefined, map: T): T[keyof T] | undefined {
  if (value === undefined)
    return undefined
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
