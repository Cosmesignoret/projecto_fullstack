import { Link, useParams } from 'react-router-dom'
import ListaJuegos from '../components/ListaJuegos.jsx'
import { useTienda } from '../context/TiendaContext.jsx'

// Vista /categorias/:id: los juegos de una sola categoría
function CategoriaDetalle() {
  // El id viaja en la URL como texto ("1"), por eso se convierte con Number()
  const { id } = useParams()
  const { categorias, buscarProductosPorCategoria } = useTienda()
  const categoria = categorias.find((c) => c.id === Number(id))

  // Si alguien entra con un id que no existe, no hay nada que mostrar
  if (!categoria) {
    return (
      <section className="formulario">
        <h1>No encontramos esa categoría</h1>
        <p>Puede que haya sido eliminada. Revisa las categorías disponibles.</p>
        <Link to="/categorias" className="boton">Ver categorías</Link>
      </section>
    )
  }

  return (
    <>
      <section className="hero">
        <h1>{categoria.nombre}</h1>
        <p className="mb-2">{categoria.descripcion}</p>
        <Link to="/categorias">← Todas las categorías</Link>
      </section>

      <ListaJuegos
        productos={buscarProductosPorCategoria(categoria.nombre)}
        vacio="No hay videojuegos disponibles en esta categoría."
      />
    </>
  )
}

export default CategoriaDetalle
