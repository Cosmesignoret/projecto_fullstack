import { createContext, useContext, useState } from 'react'
import {
  listarProductos, agregarProducto, editarProducto, eliminarProducto,
  listarCategorias, agregarCategoria, editarCategoria, eliminarCategoria,
  listarUsuarios, buscarUsuarioPorCorreo as dbBuscarUsuario, agregarUsuario, editarUsuario, eliminarUsuario,
  obtenerSesion, guardarSesion, cerrarSesion as dbCerrarSesion,
  listarOrdenes, agregarOrden
} from '../data/db.js'

// Estado global de la tienda: productos (con su stock), categorías, usuarios, sesión y órdenes.
// Los datos viven en db.js (que los guarda en localStorage, así no se pierden al recargar).
// Aquí se copian a useState para que React redibuje la pantalla cuando algo cambia:
// cada función de este contexto (1) llama a db.js para modificar y guardar, y
// (2) vuelve a leer la lista para actualizar el estado.
// La prop "sesionInicial" permite arrancar con una sesión distinta (se usa en las pruebas).
const TiendaContext = createContext()

export function TiendaProvider({ children, sesionInicial = null }) {
  const [productos, setProductos] = useState(listarProductos)
  const [categorias, setCategorias] = useState(listarCategorias)
  const [usuarios, setUsuarios] = useState(listarUsuarios)
  const [sesion, setSesion] = useState(() => sesionInicial ?? obtenerSesion())
  const [ordenes, setOrdenes] = useState(listarOrdenes)

  // Vuelven a leer cada lista desde db.js
  const refrescarProductos = () => setProductos(listarProductos())
  const refrescarCategorias = () => setCategorias(listarCategorias())
  const refrescarUsuarios = () => setUsuarios(listarUsuarios())

  // ---------- productos ----------

  function buscarProductoPorId(id) {
    return productos.find((p) => p.id === Number(id)) || null
  }

  function buscarProductosPorCategoria(categoria) {
    return productos.filter((p) => p.categoria === categoria)
  }

  // Los juegos en oferta y los críticos se calculan a partir de la lista: no se guardan aparte
  const ofertas = productos.filter((p) => p.enOferta === true)
  const productosCriticos = productos.filter((p) => p.stock <= p.stockCritico)

  function crearProducto(datos) {
    const nuevo = agregarProducto(datos)
    refrescarProductos()
    return nuevo
  }

  function actualizarProducto(id, datos) {
    const editado = editarProducto(id, datos)
    refrescarProductos()
    return editado
  }

  function borrarProducto(id) {
    eliminarProducto(id)
    refrescarProductos()
  }

  // ---------- categorías ----------

  function crearCategoria(datos) {
    const nueva = agregarCategoria(datos)
    refrescarCategorias()
    return nueva
  }

  // Renombrar una categoría también cambia los productos que la usan
  function actualizarCategoria(id, datos) {
    const editada = editarCategoria(id, datos)
    refrescarCategorias()
    refrescarProductos()
    return editada
  }

  // Devuelve false si no se pudo eliminar porque aún tiene productos
  function borrarCategoria(id) {
    const eliminada = eliminarCategoria(id)
    refrescarCategorias()
    return eliminada
  }

  // ---------- usuarios y sesión ----------

  function buscarUsuarioPorCorreo(correo) {
    return dbBuscarUsuario(correo)
  }

  function registrarUsuario(datos) {
    const nuevo = agregarUsuario(datos)
    refrescarUsuarios()
    return nuevo
  }

  function actualizarUsuario(id, datos) {
    const editado = editarUsuario(id, datos)
    refrescarUsuarios()
    // Si el usuario editado es el que tiene la sesión abierta, la sesión se actualiza también
    if (sesion && editado && sesion.id === editado.id) {
      setSesion(guardarSesion(editado))
    }
    return editado
  }

  function borrarUsuario(id) {
    eliminarUsuario(id)
    refrescarUsuarios()
    // Si se elimina al usuario con sesión abierta, se cierra su sesión
    if (sesion && sesion.id === Number(id)) {
      cerrarSesion()
    }
  }

  // Devuelve el usuario si el correo y la contraseña coinciden, o null si no.
  // guardarSesion arma la sesión campo por campo: la contraseña nunca queda guardada en ella.
  function iniciarSesion(correo, contrasena) {
    const usuario = dbBuscarUsuario(correo)
    if (usuario === null || usuario.contrasena !== contrasena) {
      return null
    }
    setSesion(guardarSesion(usuario))
    return usuario
  }

  function cerrarSesion() {
    dbCerrarSesion()
    setSesion(null)
  }

  // ---------- compras ----------

  function buscarOrdenPorNumero(numero) {
    return ordenes.find((o) => o.numero === numero) || null
  }

  // Registra una compra aprobada: db.js crea la orden (con número y fecha) y descuenta el stock
  // de cada juego comprado.
  function comprar(datosOrden) {
    const orden = agregarOrden(datosOrden)
    setOrdenes(listarOrdenes())
    refrescarProductos()
    return orden
  }

  const valor = {
    productos,
    categorias,
    ofertas,
    productosCriticos,
    buscarProductoPorId,
    buscarProductosPorCategoria,
    crearProducto,
    actualizarProducto,
    borrarProducto,
    crearCategoria,
    actualizarCategoria,
    borrarCategoria,
    usuarios,
    buscarUsuarioPorCorreo,
    registrarUsuario,
    actualizarUsuario,
    borrarUsuario,
    sesion,
    iniciarSesion,
    cerrarSesion,
    ordenes,
    buscarOrdenPorNumero,
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
