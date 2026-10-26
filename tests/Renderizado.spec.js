import { cleanup, screen } from '@testing-library/react'
import Productos from '../src/pages/Productos.jsx'
import TarjetaProducto from '../src/components/TarjetaProducto.jsx'
import { pesos } from '../src/js/formato.js'
import { renderTienda, JUEGOS } from './ayudas.js'

describe('Pruebas de renderizado Karma', () => {
  afterEach(() => {
    cleanup() // Limpieza
  })

  it('Debe renderizar la tarjeta con los datos del producto recibido', () => {
    const nombreProducto = 'Juego de prueba'
    const precioProducto = 50000
    const descripcionProducto = 'DescripciondePrueba'

    renderTienda(
      <TarjetaProducto
        nombre={nombreProducto}
        precio={precioProducto}
        stock={10}
        descripcion={descripcionProducto}
        imagen="/img/gta.webp"
      />
    )

    // Se comprueba que el producto haya sido renderizado por texto en pantalla.
    expect(screen.getByText(nombreProducto)).toBeTruthy()
    expect(screen.getByText(descripcionProducto)).toBeTruthy()
    expect(screen.getByText(pesos(precioProducto))).toBeTruthy()
  })

  it('Debe mostrar todos los elementos de la lista de productos', () => {
    renderTienda(<Productos />)

    // Un título (h5) por cada juego: se compara con la cantidad real de juegos de la tienda
    expect(screen.getAllByRole('heading', { level: 5 }).length).toBe(JUEGOS.length)
  })

  it('Renderizado condicional: con stock ofrece añadir al carrito', () => {
    renderTienda(
      <TarjetaProducto nombre="Producto Prueba" precio={1000} stock={10}
        descripcion="Validación condicional" imagen="/img/gta.webp" />
    )

    expect(screen.getByRole('button', { name: 'Añadir al carrito' }).disabled).toBeFalse()
    expect(screen.queryByText(/No disponible/i)).toBeNull()
  })

  it('Renderizado condicional: sin stock muestra "No disponible" y deshabilita el botón', () => {
    renderTienda(
      <TarjetaProducto nombre="Producto Prueba" precio={1000} stock={0}
        descripcion="Validación condicional" imagen="/img/gta.webp" />
    )

    const boton = screen.getByRole('button', { name: 'No disponible' })
    expect(boton.disabled).toBeTrue()
  })

  it('Renderizado condicional: un juego en oferta muestra el precio tachado y el descuento', () => {
    renderTienda(
      <TarjetaProducto nombre="Juego en oferta" precio={10000} stock={5} enOferta={true} precioOferta={8000}
        descripcion="Oferta" imagen="/img/gta.webp" />
    )

    expect(screen.getByText('-20%')).toBeTruthy()
    expect(screen.getByText(pesos(8000))).toBeTruthy()
    expect(screen.getByText(pesos(10000))).toBeTruthy()
  })
})
