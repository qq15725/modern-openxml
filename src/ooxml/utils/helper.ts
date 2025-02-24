export function clearUndef<T>(obj: T): T {
  if (typeof obj !== 'object' || !obj) {
    return obj
  }
  if (Array.isArray(obj)) {
    return obj.map(v => clearUndef(v)) as T
  }
  const newObj: Record<string, any> = {}
  for (const key in obj) {
    const value = obj[key]
    if (value === undefined || value === null) {
      continue
    }
    newObj[key] = clearUndef(value)
  }
  return newObj as T
}
