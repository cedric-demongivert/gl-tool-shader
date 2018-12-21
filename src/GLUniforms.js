/**
* Uniforms of a given webgl program.
*/
export class GLUniforms {
  /**
  * Create a new uniforms instance for a given program.
  *
  * @param {GLProgram} program - A program that declare the uniforms.
  */
  constructor (program) {
    this._program = program
    this._uniforms = new Map()
  }

  get context () {
    return this._program.context
  }

  /**
  * @return {GLProgram} The program that declare the uniforms.
  */
  get program () {
    return this._program
  }

  /**
  * @return {number} The number of declared uniforms.
  */
  get size () {
    return this._uniforms.size()
  }

  /**
  * Return the value of an uniform.
  *
  * @param {string} name - Name of the uniform to fetch.
  *
  * @return {any} The value of the requested uniform.
  */
  get (name) {
    return this.context.context.getUniform(
      this._program.program,
      this.location(name)
    )
  }

  /**
  * Set the value of an uniform.
  *
  * @param {string} name - Name of the uniform to fetch.
  * @param {...any} params - Value to set, for exact parameters documentation please refer to https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/uniform, https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/uniformMatrix and https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/bindTexture.
  *
  * @return {any} The value of the requested uniform.
  *
  * @throws {InvalidParameterError} If the uniform to set does not exists.
  */
  set (name, ...params) {
    if (!this.has(name)) {
      throw new Error(`Trying to set an undefined uniform named : ${name}.`)
    }

    const size = this._uniforms.get(name).size

    if (size <= 1) {
      this._setValue(name, params)
    } else {
      this._setArray(name, params)
    }
  }

  _setValue (name, params) {
    const location = this._uniforms.get(name).location
    const context = this.context.context

    switch (this._uniforms.get(name).type) {
      case context.FLOAT:
        context.uniform1f(location, ...params)
        break
      case context.FLOAT_VEC2:
        context.uniform2f(location, ...params)
        break
      case context.FLOAT_VEC3:
        context.uniform3f(location, ...params)
        break
      case context.FLOAT_VEC4:
        context.uniform4f(location, ...params)
        break
      case context.INT:
        context.uniform1i(location, ...params)
        break
      case context.INT_VEC2:
        context.uniform2i(location, ...params)
        break
      case context.INT_VEC3:
        context.uniform3i(location, ...params)
        break
      case context.INT_VEC4:
        context.uniform4i(location, ...params)
        break
      case context.FLOAT_MAT2:
        context.uniformMatrix2fv(location, ...params)
        break
      case context.FLOAT_MAT3:
        context.uniformMatrix3fv(location, ...params)
        break
      case context.FLOAT_MAT4:
        context.uniformMatrix4fv(location, ...params)
        break
      case context.SAMPLER_2D: {
        const textureUnit = params[1]
        const texture = params[0]
        context.activeTexture(context[`TEXTURE${textureUnit}`])
        texture.bind()
        context.uniform1i(location, textureUnit)
      } break
      case context.SAMPLER_CUBE: {
        const textureUnit = params[1]
        const texture = params[0]
        context.activeTexture(context[`TEXTURE${textureUnit}`])
        texture.bind()
        context.uniform1i(location, textureUnit)
      } break
    }
  }

  _setArray (name, params) {
    const location = this._uniforms.get(name).location
    const context = this.context.context

    switch (this._uniforms.get(name).type) {
      case context.FLOAT:
        context.uniform1fv(location, ...params)
        break
      case context.FLOAT_VEC2:
        context.uniform2fv(location, ...params)
        break
      case context.FLOAT_VEC3:
        context.uniform3fv(location, ...params)
        break
      case context.FLOAT_VEC4:
        context.uniform4fv(location, ...params)
        break
      case context.INT:
        context.uniform1iv(location, ...params)
        break
      case context.INT_VEC2:
        context.uniform2iv(location, ...params)
        break
      case context.INT_VEC3:
        context.uniform3iv(location, ...params)
        break
      case context.INT_VEC4:
        context.uniform4iv(location, ...params)
        break
    }
  }

  /**
  * Return a pointer over an uniform by using its name.
  *
  * @param {string} name - Name of the uniform to fetch.
  *
  * @return {WebGLUniformLocation} A pointer over the requested uniform.
  */
  location (name) {
    return this._uniforms.get(name).location
  }

  /**
  * Return the type constant of a uniform by using its name.
  *
  * @param {string} name - Name of the uniform to fetch.
  *
  * @return {number} A webgl constant that describe the type of the requested uniform.
  */
  typeof (name) {
    return this._uniforms.get(name).location
  }

  /**
  * Return the size of a uniform by using its name.
  *
  * @param {string} name - Name of the uniform to fetch.
  *
  * @return {number} The size of the requested uniform.
  */
  sizeof (name) {
    return this._uniforms.get(name).size
  }

  /**
  * Check if the program declare a uniform.
  *
  * @param {string} name - Name of the uniform to fetch.
  *
  * @return {boolean} True if the given uniform exists and is active.
  */
  has (name) {
    return this._uniforms.has(name)
  }

  /**
  * Refresh all meta data of each uniforms from the related program.
  *
  * @throws {InvalidInvocationError} When you trying to update uniforms metadatas from an unlinked program.
  */
  update () {
    if (!this._program.linked) {
      throw new Error (
        "Trying to refresh uniforms metadatas from an unlinked program."
      )
    }

    this._uniforms.clear()

    const context = this.context.context
    const program = this._program.program
    const size = context.getProgramParameter(program, context.ACTIVE_UNIFORMS)

    for (let index = 0; index < size; ++index) {
      const info = context.getActiveUniform(program, index)

      this._uniforms.set(info.name, {
        type: info.type,
        size: info.size,
        location: context.getUniformLocation(program, info.name)
      })
    }
  }

  /**
  * Iterate over each registered uniforms.
  */
  * [Symbol.iterator] () {
    yield * this._uniforms
  }
}
