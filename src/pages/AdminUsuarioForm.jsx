import { useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { useTienda } from '../context/TiendaContext.jsx'
import { regiones, comunasDe } from '../data/regiones.js'
import {
  validarRun, validarNombre, validarCorreoAdmitido, validarContrasena, validarDireccion
} from '../js/validaciones.js'

const ROLES = [
  { valor: 'administrador', texto: 'Administrador' },
  { valor: 'vendedor', texto: 'Vendedor' },
  { valor: 'cliente', texto: 'Cliente' }
]

const VACIO = {
  run: '', nombre: '', apellidos: '', correo: '', rol: '', contrasena: '',
  calle: '', departamento: '', region: regiones[0].nombre, comuna: ''
}

// Crea (/admin/usuarios/nuevo) o edita (/admin/usuarios/:id/editar) un usuario
function AdminUsuarioForm() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { buscarUsuarioPorId, buscarUsuarioPorCorreo, crearUsuario, actualizarUsuario } = useTienda()
  const existente = id ? buscarUsuarioPorId(id) : null
  // La contraseña no se muestra al editar: si se deja vacía, se mantiene la actual
  const [form, setForm] = useState(existente ? { ...VACIO, ...existente, contrasena: '' } : VACIO)
  const [error, setError] = useState('')

  if (id && existente === null) {
    return (
      <section className="admin-panel">
        <h1>Usuario no encontrado</h1>
        <Link to="/admin/usuarios" className="btn btn-success">Volver a usuarios</Link>
      </section>
    )
  }

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  function handleRegion(e) {
    setForm({ ...form, region: e.target.value, comuna: '' })
  }

  function handleGuardar(e) {
    e.preventDefault()
    setError('')

    const problema =
      validarRun(form.run) ||
      validarNombre(form.nombre, 'El nombre', 1, 50) ||
      validarNombre(form.apellidos, 'Los apellidos', 1, 100) ||
      validarCorreoAdmitido(form.correo) ||
      (form.rol === '' ? 'Debe seleccionar un tipo de usuario.' : '') ||
      // La contraseña es obligatoria al crear; al editar solo se valida si se escribió una nueva
      (!existente || form.contrasena !== '' ? validarContrasena(form.contrasena) : '') ||
      validarDireccion(form)

    if (problema) {
      setError(problema)
      return
    }

    // El correo no puede estar en uso por otro usuario
    const otro = buscarUsuarioPorCorreo(form.correo)
    if (otro !== null && (!existente || otro.id !== existente.id)) {
      setError('Ya existe un usuario con ese correo.')
      return
    }

    const datos = {
      run: form.run.trim().toUpperCase(),
      nombre: form.nombre.trim(),
      apellidos: form.apellidos.trim(),
      correo: form.correo.trim().toLowerCase(),
      rol: form.rol,
      calle: form.calle.trim(),
      departamento: form.departamento.trim(),
      region: form.region,
      comuna: form.comuna
    }

    if (existente) {
      actualizarUsuario(existente.id, form.contrasena ? { ...datos, contrasena: form.contrasena } : datos)
    } else {
      crearUsuario({ ...datos, contrasena: form.contrasena })
    }
    navigate('/admin/usuarios')
  }

  return (
    <>
      <div className="admin-topbar"><h1>{existente ? 'Editar usuario' : 'Nuevo usuario'}</h1></div>
      {error && <div className="alert alert-danger" role="alert">{error}</div>}

      <section className="admin-panel">
        <form onSubmit={handleGuardar} noValidate>
          <div className="row g-3">
            <div className="col-md-4">
              <label htmlFor="run" className="form-label">RUN (sin puntos ni guión)*</label>
              <input type="text" className="form-control" id="run" name="run" maxLength="9"
                placeholder="Ej: 190110222" value={form.run} onChange={handleChange} />
            </div>
            <div className="col-md-4">
              <label htmlFor="nombre" className="form-label">Nombre*</label>
              <input type="text" className="form-control" id="nombre" name="nombre" maxLength="50"
                value={form.nombre} onChange={handleChange} />
            </div>
            <div className="col-md-4">
              <label htmlFor="apellidos" className="form-label">Apellidos*</label>
              <input type="text" className="form-control" id="apellidos" name="apellidos" maxLength="100"
                value={form.apellidos} onChange={handleChange} />
            </div>
            <div className="col-md-6">
              <label htmlFor="correo" className="form-label">Correo electrónico*</label>
              <input type="email" className="form-control" id="correo" name="correo" maxLength="100"
                placeholder="nombre@duoc.cl" value={form.correo} onChange={handleChange} />
            </div>
            <div className="col-md-3">
              <label htmlFor="rol" className="form-label">Tipo de usuario*</label>
              <select className="form-select" id="rol" name="rol" value={form.rol} onChange={handleChange}>
                <option value="">-- Seleccione --</option>
                {ROLES.map((r) => <option key={r.valor} value={r.valor}>{r.texto}</option>)}
              </select>
            </div>
            <div className="col-md-3">
              <label htmlFor="contrasena" className="form-label">
                Contraseña{existente ? ' (opcional)' : '*'}
              </label>
              <input type="password" className="form-control" id="contrasena" name="contrasena" maxLength="20"
                value={form.contrasena} onChange={handleChange} />
            </div>
            <div className="col-md-6">
              <label htmlFor="calle" className="form-label">Calle*</label>
              <input type="text" className="form-control" id="calle" name="calle" maxLength="100"
                value={form.calle} onChange={handleChange} />
            </div>
            <div className="col-md-6">
              <label htmlFor="departamento" className="form-label">Departamento (opcional)</label>
              <input type="text" className="form-control" id="departamento" name="departamento" maxLength="20"
                value={form.departamento} onChange={handleChange} />
            </div>
            <div className="col-md-6">
              <label htmlFor="region" className="form-label">Región*</label>
              <select className="form-select" id="region" name="region" value={form.region} onChange={handleRegion}>
                {regiones.map((r) => <option key={r.nombre} value={r.nombre}>{r.nombre}</option>)}
              </select>
            </div>
            <div className="col-md-6">
              <label htmlFor="comuna" className="form-label">Comuna*</label>
              <select className="form-select" id="comuna" name="comuna" value={form.comuna} onChange={handleChange}>
                <option value="">-- Seleccione --</option>
                {comunasDe(form.region).map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
          </div>

          <button type="submit" className="btn btn-success mt-3">Guardar usuario</button>
          <Link to="/admin/usuarios" className="btn btn-outline-secondary mt-3 ms-2">Cancelar</Link>
        </form>
      </section>
    </>
  )
}

export default AdminUsuarioForm
