import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Container, Row, Col } from 'react-bootstrap'
import { validarCorreo } from '../../js/validaciones.js'

function Footer() {
  const [correo, setCorreo] = useState('')
  const [mensaje, setMensaje] = useState('')
  const [error, setError] = useState('')

  // Boletín simulado: solo valida el correo y muestra una confirmación
  function handleSuscribir(e) {
    e.preventDefault()
    const problema = validarCorreo(correo)
    if (problema) {
      setMensaje('')
      setError(problema)
      return
    }
    setError('')
    setMensaje('¡Listo! Te suscribiste al boletín de Stog.')
    setCorreo('')
  }

  return (
    <footer className="footer-stog mt-auto">
      <Container>
        <Row className="g-4 align-items-center">
          <Col xs={12} md={6}>
            <p className="marca mb-2">Stog<span>.</span></p>
            <Link to="/productos" className="me-2">Productos</Link>|
            <Link to="/ofertas" className="mx-2">Ofertas</Link>|
            <Link to="/contacto" className="ms-2">Contacto</Link>
          </Col>
          <Col xs={12} md={6}>
            <p className="mb-2">Mantente al día, únete a nuestro boletín</p>
            <form className="input-group" onSubmit={handleSuscribir} noValidate>
              <input
                type="email"
                className="form-control"
                placeholder="Ingresa tu correo"
                aria-label="Correo para el boletín"
                value={correo}
                onChange={(e) => setCorreo(e.target.value)}
              />
              <button className="btn btn-success" type="submit">Suscribirse</button>
            </form>
            {error && <small className="text-danger d-block mt-1">{error}</small>}
            {mensaje && <small className="d-block mt-1" style={{ color: 'var(--stog-accent)' }}>{mensaje}</small>}
          </Col>
        </Row>
        <hr />
        <p className="text-center small mb-0" style={{ color: '#adb5bd' }}>Stog 2026</p>
      </Container>
    </footer>
  )
}

export default Footer
