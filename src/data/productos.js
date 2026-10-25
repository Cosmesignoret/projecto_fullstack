// Datos iniciales de Stog (tienda de videojuegos).
// Son la "semilla": db.js los copia a localStorage la primera vez que se abre la tienda y
// desde ahí se modifican con el CRUD (por ejemplo, el stock baja al comprar).
// stockCritico = si el stock llega a ese número o menos, el admin lo ve como producto crítico.
export const productos = [
  {
    id: 1,
    codigo: "PRD-001",
    nombre: "GTA VI",
    descripcion: "Videojuego en línea y de mundo abierto. Explora una ciudad viva, completa misiones y vive historias junto a otros jugadores en tiempo real.",
    precio: 89990,
    stock: 25,
    stockCritico: 5,
    categoria: "Mundo Abierto",
    imagen: "/img/gta.webp",
    enOferta: true,
    precioOferta: 71990
  },
  {
    id: 2,
    codigo: "PRD-002",
    nombre: "Doom",
    descripcion: "Juego donde matas demonios. Acción rápida en primera persona con combates intensos y niveles llenos de adrenalina.",
    precio: 19990,
    stock: 40,
    stockCritico: 8,
    categoria: "Acción",
    imagen: "/img/doom.webp",
    enOferta: true,
    precioOferta: 13990
  },
  {
    id: 3,
    codigo: "PRD-003",
    nombre: "Gamble Whit Your Friends",
    descripcion: "Videojuego de casino donde apuestas con amigos. Ideal para partidas casuales y competir por las mejores rachas.",
    precio: 4990,
    stock: 100,
    stockCritico: 10,
    categoria: "Casino",
    imagen: "/img/gwf.jpg",
    enOferta: true,
    precioOferta: 4240
  },
  {
    id: 4,
    codigo: "PRD-004",
    nombre: "Detroit: Become Human",
    descripcion: "Juego donde tus decisiones cambian el destino de la trama. Una experiencia narrativa con múltiples finales.",
    precio: 29990,
    stock: 4,
    stockCritico: 5,
    categoria: "Aventura",
    imagen: "/img/bh.jpg",
    enOferta: true,
    precioOferta: 22490
  }
];

export const categorias = [
  { id: 1, nombre: "Acción", descripcion: "Shooters y juegos de combate rápido." },
  { id: 2, nombre: "Mundo Abierto", descripcion: "Ciudades y mapas enormes para explorar libremente." },
  { id: 3, nombre: "Aventura", descripcion: "Historias narrativas donde tus decisiones importan." },
  { id: 4, nombre: "Casino", descripcion: "Juegos de apuestas y partidas para compartir con amigos." }
];

// Usuarios de prueba para iniciar sesión (los que se registran después se agregan a esta lista)
export const usuarios = [
  { id: 1, nombre: "Carlos Eduardo", apellidos: "Torres", correo: "carlos.edut@gmail.com", contrasena: "cliente123", edad: 28, rol: "cliente" },
  { id: 2, nombre: "Juan", apellidos: "Perez Gonzalez", correo: "jperez@duoc.cl", contrasena: "juan123", edad: 31, rol: "cliente" },
  { id: 3, nombre: "Admin", apellidos: "Stog", correo: "admin@stog.cl", contrasena: "admin123", edad: 30, rol: "administrador" }
];
