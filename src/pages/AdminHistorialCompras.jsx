import { Link, useParams } from 'react-router-dom'
import { useTienda } from '../context/TiendaContext.jsx'
import { comprasDeUsuario } from '../js/reportes.js'
import { pesos } from '../js/formato.js'

// Historial de compras de un usuario: /admin/usuarios/:id/compras
function AdminHistorialCompras() {
  const { id } = useParams()
  const { usuarios, ordenes } = useTienda()
  const usuario = usuarios.find((u) => u.id === Number(id))

  if (!usuario) {
    return (
      <>
        <div className="admin-topbar"><h1>Historial de compras</h1></div>
        <section className="admin-panel">
          <p>No existe el usuario solicitado.</p>
          <Link to="/admin/usuarios" className="btn btn-success">Volver a usuarios</Link>
        </section>
      </>
    )
  }

  const compras = comprasDeUsuario(ordenes, usuario.correo)
  const totalGastado = compras.reduce((suma, o) => suma + o.total, 0)

  return (
    <>
      <div className="admin-topbar"><h1>Historial de compras</h1></div>

      <section className="admin-panel mb-3">
        <h2>{usuario.nombre} {usuario.apellidos}</h2>
        <p className="mb-1">{usuario.correo}</p>
        <p className="mb-0">
          {compras.length} compra(s) · Total gastado: <strong>{pesos(totalGastado)}</strong>
        </p>
      </section>

      <section className="admin-panel">
        <h2>Compras</h2>
        {compras.length === 0 ? (
          <p>Este usuario todavía no ha realizado compras.</p>
        ) : (
          <div className="tabla-scroll">
            <table className="tabla-stog">
              <thead>
                <tr><th>N° orden</th><th>Fecha</th><th>Juegos</th><th>Total</th></tr>
              </thead>
              <tbody>
                {[...compras].reverse().map((o) => (
                  <tr key={o.numero}>
                    <td><Link to={'/admin/ordenes/' + o.numero}>{o.numero}</Link></td>
                    <td>{new Date(o.fecha).toLocaleString('es-CL')}</td>
                    <td>{o.items.map((i) => i.nombre + ' x' + i.cantidad).join(', ')}</td>
                    <td>{pesos(o.total)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        <Link to="/admin/usuarios" className="btn btn-outline-secondary mt-3">Volver a usuarios</Link>
      </section>
    </>
  )
}

export default AdminHistorialCompras
