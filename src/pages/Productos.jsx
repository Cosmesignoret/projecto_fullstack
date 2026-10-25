import { useState } from 'react'
import ListaJuegos from '../components/ListaJuegos.jsx'
import { useTienda } from '../context/TiendaContext.jsx'

// Quita tildes y mayúsculas para que "accion" encuentre "Acción"
const limpiar = (texto) => texto.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase()

function Productos() {
  const { productos } = useTienda()
  // Lo que el usuario escribe en el buscador
  const [busqueda, setBusqueda] = useState('')

  const filtrados = productos.filter((producto) => limpiar(producto.nombre).includes(limpiar(busqueda)))

  return (
    <>
      <section className="hero">
        <h1>Nuestros videojuegos</h1>
        <p>Elige tu próximo juego favorito.</p>

        <div className="mx-auto" style={{ maxWidth: '400px' }}>
          <input
            type="text"
            className="form-control"
            placeholder="Buscar producto..."
            aria-label="Buscar producto"
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
          />
        </div>
      </section>

      <ListaJuegos productos={filtrados} vacio="No se encontraron productos que coincidan." />
    </>
  )
}

export default Productos
