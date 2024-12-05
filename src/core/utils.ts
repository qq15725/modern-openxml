export function getNestedValue(obj: any, path: (string | number)[], fallback?: any): any {
  const last = path.length - 1
  if (last < 0)
    return obj === undefined ? fallback : obj
  for (let i = 0; i < last; i++) {
    if (obj == null) {
      return fallback
    }
    obj = obj[path[i]]
  }
  if (obj == null)
    return fallback
  return obj[path[last]] === undefined ? fallback : obj[path[last]]
}

export function getObjectValueByPath(obj: any, path: string, fallback?: any): any {
  // credit: http://stackoverflow.com/questions/6491463/accessing-nested-javascript-objects-with-string-key#comment55278413_6491621
  if (obj == null || !path || typeof path !== 'string')
    return fallback
  if (obj[path] !== undefined)
    return obj[path]
  path = path.replace(/\[(\w+)\]/g, '.$1') // convert indexes to properties
  path = path.replace(/^\./, '') // strip a leading dot
  return getNestedValue(obj, path.split('.'), fallback)
}

export function setNestedValue(obj: any, path: (string | number)[], value: any): void {
  const last = path.length - 1
  for (let i = 0; i < last; i++) {
    if (typeof obj[path[i]] !== 'object')
      obj[path[i]] = {}
    obj = obj[path[i]]
  }
  obj[path[last]] = value
}

export function setObjectValueByPath(obj: any, path: string, value: any): void {
  if (typeof obj !== 'object' || !path)
    return
  path = path.replace(/\[(\w+)\]/g, '.$1')
  path = path.replace(/^\./, '')
  return setNestedValue(obj, path.split('.'), value)
}

export function isObject(objectable: any): objectable is object {
  return objectable !== null && typeof objectable === 'object' && !Array.isArray(objectable)
}

export function deepMerge(
  source: Record<string, any> = {},
  target: Record<string, any> = {},
  out: Record<string, any> = {},
): Record<string, any> {
  for (const key in source) {
    out[key] = source[key]
  }
  for (const key in target) {
    const sourceProperty = source[key]
    const targetProperty = target[key]
    if (
      isObject(sourceProperty)
      && isObject(targetProperty)
    ) {
      out[key] = deepMerge(sourceProperty, targetProperty)
      continue
    }
    out[key] = targetProperty
  }
  return out
}
