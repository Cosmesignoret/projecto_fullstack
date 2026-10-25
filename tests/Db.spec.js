// Pruebas de db.js, la "base de datos" de Stog (CRUD sobre localStorage).
// Son funciones simples que reciben datos y devuelven un resultado, sin React de por medio.
import {
  listarProductos, buscarProductoPorId, buscarProductosPorCategoria, listarOfertas, listarProductosCriticos,
  agregarProducto, editarProducto, eliminarProducto, descontarStock,
  listarCategorias, agregarCategoria, editarCategoria, eliminarCategoria, contarProductosDeCategoria,
  listarUsuarios, buscarUsuarioPorCorreo, agregarUsuario, editarUsuario, eliminarUsuario,
  listarCarrito, guardarCarrito, agregarAlCarrito, actualizarCantidadCarrito, quitarDelCarrito, vaciarCarrito,
  guardarSesion, obtenerSesion, cerrarSesion,
  listarOrdenes, buscarOrdenPorNumero, agregarOrden,
  reiniciarDatos
} from '../src/data/db.js'

// Jasmine corre las pruebas en orden aleatorio y todas comparten los mismos datos.
// Por eso antes de CADA prueba se vuelve a los datos iniciales con reiniciarDatos():
// ninguna prueba depende de lo que dejó otra.
beforeEach(() => {
  reiniciarDatos()
})

function productoNuevo() {
  return {
    nombre: 'Juego de prueba', descripcion: 'Solo para pruebas', categoria: 'Acción',
    precio: 1000, stock: 10, stockCritico: 2
  }
}

describe('db.js - productos (leer)', () => {
  it('la primera vez carga los productos iniciales y los guarda en localStorage', () => {
    expect(listarProductos().length).toBe(4)
    expect(JSON.parse(localStorage.getItem('stogProductos')).length).toBe(4)
  })

  it('buscarProductoPorId encuentra el producto, incluso si el id llega como texto', () => {
    expect(buscarProductoPorId(1).nombre).toBe('GTA VI')
    expect(buscarProductoPorId('2').nombre).toBe('Doom') // en la URL el id viaja como texto
  })

  it('buscarProductoPorId devuelve null si el id no existe', () => {
    expect(buscarProductoPorId(99999)).toBeNull()
  })

  it('buscarProductosPorCategoria y listarOfertas filtran correctamente', () => {
    expect(buscarProductosPorCategoria('Casino').every((p) => p.categoria === 'Casino')).toBe(true)
    expect(buscarProductosPorCategoria('Casino').length).toBe(1)
    expect(listarOfertas().every((p) => p.enOferta === true)).toBe(true)
  })

  it('listarProductosCriticos incluye solo los que tienen stock igual o menor al crítico', () => {
    // En los datos iniciales solo Detroit (stock 4, crítico 5) está en estado crítico
    const criticos = listarProductosCriticos()
    expect(criticos.length).toBe(1)
    expect(criticos[0].nombre).toBe('Detroit: Become Human')
  })

  it('devuelve copias: modificar lo que devuelve no cambia los datos guardados', () => {
    const producto = buscarProductoPorId(1)
    producto.nombre = 'Cambiado por fuera'
    expect(buscarProductoPorId(1).nombre).toBe('GTA VI')
  })
})

describe('db.js - productos (crear, actualizar, eliminar)', () => {
  it('agregarProducto asigna id y código, lo deja en la lista y lo guarda', () => {
    const creado = agregarProducto(productoNuevo())

    expect(creado.id).toBe(5)
    expect(creado.codigo).toBe('PRD-005')
    expect(listarProductos().length).toBe(5)
    expect(JSON.parse(localStorage.getItem('stogProductos')).length).toBe(5)
  })

  it('el id nuevo no se repite aunque se haya eliminado un producto', () => {
    eliminarProducto(2)
    const creado = agregarProducto(productoNuevo())
    // con length + 1 daría 4 y repetiría el id de Detroit
    expect(creado.id).toBe(5)
  })

  it('editarProducto cambia solo los campos enviados y devuelve el producto editado', () => {
    const editado = editarProducto(1, { precio: 12345 })

    expect(editado.precio).toBe(12345)
    expect(editado.nombre).toBe('GTA VI') // lo que no se envía queda igual
    expect(buscarProductoPorId(1).precio).toBe(12345)
  })

  it('editarProducto devuelve null si el producto no existe', () => {
    expect(editarProducto(99999, { precio: 1 })).toBeNull()
  })

  it('eliminarProducto saca el producto de la lista', () => {
    eliminarProducto(3)
    expect(buscarProductoPorId(3)).toBeNull()
    expect(listarProductos().length).toBe(3)
  })

  it('los cambios persisten: recargar desde localStorage devuelve lo modificado', () => {
    editarProducto(1, { nombre: 'GTA VI Editado' })
    const guardado = JSON.parse(localStorage.getItem('stogProductos'))
    expect(guardado.find((p) => p.id === 1).nombre).toBe('GTA VI Editado')
  })

  it('descontarStock resta unidades y nunca deja el stock negativo', () => {
    const stock = buscarProductoPorId(1).stock
    descontarStock(1, 1)
    expect(buscarProductoPorId(1).stock).toBe(stock - 1)

    descontarStock(1, 9999)
    expect(buscarProductoPorId(1).stock).toBe(0)

    expect(() => descontarStock(99999, 1)).not.toThrow() // un id que no existe no rompe nada
  })
})

describe('db.js - categorías', () => {
  it('agregarCategoria la deja en la lista con un id nuevo', () => {
    const creada = agregarCategoria({ nombre: 'Terror', descripcion: 'Para pasar susto' })
    expect(creada.id).toBe(5)
    expect(listarCategorias().length).toBe(5)
  })

  it('editarCategoria cambia el nombre y también el de los productos que la usaban', () => {
    editarCategoria(1, { nombre: 'Disparos' }) // "Acción" -> "Disparos"

    expect(listarCategorias().find((c) => c.id === 1).nombre).toBe('Disparos')
    expect(buscarProductoPorId(2).categoria).toBe('Disparos') // Doom era de "Acción"
    expect(contarProductosDeCategoria('Acción')).toBe(0)
  })

  it('editarCategoria devuelve null si no existe', () => {
    expect(editarCategoria(99999, { nombre: 'x' })).toBeNull()
  })

  it('eliminarCategoria NO elimina una categoría que todavía tiene productos', () => {
    expect(eliminarCategoria(1)).toBe(false)
    expect(listarCategorias().length).toBe(4)
  })

  it('eliminarCategoria elimina una categoría vacía', () => {
    const creada = agregarCategoria({ nombre: 'Vacía', descripcion: 'Sin productos' })
    expect(eliminarCategoria(creada.id)).toBe(true)
    expect(listarCategorias().length).toBe(4)
  })
})

describe('db.js - usuarios', () => {
  it('buscarUsuarioPorCorreo ignora mayúsculas y devuelve null si no existe', () => {
    expect(buscarUsuarioPorCorreo('JPEREZ@duoc.cl').nombre).toBe('Juan')
    expect(buscarUsuarioPorCorreo('no-existe@gmail.com')).toBeNull()
  })

  it('agregarUsuario lo deja en la lista y por defecto es cliente', () => {
    const creado = agregarUsuario({ nombre: 'Ana', apellidos: 'Prueba', correo: 'ana@gmail.com', contrasena: 'abc123', edad: 22 })
    expect(creado.rol).toBe('cliente')
    expect(buscarUsuarioPorCorreo('ana@gmail.com')).not.toBeNull()
  })

  it('editarUsuario cambia solo los datos enviados y conserva el resto', () => {
    const editado = editarUsuario(1, { nombre: 'Nombre editado' })
    expect(editado.nombre).toBe('Nombre editado')
    expect(editado.correo).toBe('carlos.edut@gmail.com')
    expect(editarUsuario(99999, { nombre: 'x' })).toBeNull()
  })

  it('eliminarUsuario lo saca de la lista', () => {
    eliminarUsuario(2)
    expect(buscarUsuarioPorCorreo('jperez@duoc.cl')).toBeNull()
    expect(listarUsuarios().length).toBe(2)
  })
})

describe('db.js - carrito', () => {
  it('agregarAlCarrito usa el precio normal, o el de oferta si el producto está en oferta', () => {
    const enOferta = buscarProductoPorId(1)
    agregarAlCarrito(enOferta, 1)
    expect(listarCarrito()[0].precio).toBe(enOferta.precioOferta)

    vaciarCarrito()
    agregarAlCarrito({ ...enOferta, enOferta: false }, 1)
    expect(listarCarrito()[0].precio).toBe(enOferta.precio)
  })

  it('si el producto ya estaba en el carrito, suma las cantidades en vez de repetirlo', () => {
    const producto = buscarProductoPorId(1)
    agregarAlCarrito(producto, 1)
    agregarAlCarrito(producto, 2)

    expect(listarCarrito().length).toBe(1)
    expect(listarCarrito()[0].cantidad).toBe(3)
  })

  it('el carrito se guarda en localStorage', () => {
    agregarAlCarrito(buscarProductoPorId(1), 1)
    expect(JSON.parse(localStorage.getItem('stogCarrito')).length).toBe(1)
  })

  it('actualizarCantidadCarrito cambia la cantidad y no falla si el id no existe', () => {
    agregarAlCarrito(buscarProductoPorId(1), 1)
    actualizarCantidadCarrito(1, 5)
    expect(listarCarrito()[0].cantidad).toBe(5)
    expect(() => actualizarCantidadCarrito(99999, 3)).not.toThrow()
  })

  it('quitarDelCarrito saca solo el producto indicado y vaciarCarrito deja todo vacío', () => {
    agregarAlCarrito(buscarProductoPorId(1), 1)
    agregarAlCarrito(buscarProductoPorId(2), 1)

    quitarDelCarrito(1)
    expect(listarCarrito().map((i) => i.id)).toEqual([2])

    vaciarCarrito()
    expect(listarCarrito().length).toBe(0)
  })

  it('guardarCarrito reemplaza todo el carrito', () => {
    guardarCarrito([{ id: 9, nombre: 'X', precio: 100, cantidad: 2 }])
    expect(listarCarrito()).toEqual([{ id: 9, nombre: 'X', precio: 100, cantidad: 2 }])
  })
})

describe('db.js - sesión', () => {
  it('obtenerSesion devuelve null si nadie inició sesión', () => {
    expect(obtenerSesion()).toBeNull()
  })

  it('guardarSesion guarda al usuario SIN su contraseña', () => {
    guardarSesion(buscarUsuarioPorCorreo('admin@stog.cl'))
    const sesion = obtenerSesion()

    expect(sesion.correo).toBe('admin@stog.cl')
    expect(sesion.rol).toBe('administrador')
    expect(sesion.contrasena).toBeUndefined()
    expect(localStorage.getItem('stogSesion')).not.toContain('admin123')
  })

  it('cerrarSesion borra la sesión guardada', () => {
    guardarSesion(listarUsuarios()[0])
    cerrarSesion()
    expect(obtenerSesion()).toBeNull()
  })
})

describe('db.js - órdenes', () => {
  function ordenDePrueba() {
    return {
      cliente: { nombre: 'Ana', apellidos: 'Prueba', correo: 'ana@gmail.com', telefono: '' },
      metodoPago: 'WebPay',
      items: [{ id: 1, nombre: 'GTA VI', precio: 71990, cantidad: 2 }],
      total: 143980
    }
  }

  it('agregarOrden guarda la orden con número y fecha, y se puede buscar', () => {
    const orden = agregarOrden(ordenDePrueba())

    expect(orden.numero).toBe('ST-ORD-1001')
    expect(orden.fecha).toBeTruthy()
    expect(buscarOrdenPorNumero('ST-ORD-1001').total).toBe(143980)
    expect(JSON.parse(localStorage.getItem('stogOrdenes')).length).toBe(1)
  })

  it('agregarOrden descuenta el stock de lo comprado', () => {
    const antes = buscarProductoPorId(1).stock
    agregarOrden(ordenDePrueba())
    expect(buscarProductoPorId(1).stock).toBe(antes - 2)
  })

  it('los números de orden son correlativos y buscarOrdenPorNumero devuelve null si no existe', () => {
    agregarOrden(ordenDePrueba())
    expect(agregarOrden(ordenDePrueba()).numero).toBe('ST-ORD-1002')
    expect(listarOrdenes().length).toBe(2)
    expect(buscarOrdenPorNumero('ST-ORD-0')).toBeNull()
  })
})

describe('db.js - reiniciarDatos', () => {
  it('vuelve a los datos iniciales y borra lo guardado', () => {
    eliminarProducto(1)
    agregarAlCarrito(buscarProductoPorId(2), 1)
    reiniciarDatos()

    expect(listarProductos().length).toBe(4)
    expect(listarCarrito().length).toBe(0)
  })
})
