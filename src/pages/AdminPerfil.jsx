import { useState } from 'react'
import { useTienda } from '../context/TiendaContext.jsx'
import { validarNombre, validarCorreo, validarEdad, validarCambioContrasena } from '../js/validaciones.js'

const CLAVES_VACIAS = { actual: '', nueva: '', confirmar: '' }

// Perfil del administrador con sesión abierta: editar sus datos y cambiar su contraseña.
function AdminPerfil() {
  const { sesion, usuarios, actualizarUsuario, buscarUsuarioPorCorreo } = useTienda()
  // La sesión no guarda la contraseña ni la edad: se leen del usuario completo
  const usuario = usuarios.find((u) => u.id === sesion.id)

  const [datos, setDatos] = useState({
    nombre: usuario.nombre, apellidos: usuario.apellidos, correo: usuario.correo, edad: String(usuario.edad)
  })
  const [claves, setClaves] = useState(CLAVES_VACIAS)
  const [errores, setErrores] = useState({})
  const [mensaje, setMensaje] = useState('')

  function handleChange(e) {
    const { name, value } = e.target
    setDatos({ ...datos, [name]: value })
  }

  function handleClave(e) {
    const { name, value } = e.target
    setClaves({ ...claves, [name]: value })
  }

  function handleGuardar(e) {
    e.preventDefault()
    setMensaje('')

    const nuevos = {}
    const errorNombre = validarNombre(datos.nombre, 'El nombre')
    if (errorNombre) nuevos.nombre = errorNombre
    const errorApellidos = validarNombre(datos.apellidos, 'Los apellidos', 3, 80)
    if (errorApellidos) nuevos.apellidos = errorApellidos

    const errorCorreo = validarCorreo(datos.correo)
    if (errorCorreo) {
      nuevos.correo = errorCorreo
    } else {
      // El correo debe ser único (se ignora el propio)
      const existente = buscarUsuarioPorCorreo(datos.correo)
      if (existente && existente.id !== usuario.id) nuevos.correo = 'Ya existe un usuario con ese correo.'
    }

    const errorEdad = validarEdad(datos.edad)
    if (errorEdad) nuevos.edad = errorEdad

    const erroresClave = validarCambioContrasena(claves.actual, claves.nueva, claves.confirmar, usuario.contrasena)
    if (erroresClave.actual) nuevos.actual = erroresClave.actual
    if (erroresClave.nueva) nuevos.nueva = erroresClave.nueva
    if (erroresClave.confirmar) nuevos.confirmar = erroresClave.confirmar

    setErrores(nuevos)
    if (Object.keys(nuevos).length > 0) {
      return
    }

    const cambios = {
      nombre: datos.nombre.trim(),
      apellidos: datos.apellidos.trim(),
      correo: datos.correo.trim().toLowerCase(),
      edad: Number(datos.edad)
    }
    if (claves.nueva) cambios.contrasena = claves.nueva

    // actualizarUsuario también actualiza la sesión abierta (el saludo del header cambia al instante)
    actualizarUsuario(usuario.id, cambios)
    setClaves(CLAVES_VACIAS)
    setMensaje('Perfil actualizado.')
  }

  const clase = (campo) => 'form-control' + (errores[campo] ? ' is-invalid' : '')
  const error = (campo) => errores[campo] && <div className="invalid-feedback">{errores[campo]}</div>

  return (
    <>
      <div className="admin-topbar"><h1>Perfil</h1></div>

      {mensaje && <div className="alert alert-success" role="status">{mensaje}</div>}

      <section className="admin-panel">
        <form noValidate onSubmit={handleGuardar}>
          <h2>Mis datos</h2>
          <div className="row g-3">
            <div className="col-md-6">
              <label htmlFor="nombre" className="form-label">Nombre</label>
              <input type="text" id="nombre" name="nombre" className={clase('nombre')}
                maxLength="50" value={datos.nombre} onChange={handleChange} />
              {error('nombre')}
            </div>
            <div className="col-md-6">
              <label htmlFor="apellidos" className="form-label">Apellidos</label>
              <input type="text" id="apellidos" name="apellidos" className={clase('apellidos')}
                maxLength="80" value={datos.apellidos} onChange={handleChange} />
              {error('apellidos')}
            </div>
            <div className="col-md-8">
              <label htmlFor="correo" className="form-label">Correo</label>
              <input type="email" id="correo" name="correo" className={clase('correo')}
                maxLength="100" value={datos.correo} onChange={handleChange} />
              {error('correo')}
            </div>
            <div className="col-md-4">
              <label htmlFor="edad" className="form-label">Edad</label>
              <input type="number" id="edad" name="edad" className={clase('edad')}
                min="18" max="100" value={datos.edad} onChange={handleChange} />
              {error('edad')}
            </div>
          </div>

          <h2 className="mt-4">Cambiar contraseña</h2>
          <p className="text-muted">Déjalo vacío si no quieres cambiarla.</p>
          <div className="row g-3">
            <div className="col-md-4">
              <label htmlFor="actual" className="form-label">Contraseña actual</label>
              <input type="password" id="actual" name="actual" className={clase('actual')}
                maxLength="20" autoComplete="current-password" value={claves.actual} onChange={handleClave} />
              {error('actual')}
            </div>
            <div className="col-md-4">
              <label htmlFor="nueva" className="form-label">Nueva contraseña</label>
              <input type="password" id="nueva" name="nueva" className={clase('nueva')}
                maxLength="20" autoComplete="new-password" value={claves.nueva} onChange={handleClave} />
              {error('nueva')}
            </div>
            <div className="col-md-4">
              <label htmlFor="confirmar" className="form-label">Repetir nueva contraseña</label>
              <input type="password" id="confirmar" name="confirmar" className={clase('confirmar')}
                maxLength="20" autoComplete="new-password" value={claves.confirmar} onChange={handleClave} />
              {error('confirmar')}
            </div>
          </div>

          <button type="submit" className="btn btn-success mt-4">Guardar cambios</button>
        </form>
      </section>
    </>
  )
}

export default AdminPerfil
