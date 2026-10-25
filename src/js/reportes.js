// Cálculos de los reportes del panel de administración.
// Son funciones puras: reciben listas (órdenes, productos, usuarios) y devuelven números o
// listas nuevas, sin tocar nada. Por eso son fáciles de probar y las pantallas solo las muestran.

// Totales generales de las ventas
export function resumenVentas(ordenes) {
  const totalVendido = ordenes.reduce((suma, o) => suma + o.total, 0)
  const unidadesVendidas = ordenes.reduce(
    (suma, o) => suma + o.items.reduce((s, item) => s + item.cantidad, 0), 0
  )
  return {
    cantidadOrdenes: ordenes.length,
    totalVendido,
    unidadesVendidas,
    // Ticket promedio = lo que gasta en promedio cada compra (0 si aún no hay compras)
    ticketPromedio: ordenes.length === 0 ? 0 : Math.round(totalVendido / ordenes.length)
  }
}

// Unidades e ingresos de cada juego vendido, del que más ingresos dejó al que menos
export function ventasPorProducto(ordenes) {
  const porProducto = {}
  ordenes.forEach((orden) => {
    orden.items.forEach((item) => {
      if (!porProducto[item.id]) {
        porProducto[item.id] = { id: item.id, nombre: item.nombre, unidades: 0, ingresos: 0 }
      }
      porProducto[item.id].unidades += item.cantidad
      porProducto[item.id].ingresos += item.precio * item.cantidad
    })
  })
  return Object.values(porProducto).sort((a, b) => b.ingresos - a.ingresos)
}

// Precio con el que se vende hoy un producto (el de oferta si está en oferta)
export function precioVigente(producto) {
  return producto.enOferta ? producto.precioOferta : producto.precio
}

// Inventario agrupado por categoría: cuántos productos, cuántas unidades en bodega y cuánto valen
export function inventarioPorCategoria(productos) {
  const porCategoria = {}
  productos.forEach((p) => {
    if (!porCategoria[p.categoria]) {
      porCategoria[p.categoria] = { categoria: p.categoria, productos: 0, unidades: 0, valor: 0 }
    }
    porCategoria[p.categoria].productos += 1
    porCategoria[p.categoria].unidades += p.stock
    porCategoria[p.categoria].valor += p.stock * precioVigente(p)
  })
  return Object.values(porCategoria).sort((a, b) => b.valor - a.valor)
}

// Cuántos usuarios hay de cada rol: { cliente: 2, administrador: 1 }
export function usuariosPorRol(usuarios) {
  const conteo = {}
  usuarios.forEach((u) => {
    conteo[u.rol] = (conteo[u.rol] || 0) + 1
  })
  return conteo
}

// Compras de un usuario. Las órdenes guardan el correo del cliente, así que se busca por correo
// (sin importar mayúsculas), lo que también encuentra compras hechas antes de crear la cuenta.
export function comprasDeUsuario(ordenes, correo) {
  const buscado = (correo || '').trim().toLowerCase()
  return ordenes.filter((o) => o.cliente.correo.trim().toLowerCase() === buscado)
}
