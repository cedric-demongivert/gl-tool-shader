export type TextureUnit = GLenum

export namespace TextureUnit {
  export const TEXTURE0  : TextureUnit = 0x84C0
  export const TEXTURE1  : TextureUnit = 0x84C1
  export const TEXTURE2  : TextureUnit = 0x84C2
  export const TEXTURE3  : TextureUnit = 0x84C3
  export const TEXTURE4  : TextureUnit = 0x84C4
  export const TEXTURE5  : TextureUnit = 0x84C5
  export const TEXTURE6  : TextureUnit = 0x84C6
  export const TEXTURE7  : TextureUnit = 0x84C7
  export const TEXTURE8  : TextureUnit = 0x84C8
  export const TEXTURE9  : TextureUnit = 0x84C9
  export const TEXTURE10 : TextureUnit = 0x84CA
  export const TEXTURE11 : TextureUnit = 0x84CB
  export const TEXTURE12 : TextureUnit = 0x84CC
  export const TEXTURE13 : TextureUnit = 0x84CD
  export const TEXTURE14 : TextureUnit = 0x84CE
  export const TEXTURE15 : TextureUnit = 0x84CF
  export const TEXTURE16 : TextureUnit = 0x84D0
  export const TEXTURE17 : TextureUnit = 0x84D1
  export const TEXTURE18 : TextureUnit = 0x84D2
  export const TEXTURE19 : TextureUnit = 0x84D3
  export const TEXTURE20 : TextureUnit = 0x84D4
  export const TEXTURE21 : TextureUnit = 0x84D5
  export const TEXTURE22 : TextureUnit = 0x84D6
  export const TEXTURE23 : TextureUnit = 0x84D7
  export const TEXTURE24 : TextureUnit = 0x84D8
  export const TEXTURE25 : TextureUnit = 0x84D9
  export const TEXTURE26 : TextureUnit = 0x84DA
  export const TEXTURE27 : TextureUnit = 0x84DB
  export const TEXTURE28 : TextureUnit = 0x84DC
  export const TEXTURE29 : TextureUnit = 0x84DD
  export const TEXTURE30 : TextureUnit = 0x84DE
  export const TEXTURE31 : TextureUnit = 0x84DF

  export const ALL       : TextureUnit[] = [
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
  export function index (value : TextureUnit) : number {
    return value & 0x001F
  }

  /**
  * Return the unit related to the given index.
  *
  * @param value - Texture unit to map.
  *
  * @return The index of the given unit.
  */
  export function unit (index : TextureUnit) : number {
    return index | 0x84C0
  }

  /**
  * Stringify the given constant.
  *
  * @param value - A constant.
  *
  * @return The label associated with the given constant.
  */
  export function toString (unit : TextureUnit) : string {
    const index : number = TextureUnit.index(unit)

    if (index >= 0 && index < 32) {
      return 'TEXTURE' + index
    } else {
      return undefined
    }
  }
}
