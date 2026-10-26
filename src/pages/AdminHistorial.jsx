import { Link, useParams } from 'react-router-dom'
import { useTienda } from '../context/TiendaContext.jsx'
import { pesos } from '../js/formato.js'

// Historial de compras de un usuario: /admin/usuarios/:id/historial
function AdminHistorial() {
  const { id } = useParams()
  const { buscarUsuarioPorId, ordenesDeUsuario } = useTienda()
  const usuario = buscarUsuarioPorId(id)

  if (usuario === null) {
    return (
      <section className="admin-panel">
        <h1>Usuario no encontrado</h1>
        <Link to="/admin/usuarios" className="btn btn-success">Volver a usuarios</Link>
      </section>
    )
  }

  const compras = ordenesDeUsuario(usuario.correo)
  const totalGastado = compras.reduce((suma, o) => suma + o.total, 0)

  return (
    <>
      <div className="admin-topbar">
        <div>
          <h1>Historial de compras</h1>
          <p className="text-muted mb-0">{usuario.nombre} {usuario.apellidos} · {usuario.correo}</p>
        </div>
        <Link to="/admin/usuarios" className="btn btn-outline-secondary">Volver</Link>
      </div>

      <section className="admin-panel">
        {compras.length === 0 ? (
          <p className="text-muted mb-0">Este usuario todavía no ha comprado.</p>
        ) : (
          <>
            <div className="tabla-scroll">
              <table className="tabla-stog">
                <thead><tr><th>Orden</th><th>Fecha</th><th>Juegos</th><th>Total</th><th></th></tr></thead>
                <tbody>
                  {compras.map((o) => (
                    <tr key={o.numero}>
                      <td>{o.numero}</td>
                      <td>{new Date(o.fecha).toLocaleString('es-CL')}</td>
                      <td>{o.items.map((item) => item.nombre + ' x' + item.cantidad).join(', ')}</td>
                      <td>{pesos(o.total)}</td>
                      <td><Link to={'/admin/ordenes/' + o.numero} className="btn btn-sm btn-success">Boleta</Link></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="mt-3"><strong>Total gastado: {pesos(totalGastado)}</strong></p>
          </>
        )}
      </section>
    </>
  )
}

export default AdminHistorial
