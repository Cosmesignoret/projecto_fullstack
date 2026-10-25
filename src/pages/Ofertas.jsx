import ListaJuegos from '../components/ListaJuegos.jsx'
import { useTienda } from '../context/TiendaContext.jsx'

function Ofertas() {
  // Solo los productos marcados como oferta (el contexto ya los filtra)
  const { ofertas } = useTienda()

  return (
    <>
      <section className="banner-ofertas">
        <h1>Ofertas</h1>
        <p className="mb-0">Descuentos especiales por tiempo limitado.</p>
      </section>

      <ListaJuegos productos={ofertas} vacio="Actualmente no hay ofertas disponibles." />
    </>
  )
}

export default Ofertas
