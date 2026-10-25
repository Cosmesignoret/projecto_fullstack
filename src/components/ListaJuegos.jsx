import TarjetaProducto from './TarjetaProducto.jsx'
import { useCarrito } from '../context/CarritoContext.jsx'

// Dibuja una lista de productos como tarjetas en una rejilla. Lo comparten Productos,
// Categorías, Ofertas y la portada, para no repetir el mismo map en cada página.
function ListaJuegos({ productos, vacio }) {
  const { agregarAlCarrito } = useCarrito()

  if (productos.length === 0) {
    return <p className="text-muted text-center mt-4 fs-5">{vacio}</p>
  }

  return (
    // Grilla de Bootstrap: 1 columna en celular, 2 en tablet, 3 en laptop y 4 en pantallas grandes
    <div className="row row-cols-1 row-cols-sm-2 row-cols-lg-3 row-cols-xl-4 g-4 my-2">
      {productos.map((producto) => (
        <div className="col d-flex" key={producto.id}>
          <TarjetaProducto
            id={producto.id}
            nombre={producto.nombre}
            precio={producto.precio}
            stock={producto.stock}
            imagen={producto.imagen}
            categoria={producto.categoria}
            descripcion={producto.descripcion}
            enOferta={producto.enOferta}
            precioOferta={producto.precioOferta}
            onAgregarCarrito={() => agregarAlCarrito(producto, 1)}
          />
        </div>
      ))}
    </div>
  )
}

export default ListaJuegos
