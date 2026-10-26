// Artículos del blog. Para sumar uno nuevo basta con agregar un objeto a este arreglo:
// la lista (/blogs) y el detalle (/blogs/:id) se arman solos a partir de estos datos.
export const articulos = [
  {
    id: 'caso1',
    titulo: 'Caso curioso #1: el origen de Doom',
    imagen: '/img/doom.webp',
    resumen: 'Doom, lanzado en 1993, definió el género shooter en primera persona y popularizó el juego en red.',
    parrafos: [
      'Doom fue lanzado en 1993 por id Software y es considerado uno de los juegos más influyentes en la historia de los videojuegos. Popularizó el género shooter en primera persona y fue pionero en el juego multijugador en red, permitiendo que varios jugadores se enfrentaran entre sí a través de una conexión local.',
      'El juego causó tanto impacto que muchas universidades y empresas tuvieron que restringir su instalación en los computadores de sus redes, ya que consumía gran parte del ancho de banda disponible en la época.'
    ]
  },
  {
    id: 'caso2',
    titulo: 'Caso curioso #2: la saga GTA',
    imagen: '/img/gta.webp',
    resumen: 'La saga GTA ha vendido más de 405 millones de copias, una de las franquicias más exitosas de la historia.',
    parrafos: [
      'La saga Grand Theft Auto (GTA), desarrollada por Rockstar Games, ha vendido más de 405 millones de copias en total, convirtiéndola en una de las franquicias de videojuegos más exitosas de la historia. GTA VI es una de las entregas más esperadas por la comunidad gamer, con un mundo abierto detallado y una historia ambiciosa.',
      'Desde su primera entrega en 1997, la saga ha evolucionado desde una vista cenital en 2D hasta mundos tridimensionales completamente abiertos, marcando tendencia en el género de mundo abierto.'
    ]
  }
]
