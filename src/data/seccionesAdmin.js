// Secciones del panel de administración. Se define en un solo lugar para que el menú lateral
// y las tarjetas del dashboard usen la misma lista: si se agrega una sección nueva, basta con sumarla aquí.
// soloAdmin: true = la sección solo la ve el perfil "administrador" (el vendedor no).
export const secciones = [
  { ruta: '/admin', texto: 'Dashboard', icono: '📊', detalle: 'Visión general de las métricas y estadísticas clave del sistema.' },
  { ruta: '/admin/ordenes', texto: 'Órdenes', icono: '🧾', detalle: 'Gestión y seguimiento de todas las órdenes de compra realizadas.' },
  { ruta: '/admin/productos', texto: 'Productos', icono: '🎮', detalle: 'Administrar inventario y detalles de los productos disponibles.' },
  { ruta: '/admin/categorias', texto: 'Categorías', icono: '🏷️', detalle: 'Organizar productos en categorías para facilitar su navegación.' },
  { ruta: '/admin/usuarios', texto: 'Usuarios', icono: '👥', detalle: 'Gestión de cuentas de usuario y sus roles dentro del sistema.', soloAdmin: true },
  { ruta: '/admin/reportes', texto: 'Reportes', icono: '📈', detalle: 'Generación de informes detallados sobre las operaciones del sistema.' },
  { ruta: '/admin/perfil', texto: 'Perfil', icono: '👤', detalle: 'Administración de la información personal y configuraciones de cuenta.' }
]
