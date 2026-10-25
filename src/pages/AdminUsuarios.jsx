import { useState } from 'react'
import { useTienda } from '../context/TiendaContext.jsx'
import { validarNombre, validarCorreo, validarEdad, validarContrasena } from '../js/validaciones.js'

const VACIO = { nombre: '', apellidos: '', correo: '', edad: '', contrasena: '', rol: 'cliente' }

// CRUD de usuarios. Mismo patrón que categorías: un formulario que crea o edita según "editandoId".
function AdminUsuarios() {
  const { usuarios, sesion, registrarUsuario, actualizarUsuario, borrarUsuario, buscarUsuarioPorCorreo } = useTienda()
  const [form, setForm] = useState(VACIO)
  const [editandoId, setEditandoId] = useState(null)
  const [errores, setErrores] = useState({})
  const [mensaje, setMensaje] = useState('')

  function handleChange(e) {
    const { name, value } = e.target
    setForm({ ...form, [name]: value })
  }

  function limpiar() {
    setForm(VACIO)
    setEditandoId(null)
    setErrores({})
  }

  function handleEditar(usuario) {
    setMensaje('')
    setErrores({})
    setEditandoId(usuario.id)
    // La contraseña no se muestra: si se deja vacía al guardar, se conserva la actual
    setForm({ ...VACIO, ...usuario, contrasena: '' })
  }

  function handleGuardar(e) {
    e.preventDefault()
    setMensaje('')

    const nuevos = {}
    const errorNombre = validarNombre(form.nombre, 'El nombre')
    if (errorNombre) nuevos.nombre = errorNombre
    const errorApellidos = validarNombre(form.apellidos, 'Los apellidos', 3, 80)
    if (errorApellidos) nuevos.apellidos = errorApellidos

    const errorCorreo = validarCorreo(form.correo)
    if (errorCorreo) {
      nuevos.correo = errorCorreo
    } else {
      // El correo debe ser único (se ignora el del propio usuario que se está editando)
      const existente = buscarUsuarioPorCorreo(form.correo)
      if (existente && existente.id !== editandoId) nuevos.correo = 'Ya existe un usuario con ese correo.'
    }

    const errorEdad = validarEdad(form.edad)
    if (errorEdad) nuevos.edad = errorEdad

    // Al crear la contraseña es obligatoria; al editar solo se valida si se escribió una nueva
    if (editandoId === null || form.contrasena !== '') {
      const errorClave = validarContrasena(form.contrasena)
      if (errorClave) nuevos.contrasena = errorClave
    }

    setErrores(nuevos)
    if (Object.keys(nuevos).length > 0) {
      return
    }

    const datos = {
      nombre: form.nombre.trim(),
      apellidos: form.apellidos.trim(),
      correo: form.correo.trim().toLowerCase(),
      edad: Number(form.edad),
      rol: form.rol
    }
    if (form.contrasena !== '') datos.contrasena = form.contrasena

    if (editandoId === null) {
      registrarUsuario(datos)
      setMensaje('Usuario "' + datos.nombre + '" creado.')
    } else {
      actualizarUsuario(editandoId, datos)
      setMensaje('Usuario "' + datos.nombre + '" actualizado.')
    }
    limpiar()
  }

  function handleEliminar(usuario) {
    setMensaje('')
    if (!window.confirm('¿Eliminar al usuario "' + usuario.nombre + ' ' + usuario.apellidos + '"?')) {
      return
    }
    borrarUsuario(usuario.id)
    if (editandoId === usuario.id) limpiar()
    setMensaje('Usuario "' + usuario.nombre + '" eliminado.')
  }

  const clase = (campo) => 'form-control' + (errores[campo] ? ' is-invalid' : '')
  const error = (campo) => errores[campo] && <div className="invalid-feedback">{errores[campo]}</div>

  return (
    <>
      <div className="admin-topbar"><h1>Usuarios</h1></div>

      {mensaje && <div className="alert alert-success" role="status">{mensaje}</div>}

      <section className="admin-panel mb-3">
        <h2>{editandoId === null ? 'Nuevo usuario' : 'Editar usuario'}</h2>
        <form noValidate onSubmit={handleGuardar}>
          <div className="row g-3">
            <div className="col-md-6">
              <label htmlFor="nombre" className="form-label">Nombre</label>
              <input type="text" id="nombre" name="nombre" className={clase('nombre')}
                maxLength="50" value={form.nombre} onChange={handleChange} />
              {error('nombre')}
            </div>
            <div className="col-md-6">
              <label htmlFor="apellidos" className="form-label">Apellidos</label>
              <input type="text" id="apellidos" name="apellidos" className={clase('apellidos')}
                maxLength="80" value={form.apellidos} onChange={handleChange} />
              {error('apellidos')}
            </div>
            <div className="col-md-6">
              <label htmlFor="correo" className="form-label">Correo</label>
              <input type="email" id="correo" name="correo" className={clase('correo')}
                maxLength="100" value={form.correo} onChange={handleChange} />
              {error('correo')}
            </div>
            <div className="col-md-3">
              <label htmlFor="edad" className="form-label">Edad</label>
              <input type="number" id="edad" name="edad" className={clase('edad')}
                min="18" max="100" value={form.edad} onChange={handleChange} />
              {error('edad')}
            </div>
            <div className="col-md-3">
              <label htmlFor="rol" className="form-label">Rol</label>
              <select id="rol" name="rol" className="form-select" value={form.rol} onChange={handleChange}>
                <option value="cliente">Cliente</option>
                <option value="administrador">Administrador</option>
              </select>
            </div>
            <div className="col-md-6">
              <label htmlFor="contrasena" className="form-label">
                Contraseña{editandoId !== null && ' (vacía = no cambiarla)'}
              </label>
              <input type="password" id="contrasena" name="contrasena" className={clase('contrasena')}
                maxLength="20" autoComplete="new-password" value={form.contrasena} onChange={handleChange} />
              {error('contrasena')}
            </div>
          </div>
          <button type="submit" className="btn btn-success mt-3">
            {editandoId === null ? 'Crear usuario' : 'Guardar cambios'}
          </button>
          {editandoId !== null && (
            <button type="button" className="btn btn-outline-secondary mt-3 ms-2" onClick={limpiar}>Cancelar</button>
          )}
        </form>
      </section>

      <section className="admin-panel">
        <h2>Usuarios registrados ({usuarios.length})</h2>
        <div className="tabla-scroll">
          <table className="tabla-stog">
            <thead>
              <tr><th>Nombre</th><th>Correo</th><th>Edad</th><th>Rol</th><th></th></tr>
            </thead>
            <tbody>
              {usuarios.map((u) => (
                <tr key={u.id}>
                  <td>{u.nombre} {u.apellidos}</td>
                  <td>{u.correo}</td>
                  <td>{u.edad}</td>
                  <td><span className="badge-rol">{u.rol}</span></td>
                  <td className="text-nowrap">
                    <button className="btn btn-sm btn-success" onClick={() => handleEditar(u)}>Editar</button>
                    {/* El admin no puede eliminarse a sí mismo (se quedaría sin acceso al panel) */}
                    <button className="btn btn-sm btn-danger ms-1" onClick={() => handleEliminar(u)}
                      disabled={sesion && sesion.id === u.id}>
                      Eliminar
                    </button>
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

export default AdminUsuarios
