import { splitFromJumpLines } from '../../lib/helpers.mjs'

describe('test splitFromJumpLines function', () => {
  it('should return same', () => {
    let input = "Hola, esto\n"+
      "es un texto de prueba\n"+
      "para ve si funciona"

    let expected = [
      `Hola, esto`,
      `es un texto de prueba`,
      `para ve si funciona`
    ]
    let output = splitFromJumpLines(input, 27)
    expect(output.length).toBe(expected.length)
    expected.forEach((exp, index) => {
      expect(output[index]).toBe(exp)
    })
  })

});