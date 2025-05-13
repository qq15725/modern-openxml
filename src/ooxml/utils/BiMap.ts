export class BiMap<K, V> {
  forward = new Map<K, V>()
  reverse = new Map<V, K>()

  constructor(source: Record<any, any>) {
    for (const key in source) {
      this.set(key as any, source[key])
    }
  }

  set(key: K, value: V): void {
    this.forward.set(key, value)
    this.reverse.set(value, key)
  }

  getValue(key: K): V | undefined {
    return this.forward.get(key)
  }

  getKey(value: V): K | undefined {
    return this.reverse.get(value)
  }

  deleteByKey(key: K): void {
    const value = this.forward.get(key)
    this.forward.delete(key)
    if (value !== undefined) {
      this.reverse.delete(value)
    }
  }

  deleteByValue(value: V): void {
    const key = this.reverse.get(value)
    this.reverse.delete(value)
    if (key !== undefined) {
      this.forward.delete(key)
    }
  }
}
