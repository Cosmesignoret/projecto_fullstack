import { useTienda } from '../context/TiendaContext.jsx'
import { resumenVentas, ventasPorProducto, inventarioPorCategoria, usuariosPorRol } from '../js/reportes.js'
import { pesos } from '../js/formato.js'

// Reportes de ventas, inventario y usuarios. Los cálculos están en js/reportes.js;
// esta pantalla solo los dibuja con los datos del contexto, así que se actualiza sola.
function AdminReportes() {
  const { ordenes, productos, usuarios } = useTienda()

  const resumen = resumenVentas(ordenes)
  const ventas = ventasPorProducto(ordenes)
  const inventario = inventarioPorCategoria(productos)
  const roles = usuariosPorRol(usuarios)

  return (
    <>
      <div className="admin-topbar"><h1>Reportes</h1></div>

      <div className="admin-resumen">
        <div className="admin-tarjeta"><span className="numero">{pesos(resumen.totalVendido)}</span><span className="etiqueta">Total vendido</span></div>
        <div className="admin-tarjeta"><span className="numero">{resumen.cantidadOrdenes}</span><span className="etiqueta">Órdenes</span></div>
        <div className="admin-tarjeta"><span className="numero">{resumen.unidadesVendidas}</span><span className="etiqueta">Juegos vendidos</span></div>
        <div className="admin-tarjeta"><span className="numero">{pesos(resumen.ticketPromedio)}</span><span className="etiqueta">Ticket promedio</span></div>
      </div>

      <section className="admin-panel mb-3">
        <h2>Ventas por juego</h2>
        {ventas.length === 0 ? (
          <p className="mb-0">Todavía no hay ventas registradas.</p>
        ) : (
          <div className="tabla-scroll">
            <table className="tabla-stog">
              <thead><tr><th>Juego</th><th>Unidades vendidas</th><th>Ingresos</th></tr></thead>
              <tbody>
                {ventas.map((v) => (
                  <tr key={v.id}><td>{v.nombre}</td><td>{v.unidades}</td><td>{pesos(v.ingresos)}</td></tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      <section className="admin-panel mb-3">
        <h2>Inventario por categoría</h2>
        <div className="tabla-scroll">
          <table className="tabla-stog">
            <thead><tr><th>Categoría</th><th>Productos</th><th>Unidades en stock</th><th>Valor del inventario</th></tr></thead>
            <tbody>
              {inventario.map((c) => (
                <tr key={c.categoria}>
                  <td>{c.categoria}</td><td>{c.productos}</td><td>{c.unidades}</td><td>{pesos(c.valor)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="admin-panel">
        <h2>Usuarios por rol</h2>
        <div className="d-flex flex-wrap gap-3">
          {Object.entries(roles).map(([rol, cantidad]) => (
            <span key={rol}><span className="badge-rol">{rol}</span> {cantidad}</span>
          ))}
        </div>
      </section>
    </>
  )
}

export default AdminReportes
