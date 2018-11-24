/* eslint-env jest */

import { ShaderType, Shader, GLShader } from '@library'
import { createWebGLContext } from './createWebGLContext'

describe('Shader', function () {
  describe('#constructor', function () {
    it('instanciate a shader with some source code', function () {
      const shader = new Shader('source code', ShaderType.VERTEX_SHADER)

      expect(shader.source).toBe('source code')
      expect(shader.type).toBe(ShaderType.VERTEX_SHADER)
    })
  })

  describe('#get source', function () {
    it('return the source code of the shader', function () {
      const shader = new Shader('source code', ShaderType.VERTEX_SHADER)

      expect(shader.source).toBe('source code')
    })
  })

  describe('#get type', function () {
    it('return the type of the shader', function () {
      const shader = new Shader('source code', ShaderType.VERTEX_SHADER)

      expect(shader.type).toBe(ShaderType.VERTEX_SHADER)
    })
  })

  describe('#contextualise', function () {
    it('return a contextualised instance of the shader', function () {
      const context = createWebGLContext(jest)
      const descriptor = new Shader('source code', ShaderType.VERTEX_SHADER)
      const contextualisation = descriptor.contextualise(context)

      expect(contextualisation.descriptor).toBe(descriptor)
      expect(contextualisation).toBeInstanceOf(GLShader)
    })
  })

  describe('Fragment', function () {
    it('instanciate a fragment shader from source code', function () {
      const shader = new Shader.Fragment('source code')

      expect(shader.source).toBe('source code')
      expect(shader.type).toBe(ShaderType.FRAGMENT_SHADER)
    })
  })

  describe('Vertex', function () {
    it('instanciate a vertex shader from source code', function () {
      const shader = new Shader.Vertex('source code')

      expect(shader.source).toBe('source code')
      expect(shader.type).toBe(ShaderType.VERTEX_SHADER)
    })
  })
})
