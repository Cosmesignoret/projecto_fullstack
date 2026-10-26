// Pruebas del panel de administración: acceso por perfil, dashboard, y el CRUD de productos,
// categorías y usuarios, además de órdenes, boleta, historial, reportes y perfil.
import { fireEvent, cleanup, screen, within } from '@testing-library/react'
import { Routes, Route } from 'react-router-dom'
import AdminLayout from '../src/components/admin/AdminLayout.jsx'
import RutaAdmin from '../src/components/admin/RutaAdmin.jsx'
import AdminDashboard from '../src/pages/AdminDashboard.jsx'
import AdminOrdenes from '../src/pages/AdminOrdenes.jsx'
import AdminBoleta from '../src/pages/AdminBoleta.jsx'
import AdminProductos from '../src/pages/AdminProductos.jsx'
import AdminProductoForm from '../src/pages/AdminProductoForm.jsx'
import AdminProductosCriticos from '../src/pages/AdminProductosCriticos.jsx'
import AdminProductosReportes from '../src/pages/AdminProductosReportes.jsx'
import AdminCategorias from '../src/pages/AdminCategorias.jsx'
import AdminCategoriaForm from '../src/pages/AdminCategoriaForm.jsx'
import AdminUsuarios from '../src/pages/AdminUsuarios.jsx'
import AdminUsuarioForm from '../src/pages/AdminUsuarioForm.jsx'
import AdminHistorial from '../src/pages/AdminHistorial.jsx'
import AdminReportes from '../src/pages/AdminReportes.jsx'
import AdminPerfil from '../src/pages/AdminPerfil.jsx'
import { agregarOrden } from '../src/data/db.js'
import { renderTienda, JUEGOS, ADMIN, VENDEDOR, CLIENTE } from './ayudas.js'

// Las mismas rutas del panel que usa App.jsx (menos las de la tienda)
const rutasAdmin = (
  <Routes>
    <Route path="/login" element={<div>Pantalla de login</div>} />
    <Route path="/" element={<div>Inicio de la tienda</div>} />
    <Route path="/admin" element={<AdminLayout />}>
      <Route index element={<AdminDashboard />} />
      <Route path="ordenes" element={<AdminOrdenes />} />
      <Route path="ordenes/:numero" element={<AdminBoleta />} />
      <Route path="productos" element={<AdminProductos />} />
      <Route path="productos/nuevo" element={<AdminProductoForm />} />
      <Route path="productos/criticos" element={<AdminProductosCriticos />} />
      <Route path="productos/reportes" element={<AdminProductosReportes />} />
      <Route path="productos/:id/editar" element={<AdminProductoForm />} />
      <Route path="categorias" element={<AdminCategorias />} />
      <Route path="categorias/nueva" element={<AdminCategoriaForm />} />
      <Route path="categorias/:id/editar" element={<AdminCategoriaForm />} />
      <Route path="reportes" element={<AdminReportes />} />
      <Route path="perfil" element={<AdminPerfil />} />
      <Route path="usuarios" element={<RutaAdmin soloAdmin><AdminUsuarios /></RutaAdmin>} />
      <Route path="usuarios/nuevo" element={<RutaAdmin soloAdmin><AdminUsuarioForm /></RutaAdmin>} />
      <Route path="usuarios/:id/editar" element={<RutaAdmin soloAdmin><AdminUsuarioForm /></RutaAdmin>} />
      <Route path="usuarios/:id/historial" element={<RutaAdmin soloAdmin><AdminHistorial /></RutaAdmin>} />
    </Route>
  </Routes>
)

function admin(ruta, sesion = ADMIN) {
  return renderTienda(rutasAdmin, { ruta, sesion })
}

function escribir(etiqueta, valor) {
  fireEvent.change(screen.getByLabelText(etiqueta), { target: { value: valor } })
}

const titulo = (nombre) => screen.getByRole('heading', { level: 1, name: nombre })

// Crea una orden de ejemplo directamente en los datos (antes de dibujar la pantalla)
function crearOrden(correo = CLIENTE.correo) {
  return agregarOrden({
    cliente: { nombre: CLIENTE.nombre, apellidos: CLIENTE.apellidos, correo },
    direccion: { calle: 'Calle 1', departamento: '', region: 'Región Metropolitana de Santiago', comuna: 'Santiago', indicaciones: '' },
    items: [{ id: JUEGOS[0].id, nombre: JUEGOS[0].nombre, precio: 1000, cantidad: 2, imagen: JUEGOS[0].imagen }],
    total: 2000
  })
}

describe('Panel de administración - acceso', () => {
  afterEach(() => cleanup())

  it('sin sesión, el panel manda al login', () => {
    admin('/admin', null)

    expect(screen.getByText('Pantalla de login')).toBeTruthy()
  })

  it('un cliente no puede entrar al panel y vuelve a la tienda', () => {
    admin('/admin', CLIENTE)

    expect(screen.getByText('Inicio de la tienda')).toBeTruthy()
  })

  it('el administrador ve todas las secciones, incluida Usuarios', () => {
    admin('/admin')

    const menu = within(document.querySelector('.admin-nav'))
    expect(menu.getByText(/Usuarios/)).toBeTruthy()
    expect(menu.getByText(/Perfil/)).toBeTruthy()
  })

  it('el vendedor no ve Usuarios y, si escribe esa URL, vuelve al dashboard', () => {
    admin('/admin/usuarios', VENDEDOR)

    expect(titulo('Dashboard')).toBeTruthy()
    expect(within(document.querySelector('.admin-nav')).queryByText(/Usuarios/)).toBeNull()
  })

  it('"Cerrar sesión" del menú cierra la sesión y lleva al login', () => {
    admin('/admin')

    fireEvent.click(screen.getByRole('button', { name: 'Cerrar sesión' }))

    expect(screen.getByText('Pantalla de login')).toBeTruthy()
    expect(localStorage.getItem('stogSesion')).toBeNull()
  })
})

describe('Panel de administración - dashboard', () => {
  afterEach(() => cleanup())

  it('muestra los contadores de compras, productos y usuarios', () => {
    crearOrden()
    admin('/admin')

    const numeroDe = (etiqueta) => screen.getByText(etiqueta, { selector: '.etiqueta' }).parentElement.querySelector('.numero').textContent
    expect(numeroDe('Compras')).toBe('1')
    expect(numeroDe('Productos')).toBe(String(JUEGOS.length))
    expect(numeroDe('Usuarios')).toBe('3')
  })
})

describe('Panel de administración - productos', () => {
  afterEach(() => cleanup())

  it('lista todos los productos y marca los que tienen stock crítico', () => {
    admin('/admin/productos')

    expect(titulo('Inventario de productos')).toBeTruthy()
    JUEGOS.forEach((j) => expect(screen.getByText(j.nombre)).toBeTruthy())
    expect(screen.getAllByText('Crítico').length).toBeGreaterThan(0)
  })

  it('crea un producto nuevo (Crear) y lo muestra en la lista', () => {
    admin('/admin/productos/nuevo')

    escribir('Código / SKU*', 'prd-900')
    escribir('Categoría*', 'Acción')
    escribir('Nombre del producto*', 'Juego de prueba')
    escribir('Precio ($ CLP)*', '15990')
    escribir('Stock*', '12')
    escribir('Stock crítico*', '3')
    escribir('Descripción del videojuego*', 'Juego creado desde la prueba.')
    fireEvent.click(screen.getByRole('button', { name: 'Guardar producto' }))

    expect(titulo('Inventario de productos')).toBeTruthy()
    expect(screen.getByText('Juego de prueba')).toBeTruthy()
    expect(screen.getByText('PRD-900')).toBeTruthy() // el código se guarda en mayúsculas
  })

  it('el formulario de producto avisa de los errores y no guarda', () => {
    admin('/admin/productos/nuevo')

    fireEvent.click(screen.getByRole('button', { name: 'Guardar producto' }))
    expect(screen.getByRole('alert').textContent).toBe('El código es obligatorio.')

    escribir('Código / SKU*', JUEGOS[0].codigo) // un código que ya existe
    escribir('Categoría*', 'Acción')
    escribir('Nombre del producto*', 'Repetido')
    escribir('Precio ($ CLP)*', '1000')
    escribir('Stock*', '1')
    escribir('Stock crítico*', '1')
    escribir('Descripción del videojuego*', 'Texto')
    fireEvent.click(screen.getByRole('button', { name: 'Guardar producto' }))

    expect(screen.getByRole('alert').textContent).toMatch(/Ya existe un producto con el código/)
  })

  it('edita un producto (Actualizar): el formulario arranca con sus datos y guarda los cambios', () => {
    const juego = JUEGOS[0]
    admin('/admin/productos/' + juego.id + '/editar')

    expect(screen.getByLabelText('Nombre del producto*').value).toBe(juego.nombre)

    escribir('Precio ($ CLP)*', '99999') // sigue siendo mayor que su precio de oferta
    fireEvent.click(screen.getByRole('button', { name: 'Guardar producto' }))

    expect(titulo('Inventario de productos')).toBeTruthy()
    expect(screen.getByText('$99.999', { exact: false })).toBeTruthy()
  })

  it('un producto que no existe muestra "Producto no encontrado"', () => {
    admin('/admin/productos/9999/editar')

    expect(screen.getByText('Producto no encontrado')).toBeTruthy()
  })

  it('elimina un producto (Eliminar) solo si la persona confirma', () => {
    admin('/admin/productos')
    const confirmar = spyOn(window, 'confirm').and.returnValue(false)

    fireEvent.click(screen.getAllByRole('button', { name: 'Eliminar' })[0])
    expect(screen.getByText(JUEGOS[0].nombre)).toBeTruthy() // dijo que no: sigue ahí

    confirmar.and.returnValue(true)
    fireEvent.click(screen.getAllByRole('button', { name: 'Eliminar' })[0])
    expect(screen.queryByText(JUEGOS[0].nombre)).toBeNull() // dijo que sí: se fue
    expect(screen.getByRole('status').textContent).toMatch(/eliminado/)
  })

  it('la lista de productos críticos muestra solo los que están en nivel crítico', () => {
    admin('/admin/productos/criticos')
    const criticos = JUEGOS.filter((p) => p.stock <= p.stockCritico)
    const normales = JUEGOS.filter((p) => p.stock > p.stockCritico)

    expect(titulo('Productos críticos')).toBeTruthy()
    criticos.forEach((p) => expect(screen.getByText(p.nombre)).toBeTruthy())
    normales.forEach((p) => expect(screen.queryByText(p.nombre)).toBeNull())
  })

  it('el reporte de inventario muestra una fila por categoría', () => {
    admin('/admin/productos/reportes')

    expect(titulo('Reporte de inventario')).toBeTruthy()
    expect(screen.getByRole('cell', { name: JUEGOS[0].categoria })).toBeTruthy()
  })
})

describe('Panel de administración - categorías', () => {
  afterEach(() => cleanup())

  it('crea una categoría nueva y la muestra en la lista', () => {
    admin('/admin/categorias/nueva')

    escribir('Nombre de la categoría*', 'Estrategia')
    fireEvent.click(screen.getByRole('button', { name: 'Guardar categoría' }))

    expect(titulo('Categorías')).toBeTruthy()
    expect(screen.getByText('Estrategia')).toBeTruthy()
  })

  it('no permite una categoría repetida ni un nombre vacío', () => {
    admin('/admin/categorias/nueva')

    fireEvent.click(screen.getByRole('button', { name: 'Guardar categoría' }))
    expect(screen.getByRole('alert').textContent).toMatch(/obligatorio/)

    escribir('Nombre de la categoría*', JUEGOS[0].categoria.toLowerCase())
    fireEvent.click(screen.getByRole('button', { name: 'Guardar categoría' }))
    expect(screen.getByRole('alert').textContent).toBe('Ya existe una categoría con ese nombre.')
  })

  it('no deja eliminar una categoría que todavía tiene productos', () => {
    admin('/admin/categorias')
    spyOn(window, 'confirm').and.returnValue(true)

    fireEvent.click(screen.getAllByRole('button', { name: 'Eliminar' })[0])

    expect(screen.getByRole('alert').textContent).toMatch(/todavía tiene productos/)
  })

  it('edita el nombre de una categoría', () => {
    admin('/admin/categorias/1/editar')

    escribir('Nombre de la categoría*', 'Acción renovada')
    fireEvent.click(screen.getByRole('button', { name: 'Guardar categoría' }))

    expect(screen.getByText('Acción renovada')).toBeTruthy()
  })
})

describe('Panel de administración - usuarios', () => {
  afterEach(() => cleanup())

  function llenarUsuario(extra = {}) {
    const datos = {
      run: '201234565', nombre: 'Nuevo', apellidos: 'Usuario', correo: 'nuevo.usuario@gmail.com',
      rol: 'vendedor', contrasena: 'clave123', calle: 'Calle 5', comuna: 'Santiago', ...extra
    }
    escribir('RUN (sin puntos ni guión)*', datos.run)
    escribir('Nombre*', datos.nombre)
    escribir('Apellidos*', datos.apellidos)
    escribir('Correo electrónico*', datos.correo)
    escribir('Tipo de usuario*', datos.rol)
    escribir('Contraseña*', datos.contrasena)
    escribir('Calle*', datos.calle)
    escribir('Comuna*', datos.comuna)
  }

  it('lista los usuarios con su perfil', () => {
    admin('/admin/usuarios')

    expect(titulo('Usuarios')).toBeTruthy()
    expect(screen.getByText(CLIENTE.correo)).toBeTruthy()
    expect(screen.getByText(ADMIN.correo)).toBeTruthy()
  })

  it('crea un usuario nuevo con RUN válido y lo muestra en la lista', () => {
    admin('/admin/usuarios/nuevo')

    llenarUsuario()
    fireEvent.click(screen.getByRole('button', { name: 'Guardar usuario' }))

    expect(titulo('Usuarios')).toBeTruthy()
    expect(screen.getByText('nuevo.usuario@gmail.com')).toBeTruthy()
  })

  it('rechaza un RUN con dígito verificador incorrecto y un correo que ya existe', () => {
    admin('/admin/usuarios/nuevo')

    llenarUsuario({ run: '201234560' })
    fireEvent.click(screen.getByRole('button', { name: 'Guardar usuario' }))
    expect(screen.getByRole('alert').textContent).toBe('El RUN ingresado no es válido.')

    escribir('RUN (sin puntos ni guión)*', '201234565')
    escribir('Correo electrónico*', CLIENTE.correo)
    fireEvent.click(screen.getByRole('button', { name: 'Guardar usuario' }))
    expect(screen.getByRole('alert').textContent).toBe('Ya existe un usuario con ese correo.')
  })

  it('edita un usuario sin tener que escribir de nuevo la contraseña', () => {
    admin('/admin/usuarios/' + CLIENTE.id + '/editar')

    expect(screen.getByLabelText('Nombre*').value).toBe(CLIENTE.nombre)
    escribir('Nombre*', 'Carlos Cambiado')
    fireEvent.click(screen.getByRole('button', { name: 'Guardar usuario' }))

    expect(screen.getByText(/Carlos Cambiado/)).toBeTruthy()
  })

  it('el administrador no puede eliminar su propia cuenta', () => {
    admin('/admin/usuarios')
    spyOn(window, 'confirm').and.returnValue(true)
    const filaAdmin = screen.getByText(ADMIN.correo).closest('tr')

    fireEvent.click(within(filaAdmin).getByRole('button', { name: 'Eliminar' }))

    expect(screen.getByRole('alert').textContent).toMatch(/propia cuenta/)
  })

  it('elimina a otro usuario cuando se confirma', () => {
    admin('/admin/usuarios')
    spyOn(window, 'confirm').and.returnValue(true)
    const filaCliente = screen.getByText(CLIENTE.correo).closest('tr')

    fireEvent.click(within(filaCliente).getByRole('button', { name: 'Eliminar' }))

    expect(screen.queryByText(CLIENTE.correo)).toBeNull()
  })

  it('el historial de compras muestra las compras del usuario y su total gastado', () => {
    crearOrden()
    admin('/admin/usuarios/' + CLIENTE.id + '/historial')

    expect(titulo('Historial de compras')).toBeTruthy()
    expect(screen.getByText('ST-ORD-1001')).toBeTruthy()
    expect(screen.getByText(/Total gastado: \$2\.000/)).toBeTruthy()
  })

  it('el historial de un usuario sin compras lo indica', () => {
    admin('/admin/usuarios/' + ADMIN.id + '/historial')

    expect(screen.getByText('Este usuario todavía no ha comprado.')).toBeTruthy()
  })
})

describe('Panel de administración - órdenes, reportes y perfil', () => {
  afterEach(() => cleanup())

  it('lista las órdenes y permite mostrar la boleta', () => {
    const orden = crearOrden()
    admin('/admin/ordenes')

    expect(screen.getByText(orden.numero)).toBeTruthy()
    fireEvent.click(screen.getByRole('link', { name: 'Mostrar boleta' }))

    expect(titulo('Boleta ' + orden.numero)).toBeTruthy()
    expect(screen.getByLabelText('Calle de entrega').value).toBe('Calle 1')
  })

  it('sin órdenes, lo indica; y una boleta inexistente muestra "Boleta no encontrada"', () => {
    admin('/admin/ordenes')
    expect(screen.getByText('Todavía no hay órdenes de compra.')).toBeTruthy()
    cleanup()

    admin('/admin/ordenes/ST-ORD-9999')
    expect(screen.getByText('Boleta no encontrada')).toBeTruthy()
  })

  it('el reporte de ventas suma las órdenes y agrupa por videojuego', () => {
    crearOrden()
    crearOrden()
    admin('/admin/reportes')

    expect(titulo('Reportes de ventas')).toBeTruthy()
    const fila = screen.getByRole('cell', { name: JUEGOS[0].nombre }).closest('tr')
    expect(within(fila).getByText('4')).toBeTruthy() // 2 órdenes x 2 unidades
    expect(within(fila).getByText('$4.000')).toBeTruthy()
  })

  it('el perfil permite cambiar el nombre y actualiza la sesión', () => {
    admin('/admin/perfil')

    escribir('Nombre', 'Juanito')
    fireEvent.click(screen.getByRole('button', { name: 'Guardar cambios' }))

    expect(screen.getByRole('status').textContent).toBe('Perfil actualizado.')
    expect(JSON.parse(localStorage.getItem('stogSesion')).nombre).toBe('Juanito')
  })

  it('el perfil rechaza un correo que ya usa otra persona', () => {
    admin('/admin/perfil')

    escribir('Correo electrónico', CLIENTE.correo)
    fireEvent.click(screen.getByRole('button', { name: 'Guardar cambios' }))

    expect(screen.getByRole('alert').textContent).toBe('Ya existe un usuario con ese correo.')
  })
})
