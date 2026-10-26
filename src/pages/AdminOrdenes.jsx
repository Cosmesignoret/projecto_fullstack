import { Link } from 'react-router-dom'
import { useTienda } from '../context/TiendaContext.jsx'
import { pesos } from '../js/formato.js'

function AdminOrdenes() {
  const { ordenes } = useTienda()

  return (
    <>
      <div className="admin-topbar"><h1>Órdenes y boletas</h1></div>

      <section className="admin-panel">
        {ordenes.length === 0 ? (
          <p className="text-muted mb-0">Todavía no hay órdenes de compra.</p>
        ) : (
          <div className="tabla-scroll">
            <table className="tabla-stog">
              <thead>
                <tr><th>Orden</th><th>Fecha</th><th>Cliente</th><th>Total</th><th></th></tr>
              </thead>
              <tbody>
                {ordenes.map((orden) => (
                  <tr key={orden.numero}>
                    <td>{orden.numero}</td>
                    <td>{new Date(orden.fecha).toLocaleString('es-CL')}</td>
                    <td>{orden.cliente.nombre} {orden.cliente.apellidos}</td>
                    <td>{pesos(orden.total)}</td>
                    <td><Link to={'/admin/ordenes/' + orden.numero} className="btn btn-sm btn-success">Mostrar boleta</Link></td>
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
