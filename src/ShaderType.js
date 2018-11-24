import { GLContext } from '@cedric-demongivert/gl-tool-core'

export const FRAGMENT_SHADER = 0
export const VERTEX_SHADER = 1

/**
* Return the label of the given constant.
*
* @param {ShaderType} type - A constant.
* @return {string} The label associated with the given constant.
*/
export function toString (type) {
  switch (type) {
    case FRAGMENT_SHADER: return 'FRAGMENT_SHADER'
    case VERTEX_SHADER: return 'VERTEX_SHADER'
  }

  throw new Error(`'${type}' is not a valid ShaderType constant.`)
}

/**
* contextualise the given constant.
*
* @param {GLContext|WebGLRenderingContext} context - A context.
* @param {ShaderType} type - A constant.
* @return {GLEnum} The associated constant in the given context.
*/
export function contextualise (context, type) {
  const rawContext = GLContext.of(context).context

  switch (type) {
    case FRAGMENT_SHADER: return rawContext.FRAGMENT_SHADER
    case VERTEX_SHADER: return rawContext.VERTEX_SHADER
  }

  throw new Error(`'${type}' is not a valid ShaderType constant.`)
}
