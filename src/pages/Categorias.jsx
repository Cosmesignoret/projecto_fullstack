import { useState } from 'react'
import ListaJuegos from '../components/ListaJuegos.jsx'
import { useTienda } from '../context/TiendaContext.jsx'

function Categorias() {
  const { productos: todos, categorias, buscarProductosPorCategoria } = useTienda()
  // 'Todos' muestra todo sin filtrar; si no, se guarda el nombre de la categoría elegida
  const [activa, setActiva] = useState('Todos')

  const productos = activa === 'Todos' ? todos : buscarProductosPorCategoria(activa)
  const categoriaActual = categorias.find((c) => c.nombre === activa)

  return (
    <>
      <section className="hero">
        <h1>Videojuegos por categoría</h1>
        <p>Explora la tienda filtrando por el género que más te gusta.</p>

        <div className="d-flex flex-wrap justify-content-center gap-2">
          <button
            type="button"
            className={'btn ' + (activa === 'Todos' ? 'btn-success' : 'btn-outline-success')}
            onClick={() => setActiva('Todos')}
          >
            Todos
          </button>
          {categorias.map((cat) => (
            <button
              key={cat.id}
              type="button"
              className={'btn ' + (activa === cat.nombre ? 'btn-success' : 'btn-outline-success')}
              onClick={() => setActiva(cat.nombre)}
            >
              {cat.nombre}
            </button>
          ))}
        </div>

        {categoriaActual && categoriaActual.descripcion && (
          <p className="text-muted mt-3 mb-0">{categoriaActual.descripcion}</p>
        )}
      </section>

      <ListaJuegos productos={productos} vacio="No hay videojuegos disponibles en esta categoría." />
    </>
  )
}

export default Categorias
