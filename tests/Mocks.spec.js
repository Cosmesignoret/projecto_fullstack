// Pruebas con MOCKS: se reemplazan partes del entorno (azar, fecha, localStorage, ventanas del
// navegador, funciones) por versiones controladas, para que el resultado de la prueba sea siempre el mismo.
//   - spyOn(objeto, 'metodo')      : espía un método real y puede cambiar lo que devuelve.
//   - jasmine.createSpy('nombre')  : crea una función falsa que registra cómo la llamaron.
//   - jasmine.clock().mockDate()   : congela la fecha del sistema.
import { fireEvent, cleanup, screen, act, render } from '@testing-library/react'
import { Routes, Route } from 'react-router-dom'
import { TiendaProvider, useTienda } from '../src/context/TiendaContext.jsx'
import Checkout from '../src/pages/Checkout.jsx'
import PagoCorrecto from '../src/pages/PagoCorrecto.jsx'
import PagoError from '../src/pages/PagoError.jsx'
import TarjetaProducto from '../src/components/TarjetaProducto.jsx'
import Contacto from '../src/pages/Contacto.jsx'
import { agregarProducto, listarProductos } from '../src/data/db.js'
import { renderTienda, IMAGEN_PRUEBA, JUEGOS } from './ayudas.js'

function pantallaCheckout() {
  return renderTienda(
    <Routes>
      <Route path="/checkout" element={<Checkout />} />
      <Route path="/pago-correcto/:numero" element={<PagoCorrecto />} />
      <Route path="/pago-error" element={<PagoError />} />
    </Routes>,
    { ruta: '/checkout', carrito: [[JUEGOS[0], 1]] }
  )
}

function llenarYPagar(simulacion) {
  fireEvent.change(screen.getByLabelText('Nombre'), { target: { value: 'Ana' } })
  fireEvent.change(screen.getByLabelText('Apellidos'), { target: { value: 'Prueba' } })
  fireEvent.change(screen.getByLabelText('Correo electrónico'), { target: { value: 'ana@gmail.com' } })
  fireEvent.change(screen.getByLabelText('Calle'), { target: { value: 'Av. Test 123' } })
  fireEvent.change(screen.getByLabelText('Comuna'), { target: { value: 'Santiago' } })
  fireEvent.change(screen.getByLabelText('Resultado de la pasarela (simulación)'), { target: { value: simulacion } })
  fireEvent.click(screen.getByRole('button', { name: /^Pagar/ }))
}

describe('Pruebas con mocks', () => {
  afterEach(() => {
    cleanup()
    jasmine.clock().uninstall()
  })

  it('Mock de Math.random: con valor alto la pasarela "aleatoria" rechaza el pago', () => {
    // Se fuerza el "azar": 0.9 es mayor a 0.75, así que el pago NO se aprueba
    spyOn(Math, 'random').and.returnValue(0.9)
    pantallaCheckout()

    llenarYPagar('aleatorio')

    expect(Math.random).toHaveBeenCalled()
    expect(screen.getByText('No se pudo realizar el pago')).toBeTruthy()
  })

  it('Mock de Math.random: con valor bajo la pasarela "aleatoria" aprueba el pago', () => {
    spyOn(Math, 'random').and.returnValue(0.1)
    pantallaCheckout()

    llenarYPagar('aleatorio')

    expect(screen.getByText('¡Compra exitosa!')).toBeTruthy()
  })

  it('Mock de Math.random: el modo "aprobado" aprueba aunque el azar sea desfavorable', () => {
    spyOn(Math, 'random').and.returnValue(0.99)
    pantallaCheckout()

    llenarYPagar('aprobado')

    expect(screen.getByText('¡Compra exitosa!')).toBeTruthy()
  })

  it('Mock de la fecha: la orden guarda la fecha congelada', () => {
    jasmine.clock().install()
    jasmine.clock().mockDate(new Date('2026-05-20T12:00:00.000Z'))
    const sonda = { actual: null }
    function Sonda() {
      sonda.actual = useTienda()
      return null
    }
    render(<TiendaProvider><Sonda /></TiendaProvider>)

    let orden
    act(() => {
      orden = sonda.actual.comprar({
        cliente: { nombre: 'Ana', apellidos: 'Prueba', correo: 'ana@gmail.com' },
        direccion: { calle: 'Calle 1', departamento: '', region: 'Región Metropolitana de Santiago', comuna: 'Santiago', indicaciones: '' },
        items: [{ id: JUEGOS[0].id, nombre: JUEGOS[0].nombre, precio: JUEGOS[0].precio, cantidad: 1 }],
        total: JUEGOS[0].precio
      })
    })

    expect(new Date(orden.fecha).toISOString()).toBe('2026-05-20T12:00:00.000Z')
  })

  it('Mock de localStorage: guardar un producto escribe la clave "stogProductos"', () => {
    // callThrough: el espía registra la llamada pero deja que se ejecute de verdad
    const espia = spyOn(Storage.prototype, 'setItem').and.callThrough()

    agregarProducto({ ...JUEGOS[0], codigo: 'PRD-777', nombre: 'Espiado' })

    expect(espia).toHaveBeenCalledWith('stogProductos', jasmine.any(String))
    expect(listarProductos().some((p) => p.nombre === 'Espiado')).toBeTrue()
  })

  it('Mock de localStorage: si no hay nada guardado, la tienda arranca con los datos iniciales', () => {
    // Se simula un navegador "vacío": getItem siempre devuelve null
    spyOn(Storage.prototype, 'getItem').and.returnValue(null)

    expect(listarProductos().length).toBe(JUEGOS.length)
  })

  it('Mock de window.print: el botón "Imprimir boleta en PDF" abre la impresión', () => {
    spyOn(Math, 'random').and.returnValue(0.1)
    spyOn(window, 'print') // evita que se abra el cuadro de impresión de verdad
    pantallaCheckout()
    llenarYPagar('aprobado')

    fireEvent.click(screen.getByRole('button', { name: 'Imprimir boleta en PDF' }))

    expect(window.print).toHaveBeenCalledTimes(1)
  })

  it('Mock de función (callback): el botón de la tarjeta llama a onAgregarCarrito una vez por clic', () => {
    const agregar = jasmine.createSpy('onAgregarCarrito')
    renderTienda(
      <TarjetaProducto nombre="Juego espía" precio={1000} stock={5} imagen={IMAGEN_PRUEBA}
        descripcion="Descripción" onAgregarCarrito={agregar} />
    )

    const boton = screen.getByRole('button', { name: 'Añadir al carrito' })
    fireEvent.click(boton)
    fireEvent.click(boton)

    expect(agregar).toHaveBeenCalledTimes(2)
  })

  it('Mock de función: el callback no se ejecuta si el juego no tiene stock', () => {
    const agregar = jasmine.createSpy('onAgregarCarrito')
    renderTienda(
      <TarjetaProducto nombre="Juego agotado" precio={1000} stock={0} imagen={IMAGEN_PRUEBA}
        descripcion="Descripción" onAgregarCarrito={agregar} />
    )

    fireEvent.click(screen.getByRole('button', { name: 'No disponible' }))

    expect(agregar).not.toHaveBeenCalled()
  })

  it('Mock de función: el envío del formulario de contacto se puede espiar y valida los campos', () => {
    renderTienda(<Contacto />)
    const formulario = screen.getByRole('button', { name: 'Enviar' }).closest('form')
    // Espía de un escuchador de "submit": confirma que el evento ocurre una vez
    const alEnviar = jasmine.createSpy('alEnviar')
    formulario.addEventListener('submit', alEnviar)

    fireEvent.submit(formulario)

    expect(alEnviar).toHaveBeenCalledTimes(1)
    // Como el formulario está vacío, no se confirma el envío
    expect(screen.queryByText(/Mensaje enviado/i)).toBeNull()
  })
})
