import { useParams, Link } from 'react-router-dom'
import { useState } from 'react'
import { Row, Col } from 'react-bootstrap'
import { useTienda } from '../context/TiendaContext.jsx'
import { useCarrito } from '../context/CarritoContext.jsx'
import { pesos, porcentajeDescuento, urlImagen } from '../js/formato.js'

function DetalleProducto() {
  const { id } = useParams()
  const { productos, buscarProductoPorId } = useTienda()
  const producto = buscarProductoPorId(id)
  const { carrito, agregarAlCarrito } = useCarrito()
  const [cantidad, setCantidad] = useState(1)
  const [mensaje, setMensaje] = useState('')
  const [error, setError] = useState('')

  if (!producto) {
    return (
      <section className="formulario">
        <h1>Producto no encontrado</h1>
        <Link to="/productos" className="boton">Volver a Productos</Link>
      </section>
    )
  }

  // Cuántas unidades de este juego ya hay en el carrito
  const itemEnCarrito = carrito.find((item) => item.id === producto.id)
  const enCarrito = itemEnCarrito ? itemEnCarrito.cantidad : 0
  const disponibles = producto.stock - enCarrito
  const relacionados = productos.filter((p) => p.id !== producto.id).slice(0, 3)

  function handleAgregar() {
    setMensaje('')
    setError('')

    if (!Number.isInteger(cantidad) || cantidad < 1) {
      setError('La cantidad debe ser un número entero mayor o igual a 1.')
      return
    }
    if (cantidad > disponibles) {
      setError(disponibles === 0
        ? 'Ya tienes en el carrito todo el stock disponible de este juego.'
        : 'Solo puedes agregar ' + disponibles + ' unidad(es) más de este juego.')
      return
    }

    agregarAlCarrito(producto, cantidad)
    setMensaje('Se agregó "' + producto.nombre + '" al carrito.')
  }

  return (
    <div className="detalle-juego">
      <nav aria-label="breadcrumb">
        <ol className="breadcrumb">
          <li className="breadcrumb-item"><Link to="/productos">Productos</Link></li>
          <li className="breadcrumb-item active">{producto.nombre}</li>
        </ol>
      </nav>

      <Row className="g-5">
        <Col xs={12} lg={6}>
          <img src={urlImagen(producto.imagen)} className="imagen-detalle" alt={producto.nombre} />
        </Col>

        <Col xs={12} lg={6}>
          <span className="text-muted">{producto.categoria}</span>
          <h1 className="fw-bold" style={{ color: 'var(--stog-dark)' }}>{producto.nombre}</h1>

          {producto.enOferta ? (
            <p className="mb-2">
              <span className="text-muted text-decoration-line-through me-2">{pesos(producto.precio)}</span>
              <span className="precio-grande">{pesos(producto.precioOferta)}</span>
              <span className="badge bg-danger ms-2">
                -{porcentajeDescuento(producto.precio, producto.precioOferta)}%
              </span>
            </p>
          ) : (
            <p className="precio-grande mb-2">{pesos(producto.precio)}</p>
          )}

          <p>{producto.descripcion}</p>
          <p className="text-muted small">Código: {producto.codigo} · Stock disponible: {producto.stock}</p>
          {enCarrito > 0 && <p>Ya tienes {enCarrito} en el carrito.</p>}

          <div className="mb-3" style={{ maxWidth: '140px' }}>
            <label htmlFor="cantidad" className="form-label">Cantidad</label>
            <input
              type="number"
              className="form-control"
              id="cantidad"
              min="1"
              max={producto.stock}
              value={cantidad}
              onChange={(e) => setCantidad(Number(e.target.value))}
            />
          </div>

          <button
            className="btn btn-success btn-lg"
            onClick={handleAgregar}
            disabled={disponibles <= 0}
          >
            {disponibles <= 0 ? 'No disponible' : 'Añadir al carrito'}
          </button>

          {error && <p className="error">{error}</p>}
          {mensaje && (
            <div className="alert alert-success mt-3">
              {mensaje} <Link to="/carrito">Ver carrito</Link>
            </div>
          )}
        </Col>
      </Row>

      <h2 className="mt-5 mb-3 fw-bold">Productos relacionados</h2>
      <Row className="g-3">
        {relacionados.map((p) => (
          <Col xs={12} md={4} key={p.id}>
            <div className="tarjeta-info d-flex justify-content-between align-items-center">
              <div>
                <strong>{p.nombre}</strong>
                <div className="precio">{pesos(p.enOferta ? p.precioOferta : p.precio)}</div>
              </div>
              <Link to={'/productos/' + p.id} className="btn btn-outline-success">Ver</Link>
            </div>
          </Col>
        ))}
      </Row>
    </div>
  )
}

export default DetalleProducto
