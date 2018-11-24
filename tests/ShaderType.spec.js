/** eslint-env jest */

import { ShaderType } from '@library'
import { createWebGLContext } from './createWebGLContext'

describe('ShaderType', function () {
  describe('#toString', function () {
    it('return the label associated with the given value', function () {
      for (const key of [
        'VERTEX_SHADER',
        'FRAGMENT_SHADER'
      ]) {
        expect(ShaderType.toString(ShaderType[key])).toBe(key)
      }
    })

    it('throw an error if an invalid constant was passed', function () {
      expect(_ => ShaderType.toString('pwet')).toThrow()
    })
  })

  describe('#contextualise', function () {
    it('return the contextualized constant for the given context', function () {
      const context = createWebGLContext(jest)

      for (const key of [
        'VERTEX_SHADER',
        'FRAGMENT_SHADER'
      ]) {
        expect(
          ShaderType.contextualise(context, ShaderType[key])
        ).toBe(context[key])
      }
    })
  })
})
