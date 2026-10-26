// Pruebas del archivo de datos (db.js): operaciones CRUD y persistencia en localStorage.
// Estas pruebas no dibujan nada: llaman a las funciones y comprueban lo que devuelven y lo que
// queda guardado. ayudas.js borra el localStorage antes de cada prueba, así que todas parten
// con los datos iniciales.
import {
  listarProductos, buscarProductoPorId, agregarProducto, editarProducto, eliminarProducto,
  listarProductosCriticos, descontarStock,
  listarCategorias, agregarCategoria, editarCategoria, eliminarCategoria,
  listarUsuarios, buscarUsuarioPorId, buscarUsuarioPorCorreo, agregarUsuario, editarUsuario,
  eliminarUsuario, validarCredenciales,
  listarOrdenes, agregarOrden, buscarOrdenPorNumero, listarOrdenesDeUsuario,
  cargarCarrito, guardarCarrito, guardarSesion, obtenerSesion, cerrarSesion, reiniciarDatos
} from '../src/data/db.js'
import { JUEGOS, CLIENTE } from './ayudas.js'

const datosJuego = (extra = {}) => ({
  codigo: 'PRD-900', nombre: 'Juego de prueba', descripcion: 'Descripción', precio: 10000,
  stock: 10, stockCritico: 3, categoria: 'Acción', imagen: '/img/gta.webp', enOferta: false, precioOferta: 0,
  ...extra
})

const datosOrden = (correo = 'ana@gmail.com') => ({
  cliente: { nombre: 'Ana', apellidos: 'Prueba', correo },
  direccion: { calle: 'Calle 1', departamento: '', region: 'Región Metropolitana de Santiago', comuna: 'Santiago', indicaciones: '' },
  items: [{ id: 1, nombre: 'GTA VI', precio: 1000, cantidad: 2, imagen: '/img/gta.webp' }],
  total: 2000
})

describe('db.js - productos (CRUD)', () => {
  it('listarProductos devuelve los juegos iniciales la primera vez', () => {
    expect(listarProductos().length).toBe(JUEGOS.length)
  })

  it('buscarProductoPorId encuentra un producto (aunque el id llegue como texto) o devuelve null', () => {
    expect(buscarProductoPorId(JUEGOS[0].id).nombre).toBe(JUEGOS[0].nombre)
    expect(buscarProductoPorId(String(JUEGOS[0].id)).nombre).toBe(JUEGOS[0].nombre)
    expect(buscarProductoPorId(99999)).toBeNull()
  })

  it('agregarProducto (Crear) le asigna un id nuevo y queda guardado', () => {
    const creado = agregarProducto(datosJuego())

    expect(creado.id).toBeGreaterThan(JUEGOS.length)
    expect(listarProductos().length).toBe(JUEGOS.length + 1)
    expect(buscarProductoPorId(creado.id).nombre).toBe('Juego de prueba')
  })

  it('editarProducto (Actualizar) cambia solo los campos enviados', () => {
    const original = JUEGOS[0]

    const editado = editarProducto(original.id, { precio: 12345 })

    expect(editado.precio).toBe(12345)
    expect(editado.nombre).toBe(original.nombre) // lo demás no cambia
    expect(buscarProductoPorId(original.id).precio).toBe(12345)
  })

  it('editarProducto devuelve null si el producto no existe', () => {
    expect(editarProducto(99999, { precio: 1 })).toBeNull()
  })

  it('eliminarProducto (Eliminar) lo saca de la lista y avisa si existía', () => {
    expect(eliminarProducto(JUEGOS[0].id)).toBeTrue()
    expect(buscarProductoPorId(JUEGOS[0].id)).toBeNull()
    expect(eliminarProducto(99999)).toBeFalse()
  })

  it('listarProductosCriticos devuelve los juegos con stock igual o menor al crítico', () => {
    const criticos = listarProductosCriticos()

    expect(criticos.length).toBeGreaterThan(0)
    expect(criticos.every((p) => p.stock <= p.stockCritico)).toBeTrue()
    expect(listarProductos().filter((p) => p.stock > p.stockCritico).length).toBeGreaterThan(0)
  })

  it('descontarStock resta unidades y nunca deja el stock negativo', () => {
    const original = JUEGOS[0]

    descontarStock(original.id, 3)
    expect(buscarProductoPorId(original.id).stock).toBe(original.stock - 3)

    descontarStock(original.id, 9999)
    expect(buscarProductoPorId(original.id).stock).toBe(0)
  })
})

describe('db.js - categorías (CRUD)', () => {
  it('agregarCategoria crea una categoría con id nuevo', () => {
    const antes = listarCategorias().length
    const nueva = agregarCategoria({ nombre: 'Estrategia', descripcion: 'Juegos de táctica' })

    expect(nueva.id).toBeGreaterThan(antes)
    expect(listarCategorias().length).toBe(antes + 1)
  })

  it('editarCategoria cambia el nombre y también actualiza los productos que la usaban', () => {
    const categoria = listarCategorias()[0]
    const productosDeLaCategoria = listarProductos().filter((p) => p.categoria === categoria.nombre)
    expect(productosDeLaCategoria.length).toBeGreaterThan(0)

    editarCategoria(categoria.id, { nombre: 'Nombre nuevo' })

    expect(listarProductos().filter((p) => p.categoria === 'Nombre nuevo').length).toBe(productosDeLaCategoria.length)
    expect(listarProductos().some((p) => p.categoria === categoria.nombre)).toBeFalse()
  })

  it('eliminarCategoria no deja eliminar una categoría que todavía tiene productos', () => {
    const conProductos = listarCategorias()[0]

    expect(eliminarCategoria(conProductos.id)).toBeFalse()
    expect(listarCategorias().some((c) => c.id === conProductos.id)).toBeTrue()
  })

  it('eliminarCategoria elimina una categoría vacía', () => {
    const vacia = agregarCategoria({ nombre: 'Vacía', descripcion: '' })

    expect(eliminarCategoria(vacia.id)).toBeTrue()
    expect(listarCategorias().some((c) => c.id === vacia.id)).toBeFalse()
  })
})

describe('db.js - usuarios (CRUD)', () => {
  const datosUsuario = () => ({
    run: '190110222', nombre: 'Prueba', apellidos: 'Unitaria', correo: 'prueba.unitaria@gmail.com',
    contrasena: 'abc123', rol: 'cliente', calle: 'Calle 1', departamento: '', region: 'Región Metropolitana de Santiago', comuna: 'Santiago'
  })

  it('agregarUsuario le asigna un id y se puede encontrar por correo sin distinguir mayúsculas', () => {
    const creado = agregarUsuario(datosUsuario())

    expect(creado.id).toBeGreaterThan(0)
    expect(buscarUsuarioPorCorreo('PRUEBA.unitaria@gmail.com').id).toBe(creado.id)
    expect(buscarUsuarioPorId(creado.id).nombre).toBe('Prueba')
    expect(buscarUsuarioPorCorreo('otro@gmail.com')).toBeNull()
  })

  it('editarUsuario cambia los datos y, si no se envía contraseña, mantiene la anterior', () => {
    const creado = agregarUsuario(datosUsuario())

    editarUsuario(creado.id, { nombre: 'Cambiado', contrasena: '' })

    const guardado = buscarUsuarioPorId(creado.id)
    expect(guardado.nombre).toBe('Cambiado')
    expect(guardado.contrasena).toBe('abc123')
  })

  it('editarUsuario cambia la contraseña cuando se envía una nueva, y devuelve null si el usuario no existe', () => {
    const creado = agregarUsuario(datosUsuario())

    editarUsuario(creado.id, { contrasena: 'nueva456' })

    expect(buscarUsuarioPorId(creado.id).contrasena).toBe('nueva456')
    expect(editarUsuario(99999, { nombre: 'x' })).toBeNull()
  })

  it('eliminarUsuario lo saca de la lista', () => {
    const creado = agregarUsuario(datosUsuario())

    expect(eliminarUsuario(creado.id)).toBeTrue()
    expect(buscarUsuarioPorId(creado.id)).toBeNull()
  })

  it('validarCredenciales devuelve al usuario solo si el correo y la contraseña coinciden', () => {
    expect(validarCredenciales(CLIENTE.correo, CLIENTE.contrasena).id).toBe(CLIENTE.id)
    expect(validarCredenciales(CLIENTE.correo.toUpperCase(), CLIENTE.contrasena)).not.toBeNull()
    expect(validarCredenciales(CLIENTE.correo, 'incorrecta')).toBeNull()
    expect(validarCredenciales('no-existe@gmail.com', 'abc123')).toBeNull()
  })

  it('hay usuarios de los tres perfiles', () => {
    const roles = listarUsuarios().map((u) => u.rol)

    expect(roles).toContain('administrador')
    expect(roles).toContain('vendedor')
    expect(roles).toContain('cliente')
  })
})

describe('db.js - órdenes, carrito y sesión', () => {
  it('agregarOrden numera las órdenes de forma consecutiva y guarda la fecha', () => {
    const primera = agregarOrden(datosOrden())
    const segunda = agregarOrden(datosOrden())

    expect(primera.numero).toBe('ST-ORD-1001')
    expect(segunda.numero).toBe('ST-ORD-1002')
    expect(new Date(primera.fecha).getTime()).not.toBeNaN()
    expect(listarOrdenes().length).toBe(2)
  })

  it('buscarOrdenPorNumero encuentra la orden o devuelve null', () => {
    const orden = agregarOrden(datosOrden())

    expect(buscarOrdenPorNumero(orden.numero).total).toBe(2000)
    expect(buscarOrdenPorNumero('ST-ORD-9999')).toBeNull()
  })

  it('listarOrdenesDeUsuario devuelve solo las compras de ese correo (historial de compras)', () => {
    agregarOrden(datosOrden('ana@gmail.com'))
    agregarOrden(datosOrden('luis@gmail.com'))
    agregarOrden(datosOrden('ANA@gmail.com'))

    expect(listarOrdenesDeUsuario('ana@gmail.com').length).toBe(2)
    expect(listarOrdenesDeUsuario('nadie@gmail.com').length).toBe(0)
  })

  it('el carrito guardado se puede volver a cargar (persistencia)', () => {
    expect(cargarCarrito()).toEqual([])

    guardarCarrito([{ id: 1, nombre: 'GTA VI', precio: 1000, imagen: '', cantidad: 2 }])

    expect(cargarCarrito().length).toBe(1)
    expect(cargarCarrito()[0].cantidad).toBe(2)
  })

  it('la sesión se guarda sin la contraseña y se puede cerrar', () => {
    expect(obtenerSesion()).toBeNull()

    guardarSesion(CLIENTE)

    expect(obtenerSesion().correo).toBe(CLIENTE.correo)
    expect(obtenerSesion().rol).toBe('cliente')
    expect(obtenerSesion().contrasena).toBeUndefined()

    cerrarSesion()
    expect(obtenerSesion()).toBeNull()
  })

  it('los cambios quedan escritos en localStorage', () => {
    agregarProducto(datosJuego())

    const guardado = JSON.parse(localStorage.getItem('stogProductos'))
    expect(guardado.some((p) => p.nombre === 'Juego de prueba')).toBeTrue()
  })

  it('reiniciarDatos borra todo y la tienda vuelve a los datos iniciales', () => {
    agregarProducto(datosJuego())
    guardarSesion(CLIENTE)

    reiniciarDatos()

    expect(listarProductos().length).toBe(JUEGOS.length)
    expect(obtenerSesion()).toBeNull()
  })
})
