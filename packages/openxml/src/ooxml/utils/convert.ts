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
