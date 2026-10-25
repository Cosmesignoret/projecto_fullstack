import { Link } from 'react-router-dom'
import { useTienda } from '../context/TiendaContext.jsx'
import { pesos } from '../js/formato.js'

// Lista de las compras guardadas (solo lectura). Cada número de orden lleva a su boleta.
// Las órdenes también persisten en localStorage.
function AdminOrdenes() {
  const { ordenes } = useTienda()

  return (
    <>
      <div className="admin-topbar"><h1>Órdenes</h1></div>
      <section className="admin-panel">
        <h2>Compras realizadas ({ordenes.length})</h2>
        {ordenes.length === 0 ? (
          <p className="mb-0">Todavía no hay compras.</p>
        ) : (
          <div className="tabla-scroll">
            <table className="tabla-stog">
              <thead><tr><th>N° orden</th><th>Fecha</th><th>Cliente</th><th>Juegos</th><th>Total</th><th></th></tr></thead>
              <tbody>
                {[...ordenes].reverse().map((o) => (
                  <tr key={o.numero}>
                    <td><Link to={'/admin/ordenes/' + o.numero}>{o.numero}</Link></td>
                    <td>{new Date(o.fecha).toLocaleString('es-CL')}</td>
                    <td>{o.cliente.nombre} {o.cliente.apellidos}</td>
                    <td>{o.items.map((i) => i.nombre + ' x' + i.cantidad).join(', ')}</td>
                    <td>{pesos(o.total)}</td>
                    <td><Link to={'/admin/ordenes/' + o.numero} className="btn btn-sm btn-success">Ver boleta</Link></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </>
  )
}

export default AdminOrdenes
