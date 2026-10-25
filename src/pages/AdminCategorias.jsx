import { useState } from 'react'
import { useTienda } from '../context/TiendaContext.jsx'
import { validarNombre } from '../js/validaciones.js'

const VACIO = { nombre: '', descripcion: '' }

// CRUD de categorías. El mismo formulario sirve para crear y para editar:
// si "editandoId" tiene un id, se guarda como edición; si es null, como categoría nueva.
function AdminCategorias() {
  const { categorias, productos, crearCategoria, actualizarCategoria, borrarCategoria } = useTienda()
  const [form, setForm] = useState(VACIO)
  const [editandoId, setEditandoId] = useState(null)
  const [error, setError] = useState('')
  const [mensaje, setMensaje] = useState('')

  function handleChange(e) {
    const { name, value } = e.target
    setForm({ ...form, [name]: value })
  }

  function limpiar() {
    setForm(VACIO)
    setEditandoId(null)
    setError('')
  }

  function handleEditar(categoria) {
    setMensaje('')
    setError('')
    setEditandoId(categoria.id)
    setForm({ nombre: categoria.nombre, descripcion: categoria.descripcion })
  }

  function handleGuardar(e) {
    e.preventDefault()
    setMensaje('')

    const nombre = form.nombre.trim()
    const descripcion = form.descripcion.trim()

    const errorNombre = validarNombre(nombre, 'El nombre', 3, 40)
    if (errorNombre) {
      setError(errorNombre)
      return
    }
    // No puede haber dos categorías con el mismo nombre (se ignora la que se está editando)
    const repetida = categorias.some((c) => c.id !== editandoId && c.nombre.toLowerCase() === nombre.toLowerCase())
    if (repetida) {
      setError('Ya existe una categoría con ese nombre.')
      return
    }
    if (descripcion === '') {
      setError('La descripción es obligatoria.')
      return
    }

    if (editandoId === null) {
      crearCategoria({ nombre, descripcion })
      setMensaje('Categoría "' + nombre + '" creada.')
    } else {
      actualizarCategoria(editandoId, { nombre, descripcion })
      setMensaje('Categoría "' + nombre + '" actualizada.')
    }
    limpiar()
  }

  function handleEliminar(categoria) {
    setError('')
    setMensaje('')
    if (!window.confirm('¿Eliminar la categoría "' + categoria.nombre + '"?')) {
      return
    }
    if (borrarCategoria(categoria.id)) {
      if (editandoId === categoria.id) limpiar()
      setMensaje('Categoría "' + categoria.nombre + '" eliminada.')
    } else {
      setError('No se puede eliminar "' + categoria.nombre + '" porque todavía tiene productos.')
    }
  }

  const cuantos = (nombre) => productos.filter((p) => p.categoria === nombre).length

  return (
    <>
      <div className="admin-topbar"><h1>Categorías</h1></div>

      {error && <div className="alert alert-danger" role="alert">{error}</div>}
      {mensaje && <div className="alert alert-success" role="status">{mensaje}</div>}

      <section className="admin-panel mb-3">
        <h2>{editandoId === null ? 'Nueva categoría' : 'Editar categoría'}</h2>
        <form noValidate onSubmit={handleGuardar}>
          <div className="row g-3">
            <div className="col-md-4">
              <label htmlFor="nombre" className="form-label">Nombre</label>
              <input type="text" id="nombre" name="nombre" className="form-control"
                maxLength="40" value={form.nombre} onChange={handleChange} />
            </div>
            <div className="col-md-8">
              <label htmlFor="descripcion" className="form-label">Descripción</label>
              <input type="text" id="descripcion" name="descripcion" className="form-control"
                maxLength="150" value={form.descripcion} onChange={handleChange} />
            </div>
          </div>
          <button type="submit" className="btn btn-success mt-3">
            {editandoId === null ? 'Crear categoría' : 'Guardar cambios'}
          </button>
          {editandoId !== null && (
            <button type="button" className="btn btn-outline-secondary mt-3 ms-2" onClick={limpiar}>Cancelar</button>
          )}
        </form>
      </section>

      <section className="admin-panel">
        <h2>Categorías de la tienda ({categorias.length})</h2>
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
                  <td>{cuantos(c.nombre)}</td>
                  <td className="text-nowrap">
                    <button className="btn btn-sm btn-success" onClick={() => handleEditar(c)}>Editar</button>
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
