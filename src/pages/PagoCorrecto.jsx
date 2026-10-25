import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { useTienda } from '../context/TiendaContext.jsx'
import ResumenCompra from '../components/ResumenCompra.jsx'

function PagoCorrecto() {
  // El número de orden viaja en la URL: /pago-correcto/ST-ORD-1001
  const { numero } = useParams()
  const { buscarOrdenPorNumero } = useTienda()
  const orden = buscarOrdenPorNumero(numero)
  // true cuando el usuario presionó "Enviar boleta por email"
  const [enviada, setEnviada] = useState(false)

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

  // Abre el diálogo de impresión del navegador; ahí se elige "Guardar como PDF".
  // Al imprimir, el CSS oculta el menú, el pie de página y los botones (clase "no-imprimir").
  function handleImprimir() {
    window.print()
  }

  // El envío es simulado: no hay servidor de correo, solo se muestra el aviso
  function handleEnviar() {
    setEnviada(true)
  }

  return (
    <>
      <section className="hero">
        <h1>¡Compra exitosa!</h1>
        <p>Tu pago fue aprobado. Este es tu número de orden:</p>
        <p className="fs-4 mb-0"><strong>{orden.numero}</strong></p>
      </section>

      <section className="formulario">
        <p className="text-muted">Fecha: {fecha} · Método de pago: {orden.metodoPago}</p>
        <ResumenCompra
          cliente={orden.cliente}
          direccion={orden.direccion}
          items={orden.items}
          total={orden.total}
          etiquetaTotal="Total pagado"
        />

        <div className="no-imprimir mt-4">
          <button type="button" className="btn btn-danger" onClick={handleImprimir}>
            Imprimir boleta en PDF
          </button>
          <button type="button" className="btn btn-success ms-2" onClick={handleEnviar}>
            Enviar boleta por email
          </button>
          <Link to="/productos" className="btn btn-outline-secondary ms-2">Seguir comprando</Link>

          {enviada && (
            <div className="alert alert-success mt-3 mb-0" role="status">
              Enviamos la boleta a {orden.cliente.correo}.
            </div>
          )}
        </div>
      </section>
    </>
  )
}

export default PagoCorrecto
