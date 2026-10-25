import { Link } from 'react-router-dom'
import ListaJuegos from '../components/ListaJuegos.jsx'
import { useTienda } from '../context/TiendaContext.jsx'

// Vista /categorias: arriba una tarjeta por cada categoría (cada una lleva a su propia página,
// /categorias/:id) y abajo los juegos separados por categoría.
function Categorias() {
  const { categorias, buscarProductosPorCategoria } = useTienda()

  return (
    <>
      <section className="hero">
        <h1>Videojuegos por categoría</h1>
        <p className="mb-0">Explora la tienda según el género que más te gusta.</p>
      </section>

      <div className="row row-cols-1 row-cols-sm-2 row-cols-lg-4 g-3 my-2">
        {categorias.map((cat) => (
          <div className="col d-flex" key={cat.id}>
            <Link to={'/categorias/' + cat.id} className="tarjeta-categoria">
              <h2 className="h5">{cat.nombre}</h2>
              <p className="mb-2">{cat.descripcion}</p>
              <small>{buscarProductosPorCategoria(cat.nombre).length} juego(s) · Ver categoría →</small>
            </Link>
          </div>
        ))}
      </div>

      {categorias.map((cat) => {
        const juegos = buscarProductosPorCategoria(cat.nombre)
        // Una categoría sin juegos no dibuja su sección
        if (juegos.length === 0) return null
        return (
          <section key={cat.id} className="mt-4">
            <h2 className="h3">{cat.nombre}</h2>
            <ListaJuegos productos={juegos} vacio="" />
          </section>
        )
      })}
    </>
  )
}

export default Categorias
