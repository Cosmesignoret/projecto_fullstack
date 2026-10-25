import { Row, Col } from 'react-bootstrap'

function Nosotros() {
  return (
    <>
      <section className="hero">
        <h1>Nosotros</h1>
        <p className="mb-0">Conoce quiénes están detrás de Stog.</p>
      </section>

      <Row className="g-4">
        <Col xs={12}>
          <div className="tarjeta-info">
            <h2>¿Quiénes somos?</h2>
            <p>
              Stog nació como un proyecto de práctica para aprender a construir sitios web con HTML y Bootstrap,
              y hoy es una aplicación completa hecha con React. Somos una tienda en línea dedicada a la venta de
              videojuegos, pensada para que encontrar tu próximo juego favorito sea simple y rápido.
            </p>
            <p className="mb-0">
              Nuestro catálogo reúne títulos de distintos géneros: acción, mundo abierto, aventura y juegos
              casuales para compartir con amigos. Buscamos ofrecer precios accesibles y una navegación clara,
              sin complicaciones.
            </p>
          </div>
        </Col>

        <Col xs={12} md={6}>
          <div className="tarjeta-info">
            <h2>Desarrolladores</h2>
            <p><strong>Desarrollador 1:</strong> Frontend y maquetación con Bootstrap.</p>
            <p className="mb-0"><strong>Desarrollador 2:</strong> Lógica de formularios y validaciones en JavaScript.</p>
          </div>
        </Col>

        <Col xs={12} md={6}>
          <div className="tarjeta-info">
            <h2>Cómo compras en Stog</h2>
            <ol className="mb-0">
              <li>Crea tu cuenta de cliente.</li>
              <li>Agrega tus juegos al carrito.</li>
              <li>Paga y recibe tu clave de descarga por correo.</li>
            </ol>
          </div>
        </Col>
      </Row>
    </>
  )
}

export default Nosotros
