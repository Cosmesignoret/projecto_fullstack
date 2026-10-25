import { useState } from 'react'
import { Row, Col } from 'react-bootstrap'
import Boton from '../components/layout/Boton.jsx'
import { validarCorreo } from '../js/validaciones.js'

function Contacto() {
  const [datos, setDatos] = useState({ nombre: '', correo: '', mensaje: '' })
  const [errores, setErrores] = useState({})
  const [enviado, setEnviado] = useState(false)

  // Un solo handler para todos los campos: usa el "name" del input para saber qué propiedad cambiar
  function handleChange(e) {
    setDatos({ ...datos, [e.target.name]: e.target.value })
  }

  function handleSubmit(e) {
    e.preventDefault()
    const nuevos = {}

    if (datos.nombre.trim() === '') nuevos.nombre = 'El nombre es obligatorio.'
    const errorCorreo = validarCorreo(datos.correo)
    if (errorCorreo) nuevos.correo = errorCorreo
    if (datos.mensaje.trim() === '') nuevos.mensaje = 'El mensaje es obligatorio.'

    setErrores(nuevos)
    if (Object.keys(nuevos).length > 0) {
      setEnviado(false)
      return
    }
    // Mensaje simulado: no hay servidor, solo se confirma el envío
    setEnviado(true)
    setDatos({ nombre: '', correo: '', mensaje: '' })
  }

  return (
    <>
      <section className="hero">
        <h1>Contacto</h1>
        <p className="mb-0">¿Tienes dudas? Escríbenos.</p>
      </section>

      <Row className="g-4">
        <Col xs={12} md={5}>
          <div className="tarjeta-info">
            <h2>Información</h2>
            <p><strong>Dirección:</strong> Av. Principal 123</p>
            <p><strong>Teléfono:</strong> +56 9 1234 5678</p>
            <p className="mb-0"><strong>Correo:</strong> contacto@stog.cl</p>
          </div>
        </Col>

        <Col xs={12} md={7}>
          <section className="formulario mt-0">
            <h2>Escríbenos</h2>
            <form noValidate onSubmit={handleSubmit}>
              <div className="mb-3">
                <label htmlFor="nombre" className="form-label">Nombre</label>
                <input type="text" id="nombre" name="nombre" maxLength="100"
                  className={'form-control' + (errores.nombre ? ' is-invalid' : '')}
                  value={datos.nombre} onChange={handleChange} />
                <div className="invalid-feedback">{errores.nombre}</div>
              </div>

              <div className="mb-3">
                <label htmlFor="correo" className="form-label">Correo electrónico</label>
                <input type="email" id="correo" name="correo" maxLength="100"
                  className={'form-control' + (errores.correo ? ' is-invalid' : '')}
                  value={datos.correo} onChange={handleChange} />
                <div className="invalid-feedback">{errores.correo}</div>
              </div>

              <div className="mb-3">
                <label htmlFor="mensaje" className="form-label">Mensaje</label>
                <textarea id="mensaje" name="mensaje" rows="5" maxLength="500"
                  className={'form-control' + (errores.mensaje ? ' is-invalid' : '')}
                  value={datos.mensaje} onChange={handleChange}></textarea>
                <div className="invalid-feedback">{errores.mensaje}</div>
              </div>

              <Boton texto="Enviar" />

              {enviado && (
                <div className="alert alert-success mt-3" role="alert">
                  ¡Mensaje enviado! Te responderemos a la brevedad.
                </div>
              )}
            </form>
          </section>
        </Col>
      </Row>
    </>
  )
}

export default Contacto
