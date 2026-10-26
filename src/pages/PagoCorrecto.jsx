import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { useTienda } from '../context/TiendaContext.jsx'
import DetalleCompra from '../components/DetalleCompra.jsx'

function PagoCorrecto() {
  // El número de orden viaja en la URL: /pago-correcto/ST-ORD-1001
  const { numero } = useParams()
  const { buscarOrdenPorNumero } = useTienda()
  const orden = buscarOrdenPorNumero(numero)
  const [mensaje, setMensaje] = useState('')

  // Si alguien entra con un número que no existe, no hay nada que mostrar
  if (orden === null) {
    return (
      <section className="formulario">
        <h1>No encontramos esa orden</h1>
        <p>Revisa el número de orden o vuelve a la tienda.</p>
        <Link to="/productos" className="boton">Ver productos</Link>
      </section>
    )
  }

  // 'es-CL' muestra la fecha en formato chileno
  const fecha = new Date(orden.fecha).toLocaleString('es-CL')

  return (
    <>
      <section className="hero">
        <h1>¡Compra exitosa!</h1>
        <p>Se ha realizado la compra. Este es tu número de orden:</p>
        <p className="fs-4 mb-0"><strong>{orden.numero}</strong></p>
      </section>

      <section className="formulario">
        <p className="text-muted text-end">Fecha: {fecha}</p>
        <DetalleCompra cliente={orden.cliente} direccion={orden.direccion} items={orden.items} total={orden.total} />

        <div className="d-flex flex-wrap justify-content-center gap-2 mt-3 d-print-none">
          {/* window.print() abre el cuadro de impresión del navegador, desde donde se guarda como PDF */}
          <button type="button" className="btn btn-danger" onClick={() => window.print()}>
            Imprimir boleta en PDF
          </button>
          <button type="button" className="btn btn-success"
            onClick={() => setMensaje('Boleta enviada a ' + orden.cliente.correo)}>
            Enviar boleta por email
          </button>
          <Link to="/productos" className="btn btn-outline-secondary">Seguir comprando</Link>
        </div>
        {mensaje && <div className="alert alert-success mt-3" role="status">{mensaje}</div>}
      </section>
    </>
  )
}

export default PagoCorrecto
