import { useTienda } from '../context/TiendaContext.jsx'
import { pesos } from '../js/formato.js'

// Reporte de ventas calculado a partir de las órdenes guardadas
function AdminReportes() {
  const { ordenes } = useTienda()

  let totalVendido = 0
  let unidadesVendidas = 0
  // Objeto donde cada clave es el id de un juego y el valor es su resumen de ventas
  const ventasPorJuego = {}

  // Se recorren todas las órdenes y, dentro de cada una, todos sus juegos
  ordenes.forEach((orden) => {
    totalVendido += orden.total
    orden.items.forEach((item) => {
      unidadesVendidas += item.cantidad
      if (!ventasPorJuego[item.id]) {
        ventasPorJuego[item.id] = { nombre: item.nombre, unidades: 0, total: 0 }
      }
      ventasPorJuego[item.id].unidades += item.cantidad
      ventasPorJuego[item.id].total += item.precio * item.cantidad
    })
  })

  // Se ordena de mayor a menor venta
  const filas = Object.values(ventasPorJuego).sort((a, b) => b.total - a.total)

  return (
    <>
      <div className="admin-topbar"><h1>Reportes de ventas</h1></div>

      <section className="admin-resumen">
        <div className="admin-tarjeta azul"><span className="etiqueta">Órdenes</span><span className="numero">{ordenes.length}</span></div>
        <div className="admin-tarjeta verde"><span className="etiqueta">Unidades vendidas</span><span className="numero">{unidadesVendidas}</span></div>
        <div className="admin-tarjeta amarilla"><span className="etiqueta">Total vendido</span><span className="numero fs-3">{pesos(totalVendido)}</span></div>
      </section>

      <section className="admin-panel">
        <h2>Ventas por videojuego</h2>
        {filas.length === 0 ? (
          <p className="text-muted mb-0">Aún no hay ventas para reportar.</p>
        ) : (
          <div className="tabla-scroll">
            <table className="tabla-stog">
              <thead><tr><th>Juego</th><th>Unidades</th><th>Total vendido</th></tr></thead>
              <tbody>
                {filas.map((f) => (
                  <tr key={f.nombre}><td>{f.nombre}</td><td>{f.unidades}</td><td>{pesos(f.total)}</td></tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </>
  )
}

export default AdminReportes
