// Formatea un número como pesos chilenos con separador de miles: 89990 -> $89.990
export function pesos(n) {
  return '$' + Number(n).toLocaleString('es-CL')
}

// Porcentaje de descuento entre el precio normal y el de oferta: (89990, 71990) -> 20
export function porcentajeDescuento(precio, precioOferta) {
  if (!precio || precioOferta >= precio) {
    return 0
  }
  return Math.round(((precio - precioOferta) / precio) * 100)
}

// Arma la URL de una imagen guardada en public/. Se quita la "/" inicial para que
// funcione con cualquier base ('./' en producción). Si ya es una URL completa o un
// data: se deja tal cual.
export function urlImagen(imagen) {
  if (!imagen) {
    return ''
  }
  if (/^(data:|https?:)/.test(imagen)) {
    return imagen
  }
  const base = (import.meta.env && import.meta.env.BASE_URL) || './'
  return base + imagen.replace(/^\//, '')
}
