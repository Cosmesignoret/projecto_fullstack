// Validaciones de los formularios de Stog (funciones puras: reciben datos y devuelven
// un mensaje de error, o '' si todo está bien). Vienen de las reglas de la Parte 1 (HTML + JS).

// Correo básico: tiene @ y un punto después
export function validarCorreo(correo) {
  const c = (correo || '').trim()
  if (c === '') return 'El correo electrónico es obligatorio.'
  if (c.length > 100) return 'El correo no puede tener más de 100 caracteres.'
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(c)) return 'Ingresa un correo válido, por ejemplo nombre@correo.cl.'
  return ''
}

export function validarContrasena(contrasena) {
  if (!contrasena) return 'La contraseña es obligatoria.'
  if (contrasena.length < 6) return 'La contraseña debe tener al menos 6 caracteres.'
  if (contrasena.length > 20) return 'La contraseña no puede tener más de 20 caracteres.'
  return ''
}

export function validarNombre(valor, etiqueta, minimo = 3, maximo = 50) {
  const v = (valor || '').trim()
  if (v === '') return etiqueta + ' es obligatorio.'
  if (v.length < minimo) return etiqueta + ' debe tener al menos ' + minimo + ' caracteres.'
  if (v.length > maximo) return etiqueta + ' no puede tener más de ' + maximo + ' caracteres.'
  return ''
}

export function validarEdad(edad) {
  if (String(edad).trim() === '') return 'La edad es obligatoria.'
  const n = Number(edad)
  if (isNaN(n)) return 'La edad debe contener solamente números.'
  if (!Number.isInteger(n) || n < 18 || n > 100) return 'La edad debe estar entre 18 y 100 años.'
  return ''
}

// ---------- validaciones del panel de administración (CRUD de productos) ----------

// Número entero entre minimo y maximo. Recibe el valor tal como sale del input (texto).
export function validarEntero(valor, etiqueta, minimo = 0, maximo = 100000000) {
  if (String(valor).trim() === '') return etiqueta + ' es obligatorio.'
  const n = Number(valor)
  if (isNaN(n) || !Number.isInteger(n)) return etiqueta + ' debe ser un número entero.'
  if (n < minimo) return etiqueta + ' no puede ser menor a ' + minimo + '.'
  if (n > maximo) return etiqueta + ' no puede ser mayor a ' + maximo + '.'
  return ''
}

// Revisa el formulario completo de un producto. Devuelve un objeto con un mensaje por cada
// campo con error ({} si todo está bien): { nombre: '...', precio: '...' }
export function validarProducto(form) {
  const errores = {}

  const errorNombre = validarNombre(form.nombre, 'El nombre', 2, 100)
  if (errorNombre) errores.nombre = errorNombre

  const descripcion = (form.descripcion || '').trim()
  if (descripcion === '') errores.descripcion = 'La descripción es obligatoria.'
  else if (descripcion.length > 300) errores.descripcion = 'La descripción no puede tener más de 300 caracteres.'

  if (!form.categoria) errores.categoria = 'Selecciona una categoría.'

  const errorPrecio = validarEntero(form.precio, 'El precio', 1)
  if (errorPrecio) errores.precio = errorPrecio

  const errorStock = validarEntero(form.stock, 'El stock', 0, 100000)
  if (errorStock) errores.stock = errorStock

  const errorCritico = validarEntero(form.stockCritico, 'El stock crítico', 0, 100000)
  if (errorCritico) errores.stockCritico = errorCritico

  // El precio de oferta solo se revisa si el producto está en oferta, y debe ser menor al normal
  if (form.enOferta) {
    const errorOferta = validarEntero(form.precioOferta, 'El precio de oferta', 1)
    if (errorOferta) {
      errores.precioOferta = errorOferta
    } else if (!errorPrecio && Number(form.precioOferta) >= Number(form.precio)) {
      errores.precioOferta = 'El precio de oferta debe ser menor al precio normal.'
    }
  }

  return errores
}

// ---------- validaciones del perfil del administrador ----------

// Revisa el cambio de contraseña. Si los tres campos están vacíos no se quiere cambiar nada
// y no hay errores. Devuelve un objeto con un mensaje por campo con error ({} si todo está bien).
export function validarCambioContrasena(actual, nueva, confirmar, contrasenaGuardada) {
  const errores = {}
  if (!actual && !nueva && !confirmar) {
    return errores
  }
  if (actual !== contrasenaGuardada) {
    errores.actual = 'La contraseña actual no es correcta.'
  }
  const errorNueva = validarContrasena(nueva)
  if (errorNueva) {
    errores.nueva = errorNueva
  } else if (nueva === actual) {
    errores.nueva = 'La nueva contraseña debe ser distinta de la actual.'
  }
  if (confirmar !== nueva) {
    errores.confirmar = 'Las contraseñas no coinciden.'
  }
  return errores
}
