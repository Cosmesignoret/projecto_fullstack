// Datos iniciales de Stog (tienda de videojuegos).
// Son los valores con los que arranca la tienda: TiendaContext los copia a su estado (useState)
// y desde ahí se modifican (por ejemplo, el stock baja al comprar).
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
    stockCritico: 20,
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
    stockCritico: 6,
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

// Usuarios de prueba (los que se registran después se agregan a esta lista).
// rol: "administrador" | "vendedor" | "cliente"
// Cada usuario guarda también su dirección de entrega: el checkout la usa para rellenar el formulario.
export const usuarios = [
  {
    id: 1, run: "190110222", nombre: "Juan", apellidos: "Perez Gonzalez", correo: "jperez@duoc.cl",
    contrasena: "admin123", rol: "administrador",
    calle: "Av. Principal 123", departamento: "", region: "Región Metropolitana de Santiago", comuna: "Santiago"
  },
  {
    id: 2, run: "18456789K", nombre: "Erwin", apellidos: "Aguilera Segura", correo: "erwin.aguileras@profesor.duoc.cl",
    contrasena: "vendedor123", rol: "vendedor",
    calle: "Av. España 456", departamento: "", region: "Región Metropolitana de Santiago", comuna: "Providencia"
  },
  {
    id: 3, run: "201234565", nombre: "Carlos Eduardo", apellidos: "Torres", correo: "carlos.edut@gmail.com",
    contrasena: "cliente123", rol: "cliente",
    calle: "Calle Los Olmos 789", departamento: "603", region: "Región Metropolitana de Santiago", comuna: "Ñuñoa"
  }
];
