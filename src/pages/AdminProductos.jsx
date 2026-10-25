import { useState } from 'react'
import { useTienda } from '../context/TiendaContext.jsx'
import FormularioProducto from '../components/admin/FormularioProducto.jsx'
import { pesos } from '../js/formato.js'

// CRUD de productos del panel de administración:
//  Leer = la tabla · Crear = botón "Nuevo producto" · Actualizar = "Editar" · Eliminar = "Eliminar"
function AdminProductos() {
  const { productos, categorias, crearProducto, actualizarProducto, borrarProducto } = useTienda()

  // null = formulario cerrado · 'nuevo' = creando · un producto = editándolo
  const [editando, setEditando] = useState(null)
  const [mensaje, setMensaje] = useState('')

  function handleGuardar(datos) {
    if (editando === 'nuevo') {
      crearProducto(datos)
      setMensaje('Producto "' + datos.nombre + '" creado.')
    } else {
      actualizarProducto(editando.id, datos)
      setMensaje('Producto "' + datos.nombre + '" actualizado.')
    }
    setEditando(null)
  }

  function handleEliminar(producto) {
    if (!window.confirm('¿Eliminar el producto "' + producto.nombre + '"?')) {
      return
    }
    borrarProducto(producto.id)
    // Si justo se estaba editando este producto, se cierra el formulario
    if (editando && editando !== 'nuevo' && editando.id === producto.id) {
      setEditando(null)
    }
    setMensaje('Producto "' + producto.nombre + '" eliminado.')
  }

  return (
    <>
      <div className="admin-topbar"><h1>Productos</h1></div>

      {mensaje && <div className="alert alert-success" role="status">{mensaje}</div>}

      {editando !== null ? (
        <section className="admin-panel mb-3">
          <h2>{editando === 'nuevo' ? 'Nuevo producto' : 'Editar producto'}</h2>
          {/* key hace que al cambiar de producto el formulario se reinicie con los datos nuevos */}
          <FormularioProducto
            key={editando === 'nuevo' ? 'nuevo' : editando.id}
            producto={editando === 'nuevo' ? null : editando}
            categorias={categorias}
            onGuardar={handleGuardar}
            onCancelar={() => setEditando(null)}
          />
        </section>
      ) : (
        <div className="admin-toolbar">
          <button className="btn btn-success" onClick={() => { setMensaje(''); setEditando('nuevo') }}>
            + Nuevo producto
          </button>
        </div>
      )}

      <section className="admin-panel">
        <h2>Productos de la tienda ({productos.length})</h2>
        <div className="tabla-scroll">
          <table className="tabla-stog">
            <thead>
              <tr>
                <th>Código</th>
                <th>Nombre</th>
                <th>Categoría</th>
                <th>Precio</th>
                <th>Stock</th>
                <th></th>
              </tr>
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
                  <td className={p.stock <= p.stockCritico ? 'stock-critico' : ''}>{p.stock}</td>
                  <td className="text-nowrap">
                    <button className="btn btn-sm btn-success" onClick={() => { setMensaje(''); setEditando(p) }}>
                      Editar
                    </button>
                    <button className="btn btn-sm btn-danger ms-1" onClick={() => handleEliminar(p)}>
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))}
              {productos.length === 0 && (
                <tr><td colSpan="6" className="text-center">No hay productos.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </>
  )
}

export default AdminProductos
