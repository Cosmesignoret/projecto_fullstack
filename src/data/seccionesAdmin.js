// Secciones del panel de administración. Se define en un solo lugar para que el menú lateral
// y los accesos rápidos del dashboard usen la misma lista: para agregar una sección basta con sumarla aquí.
// exacta: true = el link solo se marca como activo en esa URL exacta (no en las que cuelgan de ella).
// Se usa en /admin y /admin/productos, porque /admin/productos/criticos tiene su propio link.
export const secciones = [
  { ruta: '/admin', texto: 'Dashboard', icono: '🏠', exacta: true },
  { ruta: '/admin/productos', texto: 'Productos', icono: '📦', exacta: true },
  { ruta: '/admin/productos/criticos', texto: 'Productos críticos', icono: '⚠️' },
  { ruta: '/admin/categorias', texto: 'Categorías', icono: '🏷️' },
  { ruta: '/admin/usuarios', texto: 'Usuarios', icono: '👤' },
  { ruta: '/admin/ordenes', texto: 'Órdenes', icono: '🧾' },
  { ruta: '/admin/reportes', texto: 'Reportes', icono: '📊' },
  { ruta: '/admin/perfil', texto: 'Perfil', icono: '⚙️' }
]
