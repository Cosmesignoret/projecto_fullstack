import { HashRouter, Routes, Route, Outlet } from 'react-router-dom'
import { TiendaProvider } from './context/TiendaContext.jsx'
import { CarritoProvider } from './context/CarritoContext.jsx'
import Layout from './components/layout/Layout.jsx'
import AdminLayout from './components/admin/AdminLayout.jsx'

import Home from './pages/Home.jsx'
import Productos from './pages/Productos.jsx'
import DetalleProducto from './pages/DetalleProducto.jsx'
import Categorias from './pages/Categorias.jsx'
import CategoriaDetalle from './pages/CategoriaDetalle.jsx'
import Ofertas from './pages/Ofertas.jsx'
import Carrito from './pages/Carrito.jsx'
import Checkout from './pages/Checkout.jsx'
import Nosotros from './pages/Nosotros.jsx'
import Blogs from './pages/Blogs.jsx'
import Contacto from './pages/Contacto.jsx'
import Login from './pages/Login.jsx'
import Registro from './pages/Registro.jsx'
import NoEncontrada from './pages/NoEncontrada.jsx'
import PagoCorrecto from './pages/PagoCorrecto.jsx'
import PagoError from './pages/PagoError.jsx'
import AdminDashboard from './pages/AdminDashboard.jsx'
import AdminProductos from './pages/AdminProductos.jsx'
import AdminCategorias from './pages/AdminCategorias.jsx'
import AdminUsuarios from './pages/AdminUsuarios.jsx'
import AdminOrdenes from './pages/AdminOrdenes.jsx'
import AdminBoleta from './pages/AdminBoleta.jsx'
import AdminHistorialCompras from './pages/AdminHistorialCompras.jsx'
import AdminProductosCriticos from './pages/AdminProductosCriticos.jsx'
import AdminReportes from './pages/AdminReportes.jsx'
import AdminPerfil from './pages/AdminPerfil.jsx'

// Envuelve las páginas públicas con el Header y el Footer. <Outlet /> es el hueco
// donde se dibuja la página que corresponde a la URL.
function LayoutPublico() {
  return (
    <Layout>
      <Outlet />
    </Layout>
  )
}

function App() {
  return (
    <TiendaProvider>
      <CarritoProvider>
        {/* HashRouter usa URLs con # (/#/productos): funciona en cualquier hosting sin configurar el servidor */}
        <HashRouter>
          <Routes>
            {/* Ruta sin path: no agrega nada a la URL, solo le pone el LayoutPublico a todo lo que tiene adentro */}
            <Route element={<LayoutPublico />}>
              <Route path="/" element={<Home />} />
              <Route path="/productos" element={<Productos />} />
              <Route path="/productos/:id" element={<DetalleProducto />} />
              <Route path="/categorias" element={<Categorias />} />
              <Route path="/categorias/:id" element={<CategoriaDetalle />} />
              <Route path="/ofertas" element={<Ofertas />} />
              <Route path="/carrito" element={<Carrito />} />
              <Route path="/checkout" element={<Checkout />} />
              <Route path="/pago-correcto/:numero" element={<PagoCorrecto />} />
              <Route path="/pago-error" element={<PagoError />} />
              <Route path="/nosotros" element={<Nosotros />} />
              <Route path="/blogs" element={<Blogs />} />
              <Route path="/contacto" element={<Contacto />} />
              <Route path="/login" element={<Login />} />
              <Route path="/registro" element={<Registro />} />
            </Route>

            {/* Panel de administración: tiene su propio menú lateral (sin Header ni Footer públicos)
                y AdminLayout solo deja entrar a usuarios con rol administrador */}
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<AdminDashboard />} />
              <Route path="productos" element={<AdminProductos />} />
              <Route path="productos/criticos" element={<AdminProductosCriticos />} />
              <Route path="categorias" element={<AdminCategorias />} />
              <Route path="usuarios" element={<AdminUsuarios />} />
              <Route path="usuarios/:id/compras" element={<AdminHistorialCompras />} />
              <Route path="ordenes" element={<AdminOrdenes />} />
              <Route path="ordenes/:numero" element={<AdminBoleta />} />
              <Route path="reportes" element={<AdminReportes />} />
              <Route path="perfil" element={<AdminPerfil />} />
            </Route>

            {/* Cualquier otra URL: página 404 dentro del layout público */}
            <Route element={<LayoutPublico />}>
              <Route path="*" element={<NoEncontrada />} />
            </Route>
          </Routes>
        </HashRouter>
      </CarritoProvider>
    </TiendaProvider>
  )
}

export default App
