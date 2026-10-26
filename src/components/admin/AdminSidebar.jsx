import { Link, NavLink, useNavigate } from 'react-router-dom'
import { secciones } from '../../data/seccionesAdmin.js'
import { useTienda } from '../../context/TiendaContext.jsx'

// Menú lateral del panel de administración
function AdminSidebar() {
  const { sesion, cerrarSesion } = useTienda()
  const navigate = useNavigate()
  const esAdmin = sesion !== null && sesion.rol === 'administrador'
  // El vendedor no ve las secciones marcadas como soloAdmin (Usuarios)
  const visibles = secciones.filter((seccion) => !seccion.soloAdmin || esAdmin)

  // Al cerrar sesión se va a la pantalla de login (el panel exige sesión, así que ese es de todos modos
  // el destino al que lo mandaría RutaAdmin).
  function handleSalir() {
    cerrarSesion()
    navigate('/login')
  }

  return (
    <aside className="admin-sidebar">
      <Link className="logo" to="/admin">Stog Admin</Link>

      <nav className="admin-nav">
        {visibles.map((seccion) => (
          // "end" hace que /admin cuente como activo solo en /admin exacto, y no en /admin/ordenes
          <NavLink
            key={seccion.ruta}
            to={seccion.ruta}
            end={seccion.ruta === '/admin'}
            className={({ isActive }) => (isActive ? 'activo' : '')}
          >
            {seccion.icono} {seccion.texto}
          </NavLink>
        ))}
      </nav>

      <div className="admin-acciones">
        <Link to="/" className="btn btn-dark w-100 mb-2">🏬 Tienda</Link>
        <button type="button" className="btn btn-danger w-100" onClick={handleSalir}>Cerrar sesión</button>
      </div>
    </aside>
  )
}

export default AdminSidebar
