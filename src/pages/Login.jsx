import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useTienda } from '../context/TiendaContext.jsx'
import { validarCorreo, validarContrasena } from '../js/validaciones.js'

function Login() {
  const navigate = useNavigate()
  const { iniciarSesion } = useTienda()
  const [correo, setCorreo] = useState('')
  const [contrasena, setContrasena] = useState('')
  const [errores, setErrores] = useState({})
  const [errorGeneral, setErrorGeneral] = useState('')

  function handleSubmit(e) {
    e.preventDefault()
    setErrorGeneral('')

    const nuevos = {}
    const errorCorreo = validarCorreo(correo)
    if (errorCorreo) nuevos.correo = errorCorreo
    const errorClave = validarContrasena(contrasena)
    if (errorClave) nuevos.contrasena = errorClave
    setErrores(nuevos)
    if (Object.keys(nuevos).length > 0) {
      return
    }

    // iniciarSesion (TiendaContext) guarda la sesión y devuelve el usuario si coincide, o null
    const usuario = iniciarSesion(correo, contrasena)
    if (usuario === null) {
      setErrorGeneral('Correo o contraseña incorrectos.')
      return
    }

    navigate('/')
  }

  return (
    <>
      <section className="hero">
        <h1>Inicio de sesión</h1>
        <p className="mb-0">Entra para comprar tus videojuegos favoritos.</p>
      </section>

      <section className="formulario">
        <form noValidate onSubmit={handleSubmit} className="registro-form">
          <h2 className="text-center fs-1 fw-bold mt-0">Stog<span style={{ color: 'var(--stog-accent)' }}>.</span></h2>

          <div className="mt-3">
            <label htmlFor="correo" className="form-label">Correo</label>
            <input
              type="email"
              id="correo"
              className={'form-control' + (errores.correo ? ' is-invalid' : '')}
              value={correo}
              maxLength="100"
              onChange={(e) => setCorreo(e.target.value)}
            />
            <div className="invalid-feedback">{errores.correo}</div>
          </div>

          <div className="mt-3">
            <label htmlFor="password" className="form-label">Contraseña</label>
            <input
              type="password"
              id="password"
              className={'form-control' + (errores.contrasena ? ' is-invalid' : '')}
              value={contrasena}
              maxLength="20"
              onChange={(e) => setContrasena(e.target.value)}
            />
            <div className="invalid-feedback">{errores.contrasena}</div>
          </div>

          {errorGeneral && <div className="alert alert-danger mt-3" role="alert">{errorGeneral}</div>}

          <p className="mt-3 mb-0">¿No tienes cuenta? <Link to="/registro">Regístrate aquí</Link></p>
          <button className="btn btn-success w-100 mt-3" type="submit">Iniciar sesión</button>
        </form>
      </section>

      <section className="formulario mt-3">
        <h2>Cuentas de prueba</h2>
        <p>Usa estas cuentas para probar el inicio de sesión (o crea la tuya en «Registrar usuario»).</p>
        <div className="tabla-scroll">
          <table className="tabla-stog">
            <thead>
              <tr><th>Correo</th><th>Contraseña</th></tr>
            </thead>
            <tbody>
              <tr><td>carlos.edut@gmail.com</td><td>cliente123</td></tr>
              <tr><td>jperez@duoc.cl</td><td>juan123</td></tr>
            </tbody>
          </table>
        </div>
      </section>
    </>
  )
}

export default Login
