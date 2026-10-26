import { Link } from 'react-router-dom'
import { useTienda } from '../context/TiendaContext.jsx'
import { pesos } from '../js/formato.js'

// Reporte de inventario: por cada categoría, cuántos productos hay, cuántas unidades
// y cuánto vale ese inventario (precio normal por unidades en stock).
function AdminProductosReportes() {
  const { productos, categorias } = useTienda()

  const filas = categorias.map((categoria) => {
    const delGrupo = productos.filter((p) => p.categoria === categoria.nombre)
    return {
      nombre: categoria.nombre,
      productos: delGrupo.length,
      unidades: delGrupo.reduce((suma, p) => suma + p.stock, 0),
      valor: delGrupo.reduce((suma, p) => suma + p.stock * p.precio, 0)
    }
  })
  const valorTotal = filas.reduce((suma, f) => suma + f.valor, 0)

  return (
    <>
      <div className="admin-topbar">
        <h1>Reporte de inventario</h1>
        <Link to="/admin/productos" className="btn btn-outline-secondary">Volver</Link>
      </div>

      <section className="admin-resumen">
        <div className="admin-tarjeta azul"><span className="etiqueta">Productos</span><span className="numero">{productos.length}</span></div>
        <div className="admin-tarjeta verde"><span className="etiqueta">En oferta</span><span className="numero">{productos.filter((p) => p.enOferta).length}</span></div>
        <div className="admin-tarjeta amarilla"><span className="etiqueta">Valor del inventario</span><span className="numero fs-3">{pesos(valorTotal)}</span></div>
      </section>

      <section className="admin-panel">
        <h2>Inventario por categoría</h2>
        <div className="tabla-scroll">
          <table className="tabla-stog">
            <thead>
              <tr><th>Categoría</th><th>Productos</th><th>Unidades en stock</th><th>Valor del inventario</th></tr>
            </thead>
            <tbody>
              {filas.map((f) => (
                <tr key={f.nombre}>
                  <td>{f.nombre}</td><td>{f.productos}</td><td>{f.unidades}</td><td>{pesos(f.valor)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </>
  )
}

export default AdminProductosReportes
