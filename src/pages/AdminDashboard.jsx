import { Link } from 'react-router-dom'
import { useTienda } from '../context/TiendaContext.jsx'
import { secciones } from '../data/seccionesAdmin.js'

function AdminDashboard() {
  const { ordenes, productos, usuarios, productosCriticos, sesion } = useTienda()
  const esAdmin = sesion !== null && sesion.rol === 'administrador'
  // Las tarjetas son todas las secciones menos el Dashboard (ya estamos en él).
  // El vendedor no ve las secciones solo para administradores.
  const tarjetas = secciones.filter((s) => s.ruta !== '/admin' && (!s.soloAdmin || esAdmin))

  return (
    <>
      <div className="admin-topbar">
        <div>
          <h1>Dashboard</h1>
          <p className="text-muted mb-0">Resumen de las actividades diarias. ¡Hola, {sesion ? sesion.nombre : 'Admin'}!</p>
        </div>
      </div>

      <section className="admin-resumen">
        <div className="admin-tarjeta azul">
          <span className="etiqueta">Compras</span>
          <span className="numero">{ordenes.length}</span>
          <small>Órdenes realizadas en la tienda</small>
        </div>
        <div className="admin-tarjeta verde">
          <span className="etiqueta">Productos</span>
          <span className="numero">{productos.length}</span>
          <small>{productosCriticos.length} con stock crítico</small>
        </div>
        <div className="admin-tarjeta amarilla">
          <span className="etiqueta">Usuarios</span>
          <span className="numero">{usuarios.length}</span>
          <small>Cuentas registradas</small>
        </div>
      </section>

      <section className="admin-tiles">
        {tarjetas.map((t) => (
          <Link key={t.ruta} to={t.ruta} className="admin-tile">
            <span className="icono">{t.icono}</span>
            <strong>{t.texto}</strong>
            <small>{t.detalle}</small>
          </Link>
        ))}
        <Link to="/" className="admin-tile">
          <span className="icono">🏬</span>
          <strong>Tienda</strong>
          <small>Visualiza tu tienda en tiempo real.</small>
        </Link>
      </section>
    </>
  )
}

export default AdminDashboard
