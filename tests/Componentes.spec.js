// Pruebas de componentes y páginas: cada una renderiza el componente, simula lo que haría
// una persona (escribir, hacer clic) y comprueba lo que aparece en el DOM.
import { fireEvent, cleanup, screen } from '@testing-library/react'
import { Routes, Route } from 'react-router-dom'
import Header from '../src/components/layout/Header.jsx'
import Footer from '../src/components/layout/Footer.jsx'
import Home from '../src/pages/Home.jsx'
import Categorias from '../src/pages/Categorias.jsx'
import Ofertas from '../src/pages/Ofertas.jsx'
import Contacto from '../src/pages/Contacto.jsx'
import Blogs from '../src/pages/Blogs.jsx'
import DetalleProducto from '../src/pages/DetalleProducto.jsx'
import Productos from '../src/pages/Productos.jsx'
import BlogDetalle from '../src/pages/BlogDetalle.jsx'
import { renderTienda, JUEGOS, CLIENTE, ADMIN } from './ayudas.js'

describe('Componentes y páginas', () => {
  afterEach(() => {
    cleanup()
  })

  it('Header: sin sesión muestra "Iniciar sesión" y "Registrar usuario"', () => {
    renderTienda(<Header />)

    expect(screen.getByText('Iniciar sesión')).toBeTruthy()
    expect(screen.getByText('Registrar usuario')).toBeTruthy()
    expect(screen.queryByText('Cerrar sesión')).toBeNull()
  })

  it('Header: con sesión saluda por el nombre y permite cerrar sesión', () => {
    renderTienda(<Header />, { sesion: CLIENTE })

    expect(screen.getByText('Hola, ' + CLIENTE.nombre)).toBeTruthy()

    fireEvent.click(screen.getByText('Cerrar sesión'))
    expect(screen.getByText('Iniciar sesión')).toBeTruthy()
  })

  it('Header: el contador del carrito refleja los juegos agregados', () => {
    renderTienda(<Header />, { carrito: [[JUEGOS[0], 2]] })

    expect(screen.getByText(/Carrito \(2\)/)).toBeTruthy()
  })

  it('Footer: el boletín rechaza un correo inválido y acepta uno correcto', () => {
    renderTienda(<Footer />)
    const campo = screen.getByLabelText('Correo para el boletín')
    const boton = screen.getByRole('button', { name: 'Suscribirse' })

    fireEvent.change(campo, { target: { value: 'correo-malo' } })
    fireEvent.click(boton)
    expect(screen.getByText(/correo válido/i)).toBeTruthy()

    fireEvent.change(campo, { target: { value: 'ana@gmail.com' } })
    fireEvent.click(boton)
    expect(screen.getByText(/te suscribiste/i)).toBeTruthy()
  })

  it('Header: muestra el enlace al panel solo a administradores y vendedores', () => {
    renderTienda(<Header />, { sesion: ADMIN })
    expect(screen.getByText('Panel admin')).toBeTruthy()
  })

  it('Header: el buscador lleva a Productos con el texto buscado', () => {
    renderTienda(
      <>
        <Header />
        <Routes><Route path="/productos" element={<Productos />} /></Routes>
      </>,
      { ruta: '/productos' }
    )

    fireEvent.change(screen.getByLabelText('Buscar juego'), { target: { value: 'Doom' } })
    fireEvent.click(screen.getByRole('button', { name: 'Buscar' }))

    expect(screen.getByPlaceholderText('Buscar producto...').value).toBe('Doom')
    expect(screen.getAllByRole('heading', { level: 5 }).length).toBe(1)
  })

  it('Home: muestra el título, el carrusel y los 4 juegos destacados', () => {
    renderTienda(<Home />)

    expect(screen.getByText('Tienda online')).toBeTruthy()
    expect(screen.getByText('Nuevos lanzamientos')).toBeTruthy() // primera diapositiva del carrusel
    expect(screen.getAllByRole('heading', { level: 5 }).length).toBe(4)
  })

  it('Categorías: al elegir una categoría solo se ven sus juegos', () => {
    renderTienda(<Categorias />)
    const todos = screen.getAllByRole('heading', { level: 5 }).length

    fireEvent.click(screen.getByRole('button', { name: 'Casino' }))

    const filtrados = screen.getAllByRole('heading', { level: 5 }).length
    expect(filtrados).toBeLessThan(todos)
    expect(screen.getByText('Gamble Whit Your Friends')).toBeTruthy()
  })

  it('Ofertas: muestra un juego por cada producto en oferta', () => {
    renderTienda(<Ofertas />)

    expect(screen.getAllByRole('heading', { level: 5 }).length).toBe(JUEGOS.filter((p) => p.enOferta).length)
  })

  it('Contacto: valida los campos y confirma el envío cuando están completos', () => {
    renderTienda(<Contacto />)

    fireEvent.click(screen.getByRole('button', { name: 'Enviar' }))
    expect(screen.getByText('El nombre es obligatorio.')).toBeTruthy()
    expect(screen.getByText('El mensaje es obligatorio.')).toBeTruthy()

    fireEvent.change(screen.getByLabelText('Nombre'), { target: { value: 'Ana' } })
    fireEvent.change(screen.getByLabelText('Correo electrónico'), { target: { value: 'ana@gmail.com' } })
    fireEvent.change(screen.getByLabelText('Mensaje'), { target: { value: 'Hola' } })
    fireEvent.click(screen.getByRole('button', { name: 'Enviar' }))

    expect(screen.getByText(/Mensaje enviado/i)).toBeTruthy()
  })

  it('Blogs: muestra los dos artículos con su enlace al detalle', () => {
    renderTienda(<Blogs />)

    expect(screen.getByText('Caso curioso #1: el origen de Doom')).toBeTruthy()
    expect(screen.getByText('Caso curioso #2: la saga GTA')).toBeTruthy()
    expect(screen.getAllByRole('link', { name: 'Leer artículo' }).length).toBe(2)
  })

  it('BlogDetalle: muestra el artículo elegido y agradece la respuesta de utilidad', () => {
    renderTienda(
      <Routes><Route path="/blogs/:id" element={<BlogDetalle />} /></Routes>,
      { ruta: '/blogs/caso2' }
    )

    expect(screen.getByRole('heading', { name: 'Caso curioso #2: la saga GTA' })).toBeTruthy()
    fireEvent.click(screen.getByRole('button', { name: 'Sí' }))
    expect(screen.getByText('¡Gracias por tu respuesta!')).toBeTruthy()
  })

  it('BlogDetalle: un artículo inexistente muestra "Artículo no encontrado"', () => {
    renderTienda(
      <Routes><Route path="/blogs/:id" element={<BlogDetalle />} /></Routes>,
      { ruta: '/blogs/no-existe' }
    )

    expect(screen.getByText('Artículo no encontrado')).toBeTruthy()
  })

  it('DetalleProducto: valida la cantidad y agrega el juego al carrito', () => {
    renderTienda(
      <Routes><Route path="/productos/:id" element={<DetalleProducto />} /></Routes>,
      { ruta: '/productos/' + JUEGOS[0].id }
    )

    // Cantidad 0 → error
    fireEvent.change(screen.getByLabelText('Cantidad'), { target: { value: '0' } })
    fireEvent.click(screen.getByRole('button', { name: 'Añadir al carrito' }))
    expect(screen.getByText(/cantidad debe ser/i)).toBeTruthy()

    // Cantidad válida → mensaje de éxito
    fireEvent.change(screen.getByLabelText('Cantidad'), { target: { value: '2' } })
    fireEvent.click(screen.getByRole('button', { name: 'Añadir al carrito' }))
    expect(screen.getByText(/Se agregó/i)).toBeTruthy()
  })

  it('DetalleProducto: un id inexistente muestra "Producto no encontrado"', () => {
    renderTienda(
      <Routes><Route path="/productos/:id" element={<DetalleProducto />} /></Routes>,
      { ruta: '/productos/9999' }
    )

    expect(screen.getByText('Producto no encontrado')).toBeTruthy()
  })
})
