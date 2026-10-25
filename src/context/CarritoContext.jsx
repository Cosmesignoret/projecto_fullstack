import { createContext, useContext, useState } from 'react'
import {
  listarCarrito, guardarCarrito, agregarAlCarrito as dbAgregar,
  actualizarCantidadCarrito, quitarDelCarrito as dbQuitar, vaciarCarrito as dbVaciar
} from '../data/db.js'

// Estado global del carrito. Los datos viven en db.js (localStorage), así el carrito
// sobrevive si se recarga la página. Cada función llama a db.js y guarda el resultado en el estado.
// "carritoInicial" permite arrancar con juegos ya agregados (se usa en las pruebas).
const CarritoContext = createContext()

export function CarritoProvider({ children, carritoInicial }) {
  const [carrito, setCarrito] = useState(() =>
    carritoInicial !== undefined ? guardarCarrito(carritoInicial) : listarCarrito()
  )

  function agregarAlCarrito(producto, cantidad) {
    setCarrito(dbAgregar(producto, cantidad))
  }

  function actualizarCantidad(id, cantidad) {
    setCarrito(actualizarCantidadCarrito(id, cantidad))
  }

  function quitarDelCarrito(id) {
    setCarrito(dbQuitar(id))
  }

  function vaciarCarrito() {
    setCarrito(dbVaciar())
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
