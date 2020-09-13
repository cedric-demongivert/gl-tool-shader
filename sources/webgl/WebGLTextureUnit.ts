export type WebGLTextureUnit = GLenum

export namespace WebGLTextureUnit {
  export const TEXTURE0  : WebGLTextureUnit = 0x84C0
  export const TEXTURE1  : WebGLTextureUnit = 0x84C1
  export const TEXTURE2  : WebGLTextureUnit = 0x84C2
  export const TEXTURE3  : WebGLTextureUnit = 0x84C3
  export const TEXTURE4  : WebGLTextureUnit = 0x84C4
  export const TEXTURE5  : WebGLTextureUnit = 0x84C5
  export const TEXTURE6  : WebGLTextureUnit = 0x84C6
  export const TEXTURE7  : WebGLTextureUnit = 0x84C7
  export const TEXTURE8  : WebGLTextureUnit = 0x84C8
  export const TEXTURE9  : WebGLTextureUnit = 0x84C9
  export const TEXTURE10 : WebGLTextureUnit = 0x84CA
  export const TEXTURE11 : WebGLTextureUnit = 0x84CB
  export const TEXTURE12 : WebGLTextureUnit = 0x84CC
  export const TEXTURE13 : WebGLTextureUnit = 0x84CD
  export const TEXTURE14 : WebGLTextureUnit = 0x84CE
  export const TEXTURE15 : WebGLTextureUnit = 0x84CF
  export const TEXTURE16 : WebGLTextureUnit = 0x84D0
  export const TEXTURE17 : WebGLTextureUnit = 0x84D1
  export const TEXTURE18 : WebGLTextureUnit = 0x84D2
  export const TEXTURE19 : WebGLTextureUnit = 0x84D3
  export const TEXTURE20 : WebGLTextureUnit = 0x84D4
  export const TEXTURE21 : WebGLTextureUnit = 0x84D5
  export const TEXTURE22 : WebGLTextureUnit = 0x84D6
  export const TEXTURE23 : WebGLTextureUnit = 0x84D7
  export const TEXTURE24 : WebGLTextureUnit = 0x84D8
  export const TEXTURE25 : WebGLTextureUnit = 0x84D9
  export const TEXTURE26 : WebGLTextureUnit = 0x84DA
  export const TEXTURE27 : WebGLTextureUnit = 0x84DB
  export const TEXTURE28 : WebGLTextureUnit = 0x84DC
  export const TEXTURE29 : WebGLTextureUnit = 0x84DD
  export const TEXTURE30 : WebGLTextureUnit = 0x84DE
  export const TEXTURE31 : WebGLTextureUnit = 0x84DF

  export const ALL       : WebGLTextureUnit[] = [
    TEXTURE0,
    TEXTURE1,
    TEXTURE2,
    TEXTURE3,
    TEXTURE4,
    TEXTURE5,
    TEXTURE6,
    TEXTURE7,
    TEXTURE8,
    TEXTURE9,
    TEXTURE10,
    TEXTURE11,
    TEXTURE12,
    TEXTURE13,
    TEXTURE14,
    TEXTURE15,
    TEXTURE16,
    TEXTURE17,
    TEXTURE18,
    TEXTURE19,
    TEXTURE20,
    TEXTURE21,
    TEXTURE22,
    TEXTURE23,
    TEXTURE24,
    TEXTURE25,
    TEXTURE26,
    TEXTURE27,
    TEXTURE28,
    TEXTURE29,
    TEXTURE30,
    TEXTURE31
  ]

  /**
  * Return the index related to the given unit.
  *
  * @param value - Texture unit to map.
  *
  * @return The index of the given unit.
  */
  export function index (value : WebGLTextureUnit) : number {
    return value & 0x001F
  }

  /**
  * Return the unit related to the given index.
  *
  * @param value - Texture unit to map.
  *
  * @return The index of the given unit.
  */
  export function unit (index : WebGLTextureUnit) : number {
    return index | 0x84C0
  }

  /**
  * Stringify the given constant.
  *
  * @param value - A constant.
  *
  * @return The label associated with the given constant.
  */
  export function toString (unit : WebGLTextureUnit) : string {
    const index : number = WebGLTextureUnit.index(unit)

    if (index >= 0 && index < 32) {
      return 'TEXTURE' + index
    } else {
      return undefined
    }
  }
}
