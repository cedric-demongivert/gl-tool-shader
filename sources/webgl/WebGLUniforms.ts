import { WebGLProgramParameter } from './WebGLProgramParameter'
import { WebGLUniformMetadata } from './WebGLUniformMetadata'
import { WebGLFieldType } from './WebGLFieldType'
import { WebGLTextureUnit } from './WebGLTextureUnit'

/**
* Uniforms of a given webgl program.
*/
export class WebGLUniforms {
  private _context : WebGLRenderingContext
  private _program : WebGLProgram

  public readonly uniforms : Map<string, WebGLUniformMetadata>

  private readonly _matrix2fTranspositionBuffer : Float32Array
  private readonly _matrix3fTranspositionBuffer : Float32Array
  private readonly _matrix4fTranspositionBuffer : Float32Array

  /**
  * Create a new uniforms instance.
  */
  public constructor () {
    this._context = null
    this._program = null
    this.uniforms = new Map<string, WebGLUniformMetadata>()
    this._matrix2fTranspositionBuffer = new Float32Array(4)
    this._matrix3fTranspositionBuffer = new Float32Array(9)
    this._matrix4fTranspositionBuffer = new Float32Array(16)
  }

  /**
  * Return the value of an uniform.
  *
  * @param name - Name of the uniform to fetch.
  *
  * @return The value of the requested uniform.
  */
  public get <T> (name : string) : T {
    return this._context.getUniform(
      this._program,
      this.uniforms.get(name).location
    )
  }

  /**
  * Set the value of an uniform if it exists.
  *
  * @param name - Name of the uniform to fetch.
  * @param params - Value to set, for exact parameters documentation please refer to https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/uniform, https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/uniformMatrix and https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/bindTexture.
  */
  public setIfExists (name : string, value : WebGLTextureUnit) : void
  public setIfExists (name : string, value : number) : void
  public setIfExists (name : string, x : number, y : number) : void
  public setIfExists (name : string, x : number, y : number, z : number) : void
  public setIfExists (name : string, x : number, y : number, z : number, w : number) : void
  public setIfExists (name : string, transpose : boolean, matrix : number[]) : void
  public setIfExists (name : string, transpose : boolean, matrix : Float32Array) : void
  public setIfExists (name : string, transpose : boolean, matrix : Int32Array) : void
  public setIfExists (name : string, values : Float32Array) : void
  public setIfExists (name : string, values : Int32Array) : void
  public setIfExists (name : string, values : number[]) : void
  public setIfExists (name : string, ...params : any) : void {
    const uniform : WebGLUniformMetadata = this.uniforms.get(name)

    if (uniform == null) { return }

    if (uniform.size <= 1) {
      this.setScalar(name, params[0], params[1], params[2], params[3])
    } else {
      this.setArray(name, params[0])
    }
  }

  /**
  * Set the value of an uniform.
  *
  * @param name - Name of the uniform to fetch.
  * @param params - Value to set, for exact parameters documentation please refer to https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/uniform, https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/uniformMatrix and https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/bindTexture.
  *
  * @throws If the uniform to set does not exists.
  */
  public set (name : string, value : WebGLTextureUnit) : void
  public set (name : string, value : number) : void
  public set (name : string, x : number, y : number) : void
  public set (name : string, x : number, y : number, z : number) : void
  public set (name : string, x : number, y : number, z : number, w : number) : void
  public set (name : string, transpose : boolean, matrix : number[]) : void
  public set (name : string, transpose : boolean, matrix : Float32Array) : void
  public set (name : string, transpose : boolean, matrix : Int32Array) : void
  public set (name : string, values : Float32Array) : void
  public set (name : string, values : Int32Array) : void
  public set (name : string, values : number[]) : void
  public set (name : string, ...params : any) : void {
    const uniform : WebGLUniformMetadata = this.uniforms.get(name)

    if (uniform == null) {
      throw new Error(`Trying to set an undefined uniform named : ${name}.`)
    }

    if (uniform.size <= 1) {
      this.setScalar(name, params[0], params[1], params[2], params[3])
    } else {
      this.setArray(name, params[0])
    }
  }

  /**
  * Set the value of a scalar uniform.
  *
  * @param name - Name of the uniform to fetch.
  * @param params - Value to set, for exact parameters documentation please refer to https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/uniform, https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/uniformMatrix and https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/bindTexture.
  */
  public setScalar (name : string, value : WebGLTextureUnit) : void
  public setScalar (name : string, value : number) : void
  public setScalar (name : string, x : number, y : number) : void
  public setScalar (name : string, x : number, y : number, z : number) : void
  public setScalar (name : string, x : number, y : number, z : number, w : number) : void
  public setScalar (name : string, transpose : boolean, matrix : number[]) : void
  public setScalar (name : string, transpose : boolean, matrix : Float32Array) : void
  public setScalar (name : string, transpose : boolean, matrix : Int32Array) : void
  public setScalar (name : string, values : number[]) : void
  public setScalar (name : string, values : Float32Array) : void
  public setScalar (name : string, values : Int32Array) : void
  public setScalar (name : string, ...params : any) : void {
    const uniform : WebGLUniformMetadata = this.uniforms.get(name)

    const location : WebGLUniformLocation  = uniform.location
    const webgl    : WebGLRenderingContext = this._context

    switch (uniform.type) {
      case WebGLFieldType.FLOAT:
        if (params[0].length == null) {
          webgl.uniform1f(location, params[0])
        } else {
          webgl.uniform1fv(location, params[0])
        }
        break
      case WebGLFieldType.FLOAT_VEC2:
        if (params[0].length == null) {
          webgl.uniform2f(location, params[0], params[1])
        } else {
          webgl.uniform2fv(location, params[0])
        }
        break
      case WebGLFieldType.FLOAT_VEC3:
        if (params[0].length == null) {
          webgl.uniform3f(location, params[0], params[1], params[2])
        } else {
          webgl.uniform3fv(location, params[0])
        }
        break
      case WebGLFieldType.FLOAT_VEC4:
        if (params[0].length == null) {
          webgl.uniform4f(location, params[0], params[1], params[2], params[3])
        } else {
          webgl.uniform4fv(location, params[0])
        }
        break
      case WebGLFieldType.INT:
        if (params[0].length == null) {
          webgl.uniform1i(location, params[0])
        } else {
          webgl.uniform1iv(location, params[0])
        }
        break
      case WebGLFieldType.INT_VEC2:
        if (params[0].length == null) {
          webgl.uniform2i(location, params[0], params[1])
        } else {
          webgl.uniform2iv(location, params[0])
        }
        break
      case WebGLFieldType.INT_VEC3:
        if (params[0].length == null) {
          webgl.uniform3i(location, params[0], params[1], params[2])
        } else {
          webgl.uniform3iv(location, params[0])
        }
        break
      case WebGLFieldType.INT_VEC4:
        if (params[0].length == null) {
          webgl.uniform4i(location, params[0], params[1], params[2], params[3])
        } else {
          webgl.uniform4iv(location, params[0])
        }
        break
      case WebGLFieldType.FLOAT_MAT2:
        if (params[0]) {
          const a00 : number = params[1][0]
          const a10 : number = params[1][1]
          const a01 : number = params[1][2]
          const a11 : number = params[1][3]

          const buffer : Float32Array = this._matrix2fTranspositionBuffer

          buffer[0] = a00
          buffer[1] = a01
          buffer[2] = a10
          buffer[3] = a11

          webgl.uniformMatrix2fv(location, false, buffer)
        } else {
          webgl.uniformMatrix2fv(location, params[0], params[1])
        }
        break
      case WebGLFieldType.FLOAT_MAT3:
        if (params[0]) {
          const a00 : number = params[1][0]
          const a10 : number = params[1][1]
          const a20 : number = params[1][2]
          const a01 : number = params[1][3]
          const a11 : number = params[1][4]
          const a21 : number = params[1][5]
          const a02 : number = params[1][6]
          const a12 : number = params[1][7]
          const a22 : number = params[1][8]

          const buffer : Float32Array = this._matrix3fTranspositionBuffer

          buffer[0] = a00
          buffer[1] = a01
          buffer[2] = a02
          buffer[3] = a10
          buffer[4] = a11
          buffer[5] = a12
          buffer[6] = a20
          buffer[7] = a21
          buffer[8] = a22

          webgl.uniformMatrix3fv(location, false, buffer)
        } else {
          webgl.uniformMatrix3fv(location, params[0], params[1])
        }
        break
      case WebGLFieldType.FLOAT_MAT4:
        if (params[0]) {
          const a00 : number = params[1][0]
          const a10 : number = params[1][1]
          const a20 : number = params[1][2]
          const a30 : number = params[1][3]
          const a01 : number = params[1][4]
          const a11 : number = params[1][5]
          const a21 : number = params[1][6]
          const a31 : number = params[1][7]
          const a02 : number = params[1][8]
          const a12 : number = params[1][9]
          const a22 : number = params[1][10]
          const a32 : number = params[1][11]
          const a03 : number = params[1][12]
          const a13 : number = params[1][13]
          const a23 : number = params[1][14]
          const a33 : number = params[1][15]

          const buffer : Float32Array = this._matrix4fTranspositionBuffer

          buffer[0] = a00
          buffer[1] = a01
          buffer[2] = a02
          buffer[3] = a03
          buffer[4] = a10
          buffer[5] = a11
          buffer[6] = a12
          buffer[7] = a13
          buffer[8] = a20
          buffer[9] = a21
          buffer[10] = a22
          buffer[11] = a23
          buffer[12] = a30
          buffer[13] = a31
          buffer[14] = a32
          buffer[15] = a33

          webgl.uniformMatrix4fv(location, false, buffer)
        } else {
          webgl.uniformMatrix4fv(location, params[0], params[1])
        }
        break
      case WebGLFieldType.SAMPLER_2D:
        webgl.uniform1i(location,  params[0])
        break
      case WebGLFieldType.SAMPLER_CUBE:
        webgl.uniform1i(location,  params[0])
        break
    }
  }

  /**
  * Set the value of an array of scalar uniform.
  *
  * @param name - Name of the uniform to fetch.
  * @param params - Value to set, for exact parameters documentation please refer to https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/uniform, https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/uniformMatrix and https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/bindTexture.
  */
  public setArray (name : string, buffer : Uint32Array) : void
  public setArray (name : string, buffer : Float32Array) : void
  public setArray (name : string, buffer : number[]) : void
  public setArray (name : string, buffer : any) : void {
    const uniform  : WebGLUniformMetadata  = this.uniforms.get(name)
    const webgl    : WebGLRenderingContext = this._context

    switch (uniform.type) {
      case WebGLFieldType.FLOAT:
        webgl.uniform1fv(uniform.location, buffer)
        break
      case WebGLFieldType.FLOAT_VEC2:
        webgl.uniform2fv(uniform.location, buffer)
        break
      case WebGLFieldType.FLOAT_VEC3:
        webgl.uniform3fv(uniform.location, buffer)
        break
      case WebGLFieldType.FLOAT_VEC4:
        webgl.uniform4fv(uniform.location, buffer)
        break
      case WebGLFieldType.INT:
        webgl.uniform1iv(uniform.location, buffer)
        break
      case WebGLFieldType.INT_VEC2:
        webgl.uniform2iv(uniform.location, buffer)
        break
      case WebGLFieldType.INT_VEC3:
        webgl.uniform3iv(uniform.location, buffer)
        break
      case WebGLFieldType.INT_VEC4:
        webgl.uniform4iv(uniform.location, buffer)
        break
    }
  }

  /**
  * Refresh all meta data of each uniforms from the related program.
  *
  * @throws When you trying to update uniforms metadatas from an unlinked program.
  */
  public update () : void {
    this.uniforms.clear()

    if (this._context.getProgramParameter(this._program, WebGLProgramParameter.LINK_STATUS)) {
      const webgl : WebGLRenderingContext = this._context
      const program : WebGLProgram        = this._program

      const size : number = webgl.getProgramParameter(
        program, WebGLProgramParameter.ACTIVE_UNIFORMS
      )

      for (let index = 0; index < size; ++index) {
        const info : WebGLActiveInfo = webgl.getActiveUniform(program, index)

        this.uniforms.set(info.name, {
          name: info.name,
          type: info.type,
          size: info.size,
          location: webgl.getUniformLocation(program, info.name)
        })
      }
    }
  }

  /**
  * Change the underlying program managed by this instance.
  *
  * @param context - The rendering context of the program to handle.
  * @param program - A program that declare the attributes.
  */
  public handle (context : WebGLRenderingContext, program : WebGLProgram) : void {
    this._context = context
    this._program = program
    this.update()
  }

  /**
  * Iterate over each registered uniforms.
  */
  public * [Symbol.iterator] () : Iterator<WebGLUniformMetadata> {
    return this.uniforms.values()
  }
}
