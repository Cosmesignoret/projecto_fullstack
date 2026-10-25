import { Link, useParams } from 'react-router-dom'
import { useTienda } from '../context/TiendaContext.jsx'
import { pesos } from '../js/formato.js'

function PagoCorrecto() {
  // El número de orden viaja en la URL: /pago-correcto/ST-ORD-1001
  const { numero } = useParams()
  const { buscarOrdenPorNumero } = useTienda()
  const orden = buscarOrdenPorNumero(numero)

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
        <p>Tu pago fue aprobado. Este es tu número de orden:</p>
        <p className="fs-4 mb-0"><strong>{orden.numero}</strong></p>
      </section>

      <section className="formulario">
        <h2 className="mt-0">Resumen de la compra</h2>
        <p>Fecha: {fecha}</p>
        <div className="tabla-scroll">
          <table className="tabla-stog">
            <thead>
              <tr>
                <th>Juego</th>
                <th>Cantidad</th>
                <th>Subtotal</th>
              </tr>
            </thead>
            <tbody>
              {orden.items.map((item) => (
                <tr key={item.id}>
                  <td>{item.nombre}</td>
                  <td>{item.cantidad}</td>
                  <td>{pesos(item.precio * item.cantidad)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-3"><strong>Total pagado: {pesos(orden.total)}</strong></p>
      </section>

      <section className="formulario mt-3">
        <h2 className="mt-0">Datos de la compra</h2>
        <p>{orden.cliente.nombre} {orden.cliente.apellidos} · {orden.cliente.correo}</p>
        <p>Método de pago: {orden.metodoPago}</p>
        <p>Enviamos las claves de descarga de tus juegos a tu correo.</p>
        <Link to="/productos" className="boton">Seguir comprando</Link>
      </section>
    </>
  )
}

export default PagoCorrecto
