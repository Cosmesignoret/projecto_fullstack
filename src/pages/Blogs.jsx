import { Link } from 'react-router-dom'
import { Row, Col } from 'react-bootstrap'
import { articulos } from '../data/blogs.js'
import { urlImagen } from '../js/formato.js'

// Lista de artículos: cada tarjeta lleva al detalle (/blogs/caso1, /blogs/caso2...)
function Blogs() {
  return (
    <>
      <section className="hero">
        <h1>Noticias importantes</h1>
        <p className="mb-0">Datos curiosos del mundo de los videojuegos.</p>
      </section>

      <Row className="g-4">
        {articulos.map((articulo) => (
          <Col xs={12} md={6} key={articulo.id}>
            <article className="tarjeta-info d-flex flex-column">
              <img src={urlImagen(articulo.imagen)} alt={articulo.titulo} className="rounded mb-3"
                style={{ width: '100%', aspectRatio: '16 / 9', objectFit: 'cover' }} />
              <h2>{articulo.titulo}</h2>
              <p className="flex-grow-1">{articulo.resumen}</p>
              <Link to={'/blogs/' + articulo.id} className="btn btn-success align-self-start">Leer artículo</Link>
            </article>
          </Col>
        ))}
      </Row>
    </>
  )
}

export default Blogs
