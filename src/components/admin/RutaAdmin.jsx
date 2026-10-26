import { Navigate } from 'react-router-dom'
import { useTienda } from '../../context/TiendaContext.jsx'

// Protege el panel: solo entran el administrador y el vendedor.
// Si no hay sesión (o es un cliente) se manda al login.
// soloAdmin: true = la sección es solo para el administrador (por ejemplo, Usuarios).
function RutaAdmin({ children, soloAdmin = false }) {
  const { sesion } = useTienda()

  if (sesion === null) {
    return <Navigate to="/login" replace />
  }
  if (sesion.rol !== 'administrador' && sesion.rol !== 'vendedor') {
    return <Navigate to="/" replace />
  }
  if (soloAdmin && sesion.rol !== 'administrador') {
    return <Navigate to="/admin" replace />
  }
  return children
}

export default RutaAdmin
