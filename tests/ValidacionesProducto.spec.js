import { validarEntero, validarProducto } from '../src/js/validaciones.js'

// Un formulario de producto válido: cada prueba le cambia solo lo que quiere probar
function formValido() {
  return {
    nombre: 'Juego de prueba', descripcion: 'Una descripción', categoria: 'Acción',
    precio: '10000', stock: '10', stockCritico: '2', enOferta: false, precioOferta: ''
  }
}

describe('validaciones - formulario de producto (admin)', () => {
  it('validarEntero acepta enteros dentro del rango y rechaza vacíos, decimales y texto', () => {
    expect(validarEntero('5', 'El stock', 0, 10)).toBe('')
    expect(validarEntero('', 'El stock')).not.toBe('')
    expect(validarEntero('abc', 'El stock')).not.toBe('')
    expect(validarEntero('1.5', 'El stock')).not.toBe('')
    expect(validarEntero('-1', 'El stock', 0)).not.toBe('')
    expect(validarEntero('11', 'El stock', 0, 10)).not.toBe('')
  })

  it('validarProducto no devuelve errores con un formulario válido', () => {
    expect(validarProducto(formValido())).toEqual({})
  })

  it('validarProducto marca cada campo obligatorio vacío', () => {
    const errores = validarProducto({ ...formValido(), nombre: '', descripcion: '', categoria: '', precio: '' })
    expect(Object.keys(errores)).toEqual(['nombre', 'descripcion', 'categoria', 'precio'])
  })

  it('validarProducto rechaza precio 0 y stock negativo', () => {
    const errores = validarProducto({ ...formValido(), precio: '0', stock: '-3' })
    expect(errores.precio).toBeDefined()
    expect(errores.stock).toBeDefined()
  })

  it('el precio de oferta solo se valida si está en oferta, y debe ser menor al precio normal', () => {
    // sin oferta, el precio de oferta se ignora
    expect(validarProducto({ ...formValido(), precioOferta: '99999' })).toEqual({})
    // en oferta y mayor al precio normal: error
    expect(validarProducto({ ...formValido(), enOferta: true, precioOferta: '20000' }).precioOferta).toBeDefined()
    // en oferta y menor: correcto
    expect(validarProducto({ ...formValido(), enOferta: true, precioOferta: '8000' })).toEqual({})
  })
})
