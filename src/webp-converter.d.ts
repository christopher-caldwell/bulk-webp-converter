declare module 'webp-converter' {
  const grant_permission: () => void
  /** Convert other image format to webp */
  const cwebp: (src: string, outputFileName: string, quality: string, logging?: string) => Promise<string>
  /**
   * @argument extension {string} "jpg", "png"
   * @argument quality {string} "-q 80"
   */
  const str2webpstr: (dataBase64: string, extension: string, quality: string) => Promise<unknown>
  const buffer2webpbuffer: () => Promise<unknown>
  const dwebp: () => Promise<unknown>
  /** Convert gif image to webp */
  const gwebp: () => Promise<unknown>

  const webp: {
    grant_permission: typeof grant_permission
    cwebp: typeof cwebp
    str2webpstr: typeof str2webpstr
    buffer2webpbuffer: typeof buffer2webpbuffer
    dwebp: typeof dwebp
    gwebp: typeof gwebp
  }

  export default webp
}
