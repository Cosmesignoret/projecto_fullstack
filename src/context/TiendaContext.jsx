import { createContext, useContext, useState } from 'react'
import {
  productos as productosIniciales,
  categorias as categoriasIniciales,
  usuarios as usuariosIniciales
} from '../data/productos.js'

// Estado global de la tienda: productos (con su stock), usuarios, sesión y órdenes.
// Todo vive en memoria con useState: no hay base de datos, y al recargar la página
// la tienda vuelve a los datos iniciales de data/productos.js.
// Las props "sesionInicial" y "usuariosIniciales" permiten arrancar con datos
// distintos (se usan sobre todo en las pruebas).
const TiendaContext = createContext()

export function TiendaProvider({ children, sesionInicial = null }) {
  const [productos, setProductos] = useState(productosIniciales)
  const [usuarios, setUsuarios] = useState(usuariosIniciales)
  const [sesion, setSesion] = useState(sesionInicial)
  const [ordenes, setOrdenes] = useState([])

  // ---------- productos ----------

  function buscarProductoPorId(id) {
    return productos.find((p) => p.id === Number(id)) || null
  }

  function buscarProductosPorCategoria(categoria) {
    return productos.filter((p) => p.categoria === categoria)
  }

  // Los juegos en oferta se calculan a partir de la lista: no se guardan aparte
  const ofertas = productos.filter((p) => p.enOferta === true)

  // ---------- usuarios y sesión ----------

  function buscarUsuarioPorCorreo(correo) {
    const buscado = (correo || '').trim().toLowerCase()
    return usuarios.find((u) => u.correo.toLowerCase() === buscado) || null
  }

  function registrarUsuario(datos) {
    const nuevo = { ...datos, id: usuarios.length + 1 }
    setUsuarios([...usuarios, nuevo])
    return nuevo
  }

  // Devuelve el usuario si el correo y la contraseña coinciden, o null si no.
  // La sesión se arma campo por campo para que la contraseña nunca quede guardada en ella.
  function iniciarSesion(correo, contrasena) {
    const usuario = buscarUsuarioPorCorreo(correo)
    if (usuario === null || usuario.contrasena !== contrasena) {
      return null
    }
    setSesion({ id: usuario.id, nombre: usuario.nombre, apellidos: usuario.apellidos, correo: usuario.correo })
    return usuario
  }

  function cerrarSesion() {
    setSesion(null)
  }

  // ---------- compras ----------

  function buscarOrdenPorNumero(numero) {
    return ordenes.find((o) => o.numero === numero) || null
  }

  // Registra una compra aprobada: crea la orden (con número y fecha) y descuenta el stock
  // de cada juego comprado. Math.max evita que el stock quede en negativo.
  function comprar(datosOrden) {
    const orden = {
      ...datosOrden,
      // Número que ve el cliente: ST-ORD-1001, ST-ORD-1002, etc.
      numero: 'ST-ORD-' + (1001 + ordenes.length),
      fecha: new Date().toISOString()
    }
    setOrdenes([...ordenes, orden])
    setProductos(
      productos.map((p) => {
        const comprado = datosOrden.items.find((item) => item.id === p.id)
        return comprado ? { ...p, stock: Math.max(0, p.stock - comprado.cantidad) } : p
      })
    )
    return orden
  }

  const valor = {
    productos,
    categorias: categoriasIniciales,
    ofertas,
    buscarProductoPorId,
    buscarProductosPorCategoria,
    usuarios,
    buscarUsuarioPorCorreo,
    registrarUsuario,
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
