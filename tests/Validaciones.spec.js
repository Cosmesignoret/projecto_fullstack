
import { validarCorreo, validarContrasena, validarNombre, validarEdad } from '../src/js/validaciones.js'
import { pesos, porcentajeDescuento, urlImagen } from '../src/js/formato.js'

describe('validaciones - cuenta de usuario', () => {
  it('validarCorreo acepta correos válidos y rechaza vacíos o mal escritos', () => {
    expect(validarCorreo('nombre@correo.cl')).toBe('')
    expect(validarCorreo('')).not.toBe('')
    expect(validarCorreo('sin-arroba.cl')).not.toBe('')
    expect(validarCorreo('a@b')).not.toBe('')
  })

  it('validarContrasena exige entre 6 y 20 caracteres', () => {
    expect(validarContrasena('')).not.toBe('')
    expect(validarContrasena('12345')).not.toBe('')
    expect(validarContrasena('123456')).toBe('')
    expect(validarContrasena('a'.repeat(21))).not.toBe('')
  })

  it('validarNombre exige un largo mínimo y máximo', () => {
    expect(validarNombre('', 'El nombre')).not.toBe('')
    expect(validarNombre('Al', 'El nombre')).not.toBe('')
    expect(validarNombre('Ana', 'El nombre')).toBe('')
    expect(validarNombre('a'.repeat(51), 'El nombre')).not.toBe('')
  })

  it('validarEdad acepta solo enteros entre 18 y 100', () => {
    expect(validarEdad('')).not.toBe('')
    expect(validarEdad('abc')).not.toBe('')
    expect(validarEdad('17')).not.toBe('')
    expect(validarEdad('101')).not.toBe('')
    expect(validarEdad('18')).toBe('')
    expect(validarEdad('45')).toBe('')
  })
})

describe('formato', () => {
  it('pesos agrega el signo $ y el separador de miles chileno', () => {
    expect(pesos(89990)).toBe('$89.990')
    expect(pesos(4990)).toBe('$4.990')
  })

  it('porcentajeDescuento calcula el descuento redondeado', () => {
    expect(porcentajeDescuento(89990, 71990)).toBe(20)
    expect(porcentajeDescuento(19990, 13990)).toBe(30)
    expect(porcentajeDescuento(1000, 1000)).toBe(0)
  })

  it('urlImagen deja intactas las URL completas y los data:', () => {
    expect(urlImagen('data:image/gif;base64,AAA')).toBe('data:image/gif;base64,AAA')
    expect(urlImagen('https://stog.cl/a.png')).toBe('https://stog.cl/a.png')
    expect(urlImagen('')).toBe('')
  })
})