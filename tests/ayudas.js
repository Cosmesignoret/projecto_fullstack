// Ayudas compartidas por las pruebas (este archivo NO es una prueba: no termina en .spec.js).
// Casi todas las páginas necesitan tres cosas a su alrededor: un router, el contexto de la
// tienda y el contexto del carrito. Esta función las arma una sola vez para no repetirlas.
import { render } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { TiendaProvider } from '../src/context/TiendaContext.jsx'
import { CarritoProvider } from '../src/context/CarritoContext.jsx'
import { productos, usuarios, categorias } from '../src/data/productos.js'

// Imagen mínima en base64: así las tarjetas no intentan descargar una imagen de internet
export const IMAGEN_PRUEBA = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7'

// La tienda guarda todo en localStorage (db.js). Antes de CADA prueba se borra, para que lo que
// hizo una prueba (crear un producto, comprar...) no afecte a la siguiente. Como esta función está
// fuera de cualquier describe, Jasmine la ejecuta antes de todas las pruebas de los archivos que
// importan este módulo.
beforeEach(() => {
  localStorage.clear()
})

// Datos iniciales de la tienda, para que las pruebas no dependan de textos escritos a mano
export const JUEGOS = productos
export const USUARIOS = usuarios
export const CATEGORIAS = categorias

// Un usuario de cada perfil, para no depender del orden de la lista
export const ADMIN = usuarios.find((u) => u.rol === 'administrador')
export const VENDEDOR = usuarios.find((u) => u.rol === 'vendedor')
export const CLIENTE = usuarios.find((u) => u.rol === 'cliente')

// Dibuja "ui" dentro de router + TiendaProvider + CarritoProvider.
//   ruta:    URL inicial del router falso (MemoryRouter vive en memoria, no toca el navegador)
//   carrito: juegos que el carrito ya tiene al empezar, [[producto, cantidad], ...]
//   sesion:  usuario con la sesión ya iniciada, o null
export function renderTienda(ui, { ruta = '/', carrito = [], sesion = null } = {}) {
  const carritoInicial = carrito.map(([p, cantidad]) => ({
    id: p.id,
    nombre: p.nombre,
    precio: p.enOferta ? p.precioOferta : p.precio,
    imagen: p.imagen,
    cantidad
  }))
  return render(
    <MemoryRouter initialEntries={[ruta]}>
      <TiendaProvider sesionInicial={sesion}>
        <CarritoProvider carritoInicial={carritoInicial}>{ui}</CarritoProvider>
      </TiendaProvider>
    </MemoryRouter>
  )
}
