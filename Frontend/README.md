# Stog — aplicación React

Esta es la versión React de la tienda. Las páginas HTML originales siguen conservadas en la carpeta principal del proyecto.

## Iniciar la aplicación

Abre una terminal en esta carpeta y ejecuta:

```bash
npm install
npm start
```

La aplicación se abrirá en `http://localhost:3000`.

## Estructura principal

- `src/App.js`: componentes de la tienda, navegación, formularios y estado del carrito.
- `src/App.css`: estilos propios y ajustes para pantallas pequeñas.
- `public/imagenes/`: imágenes que usa el catálogo React.
- `public/index.html`: documento base con Bootstrap y el punto donde React muestra la aplicación.

La navegación usa rutas con `#`, por ejemplo `#/productos` y `#/producto/gta`. El carrito guarda sus productos en el navegador.

## Scripts disponibles

- `npm start`: inicia el servidor local de desarrollo.
- `npm run build`: crea una versión lista para publicar.
- `npm test`: ejecuta las pruebas Jasmine en Chrome Headless con Karma.
- `npm run test:watch`: mantiene Karma activo para desarrollar pruebas.

Las pruebas de la tienda están en `src/App.test.js`. La configuración de Karma está en `karma.conf.js`. Para ejecutarlas necesitas Google Chrome instalado. Después de agregar dependencias o cambiar su configuración, ejecuta `npm install` para actualizar `package-lock.json`.
