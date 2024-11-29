export function clearUndefProp<T extends Record<string, any>>(props: T): T {
  Object.keys(props).forEach(key => {
    if (props[key] === undefined) {
      delete props[key]
    }
  })
  return props
}
