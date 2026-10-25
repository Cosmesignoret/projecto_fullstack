// "Base de datos" de Stog: funciones CRUD (Crear, Leer, Actualizar, Eliminar) sobre los datos
// de la tienda. Todo se guarda en localStorage, así que NO se pierde al recargar la página.
//
// Cómo funciona:
//  1. La primera vez que se abre la tienda, localStorage está vacío y se copian los datos
//     iniciales de productos.js (la "semilla").
//  2. Desde ahí, cada función que modifica algo (agregar, editar, eliminar) actualiza la lista
//     en memoria y la vuelve a guardar en localStorage.
//  3. Las funciones de lectura devuelven COPIAS. Así los componentes de React no pueden
//     modificar los datos por accidente: para cambiar algo hay que usar las funciones de aquí.
//
// Los contextos (TiendaContext y CarritoContext) llaman a estas funciones y guardan el
// resultado en su estado, para que la pantalla se actualice sola.

import {
  productos as productosIniciales,
  categorias as categoriasIniciales,
  usuarios as usuariosIniciales
} from './productos.js'

// Las claves con las que se guarda cada lista en el navegador
const CLAVE_PRODUCTOS = 'stogProductos'
const CLAVE_CATEGORIAS = 'stogCategorias'
const CLAVE_USUARIOS = 'stogUsuarios'
const CLAVE_CARRITO = 'stogCarrito'
const CLAVE_SESION = 'stogSesion'
const CLAVE_ORDENES = 'stogOrdenes'

// ---------- acceso a localStorage ----------
// Se envuelve en try/catch porque localStorage puede fallar (modo privado, cuota llena,
// JSON dañado). Si falla, la tienda sigue funcionando en memoria, solo que sin guardar.

function guardar(clave, valor) {
  try {
    localStorage.setItem(clave, JSON.stringify(valor))
  } catch {
    // sin persistencia: la app sigue funcionando con los datos en memoria
  }
}

// Lee una lista guardada. Si no existe (primera vez) o está dañada, usa los datos iniciales.
function cargar(clave, datosIniciales) {
  // JSON.parse(JSON.stringify(...)) hace una copia profunda: así nunca se modifica la semilla
  const copia = () => JSON.parse(JSON.stringify(datosIniciales))
  try {
    const guardado = localStorage.getItem(clave)
    if (guardado === null) {
      const inicial = copia()
      guardar(clave, inicial)
      return inicial
    }
    return JSON.parse(guardado)
  } catch {
    return copia()
  }
}

// Para no repetir ids: se busca el mayor y se le suma uno (con length + 1 se repetirían
// ids después de eliminar algo)
function nuevoId(lista) {
  return lista.reduce((mayor, item) => Math.max(mayor, item.id), 0) + 1
}

let listaProductos = cargar(CLAVE_PRODUCTOS, productosIniciales)
let listaCategorias = cargar(CLAVE_CATEGORIAS, categoriasIniciales)
let listaUsuarios = cargar(CLAVE_USUARIOS, usuariosIniciales)
let listaCarrito = cargar(CLAVE_CARRITO, [])
let listaOrdenes = cargar(CLAVE_ORDENES, [])

// Copia superficial de cada elemento: lo que sale de aquí no se puede usar para modificar la lista
const copiar = (lista) => lista.map((item) => ({ ...item }))

// ===================== PRODUCTOS =====================

export function listarProductos() {
  return copiar(listaProductos)
}

export function buscarProductoPorId(id) {
  const producto = listaProductos.find((p) => p.id === Number(id))
  return producto ? { ...producto } : null
}

export function buscarProductosPorCategoria(categoria) {
  return copiar(listaProductos.filter((p) => p.categoria === categoria))
}

export function listarOfertas() {
  return copiar(listaProductos.filter((p) => p.enOferta === true))
}

// Productos con poco stock: el admin los ve en el dashboard
export function listarProductosCriticos() {
  return copiar(listaProductos.filter((p) => p.stock <= p.stockCritico))
}

// CREATE. Asigna id y, si no viene, el código (PRD-005, PRD-006...) y la imagen por defecto
export function agregarProducto(datos) {
  const id = nuevoId(listaProductos)
  const producto = {
    codigo: 'PRD-' + String(id).padStart(3, '0'),
    imagen: '/img/sin-imagen.svg',
    stockCritico: 5,
    enOferta: false,
    precioOferta: 0,
    ...datos,
    id
  }
  listaProductos = [...listaProductos, producto]
  guardar(CLAVE_PRODUCTOS, listaProductos)
  return { ...producto }
}

// UPDATE. Solo cambia los campos que se envían; el resto queda igual. Devuelve null si no existe.
export function editarProducto(id, datos) {
  if (buscarProductoPorId(id) === null) {
    return null
  }
  let editado = null
  listaProductos = listaProductos.map((p) => {
    if (p.id !== Number(id)) return p
    editado = { ...p, ...datos, id: p.id }
    return editado
  })
  guardar(CLAVE_PRODUCTOS, listaProductos)
  return { ...editado }
}

// DELETE
export function eliminarProducto(id) {
  listaProductos = listaProductos.filter((p) => p.id !== Number(id))
  guardar(CLAVE_PRODUCTOS, listaProductos)
}

// Resta las unidades vendidas. Math.max evita que el stock quede en negativo.
export function descontarStock(id, cantidad) {
  const producto = buscarProductoPorId(id)
  if (producto !== null) {
    editarProducto(id, { stock: Math.max(0, producto.stock - cantidad) })
  }
}

// ===================== CATEGORÍAS =====================

export function listarCategorias() {
  return copiar(listaCategorias)
}

export function buscarCategoriaPorId(id) {
  const categoria = listaCategorias.find((c) => c.id === Number(id))
  return categoria ? { ...categoria } : null
}

// Cuántos productos usan una categoría (cada producto guarda el NOMBRE de su categoría)
export function contarProductosDeCategoria(nombre) {
  return listaProductos.filter((p) => p.categoria === nombre).length
}

export function agregarCategoria(datos) {
  const categoria = { ...datos, id: nuevoId(listaCategorias) }
  listaCategorias = [...listaCategorias, categoria]
  guardar(CLAVE_CATEGORIAS, listaCategorias)
  return { ...categoria }
}

// Como los productos guardan el nombre de la categoría, si se cambia el nombre también hay
// que actualizar los productos que la usaban. Si no, quedarían apuntando a una categoría que no existe.
export function editarCategoria(id, datos) {
  const original = buscarCategoriaPorId(id)
  if (original === null) {
    return null
  }
  const editada = { ...original, ...datos, id: original.id }
  listaCategorias = listaCategorias.map((c) => (c.id === editada.id ? editada : c))
  guardar(CLAVE_CATEGORIAS, listaCategorias)

  if (editada.nombre !== original.nombre) {
    listaProductos = listaProductos.map((p) =>
      p.categoria === original.nombre ? { ...p, categoria: editada.nombre } : p
    )
    guardar(CLAVE_PRODUCTOS, listaProductos)
  }
  return { ...editada }
}

// No deja eliminar una categoría que todavía tiene productos. Devuelve true si la eliminó.
export function eliminarCategoria(id) {
  const categoria = buscarCategoriaPorId(id)
  if (categoria === null || contarProductosDeCategoria(categoria.nombre) > 0) {
    return false
  }
  listaCategorias = listaCategorias.filter((c) => c.id !== categoria.id)
  guardar(CLAVE_CATEGORIAS, listaCategorias)
  return true
}

// ===================== USUARIOS =====================

export function listarUsuarios() {
  return copiar(listaUsuarios)
}

export function buscarUsuarioPorId(id) {
  const usuario = listaUsuarios.find((u) => u.id === Number(id))
  return usuario ? { ...usuario } : null
}

// El correo se compara sin importar mayúsculas ni espacios
export function buscarUsuarioPorCorreo(correo) {
  const buscado = (correo || '').trim().toLowerCase()
  const usuario = listaUsuarios.find((u) => u.correo.toLowerCase() === buscado)
  return usuario ? { ...usuario } : null
}

// Si no se indica rol, el usuario nuevo es cliente
export function agregarUsuario(datos) {
  const usuario = { rol: 'cliente', ...datos, id: nuevoId(listaUsuarios) }
  listaUsuarios = [...listaUsuarios, usuario]
  guardar(CLAVE_USUARIOS, listaUsuarios)
  return { ...usuario }
}

export function editarUsuario(id, datos) {
  if (buscarUsuarioPorId(id) === null) {
    return null
  }
  let editado = null
  listaUsuarios = listaUsuarios.map((u) => {
    if (u.id !== Number(id)) return u
    editado = { ...u, ...datos, id: u.id }
    return editado
  })
  guardar(CLAVE_USUARIOS, listaUsuarios)
  return { ...editado }
}

export function eliminarUsuario(id) {
  listaUsuarios = listaUsuarios.filter((u) => u.id !== Number(id))
  guardar(CLAVE_USUARIOS, listaUsuarios)
}

// ===================== CARRITO =====================

export function listarCarrito() {
  return copiar(listaCarrito)
}

// Reemplaza todo el carrito (se usa para arrancar con un carrito ya armado, por ejemplo en pruebas)
export function guardarCarrito(items) {
  listaCarrito = copiar(items)
  guardar(CLAVE_CARRITO, listaCarrito)
  return listarCarrito()
}

export function agregarAlCarrito(producto, cantidad) {
  const existente = listaCarrito.find((item) => item.id === producto.id)

  if (existente) {
    // Si el juego ya está en el carrito, se suma la cantidad en vez de repetir la fila
    listaCarrito = listaCarrito.map((item) =>
      item.id === producto.id ? { ...item, cantidad: item.cantidad + cantidad } : item
    )
  } else {
    listaCarrito = [...listaCarrito, {
      id: producto.id,
      nombre: producto.nombre,
      precio: producto.enOferta ? producto.precioOferta : producto.precio,
      imagen: producto.imagen,
      cantidad: cantidad
    }]
  }
  guardar(CLAVE_CARRITO, listaCarrito)
  return listarCarrito()
}

export function actualizarCantidadCarrito(id, cantidad) {
  listaCarrito = listaCarrito.map((item) => (item.id === Number(id) ? { ...item, cantidad } : item))
  guardar(CLAVE_CARRITO, listaCarrito)
  return listarCarrito()
}

export function quitarDelCarrito(id) {
  listaCarrito = listaCarrito.filter((item) => item.id !== Number(id))
  guardar(CLAVE_CARRITO, listaCarrito)
  return listarCarrito()
}

export function vaciarCarrito() {
  listaCarrito = []
  guardar(CLAVE_CARRITO, listaCarrito)
  return []
}

// ===================== SESIÓN =====================

// Guarda quién inició sesión. El objeto se arma campo por campo a propósito:
// así la contraseña nunca queda guardada en la sesión.
export function guardarSesion(usuario) {
  const sesion = {
    id: usuario.id,
    nombre: usuario.nombre,
    apellidos: usuario.apellidos,
    correo: usuario.correo,
    rol: usuario.rol
  }
  guardar(CLAVE_SESION, sesion)
  return sesion
}

// Devuelve el usuario con sesión iniciada, o null si nadie ha iniciado sesión
export function obtenerSesion() {
  try {
    const guardado = localStorage.getItem(CLAVE_SESION)
    return guardado === null ? null : JSON.parse(guardado)
  } catch {
    return null
  }
}

export function cerrarSesion() {
  try {
    localStorage.removeItem(CLAVE_SESION)
  } catch {
    // nada que borrar
  }
}

// ===================== ÓRDENES =====================

export function listarOrdenes() {
  return listaOrdenes.map((o) => ({ ...o }))
}

export function buscarOrdenPorNumero(numero) {
  const orden = listaOrdenes.find((o) => o.numero === numero)
  return orden ? { ...orden } : null
}

// Guarda una compra aprobada y descuenta el stock de cada juego comprado.
// Le agrega el id, el número que ve el cliente (ST-ORD-1001, ST-ORD-1002...) y la fecha.
export function agregarOrden(datosOrden) {
  const id = nuevoId(listaOrdenes)
  const orden = {
    ...datosOrden,
    id,
    numero: 'ST-ORD-' + (1000 + id),
    fecha: new Date().toISOString()
  }
  listaOrdenes = [...listaOrdenes, orden]
  guardar(CLAVE_ORDENES, listaOrdenes)
  datosOrden.items.forEach((item) => descontarStock(item.id, item.cantidad))
  return { ...orden }
}

// ===================== UTILIDAD =====================

// Vuelve a los datos de ejemplo (borra todo lo guardado). Útil para pruebas y para "empezar de cero".
export function reiniciarDatos() {
  try {
    [CLAVE_PRODUCTOS, CLAVE_CATEGORIAS, CLAVE_USUARIOS, CLAVE_CARRITO, CLAVE_SESION, CLAVE_ORDENES]
      .forEach((clave) => localStorage.removeItem(clave))
  } catch {
    // sin localStorage no hay nada que borrar
  }
  listaProductos = cargar(CLAVE_PRODUCTOS, productosIniciales)
  listaCategorias = cargar(CLAVE_CATEGORIAS, categoriasIniciales)
  listaUsuarios = cargar(CLAVE_USUARIOS, usuariosIniciales)
  listaCarrito = cargar(CLAVE_CARRITO, [])
  listaOrdenes = cargar(CLAVE_ORDENES, [])
}
