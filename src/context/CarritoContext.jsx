import { createContext, useContext, useState } from 'react'
import { cargarCarrito, guardarCarrito } from '../data/db.js'

// Estado global del carrito. Se guarda también en localStorage (db.js) para no perderlo
// al recargar la página. "carritoInicial" permite arrancar con juegos ya agregados (pruebas).
const CarritoContext = createContext()

export function CarritoProvider({ children, carritoInicial }) {
  const [carrito, setCarrito] = useState(() => (carritoInicial !== undefined ? carritoInicial : cargarCarrito()))

  // Cambia el estado (para que la pantalla se actualice) y guarda lo mismo en localStorage
  function actualizar(nuevoCarrito) {
    setCarrito(nuevoCarrito)
    guardarCarrito(nuevoCarrito)
  }

  function agregarAlCarrito(producto, cantidad) {
    const existente = carrito.find((item) => item.id === producto.id)

    if (existente) {
      // Si el juego ya está en el carrito, se suma la cantidad en vez de repetir la fila
      actualizar(carrito.map((item) =>
        item.id === producto.id ? { ...item, cantidad: item.cantidad + cantidad } : item
      ))
    } else {
      actualizar([...carrito, {
        id: producto.id,
        nombre: producto.nombre,
        precio: producto.enOferta ? producto.precioOferta : producto.precio,
        imagen: producto.imagen,
        cantidad: cantidad
      }])
    }
  }

  function actualizarCantidad(id, cantidad) {
    actualizar(carrito.map((item) => (item.id === Number(id) ? { ...item, cantidad } : item)))
  }

  function quitarDelCarrito(id) {
    actualizar(carrito.filter((item) => item.id !== Number(id)))
  }

  function vaciarCarrito() {
    actualizar([])
  }

  const total = carrito.reduce((suma, item) => suma + item.precio * item.cantidad, 0)
  const cantidadTotal = carrito.reduce((suma, item) => suma + item.cantidad, 0)

  const valor = {
    carrito,
    agregarAlCarrito,
    actualizarCantidad,
    quitarDelCarrito,
    vaciarCarrito,
    total,
    cantidadTotal
  }

  return (
    <CarritoContext.Provider value={valor}>
      {children}
    </CarritoContext.Provider>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export function useCarrito() {
  return useContext(CarritoContext)
}
