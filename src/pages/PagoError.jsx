import { Link, useLocation } from 'react-router-dom'

function PagoError() {
  // Si venimos del checkout, location.state trae lo que el usuario había escrito.
  // Si entran a esta URL directo, no hay state y datos queda en null.
  const location = useLocation()
  const datos = location.state ? location.state.datos : null

  return (
    <>
      <section className="hero" style={{ borderBottomColor: '#dc3545' }}>
        <h1>Pago rechazado</h1>
        <p className="mb-0">No pudimos procesar tu pago. No se realizó ningún cobro y tu carrito sigue intacto.</p>
      </section>

      <section className="formulario">
        {/* state={{ datos }} devuelve los datos al checkout para que no tenga que volver a escribirlos */}
        <Link to="/checkout" state={{ datos }} className="btn btn-success">Volver a intentar</Link>
        <Link to="/carrito" className="btn btn-outline-secondary ms-2">Volver al carrito</Link>
      </section>
    </>
  )
}

export default PagoError
