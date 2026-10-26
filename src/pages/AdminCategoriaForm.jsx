import { useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { useTienda } from '../context/TiendaContext.jsx'
import { validarNombre } from '../js/validaciones.js'

// Crea (/admin/categorias/nueva) o edita (/admin/categorias/:id/editar) una categoría
function AdminCategoriaForm() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { categorias, crearCategoria, actualizarCategoria } = useTienda()
  const existente = id ? categorias.find((c) => c.id === Number(id)) : null
  const [form, setForm] = useState({ nombre: existente ? existente.nombre : '', descripcion: existente ? existente.descripcion : '' })
  const [error, setError] = useState('')

  if (id && !existente) {
    return (
      <section className="admin-panel">
        <h1>Categoría no encontrada</h1>
        <Link to="/admin/categorias" className="btn btn-success">Volver a categorías</Link>
      </section>
    )
  }

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  function handleGuardar(e) {
    e.preventDefault()
    const problema = validarNombre(form.nombre, 'El nombre', 3, 40)
    if (problema) {
      setError(problema)
      return
    }
    if (form.descripcion.length > 150) {
      setError('La descripción no puede superar los 150 caracteres.')
      return
    }
    const repetida = categorias.some(
      (c) => c.nombre.toLowerCase() === form.nombre.trim().toLowerCase() && (!existente || c.id !== existente.id)
    )
    if (repetida) {
      setError('Ya existe una categoría con ese nombre.')
      return
    }

    const datos = { nombre: form.nombre.trim(), descripcion: form.descripcion.trim() }
    if (existente) {
      actualizarCategoria(existente.id, datos)
    } else {
      crearCategoria(datos)
    }
    navigate('/admin/categorias')
  }

  return (
    <>
      <div className="admin-topbar"><h1>{existente ? 'Editar categoría' : 'Nueva categoría'}</h1></div>
      {error && <div className="alert alert-danger" role="alert">{error}</div>}

      <section className="admin-panel">
        <form onSubmit={handleGuardar} noValidate>
          <div className="mb-3">
            <label htmlFor="nombre" className="form-label">Nombre de la categoría*</label>
            <input type="text" className="form-control" id="nombre" name="nombre" maxLength="40"
              value={form.nombre} onChange={handleChange} />
          </div>
          <div className="mb-3">
            <label htmlFor="descripcion" className="form-label">Descripción</label>
            <textarea className="form-control" id="descripcion" name="descripcion" rows="2" maxLength="150"
              value={form.descripcion} onChange={handleChange}></textarea>
          </div>
          <button type="submit" className="btn btn-success">Guardar categoría</button>
          <Link to="/admin/categorias" className="btn btn-outline-secondary ms-2">Cancelar</Link>
        </form>
      </section>
    </>
  )
}

export default AdminCategoriaForm
