import { Link } from 'react-router-dom'
import { useCarrito } from '../context/CarritoContext'
import { pesos, porcentajeDescuento, urlImagen } from '../js/formato.js'

// Tarjeta de un videojuego. Se usa en Home, Productos, Categorías y Ofertas.
// "id" es opcional: si viene, el nombre y la imagen llevan al detalle del juego.
export default function TarjetaProducto({
  id,
  nombre,
  precio,
  stock,
  imagen,
  descripcion,
  categoria,
  enOferta = false,
  precioOferta = 0,
  onAgregarCarrito
}) {
  const { carrito } = useCarrito()

  // Se descuentan del stock las unidades que ya están en el carrito para saber si queda disponible
  const cantidadEnCarrito = carrito.find((item) => item.nombre === nombre)?.cantidad || 0
  const stockRestante = stock - cantidadEnCarrito
  const descuento = enOferta ? porcentajeDescuento(precio, precioOferta) : 0

  const titulo = id !== undefined
    ? <Link to={'/productos/' + id} className="nombre-juego">{nombre}</Link>
    : nombre

  const foto = <img src={urlImagen(imagen)} alt={nombre} />

  return (
    <article className="card-juego d-flex flex-column">
      <div className="imagen-juego">
        {enOferta && <span className="badge bg-danger etiqueta-oferta">-{descuento}%</span>}
        {id !== undefined ? <Link to={'/productos/' + id}>{foto}</Link> : foto}
      </div>

      <div className="p-3 d-flex flex-column flex-grow-1">
        {categoria && <span className="categoria">{categoria}</span>}
        <h5 className="nombre-juego mb-2">{titulo}</h5>
        <p className="descripcion flex-grow-1">{descripcion}</p>

        <div className="mb-3">
          {enOferta ? (
            <>
              <span className="text-muted text-decoration-line-through me-2">{pesos(precio)}</span>
              <span className="precio-oferta">{pesos(precioOferta)}</span>
            </>
          ) : (
            <span className="precio">{pesos(precio)}</span>
          )}
        </div>

        <button
          type="button"
          className="btn btn-success w-100"
          onClick={onAgregarCarrito}
          disabled={stockRestante <= 0}
        >
          {stockRestante <= 0 ? 'No disponible' : 'Añadir al carrito'}
        </button>
      </div>
    </article>
  )
}
