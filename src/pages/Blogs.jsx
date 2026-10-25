import { useState } from 'react'
import { Accordion } from 'react-bootstrap'
import { urlImagen } from '../js/formato.js'

// Los artículos van en un arreglo: para sumar uno nuevo basta con agregar un objeto.
const articulos = [
  {
    id: 'caso1',
    titulo: 'Caso curioso #1: el origen de Doom',
    imagen: '/img/doom.webp',
    resumen: 'Doom, lanzado en 1993, definió el género shooter en primera persona y popularizó el juego en red.',
    parrafos: [
      'Doom fue lanzado en 1993 por id Software y es considerado uno de los juegos más influyentes en la historia de los videojuegos. Popularizó el género shooter en primera persona y fue pionero en el juego multijugador en red, permitiendo que varios jugadores se enfrentaran entre sí a través de una conexión local.',
      'El juego causó tanto impacto que muchas universidades y empresas tuvieron que restringir su instalación en los computadores de sus redes, ya que consumía gran parte del ancho de banda disponible en la época.'
    ]
  },
  {
    id: 'caso2',
    titulo: 'Caso curioso #2: la saga GTA',
    imagen: '/img/gta.webp',
    resumen: 'La saga GTA ha vendido más de 405 millones de copias, una de las franquicias más exitosas de la historia.',
    parrafos: [
      'La saga Grand Theft Auto (GTA), desarrollada por Rockstar Games, ha vendido más de 405 millones de copias en total, convirtiéndola en una de las franquicias de videojuegos más exitosas de la historia. GTA VI es una de las entregas más esperadas por la comunidad gamer, con un mundo abierto detallado y una historia ambiciosa.',
      'Desde su primera entrega en 1997, la saga ha evolucionado desde una vista cenital en 2D hasta mundos tridimensionales completamente abiertos, marcando tendencia en el género de mundo abierto.'
    ]
  }
]

function Blogs() {
  // Guarda qué artículos ya tuvieron respuesta a "¿Te fue de utilidad?"
  const [respondidos, setRespondidos] = useState({})

  return (
    <>
      <section className="hero">
        <h1>Noticias importantes</h1>
        <p className="mb-0">Datos curiosos del mundo de los videojuegos.</p>
      </section>

      <Accordion>
        {articulos.map((articulo) => (
          <Accordion.Item eventKey={articulo.id} key={articulo.id}>
            <Accordion.Header>
              <img
                src={urlImagen(articulo.imagen)}
                alt={articulo.titulo}
                width="120"
                height="70"
                className="rounded me-3"
              />
              <span className="tituloBlog">{articulo.titulo}</span>
            </Accordion.Header>
            <Accordion.Body>
              <article>
                <p className="lead">{articulo.resumen}</p>
                {articulo.parrafos.map((parrafo, i) => <p key={i}>{parrafo}</p>)}

                <p className="mb-2">¿Te fue de utilidad esta información?</p>
                <button
                  className="btn btn-outline-secondary btn-sm me-1"
                  onClick={() => setRespondidos({ ...respondidos, [articulo.id]: true })}
                >
                  Sí
                </button>
                <button
                  className="btn btn-outline-secondary btn-sm"
                  onClick={() => setRespondidos({ ...respondidos, [articulo.id]: true })}
                >
                  No
                </button>
                {respondidos[articulo.id] && <p className="mt-3 text-muted">¡Gracias por tu respuesta!</p>}
              </article>
            </Accordion.Body>
          </Accordion.Item>
        ))}
      </Accordion>
    </>
  )
}

export default Blogs
