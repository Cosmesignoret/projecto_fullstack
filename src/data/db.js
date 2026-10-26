// "Base de datos" simulada de Stog: un archivo JavaScript con las operaciones CRUD
// (Crear, Leer, Actualizar, Eliminar) sobre los datos de la tienda.
// Los datos se guardan en localStorage, así no se pierden al recargar la página.
// Las páginas nunca tocan localStorage directamente: usan estas funciones a través de
// TiendaContext y CarritoContext, que además actualizan la pantalla (estado de React).

import { productos, categorias, usuarios } from './productos.js'

const CLAVE_PRODUCTOS = 'stogProductos'
const CLAVE_CATEGORIAS = 'stogCategorias'
const CLAVE_USUARIOS = 'stogUsuarios'
const CLAVE_CARRITO = 'stogCarrito'
const CLAVE_SESION = 'stogSesion'
const CLAVE_ORDENES = 'stogOrdenes'

// ---------- ayudas internas ----------

// Lee una lista guardada. Si es la primera vez, guarda y devuelve los datos iniciales.
// Siempre devuelve una COPIA, para que modificarla no altere lo guardado por accidente.
function leer(clave, datosIniciales) {
  const guardado = localStorage.getItem(clave)
  if (guardado === null) {
    localStorage.setItem(clave, JSON.stringify(datosIniciales))
    return JSON.parse(JSON.stringify(datosIniciales))
  }
  return JSON.parse(guardado)
}

function guardar(clave, lista) {
  localStorage.setItem(clave, JSON.stringify(lista))
}

// Para no repetir ids: se busca el mayor y se le suma uno
function nuevoId(lista) {
  return lista.reduce((mayor, item) => (item.id > mayor ? item.id : mayor), 0) + 1
}

// ---------- productos (CRUD) ----------

export function listarProductos() {
  return leer(CLAVE_PRODUCTOS, productos)
}

export function buscarProductoPorId(id) {
  return listarProductos().find((p) => p.id === Number(id)) || null
}

export function agregarProducto(datos) {
  const lista = listarProductos()
  const nuevo = { ...datos, id: nuevoId(lista) }
  lista.push(nuevo)
  guardar(CLAVE_PRODUCTOS, lista)
  return nuevo
}

// Actualiza solo los campos recibidos. Devuelve el producto editado, o null si no existe.
export function editarProducto(id, datos) {
  const lista = listarProductos()
  const indice = lista.findIndex((p) => p.id === Number(id))
  if (indice === -1) {
    return null
  }
  lista[indice] = { ...lista[indice], ...datos, id: lista[indice].id }
  guardar(CLAVE_PRODUCTOS, lista)
  return lista[indice]
}

// Devuelve true si el producto existía y se eliminó
export function eliminarProducto(id) {
  const lista = listarProductos()
  const restantes = lista.filter((p) => p.id !== Number(id))
  guardar(CLAVE_PRODUCTOS, restantes)
  return restantes.length !== lista.length
}

// Productos con poco stock: los que están en su nivel crítico o por debajo
export function listarProductosCriticos() {
  return listarProductos().filter((p) => p.stock <= p.stockCritico)
}

// Resta del stock las unidades vendidas. Math.max evita que quede en negativo.
export function descontarStock(id, cantidad) {
  const producto = buscarProductoPorId(id)
  if (producto !== null) {
    editarProducto(id, { stock: Math.max(0, producto.stock - cantidad) })
  }
}

// ---------- categorías (CRUD) ----------

export function listarCategorias() {
  return leer(CLAVE_CATEGORIAS, categorias)
}

export function agregarCategoria(datos) {
  const lista = listarCategorias()
  const nueva = { ...datos, id: nuevoId(lista) }
  lista.push(nueva)
  guardar(CLAVE_CATEGORIAS, lista)
  return nueva
}

// Si la categoría cambia de nombre, también se actualizan los productos que la usaban
export function editarCategoria(id, datos) {
  const lista = listarCategorias()
  const indice = lista.findIndex((c) => c.id === Number(id))
  if (indice === -1) {
    return null
  }
  const nombreAnterior = lista[indice].nombre
  lista[indice] = { ...lista[indice], ...datos, id: lista[indice].id }
  guardar(CLAVE_CATEGORIAS, lista)
  if (datos.nombre && datos.nombre !== nombreAnterior) {
    guardar(CLAVE_PRODUCTOS, listarProductos().map((p) =>
      p.categoria === nombreAnterior ? { ...p, categoria: datos.nombre } : p
    ))
  }
  return lista[indice]
}

// No se puede eliminar una categoría que todavía tiene productos: devuelve false en ese caso
export function eliminarCategoria(id) {
  const lista = listarCategorias()
  const categoria = lista.find((c) => c.id === Number(id))
  if (!categoria || listarProductos().some((p) => p.categoria === categoria.nombre)) {
    return false
  }
  guardar(CLAVE_CATEGORIAS, lista.filter((c) => c.id !== Number(id)))
  return true
}

// ---------- usuarios (CRUD) ----------

export function listarUsuarios() {
  return leer(CLAVE_USUARIOS, usuarios)
}

export function buscarUsuarioPorId(id) {
  return listarUsuarios().find((u) => u.id === Number(id)) || null
}

export function buscarUsuarioPorCorreo(correo) {
  const buscado = (correo || '').trim().toLowerCase()
  return listarUsuarios().find((u) => u.correo.toLowerCase() === buscado) || null
}

export function agregarUsuario(datos) {
  const lista = listarUsuarios()
  const nuevo = { ...datos, id: nuevoId(lista) }
  lista.push(nuevo)
  guardar(CLAVE_USUARIOS, lista)
  return nuevo
}

// Si no se envía contraseña (o viene vacía), se mantiene la que ya tenía
export function editarUsuario(id, datos) {
  const lista = listarUsuarios()
  const indice = lista.findIndex((u) => u.id === Number(id))
  if (indice === -1) {
    return null
  }
  const cambios = { ...datos }
  if (!cambios.contrasena) {
    delete cambios.contrasena
  }
  lista[indice] = { ...lista[indice], ...cambios, id: lista[indice].id }
  guardar(CLAVE_USUARIOS, lista)
  return lista[indice]
}

export function eliminarUsuario(id) {
  const lista = listarUsuarios()
  const restantes = lista.filter((u) => u.id !== Number(id))
  guardar(CLAVE_USUARIOS, restantes)
  return restantes.length !== lista.length
}

// Devuelve el usuario si el correo y la contraseña coinciden, o null si no
export function validarCredenciales(correo, contrasena) {
  const usuario = buscarUsuarioPorCorreo(correo)
  if (usuario !== null && usuario.contrasena === contrasena) {
    return usuario
  }
  return null
}

// ---------- órdenes ----------

export function listarOrdenes() {
  return leer(CLAVE_ORDENES, [])
}

export function buscarOrdenPorNumero(numero) {
  return listarOrdenes().find((o) => o.numero === numero) || null
}

// Historial de compras de un cliente (se identifica por su correo)
export function listarOrdenesDeUsuario(correo) {
  const buscado = (correo || '').trim().toLowerCase()
  return listarOrdenes().filter((o) => o.cliente.correo.toLowerCase() === buscado)
}

// Guarda una compra aprobada. Recibe cliente, dirección, items y total,
// y le agrega el id, el número de orden y la fecha.
export function agregarOrden(datosOrden) {
  const lista = listarOrdenes()
  const id = nuevoId(lista)
  const orden = {
    ...datosOrden,
    id: id,
    // Número que ve el cliente: ST-ORD-1001, ST-ORD-1002, etc.
    numero: 'ST-ORD-' + (1000 + id),
    fecha: new Date().toISOString()
  }
  lista.push(orden)
  guardar(CLAVE_ORDENES, lista)
  return orden
}

// ---------- carrito ----------

export function cargarCarrito() {
  return leer(CLAVE_CARRITO, [])
}

export function guardarCarrito(carrito) {
  guardar(CLAVE_CARRITO, carrito)
}

// ---------- sesión ----------

// Guarda quién inició sesión. Se arma el objeto campo por campo a propósito:
// así la contraseña nunca queda guardada en la sesión.
export function guardarSesion(usuario) {
  const sesion = {
    id: usuario.id,
    nombre: usuario.nombre,
    apellidos: usuario.apellidos,
    correo: usuario.correo,
    rol: usuario.rol
  }
  localStorage.setItem(CLAVE_SESION, JSON.stringify(sesion))
  return sesion
}

// Devuelve el usuario con sesión iniciada, o null si nadie ha iniciado sesión
export function obtenerSesion() {
  const guardado = localStorage.getItem(CLAVE_SESION)
  return guardado === null ? null : JSON.parse(guardado)
}

export function cerrarSesion() {
  localStorage.removeItem(CLAVE_SESION)
}

// ---------- utilidades ----------

// Borra todo lo guardado: la tienda vuelve a los datos iniciales
export function reiniciarDatos() {
  ;[CLAVE_PRODUCTOS, CLAVE_CATEGORIAS, CLAVE_USUARIOS, CLAVE_CARRITO, CLAVE_SESION, CLAVE_ORDENES]
    .forEach((clave) => localStorage.removeItem(clave))
}
