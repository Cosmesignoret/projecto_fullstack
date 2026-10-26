import { createContext, useContext, useState } from 'react'
import * as db from '../data/db.js'

// Estado global de la tienda. Conecta el archivo de datos (db.js, que guarda en localStorage)
// con React: cada acción modifica los datos con db.js y luego actualiza el estado con useState,
// así la pantalla se redibuja sola con lo nuevo.
// La prop "sesionInicial" permite arrancar con una sesión ya iniciada (se usa en las pruebas).
const TiendaContext = createContext()

export function TiendaProvider({ children, sesionInicial }) {
  const [productos, setProductos] = useState(() => db.listarProductos())
  const [categorias, setCategorias] = useState(() => db.listarCategorias())
  const [usuarios, setUsuarios] = useState(() => db.listarUsuarios())
  const [ordenes, setOrdenes] = useState(() => db.listarOrdenes())
  const [sesion, setSesion] = useState(() => (sesionInicial !== undefined ? sesionInicial : db.obtenerSesion()))

  // Vuelve a leer cada lista desde db.js (después de un cambio)
  const refrescarProductos = () => setProductos(db.listarProductos())
  const refrescarCategorias = () => setCategorias(db.listarCategorias())
  const refrescarUsuarios = () => setUsuarios(db.listarUsuarios())
  const refrescarOrdenes = () => setOrdenes(db.listarOrdenes())

  // ---------- productos ----------

  const buscarProductoPorId = (id) => productos.find((p) => p.id === Number(id)) || null
  const buscarProductosPorCategoria = (categoria) => productos.filter((p) => p.categoria === categoria)
  const ofertas = productos.filter((p) => p.enOferta === true)
  const productosCriticos = productos.filter((p) => p.stock <= p.stockCritico)

  function crearProducto(datos) {
    const nuevo = db.agregarProducto(datos)
    refrescarProductos()
    return nuevo
  }

  function actualizarProducto(id, datos) {
    const editado = db.editarProducto(id, datos)
    refrescarProductos()
    return editado
  }

  function borrarProducto(id) {
    const eliminado = db.eliminarProducto(id)
    refrescarProductos()
    return eliminado
  }

  // ---------- categorías ----------

  function crearCategoria(datos) {
    const nueva = db.agregarCategoria(datos)
    refrescarCategorias()
    return nueva
  }

  function actualizarCategoria(id, datos) {
    const editada = db.editarCategoria(id, datos)
    refrescarCategorias()
    refrescarProductos() // si cambió el nombre, los productos también cambian
    return editada
  }

  function borrarCategoria(id) {
    const eliminada = db.eliminarCategoria(id)
    refrescarCategorias()
    return eliminada
  }

  // ---------- usuarios y sesión ----------

  const buscarUsuarioPorId = (id) => usuarios.find((u) => u.id === Number(id)) || null

  function buscarUsuarioPorCorreo(correo) {
    const buscado = (correo || '').trim().toLowerCase()
    return usuarios.find((u) => u.correo.toLowerCase() === buscado) || null
  }

  function crearUsuario(datos) {
    const nuevo = db.agregarUsuario(datos)
    refrescarUsuarios()
    return nuevo
  }

  // El registro público siempre crea clientes
  function registrarUsuario(datos) {
    return crearUsuario({ ...datos, rol: 'cliente' })
  }

  function actualizarUsuario(id, datos) {
    const editado = db.editarUsuario(id, datos)
    refrescarUsuarios()
    // Si la persona editó su propio perfil, la sesión también debe reflejar el cambio
    if (editado && sesion && sesion.id === editado.id) {
      setSesion(db.guardarSesion(editado))
    }
    return editado
  }

  function borrarUsuario(id) {
    const eliminado = db.eliminarUsuario(id)
    refrescarUsuarios()
    return eliminado
  }

  // Devuelve el usuario si el correo y la contraseña coinciden, o null si no.
  function iniciarSesion(correo, contrasena) {
    const usuario = db.validarCredenciales(correo, contrasena)
    if (usuario === null) {
      return null
    }
    setSesion(db.guardarSesion(usuario))
    return usuario
  }

  function cerrarSesion() {
    db.cerrarSesion()
    setSesion(null)
  }

  // ---------- compras ----------

  const buscarOrdenPorNumero = (numero) => ordenes.find((o) => o.numero === numero) || null

  function ordenesDeUsuario(correo) {
    const buscado = (correo || '').trim().toLowerCase()
    return ordenes.filter((o) => o.cliente.correo.toLowerCase() === buscado)
  }

  // Número que tendrá la próxima orden (se muestra también cuando un pago es rechazado)
  const proximoNumeroOrden = 'ST-ORD-' + (1001 + ordenes.reduce((mayor, o) => (o.id > mayor ? o.id : mayor), 0))

  // Registra una compra aprobada: crea la orden (con número y fecha) y descuenta el stock
  // de cada juego comprado.
  function comprar(datosOrden) {
    const orden = db.agregarOrden(datosOrden)
    datosOrden.items.forEach((item) => db.descontarStock(item.id, item.cantidad))
    refrescarOrdenes()
    refrescarProductos()
    return orden
  }

  const valor = {
    productos,
    ofertas,
    productosCriticos,
    buscarProductoPorId,
    buscarProductosPorCategoria,
    crearProducto,
    actualizarProducto,
    borrarProducto,
    categorias,
    crearCategoria,
    actualizarCategoria,
    borrarCategoria,
    usuarios,
    buscarUsuarioPorId,
    buscarUsuarioPorCorreo,
    crearUsuario,
    registrarUsuario,
    actualizarUsuario,
    borrarUsuario,
    sesion,
    iniciarSesion,
    cerrarSesion,
    ordenes,
    buscarOrdenPorNumero,
    ordenesDeUsuario,
    proximoNumeroOrden,
    comprar
  }

  return (
    <TiendaContext.Provider value={valor}>
      {children}
    </TiendaContext.Provider>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export function useTienda() {
  return useContext(TiendaContext)
}
