import { Link, useParams } from 'react-router-dom'
import { useTienda } from '../context/TiendaContext.jsx'
import DetalleCompra from '../components/DetalleCompra.jsx'

// Boleta de una orden: /admin/ordenes/ST-ORD-1001
function AdminBoleta() {
  const { numero } = useParams()
  const { buscarOrdenPorNumero } = useTienda()
  const orden = buscarOrdenPorNumero(numero)

  if (orden === null) {
    return (
      <section className="admin-panel">
        <h1>Boleta no encontrada</h1>
        <Link to="/admin/ordenes" className="btn btn-success">Volver a órdenes</Link>
      </section>
    )
  }

  return (
    <>
      <div className="admin-topbar">
        <h1>Boleta {orden.numero}</h1>
        <div className="d-print-none">
          <button className="btn btn-danger me-2" onClick={() => window.print()}>Imprimir en PDF</button>
          <Link to="/admin/ordenes" className="btn btn-outline-secondary">Volver</Link>
        </div>
      </div>
      <section className="admin-panel">
        <p className="text-muted text-end">Fecha: {new Date(orden.fecha).toLocaleString('es-CL')}</p>
        <DetalleCompra cliente={orden.cliente} direccion={orden.direccion} items={orden.items} total={orden.total} />
      </section>
    </>
  )
}

export default AdminBoleta
