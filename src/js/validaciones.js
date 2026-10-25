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
