// A1 风格单元格引用与 (行, 列) 之间的互转。
// 列采用 26 进制字母(A..Z, AA..),行号 1-based。

/** 0-based 列号转字母,例如 0 -> "A", 26 -> "AA" */
export function colToLetter(col: number): string {
  let letters = ''
  let n = col + 1
  while (n > 0) {
    const rem = (n - 1) % 26
    letters = String.fromCharCode(65 + rem) + letters
    n = Math.floor((n - 1) / 26)
  }
  return letters
}

/** 字母转 0-based 列号,例如 "A" -> 0, "AA" -> 26 */
export function letterToCol(letters: string): number {
  let n = 0
  for (const ch of letters.toUpperCase()) {
    n = n * 26 + (ch.charCodeAt(0) - 64)
  }
  return n - 1
}

/** 解析 A1 引用,返回 { row(1-based), col(0-based) } */
export function parseCellRef(ref: string): { row: number, col: number } {
  const matched = /^([A-Z]+)(\d+)$/i.exec(ref)
  if (!matched) {
    return { row: 1, col: 0 }
  }
  return { col: letterToCol(matched[1]), row: Number(matched[2]) }
}

/** 由 row(1-based) 与 col(0-based) 生成 A1 引用 */
export function toCellRef(row: number, col: number): string {
  return `${colToLetter(col)}${row}`
}
