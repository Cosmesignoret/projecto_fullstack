// Regiones y comunas disponibles para el despacho (se usan en el checkout y en el formulario de usuarios).
export const regiones = [
  {
    nombre: "Región Metropolitana de Santiago",
    comunas: ["Santiago", "Providencia", "Las Condes", "Ñuñoa", "La Florida", "Maipú", "Puente Alto", "San Miguel", "Recoleta", "La Reina"]
  },
  {
    nombre: "Región de Valparaíso",
    comunas: ["Valparaíso", "Viña del Mar", "Quilpué", "Villa Alemana", "Concón"]
  },
  {
    nombre: "Región del Biobío",
    comunas: ["Concepción", "Talcahuano", "San Pedro de la Paz", "Hualpén", "Chiguayante"]
  }
]

// Devuelve las comunas de una región (lista vacía si la región no existe)
export function comunasDe(nombreRegion) {
  const region = regiones.find((r) => r.nombre === nombreRegion)
  return region ? region.comunas : []
}
