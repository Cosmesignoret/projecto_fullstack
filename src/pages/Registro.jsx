import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useTienda } from '../context/TiendaContext.jsx'
import {
  validarNombre, validarCorreo, validarEdad, validarContrasena
} from '../js/validaciones.js'

const VACIO = { nombre: '', apellido: '', correo: '', edad: '', contrasena: '', confirmar: '', terminos: false }

function Registro() {
  const { registrarUsuario, buscarUsuarioPorCorreo } = useTienda()
  const [datos, setDatos] = useState(VACIO)
  const [errores, setErrores] = useState({})
  const [registrado, setRegistrado] = useState(false)

  // Un solo handler para todos los campos. Los checkbox usan "checked" en vez de "value".
  function handleChange(e) {
    const { name, value, type, checked } = e.target
    setDatos({ ...datos, [name]: type === 'checkbox' ? checked : value })
  }

  function handleSubmit(e) {
    e.preventDefault()
    setRegistrado(false)

    const nuevos = {}
    const errorNombre = validarNombre(datos.nombre, 'El nombre')
    if (errorNombre) nuevos.nombre = errorNombre
    const errorApellido = validarNombre(datos.apellido, 'El apellido')
    if (errorApellido) nuevos.apellido = errorApellido

    const errorCorreo = validarCorreo(datos.correo)
    if (errorCorreo) {
      nuevos.correo = errorCorreo
    } else if (buscarUsuarioPorCorreo(datos.correo) !== null) {
      nuevos.correo = 'Ya existe una cuenta con ese correo.'
    }

    const errorEdad = validarEdad(datos.edad)
    if (errorEdad) nuevos.edad = errorEdad
    const errorClave = validarContrasena(datos.contrasena)
    if (errorClave) nuevos.contrasena = errorClave

    if (datos.confirmar === '') {
      nuevos.confirmar = 'Debes repetir la contraseña.'
    } else if (datos.confirmar !== datos.contrasena) {
      nuevos.confirmar = 'Las contraseñas no coinciden.'
    }
    if (!datos.terminos) nuevos.terminos = 'Debes aceptar los términos y condiciones.'

    setErrores(nuevos)
    if (Object.keys(nuevos).length > 0) {
      return
    }

    // El correo se guarda en minúsculas para que el login no falle por mayúsculas.
    registrarUsuario({
      nombre: datos.nombre.trim(),
      apellidos: datos.apellido.trim(),
      correo: datos.correo.trim().toLowerCase(),
      contrasena: datos.contrasena,
      edad: Number(datos.edad)
    })
    setDatos(VACIO)
    setRegistrado(true)
  }

  // Devuelve las clases de un campo según tenga error o no
  const clase = (campo) => 'form-control' + (errores[campo] ? ' is-invalid' : '')

  return (
    <>
      <section className="hero">
        <h1>Crea tu cuenta</h1>
        <p className="mb-0">Regístrate para comprar tus videojuegos favoritos.</p>
      </section>

      <section className="formulario">
        <form noValidate onSubmit={handleSubmit} className="registro-form">
          <div className="mt-2">
            <label htmlFor="nombre" className="form-label">Nombre</label>
            <input type="text" id="nombre" name="nombre" className={clase('nombre')} maxLength="50"
              value={datos.nombre} onChange={handleChange} />
            <div className="invalid-feedback">{errores.nombre}</div>
          </div>

          <div className="mt-3">
            <label htmlFor="apellido" className="form-label">Apellido</label>
            <input type="text" id="apellido" name="apellido" className={clase('apellido')} maxLength="50"
              value={datos.apellido} onChange={handleChange} />
            <div className="invalid-feedback">{errores.apellido}</div>
          </div>

          <div className="mt-3">
            <label htmlFor="correo" className="form-label">Correo electrónico</label>
            <input type="email" id="correo" name="correo" className={clase('correo')} maxLength="100"
              value={datos.correo} onChange={handleChange} />
            <div className="invalid-feedback">{errores.correo}</div>
          </div>

          <div className="mt-3">
            <label htmlFor="edad" className="form-label">Edad</label>
            <input type="number" id="edad" name="edad" className={clase('edad')}
              value={datos.edad} onChange={handleChange} />
            <div className="form-text">Debes ser mayor de 18 años.</div>
            <div className="invalid-feedback">{errores.edad}</div>
          </div>

          <div className="mt-3">
            <label htmlFor="contrasena" className="form-label">Contraseña</label>
            <input type="password" id="contrasena" name="contrasena" className={clase('contrasena')} maxLength="20"
              value={datos.contrasena} onChange={handleChange} />
            <div className="form-text">Entre 6 y 20 caracteres.</div>
            <div className="invalid-feedback">{errores.contrasena}</div>
          </div>

          <div className="mt-3">
            <label htmlFor="confirmar" className="form-label">Repetir contraseña</label>
            <input type="password" id="confirmar" name="confirmar" className={clase('confirmar')} maxLength="20"
              value={datos.confirmar} onChange={handleChange} />
            <div className="invalid-feedback">{errores.confirmar}</div>
          </div>

          <div className="form-check mt-3 text-start">
            <input type="checkbox" id="terminos" name="terminos"
              className={'form-check-input' + (errores.terminos ? ' is-invalid' : '')}
              checked={datos.terminos} onChange={handleChange} />
            <label htmlFor="terminos" className="form-check-label">Acepto los términos y condiciones</label>
            <div className="invalid-feedback">{errores.terminos}</div>
          </div>

          <button className="btn btn-success w-100 mt-4" type="submit">Registrar cliente</button>

          {registrado && (
            <div className="alert alert-success mt-3" role="alert">
              ¡Cuenta creada! Ya puedes <Link to="/login">iniciar sesión</Link>.
            </div>
          )}
        </form>
      </section>
    </>
  )
}

export default Registro
