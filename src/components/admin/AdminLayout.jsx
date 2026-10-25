import { Navigate, Outlet } from 'react-router-dom'
import { useTienda } from '../../context/TiendaContext.jsx'
import AdminSidebar from './AdminSidebar.jsx'

// Estructura de todas las páginas del panel: menú lateral a la izquierda y la sección a la derecha.
// También es el "guardia" del panel: solo entra un usuario con sesión y rol administrador;
// cualquier otra persona es enviada al login.
function AdminLayout() {
  const { sesion } = useTienda()

  if (!sesion || sesion.rol !== 'administrador') {
    return <Navigate to="/login" replace />
  }

  return (
    <div className="admin-layout">
      <AdminSidebar />
      <main className="admin-main">
        <div className="admin-topbar">
          <div className="admin-usuario">
            <span className="avatar">{sesion.nombre.charAt(0).toUpperCase()}</span>
            <span>{sesion.nombre} <span className="badge-rol">{sesion.rol}</span></span>
          </div>
        </div>
        <Outlet />
      </main>
    </div>
  )
}

export default AdminLayout
