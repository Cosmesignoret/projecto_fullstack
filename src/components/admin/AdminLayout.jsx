import { Outlet } from 'react-router-dom'
import AdminSidebar from './AdminSidebar.jsx'
import RutaAdmin from './RutaAdmin.jsx'

// Estructura de todas las páginas del panel: menú lateral a la izquierda y el contenido de
// cada sección a la derecha. <Outlet /> es el hueco donde React Router dibuja la página que
// corresponde a la URL. RutaAdmin revisa que haya una sesión autorizada.
function AdminLayout() {
  return (
    <RutaAdmin>
      <div className="admin-layout">
        <AdminSidebar />
        <main className="admin-main">
          <Outlet />
        </main>
      </div>
    </RutaAdmin>
  )
}

export default AdminLayout
