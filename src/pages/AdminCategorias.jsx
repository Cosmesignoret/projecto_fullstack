import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useTienda } from '../context/TiendaContext.jsx'

function AdminCategorias() {
  const { categorias, productos, borrarCategoria } = useTienda()
  const [mensaje, setMensaje] = useState('')
  const [error, setError] = useState('')

  function handleEliminar(categoria) {
    setMensaje('')
    setError('')
    if (!window.confirm('¿Eliminar la categoría "' + categoria.nombre + '"?')) {
      return
    }
    // borrarCategoria devuelve false si todavía hay productos en esa categoría
    if (borrarCategoria(categoria.id)) {
      setMensaje('Categoría "' + categoria.nombre + '" eliminada.')
    } else {
      setError('No se puede eliminar "' + categoria.nombre + '" porque todavía tiene productos.')
    }
  }

  return (
    <>
      <div className="admin-topbar">
        <h1>Categorías</h1>
        <Link to="/admin/categorias/nueva" className="btn btn-success">+ Nueva categoría</Link>
      </div>

      {error && <div className="alert alert-danger" role="alert">{error}</div>}
      {mensaje && <div className="alert alert-success" role="status">{mensaje}</div>}

      <section className="admin-panel">
        <div className="tabla-scroll">
          <table className="tabla-stog">
            <thead>
              <tr><th>Nombre</th><th>Descripción</th><th>Productos</th><th></th></tr>
            </thead>
            <tbody>
              {categorias.map((c) => (
                <tr key={c.id}>
                  <td>{c.nombre}</td>
                  <td>{c.descripcion}</td>
                  <td>{productos.filter((p) => p.categoria === c.nombre).length}</td>
                  <td>
                    <Link to={'/admin/categorias/' + c.id + '/editar'} className="btn btn-sm btn-success">Editar</Link>
                    <button className="btn btn-sm btn-danger ms-1" onClick={() => handleEliminar(c)}>Eliminar</button>
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

export default AdminCategorias
