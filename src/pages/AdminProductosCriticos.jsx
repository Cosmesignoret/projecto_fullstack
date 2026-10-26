import { Link } from 'react-router-dom'
import { useTienda } from '../context/TiendaContext.jsx'

// Productos cuyo stock llegó a su nivel crítico (o está por debajo): hay que reponerlos
function AdminProductosCriticos() {
  const { productosCriticos } = useTienda()

  return (
    <>
      <div className="admin-topbar">
        <h1>Productos críticos</h1>
        <Link to="/admin/productos" className="btn btn-outline-secondary">Volver</Link>
      </div>

      <section className="admin-panel">
        {productosCriticos.length === 0 ? (
          <p className="text-muted mb-0">No hay productos con stock crítico.</p>
        ) : (
          <div className="tabla-scroll">
            <table className="tabla-stog">
              <thead>
                <tr><th>Código</th><th>Nombre</th><th>Stock</th><th>Crítico desde</th><th></th></tr>
              </thead>
              <tbody>
                {productosCriticos.map((p) => (
                  <tr key={p.id}>
                    <td>{p.codigo}</td>
                    <td>{p.nombre}</td>
                    <td className="stock-critico">{p.stock}</td>
                    <td>{p.stockCritico}</td>
                    <td><Link to={'/admin/productos/' + p.id + '/editar'} className="btn btn-sm btn-success">Reponer stock</Link></td>
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

export default AdminProductosCriticos
