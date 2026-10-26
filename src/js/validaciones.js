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

const DOMINIOS_ADMITIDOS = ['@duoc.cl', '@profesor.duoc.cl', '@gmail.com']

// Para los usuarios que crea el administrador: solo dominios admitidos
export function validarCorreoAdmitido(correo) {
  const error = validarCorreo(correo)
  if (error) return error
  const c = correo.trim().toLowerCase()
  if (!DOMINIOS_ADMITIDOS.some((d) => c.endsWith(d))) {
    return 'Solo se permiten correos @duoc.cl, @profesor.duoc.cl o @gmail.com.'
  }
  return ''
}

// Calcula el dígito verificador con el algoritmo módulo 11 y lo compara con el ingresado
export function validarRun(run) {
  const limpio = (run || '').trim().toUpperCase()
  if (limpio === '') return 'El RUN es obligatorio.'
  if (limpio.length < 7 || limpio.length > 9) return 'El RUN debe tener entre 7 y 9 caracteres (ej: 190110222).'
  if (!/^[0-9]{6,8}[0-9K]$/.test(limpio)) return 'El RUN ingresado no es válido.'

  const cuerpo = limpio.slice(0, -1)
  const dvIngresado = limpio.slice(-1)
  let suma = 0
  let multiplicador = 2
  for (let i = cuerpo.length - 1; i >= 0; i--) {
    suma += parseInt(cuerpo.charAt(i), 10) * multiplicador
    multiplicador = multiplicador < 7 ? multiplicador + 1 : 2
  }
  const mod = 11 - (suma % 11)
  const dvEsperado = mod === 11 ? '0' : mod === 10 ? 'K' : String(mod)
  return dvIngresado === dvEsperado ? '' : 'El RUN ingresado no es válido.'
}

// Dirección de entrega: calle, región y comuna son obligatorias
export function validarDireccion({ calle, region, comuna }) {
  if ((calle || '').trim() === '') return 'La calle es obligatoria.'
  if ((calle || '').length > 100) return 'La calle no puede superar los 100 caracteres.'
  if (!region) return 'Selecciona una región.'
  if (!comuna) return 'Selecciona una comuna.'
  return ''
}

// Valida el formulario de producto del admin. Devuelve el primer error o ''.
export function validarProducto(p) {
  const codigo = (p.codigo || '').trim()
  if (codigo === '') return 'El código es obligatorio.'
  if (codigo.length < 3 || codigo.length > 10) return 'El código debe tener entre 3 y 10 caracteres.'
  if (!p.categoria) return 'Selecciona una categoría.'
  const nombre = (p.nombre || '').trim()
  if (nombre === '') return 'El nombre del producto es obligatorio.'
  if (nombre.length > 60) return 'El nombre no puede superar los 60 caracteres.'
  if (String(p.precio).trim() === '' || !Number.isInteger(Number(p.precio)) || Number(p.precio) < 1) {
    return 'El precio debe ser un número entero mayor a $0.'
  }
  if (String(p.stock).trim() === '' || !Number.isInteger(Number(p.stock)) || Number(p.stock) < 0) {
    return 'El stock debe ser un número entero, igual o mayor a 0.'
  }
  if (String(p.stockCritico).trim() === '' || !Number.isInteger(Number(p.stockCritico)) || Number(p.stockCritico) < 0) {
    return 'El stock crítico debe ser un número entero, igual o mayor a 0.'
  }
  const descripcion = (p.descripcion || '').trim()
  if (descripcion === '') return 'La descripción es obligatoria.'
  if (descripcion.length > 250) return 'La descripción no puede superar los 250 caracteres.'
  if (p.enOferta) {
    const oferta = Number(p.precioOferta)
    if (!Number.isInteger(oferta) || oferta < 1 || oferta >= Number(p.precio)) {
      return 'El precio de oferta debe ser un entero mayor a 0 y menor que el precio normal.'
    }
  }
  return ''
}
