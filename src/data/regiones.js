// Regiones y comunas de Chile para la dirección de entrega del checkout.
// La Región Metropolitana está completa (52 comunas). En las demás regiones están las comunas
// principales: para agregar otra basta con sumarla a la lista de su región.
export const regiones = [
  { nombre: 'Región de Arica y Parinacota', comunas: ['Arica', 'Camarones', 'General Lagos', 'Putre'] },
  { nombre: 'Región de Tarapacá', comunas: ['Alto Hospicio', 'Camiña', 'Colchane', 'Huara', 'Iquique', 'Pica', 'Pozo Almonte'] },
  { nombre: 'Región de Antofagasta', comunas: ['Antofagasta', 'Calama', 'María Elena', 'Mejillones', 'Ollagüe', 'San Pedro de Atacama', 'Sierra Gorda', 'Taltal', 'Tocopilla'] },
  { nombre: 'Región de Atacama', comunas: ['Alto del Carmen', 'Caldera', 'Chañaral', 'Copiapó', 'Diego de Almagro', 'Freirina', 'Huasco', 'Tierra Amarilla', 'Vallenar'] },
  { nombre: 'Región de Coquimbo', comunas: ['Andacollo', 'Coquimbo', 'Illapel', 'La Serena', 'Los Vilos', 'Monte Patria', 'Ovalle', 'Salamanca', 'Vicuña'] },
  { nombre: 'Región de Valparaíso', comunas: ['Casablanca', 'Concón', 'La Calera', 'Limache', 'Los Andes', 'Olmué', 'Quillota', 'Quilpué', 'Quintero', 'San Antonio', 'San Felipe', 'Valparaíso', 'Villa Alemana', 'Viña del Mar'] },
  {
    nombre: 'Región Metropolitana de Santiago',
    comunas: [
      'Alhué', 'Buin', 'Calera de Tango', 'Cerrillos', 'Cerro Navia', 'Colina', 'Conchalí', 'Curacaví',
      'El Bosque', 'El Monte', 'Estación Central', 'Huechuraba', 'Independencia', 'Isla de Maipo',
      'La Cisterna', 'La Florida', 'La Granja', 'La Pintana', 'La Reina', 'Lampa', 'Las Condes',
      'Lo Barnechea', 'Lo Espejo', 'Lo Prado', 'Macul', 'Maipú', 'María Pinto', 'Melipilla', 'Ñuñoa',
      'Padre Hurtado', 'Paine', 'Pedro Aguirre Cerda', 'Peñaflor', 'Peñalolén', 'Pirque', 'Providencia',
      'Pudahuel', 'Puente Alto', 'Quilicura', 'Quinta Normal', 'Recoleta', 'Renca', 'San Bernardo',
      'San Joaquín', 'San José de Maipo', 'San Miguel', 'San Pedro', 'San Ramón', 'Santiago',
      'Talagante', 'Tiltil', 'Vitacura'
    ]
  },
  { nombre: "Región del Libertador General Bernardo O'Higgins", comunas: ['Graneros', 'Machalí', 'Mostazal', 'Pichilemu', 'Rancagua', 'Rengo', 'Requínoa', 'San Fernando', 'San Vicente', 'Santa Cruz'] },
  { nombre: 'Región del Maule', comunas: ['Cauquenes', 'Constitución', 'Curicó', 'Linares', 'Maule', 'Molina', 'Parral', 'San Clemente', 'San Javier', 'Talca'] },
  { nombre: 'Región de Ñuble', comunas: ['Bulnes', 'Chillán', 'Chillán Viejo', 'Coelemu', 'Quillón', 'San Carlos', 'Yungay'] },
  { nombre: 'Región del Biobío', comunas: ['Cañete', 'Chiguayante', 'Concepción', 'Coronel', 'Hualpén', 'Lebu', 'Los Ángeles', 'Lota', 'Penco', 'San Pedro de la Paz', 'Talcahuano', 'Tomé'] },
  { nombre: 'Región de La Araucanía', comunas: ['Angol', 'Collipulli', 'Lautaro', 'Nueva Imperial', 'Padre Las Casas', 'Pitrufquén', 'Pucón', 'Temuco', 'Victoria', 'Villarrica'] },
  { nombre: 'Región de Los Ríos', comunas: ['Futrono', 'La Unión', 'Lanco', 'Los Lagos', 'Paillaco', 'Panguipulli', 'Río Bueno', 'Valdivia'] },
  { nombre: 'Región de Los Lagos', comunas: ['Ancud', 'Calbuco', 'Castro', 'Frutillar', 'Llanquihue', 'Osorno', 'Puerto Montt', 'Puerto Octay', 'Puerto Varas', 'Quellón'] },
  { nombre: 'Región de Aysén del General Carlos Ibáñez del Campo', comunas: ['Aysén', 'Chile Chico', 'Cisnes', 'Cochrane', 'Coyhaique', 'Guaitecas', 'Lago Verde', "O'Higgins", 'Río Ibáñez', 'Tortel'] },
  { nombre: 'Región de Magallanes y de la Antártica Chilena', comunas: ['Antártica', 'Cabo de Hornos', 'Laguna Blanca', 'Porvenir', 'Primavera', 'Puerto Natales', 'Punta Arenas', 'Río Verde', 'San Gregorio', 'Timaure', 'Torres del Paine'] }
]

// Región con la que parte el formulario
export const REGION_INICIAL = 'Región Metropolitana de Santiago'

// Comunas de una región ([] si la región no existe)
export function comunasDeRegion(nombreRegion) {
  const region = regiones.find((r) => r.nombre === nombreRegion)
  return region ? region.comunas : []
}
