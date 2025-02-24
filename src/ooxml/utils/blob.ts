enum Algorithm {
  sha1 = 'SHA-1',
  sha256 = 'SHA-256',
  sha384 = 'SHA-384',
  sha512 = 'SHA-512',
}

export const IN_BROWSER = typeof window !== 'undefined'
export const SUPPORTS_CRYPTO = IN_BROWSER && 'crypto' in window
export const SUPPORTS_CRYPTO_SUBTLE = SUPPORTS_CRYPTO && 'subtle' in window.crypto

export function hashBlob(blob: Blob, algorithm: 'sha1' | 'sha256' | 'sha384' | 'sha512' = 'sha1'): Promise<string> {
  return new Promise((resolve, reject) => {
    const fileReader = new FileReader()

    fileReader.addEventListener('load', () => {
      crypto.subtle.digest(Algorithm[algorithm], fileReader.result as ArrayBuffer).then((buffer) => {
        const typedArray = new Uint8Array(buffer)
        resolve(Array.prototype.map.call(typedArray, (x: number) => `00${x.toString(16)}`.slice(-2)).join(''))
      })
    })

    fileReader.addEventListener('error', () => {
      reject(fileReader.error)
    })

    fileReader.readAsArrayBuffer(blob)
  })
}
