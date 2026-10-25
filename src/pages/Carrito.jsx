import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useCarrito } from '../context/CarritoContext.jsx'
import { useTienda } from '../context/TiendaContext.jsx'
import { pesos, urlImagen } from '../js/formato.js'

function Carrito() {
  const { carrito, actualizarCantidad, quitarDelCarrito, vaciarCarrito, total } = useCarrito()
  const { buscarProductoPorId } = useTienda()
  const [error, setError] = useState('')

  if (carrito.length === 0) {
    return (
      <section className="formulario">
        <h1>Carrito</h1>
        <p>Tu carrito está vacío.</p>
        <Link to="/productos" className="boton">Ver productos</Link>
      </section>
    )
  }

  return (
    <section className="formulario">
      <h1>Carrito</h1>

      {error && <p className="error">{error}</p>}

      <div className="tabla-scroll">
        <table className="tabla-stog">
          <thead>
            <tr>
              <th>Juego</th>
              <th>Precio</th>
              <th>Cantidad</th>
              <th>Subtotal</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {carrito.map((item) => {
              // El stock se consulta al producto original, no se guarda en el carrito
              const producto = buscarProductoPorId(item.id)
              const stock = producto ? producto.stock : item.cantidad

              return (
                <tr key={item.id}>
                  <td>
                    <img src={urlImagen(item.imagen)} alt="" width="64" height="36"
                      className="rounded me-2" style={{ objectFit: 'cover', display: 'inline-block' }} />
                    {item.nombre}
                  </td>
                  <td>{pesos(item.precio)}</td>
                  <td>
                    <input
                      type="number"
                      min="1"
                      max={stock}
                      value={item.cantidad}
                      aria-label={'Cantidad de ' + item.nombre}
                      onChange={(e) => {
                        const nuevaCantidad = Number(e.target.value)

                        if (nuevaCantidad < 1) {
                          return
                        }
                        if (nuevaCantidad > stock) {
                          setError('Solo hay ' + stock + ' unidades disponibles de "' + item.nombre + '".')
                          return
                        }

                        setError('')
                        actualizarCantidad(item.id, nuevaCantidad)
                      }}
                      style={{ width: '70px' }}
                    />
                  </td>
                  <td>{pesos(item.precio * item.cantidad)}</td>
                  <td>
                    <a href="#" onClick={(e) => { e.preventDefault(); setError(''); quitarDelCarrito(item.id) }}>
                      Quitar
                    </a>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      <p className="mt-3 fs-5"><strong>Total: {pesos(total)}</strong></p>

      <div className="mt-3 d-flex flex-wrap gap-2">
        <button className="btn btn-outline-secondary" onClick={() => { setError(''); vaciarCarrito() }}>
          Vaciar carrito
        </button>
        <Link to="/checkout" className="btn btn-success">Ir a pagar</Link>
      </div>
    </section>
  )
}

export default Carrito
