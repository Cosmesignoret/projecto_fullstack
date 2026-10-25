import { Link } from 'react-router-dom'
import { Row, Col } from 'react-bootstrap'
import ListaJuegos from '../components/ListaJuegos.jsx'
import { useTienda } from '../context/TiendaContext.jsx'
import { urlImagen } from '../js/formato.js'

function Home() {
  // Los destacados son los primeros 4 productos de la tienda
  const { productos } = useTienda()
  const destacados = productos.slice(0, 4)

  return (
    <>
      <section className="hero-stog">
        <Row className="align-items-center g-4">
          <Col xs={12} lg={6}>
            <h1>Tienda online</h1>
            <p className="my-3">
              Encuentra los mejores videojuegos de acción, mundo abierto y mucho más.
              Descarga o compra tus títulos favoritos hoy mismo.
            </p>
            <Link to="/productos" className="btn btn-dark">Ver productos</Link>
          </Col>
          <Col xs={12} lg={6}>
            <div className="ratio ratio-16x9">
              <img src={urlImagen('/img/gta.webp')} alt="Stog videojuegos" />
            </div>
          </Col>
        </Row>
      </section>

      <section>
        <h2 className="text-center fw-bold">Destacados</h2>
        <ListaJuegos productos={destacados} vacio="Pronto tendremos nuevos títulos." />
      </section>
    </>
  )
}

export default Home
