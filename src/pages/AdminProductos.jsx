import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useTienda } from '../context/TiendaContext.jsx'
import { pesos } from '../js/formato.js'

function AdminProductos() {
  const { productos, borrarProducto } = useTienda()
  const [mensaje, setMensaje] = useState('')

  function handleEliminar(producto) {
    // window.confirm abre el cuadro "Aceptar / Cancelar" del navegador
    if (!window.confirm('¿Eliminar el producto "' + producto.nombre + '"?')) {
      return
    }
    borrarProducto(producto.id)
    setMensaje('Producto "' + producto.nombre + '" eliminado.')
  }

  return (
    <>
      <div className="admin-topbar">
        <h1>Inventario de productos</h1>
        <div className="d-flex flex-wrap gap-2">
          <Link to="/admin/productos/criticos" className="btn btn-outline-danger">Productos críticos</Link>
          <Link to="/admin/productos/reportes" className="btn btn-outline-secondary">Reportes</Link>
          <Link to="/admin/productos/nuevo" className="btn btn-success">+ Nuevo producto</Link>
        </div>
      </div>

      {mensaje && <div className="alert alert-success" role="status">{mensaje}</div>}

      <section className="admin-panel">
        <div className="tabla-scroll">
          <table className="tabla-stog">
            <thead>
              <tr><th>Código</th><th>Nombre</th><th>Categoría</th><th>Precio</th><th>Stock</th><th></th></tr>
            </thead>
            <tbody>
              {productos.map((p) => (
                <tr key={p.id}>
                  <td>{p.codigo}</td>
                  <td>{p.nombre}</td>
                  <td>{p.categoria}</td>
                  <td>
                    {pesos(p.precio)}
                    {p.enOferta && <div><small>Oferta: {pesos(p.precioOferta)}</small></div>}
                  </td>
                  <td className={p.stock <= p.stockCritico ? 'stock-critico' : ''}>
                    {p.stock}
                    {p.stock <= p.stockCritico && <div><small>Crítico</small></div>}
                  </td>
                  <td>
                    <Link to={'/admin/productos/' + p.id + '/editar'} className="btn btn-sm btn-success">Editar</Link>
                    <button className="btn btn-sm btn-danger ms-1" onClick={() => handleEliminar(p)}>Eliminar</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </>
  )
}

export default AdminProductos
