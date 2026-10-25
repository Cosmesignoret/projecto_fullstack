import { createContext, useContext, useState } from 'react'

// Estado global del carrito. Vive en memoria con useState.
// "carritoInicial" permite arrancar con juegos ya agregados (se usa en las pruebas).
const CarritoContext = createContext()

export function CarritoProvider({ children, carritoInicial = [] }) {
  const [carrito, setCarrito] = useState(carritoInicial)

  function agregarAlCarrito(producto, cantidad) {
    const existente = carrito.find((item) => item.id === producto.id)

    if (existente) {
      // Si el juego ya está en el carrito, se suma la cantidad en vez de repetir la fila
      setCarrito(carrito.map((item) =>
        item.id === producto.id ? { ...item, cantidad: item.cantidad + cantidad } : item
      ))
    } else {
      setCarrito([...carrito, {
        id: producto.id,
        nombre: producto.nombre,
        precio: producto.enOferta ? producto.precioOferta : producto.precio,
        imagen: producto.imagen,
        cantidad: cantidad
      }])
    }
  }

  function actualizarCantidad(id, cantidad) {
    setCarrito(carrito.map((item) => (item.id === Number(id) ? { ...item, cantidad } : item)))
  }

  function quitarDelCarrito(id) {
    setCarrito(carrito.filter((item) => item.id !== Number(id)))
  }

  function vaciarCarrito() {
    setCarrito([])
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
