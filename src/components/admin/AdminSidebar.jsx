import { Link, NavLink } from 'react-router-dom'
import { secciones } from '../../data/seccionesAdmin.js'

// Menú lateral del panel de administración
function AdminSidebar() {
  return (
    <aside className="admin-sidebar">
      <Link className="logo" to="/admin">Stog Admin</Link>

      <nav className="admin-nav">
        {secciones.map((seccion) => (
          // "end" hace que /admin cuente como activo solo en /admin exacto y no en /admin/productos
          <NavLink
            key={seccion.ruta}
            to={seccion.ruta}
            end={seccion.ruta === '/admin'}
            className={({ isActive }) => (isActive ? 'activo' : '')}
          >
            {seccion.icono} {seccion.texto}
          </NavLink>
        ))}
        <Link to="/" className="salir">↩ Volver a la tienda</Link>
      </nav>
    </aside>
  )
}

export default AdminSidebar
