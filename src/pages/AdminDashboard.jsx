import { Link } from 'react-router-dom'
import { useTienda } from '../context/TiendaContext.jsx'
import { secciones } from '../data/seccionesAdmin.js'
import { pesos } from '../js/formato.js'

// Resumen del panel: números clave y los productos con stock crítico.
// Todo se calcula con los datos del contexto, así que se actualiza solo cuando algo cambia.
function AdminDashboard() {
  const { productos, usuarios, ordenes, productosCriticos } = useTienda()
  const totalVendido = ordenes.reduce((suma, o) => suma + o.total, 0)

  return (
    <>
      <div className="admin-topbar"><h1>Dashboard</h1></div>

      <div className="admin-resumen">
        <div className="admin-tarjeta"><span className="numero">{ordenes.length}</span><span className="etiqueta">Órdenes ({pesos(totalVendido)})</span></div>
        <div className="admin-tarjeta"><span className="numero">{productos.length}</span><span className="etiqueta">Productos</span></div>
        <div className="admin-tarjeta"><span className="numero">{usuarios.length}</span><span className="etiqueta">Usuarios</span></div>
        <div className="admin-tarjeta"><span className="numero">{productosCriticos.length}</span><span className="etiqueta">Productos críticos</span></div>
      </div>

      <section className="admin-panel mb-3">
        <h2>Productos con stock crítico</h2>
        {productosCriticos.length === 0 ? (
          <p className="mb-0">Todos los productos tienen stock suficiente.</p>
        ) : (
          <div className="tabla-scroll">
            <table className="tabla-stog">
              <thead><tr><th>Código</th><th>Nombre</th><th>Stock</th><th>Crítico</th></tr></thead>
              <tbody>
                {productosCriticos.map((p) => (
                  <tr key={p.id}>
                    <td>{p.codigo}</td>
                    <td>{p.nombre}</td>
                    <td className="stock-critico">{p.stock}</td>
                    <td>{p.stockCritico}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      <section className="admin-panel">
        <h2>Accesos rápidos</h2>
        <div className="d-flex flex-wrap gap-2">
          {secciones.filter((s) => s.ruta !== '/admin').map((s) => (
            <Link key={s.ruta} to={s.ruta} className="btn btn-outline-dark">{s.icono} {s.texto}</Link>
          ))}
        </div>
      </section>
    </>
  )
}

export default AdminDashboard
