import { Link, useLocation } from 'react-router-dom'
import { useCarrito } from '../context/CarritoContext.jsx'
import { useTienda } from '../context/TiendaContext.jsx'
import DetalleCompra from '../components/DetalleCompra.jsx'

function PagoError() {
  // Si venimos del checkout, location.state trae lo que el usuario había escrito.
  // Si entran a esta URL directo, no hay state y datos queda en null.
  const location = useLocation()
  const datos = location.state ? location.state.datos : null
  // El pago falló, así que el carrito sigue intacto y se puede mostrar el detalle de la compra
  const { carrito, total } = useCarrito()
  const { proximoNumeroOrden } = useTienda()

  return (
    <>
      <section className="hero" style={{ borderBottomColor: '#dc3545' }}>
        <h1>No se pudo realizar el pago</h1>
        <p className="mb-0">
          Compra nro <strong>{proximoNumeroOrden}</strong>. No se realizó ningún cobro y tu carrito sigue intacto.
        </p>
      </section>

      <section className="formulario">
        {/* state={{ datos }} devuelve los datos al checkout para que no tenga que volver a escribirlos */}
        <div className="text-center mb-3">
          <Link to="/checkout" state={{ datos }} className="btn btn-success btn-lg">Volver a realizar el pago</Link>
          <Link to="/carrito" className="btn btn-outline-secondary btn-lg ms-2">Volver al carrito</Link>
        </div>

        {datos && carrito.length > 0 && (
          <DetalleCompra
            cliente={{ nombre: datos.nombre, apellidos: datos.apellidos, correo: datos.correo }}
            direccion={{
              calle: datos.calle, departamento: datos.departamento, region: datos.region,
              comuna: datos.comuna, indicaciones: datos.indicaciones
            }}
            items={carrito}
            total={total}
            etiquetaTotal="Total a pagar"
          />
        )}
      </section>
    </>
  )
}

export default PagoError
