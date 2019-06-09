/* eslint-env jest */

import { ShaderType, Shader, GLShader } from '@library'
import { createWebGLContext } from './createWebGLContext'

describe('Shader', function () {
  describe('#constructor', function () {
    it('instanciate a shader of the given type', function () {
      const shader = new Shader(ShaderType.VERTEX_SHADER)

      expect(shader.source).toBeNull()
      expect(shader.type).toBe(ShaderType.VERTEX_SHADER)
    })
  })

  describe('#get source', function () {
    it('return the source code of the shader', function () {
      const shader = new Shader(ShaderType.VERTEX_SHADER)

      expect(shader.source).toBeNull()
    })
  })

  describe('#set source', function () {
    it('change the source code of the shader', function () {
      const shader = new Shader(ShaderType.VERTEX_SHADER)

      expect(shader.source).toBeNull()

      shader.source = 'source code'

      expect(shader.source).toBe('source code')
    })
  })

  describe('#get type', function () {
    it('return the type of the shader', function () {
      const shader = new Shader(ShaderType.VERTEX_SHADER)

      expect(shader.type).toBe(ShaderType.VERTEX_SHADER)
    })
  })

  describe('#commit', function () {
    it('update the source code of all of its contextualisation', function () {
      const contexts = [
        createWebGLContext(jest),
        createWebGLContext(jest),
        createWebGLContext(jest),
        createWebGLContext(jest)
      ]
      const descriptor = new Shader(ShaderType.VERTEX_SHADER)
      const contextualisations = contexts.map(
        context => descriptor.contextualise(context)
      )

      for (const contextualisation of contextualisations) {
        expect(contextualisation.source).toBeNull()
      }

      descriptor.source = 'source code'
      descriptor.commit()

      for (const contextualisation of contextualisations) {
        expect(contextualisation.source).toBe('source code')
      }
    })
  })

  describe('#contextualise', function () {
    it('return a contextualised instance of the shader', function () {
      const context = createWebGLContext(jest)
      const descriptor = new Shader(ShaderType.VERTEX_SHADER)
      const contextualisation = descriptor.contextualise(context)

      expect(contextualisation.descriptor).toBe(descriptor)
      expect(contextualisation).toBeInstanceOf(GLShader)
    })
  })

  describe('Fragment', function () {
    it('instanciate a fragment shader from source code', function () {
      const shader = new Shader.Fragment()

      expect(shader.source).toBeNull()
      expect(shader.type).toBe(ShaderType.FRAGMENT_SHADER)
    })
  })

  describe('Vertex', function () {
    it('instanciate a vertex shader from source code', function () {
      const shader = new Shader.Vertex()

      expect(shader.source).toBeNull()
      expect(shader.type).toBe(ShaderType.VERTEX_SHADER)
    })
  })
})
