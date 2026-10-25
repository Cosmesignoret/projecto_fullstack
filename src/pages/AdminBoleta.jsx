import { Link, useParams } from 'react-router-dom'
import { useTienda } from '../context/TiendaContext.jsx'
import ResumenCompra from '../components/ResumenCompra.jsx'

// Boleta de una orden: /admin/ordenes/:numero
function AdminBoleta() {
  // El número de orden viaja en la URL, por ejemplo ST-ORD-1001
  const { numero } = useParams()
  const { buscarOrdenPorNumero } = useTienda()
  const orden = buscarOrdenPorNumero(numero)

  if (orden === null) {
    return (
      <>
        <div className="admin-topbar"><h1>Boleta</h1></div>
        <section className="admin-panel">
          <p>No existe una orden con el número "{numero}".</p>
          <Link to="/admin/ordenes" className="btn btn-success">Volver a órdenes</Link>
        </section>
      </>
    )
  }

  return (
    <>
      <div className="admin-topbar"><h1>Boleta {orden.numero}</h1></div>

      <section className="admin-panel">
        <p className="text-muted">
          Fecha: {new Date(orden.fecha).toLocaleString('es-CL')} · Método de pago: {orden.metodoPago}
        </p>
        <ResumenCompra
          cliente={orden.cliente}
          direccion={orden.direccion}
          items={orden.items}
          total={orden.total}
          etiquetaTotal="Total pagado"
        />

        {/* Los elementos con "no-imprimir" no salen en la hoja impresa */}
        <div className="no-imprimir mt-4">
          <button type="button" className="btn btn-danger" onClick={() => window.print()}>
            Imprimir boleta en PDF
          </button>
          <Link to="/admin/ordenes" className="btn btn-outline-secondary ms-2">Volver a órdenes</Link>
        </div>
      </section>
    </>
  )
}

export default AdminBoleta
