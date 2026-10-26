# Stog — tienda de videojuegos (React + Vite)

Stog es una tienda online de videojuegos hecha con **React 19**, **Vite**, **React Router** y **React Bootstrap**.
Es la versión en React del proyecto original (HTML + Bootstrap): conserva el nombre, los textos, los juegos y los colores de Stog, y suma un archivo de datos con CRUD, persistencia y un panel de administración.

## Colores de Stog

| Uso | Color |
|---|---|
| Verde de acento (links, botones, precios) | `#22c55e` (hover `#16a34a`) |
| Azul oscuro (títulos y menú del panel) | `#111827` |
| Barra superior, navbar y footer | `#212529` |
| Texto secundario | `#6b7280` |

Están definidos como variables CSS al inicio de `src/css/estilos.css` (`--stog-accent`, `--stog-dark`, `--stog-navbar`…).

## Cómo ejecutarlo

```bash
npm install
npm run dev                         # http://localhost:5173
npm run build                       # genera la carpeta dist/
npm run lint
npm install --save-dev puppeteer    # intalacion de puppeter para cualquier navegador
npm test                            # Karma + Jasmine
```



La app usa `HashRouter` (URLs como `/#/productos`) y rutas relativas (`base: './'`), así que la carpeta `dist/` funciona en cualquier hosting estático, incluido GitHub Pages.

## Cuentas de prueba

| Perfil | Correo | Contraseña |
|---|---|---|
| Administrador | `jperez@duoc.cl` | `admin123` |
| Vendedor | `erwin.aguileras@profesor.duoc.cl` | `vendedor123` |
| Cliente | `carlos.edut@gmail.com` | `cliente123` |

El administrador y el vendedor entran al panel en `/#/admin` (el vendedor no ve la sección *Usuarios*). Cualquier persona puede crear una cuenta de cliente desde **Registrar usuario**.

## Vistas

**Tienda:** Inicio (carrusel y destacados) · Productos (con buscador) · Detalle de juego · Categorías · Ofertas · Nosotros · Blogs y detalle de blog · Contacto · Iniciar sesión · Registro · Carrito · Checkout con dirección de entrega · Compra exitosa (con boleta) · Pago rechazado · 404.

**Panel de administración:** Dashboard · Órdenes y boleta · Productos (crear, editar, eliminar, críticos y reporte de inventario) · Categorías (CRUD) · Usuarios (CRUD e historial de compras) · Reportes de ventas · Perfil.

## Estructura de `src/`

| Carpeta | Contenido |
|---|---|
| `data/` | `db.js` (archivo de datos con CRUD, guarda en `localStorage`), `productos.js` (datos iniciales), `regiones.js`, `blogs.js` y `seccionesAdmin.js` |
| `context/` | `TiendaContext` (productos, categorías, usuarios, sesión y órdenes) y `CarritoContext`. Conectan `db.js` con React usando `useState` |
| `components/` | `layout/` (Header, Footer, Layout, Boton), `TarjetaProducto`, `ListaJuegos`, `DetalleCompra` y `admin/` (layout, menú lateral y `RutaAdmin`) |
| `pages/` | Una vista por archivo (tienda y `Admin*`) |
| `js/` | `validaciones.js` (reglas de los formularios) y `formato.js` (pesos, descuentos, rutas de imágenes) |
| `css/` | `estilos.css` (identidad visual de Stog y panel admin) |

## Pruebas (carpeta `tests/`)

145 pruebas con Jasmine + Karma + Testing Library:

| Archivo | Qué prueba |
|---|---|
| `Boton.spec.js` | Props y evento de clic |
| `Validaciones.spec.js` | Reglas de formularios (correo, contraseña, edad, RUN, dirección, producto), formato de precios y descuentos |
| `Db.spec.js` | CRUD de productos, categorías y usuarios; órdenes; carrito y sesión; persistencia |
| `Tienda.spec.js` | `TiendaContext` y `CarritoContext` |
| `Renderizado.spec.js` | Tarjetas y lista de productos en el DOM, y renderizado condicional |
| `EstadoEventos.spec.js` | Estado y eventos: escribir, agregar, quitar, cambiar cantidad y buscar |
| `Componentes.spec.js` | Header, Footer, Home con carrusel, Categorías, Ofertas, Contacto, Blogs y Detalle |
| `Flujos.spec.js` | Login, registro, checkout y compra con pago aprobado y rechazado |
| `Mocks.spec.js` | Mocks de azar, fecha, `localStorage`, `window.print` y funciones espía |
| `Admin.spec.js` | Acceso por perfil y todas las pantallas del panel |
| `ayudas.js` | No es una prueba: arma router + contextos y limpia `localStorage` antes de cada prueba |

`npm test` genera además el reporte de cobertura en `coverage/html/index.html`.

## Notas

- No hay backend: los datos viven en el `localStorage` del navegador. Las contraseñas están en texto plano **solo** porque es una simulación.
- La pasarela de pago es simulada: el checkout trae un selector para forzar «aprobado», «rechazado» o «aleatorio». El envío de la boleta por email también es simulado.
- Para reiniciar los datos, borra el `localStorage` del sitio (claves que empiezan con `stog`).
