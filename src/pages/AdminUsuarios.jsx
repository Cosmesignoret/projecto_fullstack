import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useTienda } from '../context/TiendaContext.jsx'

function AdminUsuarios() {
  const { usuarios, sesion, borrarUsuario } = useTienda()
  const [mensaje, setMensaje] = useState('')
  const [error, setError] = useState('')

  function handleEliminar(usuario) {
    setMensaje('')
    setError('')
    // Evita que el administrador se borre a sí mismo y se quede sin acceso
    if (sesion !== null && sesion.id === usuario.id) {
      setError('No puedes eliminar tu propia cuenta mientras tienes la sesión abierta.')
      return
    }
    if (!window.confirm('¿Eliminar al usuario "' + usuario.nombre + ' ' + usuario.apellidos + '"?')) {
      return
    }
    borrarUsuario(usuario.id)
    setMensaje('Usuario "' + usuario.nombre + '" eliminado.')
  }

  return (
    <>
      <div className="admin-topbar">
        <h1>Usuarios</h1>
        <Link to="/admin/usuarios/nuevo" className="btn btn-success">+ Nuevo usuario</Link>
      </div>

      {error && <div className="alert alert-danger" role="alert">{error}</div>}
      {mensaje && <div className="alert alert-success" role="status">{mensaje}</div>}

      <section className="admin-panel">
        <div className="tabla-scroll">
          <table className="tabla-stog">
            <thead>
              <tr><th>RUN</th><th>Nombre completo</th><th>Correo</th><th>Perfil</th><th></th></tr>
            </thead>
            <tbody>
              {usuarios.map((u) => (
                <tr key={u.id}>
                  <td>{u.run || '—'}</td>
                  <td>{u.nombre} {u.apellidos}</td>
                  <td>{u.correo}</td>
                  <td><span className="badge-rol">{u.rol}</span></td>
                  <td>
                    <Link to={'/admin/usuarios/' + u.id + '/editar'} className="btn btn-sm btn-success">Editar</Link>
                    <Link to={'/admin/usuarios/' + u.id + '/historial'} className="btn btn-sm btn-outline-secondary ms-1">Historial de compras</Link>
                    <button className="btn btn-sm btn-danger ms-1" onClick={() => handleEliminar(u)}>Eliminar</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </>
  )
}

export default AdminUsuarios
