// Pruebas de los dos Context: TiendaContext (productos, categorías, usuarios, sesión, compras)
// y CarritoContext (carrito). Un Context no se puede llamar suelto: necesita estar dentro de un
// Provider. Por eso se usa una "sonda": un componente sin pantalla que guarda lo que entrega el
// contexto, para que la prueba pueda llamar a sus funciones. act() espera a que React termine
// de actualizar el estado antes de seguir.
import { render, act, cleanup } from '@testing-library/react'
import { TiendaProvider, useTienda } from '../src/context/TiendaContext.jsx'
import { CarritoProvider, useCarrito } from '../src/context/CarritoContext.jsx'
import { JUEGOS, CLIENTE, ADMIN } from './ayudas.js'

function montarTienda(sesionInicial) {
  const sonda = { actual: null }
  function Sonda() {
    sonda.actual = useTienda()
    return null
  }
  render(<TiendaProvider sesionInicial={sesionInicial}><Sonda /></TiendaProvider>)
  return sonda
}

function montarCarrito(carritoInicial) {
  const sonda = { actual: null }
  function Sonda() {
    sonda.actual = useCarrito()
    return null
  }
  render(<CarritoProvider carritoInicial={carritoInicial}><Sonda /></CarritoProvider>)
  return sonda
}

const datosJuego = () => ({
  codigo: 'PRD-900', nombre: 'Juego nuevo', descripcion: 'Descripción', precio: 10000, stock: 10,
  stockCritico: 3, categoria: 'Acción', imagen: '/img/gta.webp', enOferta: false, precioOferta: 0
})

describe('TiendaContext - productos y categorías', () => {
  afterEach(() => cleanup())

  it('arranca con los juegos y categorías iniciales de la tienda', () => {
    const t = montarTienda()

    expect(t.actual.productos.length).toBe(JUEGOS.length)
    expect(t.actual.categorias.length).toBeGreaterThan(0)
  })

  it('buscarProductoPorId encuentra el producto (aunque el id sea texto) o devuelve null', () => {
    const t = montarTienda()

    expect(t.actual.buscarProductoPorId(String(JUEGOS[0].id)).nombre).toBe(JUEGOS[0].nombre)
    expect(t.actual.buscarProductoPorId(99999)).toBeNull()
  })

  it('buscarProductosPorCategoria y ofertas devuelven solo lo que corresponde', () => {
    const t = montarTienda()
    const categoria = JUEGOS[0].categoria

    expect(t.actual.buscarProductosPorCategoria(categoria).every((p) => p.categoria === categoria)).toBeTrue()
    expect(t.actual.ofertas.every((p) => p.enOferta === true)).toBeTrue()
  })

  it('productosCriticos incluye solo los juegos con stock igual o menor al crítico', () => {
    const t = montarTienda()

    expect(t.actual.productosCriticos.length).toBeGreaterThan(0)
    expect(t.actual.productosCriticos.every((p) => p.stock <= p.stockCritico)).toBeTrue()
  })

  it('crearProducto agrega el juego al estado y queda guardado para la próxima vez', () => {
    const t = montarTienda()

    act(() => { t.actual.crearProducto(datosJuego()) })

    expect(t.actual.productos.length).toBe(JUEGOS.length + 1)
    expect(JSON.parse(localStorage.getItem('stogProductos')).length).toBe(JUEGOS.length + 1)
  })

  it('actualizarProducto cambia el juego y borrarProducto lo quita', () => {
    const t = montarTienda()
    const id = JUEGOS[0].id

    act(() => { t.actual.actualizarProducto(id, { precio: 5555 }) })
    expect(t.actual.buscarProductoPorId(id).precio).toBe(5555)

    act(() => { t.actual.borrarProducto(id) })
    expect(t.actual.buscarProductoPorId(id)).toBeNull()
  })

  it('crearCategoria, actualizarCategoria y borrarCategoria actualizan el estado', () => {
    const t = montarTienda()
    let nueva
    act(() => { nueva = t.actual.crearCategoria({ nombre: 'Estrategia', descripcion: '' }) })
    expect(t.actual.categorias.some((c) => c.nombre === 'Estrategia')).toBeTrue()

    act(() => { t.actual.actualizarCategoria(nueva.id, { nombre: 'Táctica' }) })
    expect(t.actual.categorias.some((c) => c.nombre === 'Táctica')).toBeTrue()

    let eliminada
    act(() => { eliminada = t.actual.borrarCategoria(nueva.id) })
    expect(eliminada).toBeTrue()
    expect(t.actual.categorias.some((c) => c.nombre === 'Táctica')).toBeFalse()
  })

  it('al renombrar una categoría, los productos del estado se actualizan', () => {
    const t = montarTienda()
    const categoria = t.actual.categorias.find((c) => c.nombre === JUEGOS[0].categoria)

    act(() => { t.actual.actualizarCategoria(categoria.id, { nombre: 'Renombrada' }) })

    expect(t.actual.buscarProductoPorId(JUEGOS[0].id).categoria).toBe('Renombrada')
  })

  it('los datos sobreviven a una recarga: un provider nuevo lee lo guardado', () => {
    const primero = montarTienda()
    act(() => { primero.actual.crearProducto(datosJuego()) })
    cleanup() // "se cierra la página"

    const despues = montarTienda() // "se abre otra vez"

    expect(despues.actual.productos.some((p) => p.nombre === 'Juego nuevo')).toBeTrue()
  })
})

describe('TiendaContext - usuarios y sesión', () => {
  afterEach(() => cleanup())

  it('iniciarSesion con credenciales correctas abre la sesión con el rol y sin la contraseña', () => {
    const t = montarTienda()

    act(() => { t.actual.iniciarSesion(ADMIN.correo, ADMIN.contrasena) })

    expect(t.actual.sesion.correo).toBe(ADMIN.correo)
    expect(t.actual.sesion.rol).toBe('administrador')
    expect(t.actual.sesion.contrasena).toBeUndefined()
  })

  it('iniciarSesion con contraseña incorrecta o correo inexistente devuelve null y no abre sesión', () => {
    const t = montarTienda()
    let r1, r2
    act(() => { r1 = t.actual.iniciarSesion(CLIENTE.correo, 'clave-incorrecta') })
    act(() => { r2 = t.actual.iniciarSesion('no-existe@gmail.com', 'abc123') })

    expect(r1).toBeNull()
    expect(r2).toBeNull()
    expect(t.actual.sesion).toBeNull()
  })

  it('la sesión se mantiene al recargar y cerrarSesion la borra', () => {
    const primero = montarTienda()
    act(() => { primero.actual.iniciarSesion(CLIENTE.correo, CLIENTE.contrasena) })
    cleanup()

    const despues = montarTienda()
    expect(despues.actual.sesion.correo).toBe(CLIENTE.correo)

    act(() => { despues.actual.cerrarSesion() })
    expect(despues.actual.sesion).toBeNull()
    expect(localStorage.getItem('stogSesion')).toBeNull()
  })

  it('registrarUsuario crea siempre un cliente y se puede encontrar por correo', () => {
    const t = montarTienda()
    const antes = t.actual.usuarios.length

    act(() => {
      t.actual.registrarUsuario({ nombre: 'Prueba', apellidos: 'Unitaria', correo: 'prueba@gmail.com', contrasena: 'abc123', edad: 30 })
    })

    expect(t.actual.usuarios.length).toBe(antes + 1)
    expect(t.actual.buscarUsuarioPorCorreo('PRUEBA@gmail.com').rol).toBe('cliente')
  })

  it('crearUsuario, actualizarUsuario y borrarUsuario actualizan la lista', () => {
    const t = montarTienda()
    let creado
    act(() => { creado = t.actual.crearUsuario({ nombre: 'Nuevo', apellidos: 'Usuario', correo: 'nuevo@gmail.com', contrasena: 'abc123', rol: 'vendedor' }) })
    expect(t.actual.buscarUsuarioPorId(creado.id).rol).toBe('vendedor')

    act(() => { t.actual.actualizarUsuario(creado.id, { nombre: 'Cambiado' }) })
    expect(t.actual.buscarUsuarioPorId(creado.id).nombre).toBe('Cambiado')

    act(() => { t.actual.borrarUsuario(creado.id) })
    expect(t.actual.buscarUsuarioPorId(creado.id)).toBeNull()
  })

  it('si la persona edita su propio perfil, la sesión también se actualiza', () => {
    const t = montarTienda()
    act(() => { t.actual.iniciarSesion(ADMIN.correo, ADMIN.contrasena) })

    act(() => { t.actual.actualizarUsuario(ADMIN.id, { nombre: 'Juanito' }) })

    expect(t.actual.sesion.nombre).toBe('Juanito')
  })
})

describe('TiendaContext - compras', () => {
  afterEach(() => cleanup())

  const datosOrden = (juego, cantidad, correo = 'ana@gmail.com') => ({
    cliente: { nombre: 'Ana', apellidos: 'Prueba', correo },
    direccion: { calle: 'Calle 1', departamento: '', region: 'Región Metropolitana de Santiago', comuna: 'Santiago', indicaciones: '' },
    items: [{ id: juego.id, nombre: juego.nombre, precio: juego.precio, cantidad }],
    total: juego.precio * cantidad
  })

  it('comprar crea la orden con número y fecha, y se puede buscar por su número', () => {
    const t = montarTienda()
    let orden
    act(() => { orden = t.actual.comprar(datosOrden(JUEGOS[0], 1)) })

    expect(orden.numero).toBe('ST-ORD-1001')
    expect(new Date(orden.fecha).getTime()).not.toBeNaN()
    expect(t.actual.buscarOrdenPorNumero('ST-ORD-1001').total).toBe(JUEGOS[0].precio)
    expect(t.actual.buscarOrdenPorNumero('ST-ORD-9999')).toBeNull()
  })

  it('cada compra recibe un número consecutivo y proximoNumeroOrden anticipa el siguiente', () => {
    const t = montarTienda()
    expect(t.actual.proximoNumeroOrden).toBe('ST-ORD-1001')

    act(() => { t.actual.comprar(datosOrden(JUEGOS[0], 1)) })
    act(() => { t.actual.comprar(datosOrden(JUEGOS[1], 1)) })

    expect(t.actual.ordenes.map((o) => o.numero)).toEqual(['ST-ORD-1001', 'ST-ORD-1002'])
    expect(t.actual.proximoNumeroOrden).toBe('ST-ORD-1003')
  })

  it('comprar descuenta el stock de los juegos comprados y no toca los demás', () => {
    const t = montarTienda()
    act(() => { t.actual.comprar(datosOrden(JUEGOS[0], 3)) })

    expect(t.actual.buscarProductoPorId(JUEGOS[0].id).stock).toBe(JUEGOS[0].stock - 3)
    expect(t.actual.buscarProductoPorId(JUEGOS[1].id).stock).toBe(JUEGOS[1].stock)
  })

  it('el stock nunca queda negativo, aunque se compren más unidades de las que hay', () => {
    const t = montarTienda()
    act(() => { t.actual.comprar(datosOrden(JUEGOS[0], JUEGOS[0].stock + 100)) })

    expect(t.actual.buscarProductoPorId(JUEGOS[0].id).stock).toBe(0)
  })

  it('ordenesDeUsuario devuelve solo el historial de compras de ese correo', () => {
    const t = montarTienda()
    act(() => { t.actual.comprar(datosOrden(JUEGOS[0], 1, 'ana@gmail.com')) })
    act(() => { t.actual.comprar(datosOrden(JUEGOS[1], 1, 'luis@gmail.com')) })

    expect(t.actual.ordenesDeUsuario('ANA@gmail.com').length).toBe(1)
    expect(t.actual.ordenesDeUsuario('nadie@gmail.com').length).toBe(0)
  })
})

describe('CarritoContext', () => {
  afterEach(() => cleanup())

  it('arranca vacío, o con lo que indique carritoInicial', () => {
    expect(montarCarrito().actual.carrito.length).toBe(0)
    cleanup()
    const c = montarCarrito([{ id: 1, nombre: 'GTA VI', precio: 1000, imagen: '', cantidad: 2 }])
    expect(c.actual.cantidadTotal).toBe(2)
  })

  it('agregarAlCarrito usa el precio normal si el juego no está en oferta', () => {
    const c = montarCarrito()
    const normal = { ...JUEGOS[0], enOferta: false, precioOferta: 0 }

    act(() => { c.actual.agregarAlCarrito(normal, 2) })

    expect(c.actual.carrito[0].precio).toBe(normal.precio)
    expect(c.actual.carrito[0].cantidad).toBe(2)
  })

  it('agregarAlCarrito usa el precio de oferta si el juego está en oferta', () => {
    const c = montarCarrito()

    act(() => { c.actual.agregarAlCarrito({ ...JUEGOS[0], enOferta: true, precioOferta: 500 }, 1) })

    expect(c.actual.carrito[0].precio).toBe(500)
  })

  it('si el juego ya estaba en el carrito, suma las cantidades en vez de repetirlo', () => {
    const c = montarCarrito()
    act(() => { c.actual.agregarAlCarrito(JUEGOS[0], 1) })
    act(() => { c.actual.agregarAlCarrito(JUEGOS[0], 2) })

    expect(c.actual.carrito.length).toBe(1)
    expect(c.actual.carrito[0].cantidad).toBe(3)
  })

  it('actualizarCantidad cambia la cantidad y no falla si el id no existe', () => {
    const c = montarCarrito()
    act(() => { c.actual.agregarAlCarrito(JUEGOS[0], 1) })

    act(() => { c.actual.actualizarCantidad(JUEGOS[0].id, 5) })
    expect(c.actual.carrito[0].cantidad).toBe(5)

    act(() => { c.actual.actualizarCantidad(99999, 5) })
    expect(c.actual.carrito.length).toBe(1)
  })

  it('quitarDelCarrito saca solo el juego indicado y vaciarCarrito deja todo vacío', () => {
    const c = montarCarrito()
    act(() => { c.actual.agregarAlCarrito(JUEGOS[0], 1) })
    act(() => { c.actual.agregarAlCarrito(JUEGOS[1], 1) })

    act(() => { c.actual.quitarDelCarrito(JUEGOS[0].id) })
    expect(c.actual.carrito.length).toBe(1)
    expect(c.actual.carrito[0].id).toBe(JUEGOS[1].id)

    act(() => { c.actual.vaciarCarrito() })
    expect(c.actual.carrito.length).toBe(0)
    expect(c.actual.total).toBe(0)
  })

  it('total y cantidadTotal se calculan a partir del contenido del carrito', () => {
    const c = montarCarrito()
    const a = { ...JUEGOS[0], enOferta: false }
    const b = { ...JUEGOS[2], enOferta: false }
    act(() => { c.actual.agregarAlCarrito(a, 2) })
    act(() => { c.actual.agregarAlCarrito(b, 1) })

    expect(c.actual.cantidadTotal).toBe(3)
    expect(c.actual.total).toBe(a.precio * 2 + b.precio)
  })

  it('el carrito se conserva al recargar la página (persistencia)', () => {
    const primero = montarCarrito()
    act(() => { primero.actual.agregarAlCarrito(JUEGOS[0], 2) })
    cleanup()

    const despues = montarCarrito() // sin carritoInicial: lee lo guardado

    expect(despues.actual.cantidadTotal).toBe(2)
  })
})
