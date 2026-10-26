import { useState } from 'react'
import { useTienda } from '../context/TiendaContext.jsx'
import { validarNombre, validarCorreo, validarContrasena } from '../js/validaciones.js'

// Perfil de la persona que tiene la sesión iniciada: puede cambiar su nombre, correo y contraseña
function AdminPerfil() {
  const { sesion, buscarUsuarioPorId, buscarUsuarioPorCorreo, actualizarUsuario } = useTienda()
  const usuario = buscarUsuarioPorId(sesion.id)
  const [form, setForm] = useState({
    nombre: usuario.nombre, apellidos: usuario.apellidos, correo: usuario.correo, contrasena: ''
  })
  const [error, setError] = useState('')
  const [mensaje, setMensaje] = useState('')

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  function handleGuardar(e) {
    e.preventDefault()
    setMensaje('')

    const problema =
      validarNombre(form.nombre, 'El nombre', 1, 50) ||
      validarNombre(form.apellidos, 'Los apellidos', 1, 100) ||
      validarCorreo(form.correo) ||
      (form.contrasena !== '' ? validarContrasena(form.contrasena) : '')
    if (problema) {
      setError(problema)
      return
    }
    const otro = buscarUsuarioPorCorreo(form.correo)
    if (otro !== null && otro.id !== usuario.id) {
      setError('Ya existe un usuario con ese correo.')
      return
    }

    setError('')
    const datos = { nombre: form.nombre.trim(), apellidos: form.apellidos.trim(), correo: form.correo.trim().toLowerCase() }
    actualizarUsuario(usuario.id, form.contrasena ? { ...datos, contrasena: form.contrasena } : datos)
    setForm({ ...form, contrasena: '' })
    setMensaje('Perfil actualizado.')
  }

  return (
    <>
      <div className="admin-topbar">
        <h1>Mi perfil</h1>
        <span className="badge-rol">{usuario.rol}</span>
      </div>
      {error && <div className="alert alert-danger" role="alert">{error}</div>}
      {mensaje && <div className="alert alert-success" role="status">{mensaje}</div>}

      <section className="admin-panel">
        <form onSubmit={handleGuardar} noValidate>
          <div className="row g-3">
            <div className="col-md-6">
              <label htmlFor="nombre" className="form-label">Nombre</label>
              <input type="text" className="form-control" id="nombre" name="nombre" maxLength="50"
                value={form.nombre} onChange={handleChange} />
            </div>
            <div className="col-md-6">
              <label htmlFor="apellidos" className="form-label">Apellidos</label>
              <input type="text" className="form-control" id="apellidos" name="apellidos" maxLength="100"
                value={form.apellidos} onChange={handleChange} />
            </div>
            <div className="col-md-6">
              <label htmlFor="correo" className="form-label">Correo electrónico</label>
              <input type="email" className="form-control" id="correo" name="correo" maxLength="100"
                value={form.correo} onChange={handleChange} />
            </div>
            <div className="col-md-6">
              <label htmlFor="contrasena" className="form-label">Nueva contraseña (opcional)</label>
              <input type="password" className="form-control" id="contrasena" name="contrasena" maxLength="20"
                value={form.contrasena} onChange={handleChange} />
            </div>
          </div>
          <button type="submit" className="btn btn-success mt-3">Guardar cambios</button>
        </form>
      </section>
    </>
  )
}

export default AdminPerfil
