import { useState } from 'react'
import { Navbar, Nav, Container } from 'react-bootstrap'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { useCarrito } from '../../context/CarritoContext.jsx'
import { useTienda } from '../../context/TiendaContext.jsx'
import { pesos } from '../../js/formato.js'

// Barra superior (sesión) + navbar oscuro de Stog. Usa react-bootstrap para que la
// hamburguesa funcione sin cargar el JavaScript de Bootstrap por CDN.
function Header() {
  const { cantidadTotal, total } = useCarrito()
  const { sesion, cerrarSesion } = useTienda()
  const navigate = useNavigate()
  const [busqueda, setBusqueda] = useState('')

  function handleSalir() {
    cerrarSesion()
    navigate('/')
  }

  // El buscador manda a /productos con el texto en la URL (?buscar=...), y esa página filtra con él
  function handleBuscar(e) {
    e.preventDefault()
    const texto = busqueda.trim()
    navigate(texto === '' ? '/productos' : '/productos?buscar=' + encodeURIComponent(texto))
  }

  // NavLink sabe cuál ruta está abierta: el link actual lleva la clase "active" (verde)
  const enlace = ({ isActive }) => 'nav-link' + (isActive ? ' active' : '')

  return (
    <header>
      <div className="barrasuperior">
        <Container className="text-end">
          {sesion ? (
            <>
              <span className="saludo me-3">Hola, {sesion.nombre}</span>
              {(sesion.rol === 'administrador' || sesion.rol === 'vendedor') && (
                <Link to="/admin" className="me-3">Panel admin</Link>
              )}
              <button type="button" className="enlace" onClick={handleSalir}>Cerrar sesión</button>
            </>
          ) : (
            <>
              <Link to="/login" className="me-3">Iniciar sesión</Link>
              <Link to="/registro">Registrar usuario</Link>
            </>
          )}
        </Container>
      </div>

      <Navbar expand="lg" variant="dark" className="navbar-stog">
        <Container>
          <Navbar.Brand as={Link} to="/">Stog</Navbar.Brand>
          <Navbar.Toggle aria-controls="menuNavbar" />
          <Navbar.Collapse id="menuNavbar">
            <Nav className="me-auto">
              <NavLink to="/" end className={enlace}>Inicio</NavLink>
              <NavLink to="/productos" className={enlace}>Productos</NavLink>
              <NavLink to="/categorias" className={enlace}>Categorías</NavLink>
              <NavLink to="/ofertas" className={enlace}>Ofertas</NavLink>
              <NavLink to="/nosotros" className={enlace}>Nosotros</NavLink>
              <NavLink to="/blogs" className={enlace}>Blogs</NavLink>
              <NavLink to="/contacto" className={enlace}>Contacto</NavLink>
            </Nav>
            <form className="d-flex me-lg-3 my-2 my-lg-0" role="search" onSubmit={handleBuscar}>
              <input
                type="search"
                className="form-control form-control-sm me-2"
                placeholder="Buscar juego..."
                aria-label="Buscar juego"
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
              />
              <button className="btn btn-sm btn-outline-success" type="submit">Buscar</button>
            </form>
            <Link to="/carrito" className="carrito-link">
              🛒 Carrito ({cantidadTotal}){cantidadTotal > 0 && <> · {pesos(total)}</>}
            </Link>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </header>
  )
}

export default Header
