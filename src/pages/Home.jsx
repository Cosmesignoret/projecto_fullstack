import { Link } from 'react-router-dom'
import { Carousel } from 'react-bootstrap'
import ListaJuegos from '../components/ListaJuegos.jsx'
import { useTienda } from '../context/TiendaContext.jsx'
import { urlImagen } from '../js/formato.js'

// Diapositivas del carrusel de la portada
const diapositivas = [
  { imagen: '/img/gta.webp', titulo: 'Nuevos lanzamientos', texto: 'Descubre los últimos juegos disponibles en nuestra tienda.' },
  { imagen: '/img/doom.webp', titulo: 'Acción sin pausa', texto: 'Shooters y combates rápidos para los más intensos.' },
  { imagen: '/img/bh.jpg', titulo: 'Historias que importan', texto: 'Aventuras narrativas donde tus decisiones cambian el final.' }
]

function Home() {
  // Los destacados son los primeros 4 productos de la tienda
  const { productos } = useTienda()
  const destacados = productos.slice(0, 4)

  return (
    <>
      <section className="hero-stog">
        <h1>Tienda online</h1>
        <p className="my-3">
          Encuentra los mejores videojuegos de acción, mundo abierto y mucho más.
          Descarga o compra tus títulos favoritos hoy mismo.
        </p>
        <Link to="/productos" className="btn btn-dark">Ver productos</Link>
      </section>

      <Carousel className="carrusel-stog mb-4" aria-label="Novedades">
        {diapositivas.map((d) => (
          <Carousel.Item key={d.titulo}>
            <img src={urlImagen(d.imagen)} alt={d.titulo} />
            <Carousel.Caption>
              <h3>{d.titulo}</h3>
              <p>{d.texto}</p>
            </Carousel.Caption>
          </Carousel.Item>
        ))}
      </Carousel>

      <section>
        <h2 className="text-center fw-bold">Destacados</h2>
        <ListaJuegos productos={destacados} vacio="Pronto tendremos nuevos títulos." />
      </section>
    </>
  )
}

export default Home
