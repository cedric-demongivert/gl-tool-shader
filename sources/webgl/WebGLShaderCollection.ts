import { System } from '@cedric-demongivert/gl-tool-ecs'
import { Pack } from '@cedric-demongivert/gl-tool-collection'

import { ShaderCollectionListener } from '../systems/ShaderCollectionListener'
import { ShaderCollection } from '../systems/ShaderCollection'

import { ShaderType } from '../ShaderType'
import { ShaderSource } from '../ShaderSource'
import { ShaderIdentifier } from '../ShaderIdentifier'

import { WebGLShaderState } from './WebGLShaderState'
import { WebGLShaderType } from './WebGLShaderType'
import { WebGLShaderParameter } from './WebGLShaderParameter'
import { WebGLShaderCompilationError } from './WebGLShaderCompilationError'

export class WebGLShaderCollection extends System implements ShaderCollectionListener {
  /**
  * This collection webgl context.
  */
  private _webgl : WebGLRenderingContext

  /**
  * A sequence of all existing webgl shader indexed by their application identifier.
  */
  private _shaders : Pack<WebGLShader>

  /**
  * A sequence of all existing webgl shader states indexed by their application identifier.
  */
  private _states : Pack<WebGLShaderState>

  /**
  * Parent application shader collection.
  */
  private _descriptors : ShaderCollection

  /**
  * Instantiate a new webgl shader collection for a given context.
  *
  * @param webgl - A webgl context.
  */
  public constructor (webgl : WebGLRenderingContext) {
    super()
    this._shaders = Pack.uint32(0)
    this._states = Pack.uint8(0)
    this._webgl = webgl
    this._descriptors = null
  }

  /**
  * @see ShaderCollectionListener.afterSubscription
  */
  public afterSubscription (collection : ShaderCollection) : void {
    if (this._descriptors == null) {
      this._descriptors = collection
      this._shaders.reallocate(this._descriptors.capacity)
      this._states.reallocate(this._descriptors.capacity)
    } else {
      throw new Error(
        'Unable to subscribe this WebGLShaderCollection to the given ' +
        'ShaderCollection because this WebGLShaderCollection was already ' +
        'registered into another ShaderCollection instance.'
      )
    }
  }

  /**
  * @see ShaderCollectionListener.beforeUnsubscription
  */
  public beforeUnsubscription (collection : ShaderCollection) : void {
    if (this._descriptors === collection) {
      this._descriptors = null
      this._shaders.reallocate(0)
      this._states.reallocate(0)
    } else {
      throw new Error(
        'Unable to unsubscribe this WebGLShaderCollection from the given ' +
        'ShaderCollection because this WebGLShaderCollection was registered ' +
        'into another ShaderCollection instance.'
      )
    }
  }

  /**
  * @see ShaderCollectionListener.delete
  */
  public beforeShaderDeletion (identifier : ShaderIdentifier) : void {
    const state : WebGLShaderState = this._states.get(identifier)

    if (state !== WebGLShaderState.BLANK) {
      this._webgl.deleteShader(this._shaders.get(identifier))
    }
  }

  /**
  * @see ShaderCollectionListener.afterShaderCreation
  */
  public afterShaderCreation (identifier : ShaderIdentifier) : void {
    this._states.set(identifier, WebGLShaderState.BLANK)
  }

  /**
  * @see ShaderCollectionListener.afterShaderUpdate
  */
  public afterSourceUpdate (identifier : ShaderIdentifier) : void {
    if (this._states.get(identifier) !== WebGLShaderState.BLANK) {
      this._states.set(identifier, WebGLShaderState.DIRTY)
    }
  }

  /**
  * Instantiate the requested shader and return it's associated WebGL pointer.
  *
  * @param identifier - The shader to instantiate.
  */
  public instantiate (identifier : ShaderIdentifier) : WebGLShader {
    const state : WebGLShaderState = this._states.get(identifier)

    if (state === WebGLShaderState.BLANK) {
      const type : ShaderType = this._descriptors.getType(identifier)

      let shader : WebGLShader

      switch (type) {
        case ShaderType.FRAGMENT:
          shader = this._webgl.createShader(WebGLShaderType.FRAGMENT_SHADER)
          break
        case ShaderType.VERTEX:
          shader = this._webgl.createShader(WebGLShaderType.VERTEX_SHADER)
          break
        default:
          throw new Error(
            'Unable to instantiate a shader of abstract type #' + type +
            ' "' + ShaderType.toString(type) + '" because this abstract type ' +
            'is not currently handled by the WebGLShaderCollection.'
          )
      }

      this._shaders.set(identifier, shader)
      return shader
    } else {
      throw new Error(
        'Unable to instantiate the shader #' + identifier + ' because this ' +
        'shader was already instantiated and is currently in #' + state +
        ' "' + WebGLShaderState.toString(state) + '" state.'
      )
    }
  }

  /**
  * Do compile the requested shader.
  *
  * @param identifier - Shader to compile.
  */
  public compile (identifier : ShaderIdentifier) : void {
    const webgl : WebGLRenderingContext = this._webgl
    const shader : WebGLShader = this._shaders.get(identifier)
    const state : WebGLShaderState = this._states.get(identifier)

    switch (state) {
      case WebGLShaderState.ERROR:
        throw new WebGLShaderCompilationError(webgl, shader)
      case WebGLShaderState.BLANK:
        throw new Error(
          'Unable to compile shader #' + identifier + ' because the given ' +
          'shader was not instantiated.'
        )
      case WebGLShaderState.DIRTY:
        const source : ShaderSource = this._descriptors.getSource(identifier)

        if (source.isEmpty()) {
          throw new Error(
            'Unable to compile shader #' + identifier + ' because the given ' +
            'shader does not have any source attached to it.'
          )
        } else {
          webgl.shaderSource(shader, source.content)
          webgl.compileShader(shader)

          if (!webgl.getShaderParameter(shader, WebGLShaderParameter.COMPILE_STATUS)) {
            this._states.set(identifier, WebGLShaderState.ERROR)
            throw new WebGLShaderCompilationError(webgl, shader)
          }

          this._states.set(identifier, WebGLShaderState.READY)
        }
      case WebGLShaderState.READY:
        return
      default:
        throw new Error(
          'Unable to compile shader #' + identifier + ' in state #' + state +
          ' "' + WebGLShaderState.toString(state) + '" because this ' +
          'WebGLShaderCollection does not define a compilation procedure for ' +
          'shaders in this state.'
        )
    }
  }

  /**
  * Instantiate and compile the given shader.
  *
  * @param identifier - The shader to bootstrap.
  */
  public bootstrap (identifier : ShaderIdentifier) : void {
    const webgl : WebGLRenderingContext = this._webgl
    const state : WebGLShaderState = this._states.get(identifier)

    switch (state) {
      case WebGLShaderState.ERROR:
        throw new WebGLShaderCompilationError(webgl, this._shaders.get(identifier))
      case WebGLShaderState.BLANK:
        this.instantiate(identifier)
      case WebGLShaderState.DIRTY:
        this.compile(identifier)
      case WebGLShaderState.READY:
        return
      default:
        throw new Error(
          'Unable to readify shader #' + identifier + ' in state #' + state +
          ' "' + WebGLShaderState.toString(state) + '" because this ' +
          'WebGLShaderCollection does not define a readify procedure for ' +
          'shaders in this state.'
        )
    }
  }

  /**
  * Release the requested shader.
  *
  * @param identifier - Shader to free.
  */
  public free (identifier : ShaderIdentifier) : void {
    const state : WebGLShaderState = this._states.get(identifier)

    if (state !== WebGLShaderState.BLANK) {
      this._webgl.deleteShader(this._shaders.get(identifier))
    } else {
      throw new Error(
        'Unable to free the shader #' + identifier + ' because this ' +
        'shader was not instantiated into this context.'
      )
    }
  }

  /**
  * @return The parent application shader collection.
  */
  public getDescriptors () : ShaderCollection {
    return this._descriptors
  }

  /**
  * @return The WebGLContext of this collection.
  */
  public getContext () : WebGLRenderingContext {
    return this._webgl
  }

  /**
  * Return the shader pointer associated with the given identifier.
  *
  * @param identifier - A shader identifier.
  *
  * @return The pointer associated with the given identifier.
  */
  public getShader (identifier : ShaderIdentifier) : WebGLShader {
    if (this._states.get(identifier) !== WebGLShaderState.BLANK) {
      return this._shaders.get(identifier)
    } else {
      throw new Error(
        'Unable to return the pointer associated to the shader #' + identifier +
        ' because this shader was not instantiated into this context.'
      )
    }
  }

  public getState (identifier : ShaderIdentifier) : WebGLShaderState {
    return this._states.get(identifier)
  }

  /**
  * Attach a shader to a program.
  */
  public attachShader (program : WebGLProgram, shader : ShaderIdentifier) : void {
    if (this._states.get(shader) !== WebGLShaderState.BLANK) {
      this._webgl.attachShader(program, this._shaders.get(shader))
    } else {
      throw new Error(
        'Unable to attach the shader #' + shader + ' to the WebGLProgram #' +
        program + ' because this shader was not instantiated into this context.'
      )
    }
  }

  /**
  * Detach a shader from a program.
  */
  public detachShader (program : WebGLProgram, shader : ShaderIdentifier) : void {
    if (this._states.get(shader) !== WebGLShaderState.BLANK) {
      this._webgl.detachShader(program, this._shaders.get(shader))
    } else {
      throw new Error(
        'Unable to detach the shader #' + shader + ' from the WebGLProgram #' +
        program + ' because this shader was not instantiated into this context.'
      )
    }
  }

  /**
  * @see System.destroy
  */
  public destroy () {
    if (this._descriptors != null) {
      this._descriptors.deleteListener(this)
    }
  }
}
