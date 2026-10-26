import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { articulos } from '../data/blogs.js'
import { urlImagen } from '../js/formato.js'

// Detalle de un artículo. El id llega por la URL (/blogs/:id) y se lee con useParams.
function BlogDetalle() {
  const { id } = useParams()
  const articulo = articulos.find((a) => a.id === id)
  // Guarda si la persona ya respondió "¿Te fue de utilidad?"
  const [respondido, setRespondido] = useState(false)

  if (!articulo) {
    return (
      <section className="formulario">
        <h1>Artículo no encontrado</h1>
        <Link to="/blogs" className="boton">Volver a Blogs</Link>
      </section>
    )
  }

  return (
    <article className="formulario">
      <nav aria-label="breadcrumb">
        <ol className="breadcrumb">
          <li className="breadcrumb-item"><Link to="/blogs">Blogs</Link></li>
          <li className="breadcrumb-item active">{articulo.titulo}</li>
        </ol>
      </nav>

      <h1 className="fw-bold" style={{ color: 'var(--stog-dark)' }}>{articulo.titulo}</h1>
      <img src={urlImagen(articulo.imagen)} alt={articulo.titulo} className="rounded my-3"
        style={{ width: '100%', maxHeight: '360px', objectFit: 'cover' }} />
      <p className="lead">{articulo.resumen}</p>
      {articulo.parrafos.map((parrafo, i) => <p key={i}>{parrafo}</p>)}

      <p className="mb-2">¿Te fue de utilidad esta información?</p>
      <button className="btn btn-outline-secondary btn-sm me-1" onClick={() => setRespondido(true)}>Sí</button>
      <button className="btn btn-outline-secondary btn-sm" onClick={() => setRespondido(true)}>No</button>
      {respondido && <p className="mt-3 text-muted">¡Gracias por tu respuesta!</p>}
    </article>
  )
}

export default BlogDetalle
