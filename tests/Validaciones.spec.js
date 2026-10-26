// Pruebas de las funciones de validación de los formularios (src/js/validaciones.js).
// Son funciones puras: reciben un dato y devuelven un mensaje de error, o '' si está bien.
import {
  validarCorreo, validarCorreoAdmitido, validarContrasena, validarNombre, validarEdad,
  validarRun, validarDireccion, validarProducto
} from '../src/js/validaciones.js'
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

describe('validaciones - panel de administración', () => {
  it('validarCorreoAdmitido solo acepta duoc.cl, profesor.duoc.cl y gmail.com', () => {
    expect(validarCorreoAdmitido('juan@duoc.cl')).toBe('')
    expect(validarCorreoAdmitido('juan@profesor.duoc.cl')).toBe('')
    expect(validarCorreoAdmitido('juan@gmail.com')).toBe('')
    expect(validarCorreoAdmitido('juan@hotmail.com')).not.toBe('')
  })

  it('validarRun comprueba el dígito verificador', () => {
    expect(validarRun('190110222')).toBe('')
    expect(validarRun('18456789K')).toBe('')
    expect(validarRun('18456789k')).toBe('') // la K minúscula también vale
    expect(validarRun('190110221')).not.toBe('') // dígito verificador incorrecto
    expect(validarRun('')).not.toBe('')
    expect(validarRun('123')).not.toBe('')
  })

  it('validarDireccion exige calle, región y comuna', () => {
    const buena = { calle: 'Av. Siempre Viva 742', region: 'Región Metropolitana de Santiago', comuna: 'Santiago' }

    expect(validarDireccion(buena)).toBe('')
    expect(validarDireccion({ ...buena, calle: '' })).not.toBe('')
    expect(validarDireccion({ ...buena, region: '' })).not.toBe('')
    expect(validarDireccion({ ...buena, comuna: '' })).not.toBe('')
  })

  const producto = {
    codigo: 'PRD-010', categoria: 'Acción', nombre: 'Juego', precio: 10000, stock: 5,
    stockCritico: 2, descripcion: 'Una descripción', enOferta: false, precioOferta: 0
  }

  it('validarProducto acepta un producto correcto y rechaza datos inválidos', () => {
    expect(validarProducto(producto)).toBe('')
    expect(validarProducto({ ...producto, codigo: 'AB' })).not.toBe('')
    expect(validarProducto({ ...producto, precio: 0 })).not.toBe('')
    expect(validarProducto({ ...producto, stock: -1 })).not.toBe('')
    expect(validarProducto({ ...producto, categoria: '' })).not.toBe('')
  })

  it('si el producto está en oferta, el precio de oferta debe ser menor al normal', () => {
    expect(validarProducto({ ...producto, enOferta: true, precioOferta: 8000 })).toBe('')
    expect(validarProducto({ ...producto, enOferta: true, precioOferta: 10000 })).not.toBe('')
    expect(validarProducto({ ...producto, enOferta: true, precioOferta: '' })).not.toBe('')
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
