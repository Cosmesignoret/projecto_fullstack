// Pruebas de flujos completos de la tienda: login, registro, checkout y compra.
// Cada prueba simula lo que haría una persona (escribir, hacer clic) y revisa el resultado.
import { fireEvent, cleanup, screen } from '@testing-library/react'
import { Routes, Route } from 'react-router-dom'
import Login from '../src/pages/Login.jsx'
import Registro from '../src/pages/Registro.jsx'
import Checkout from '../src/pages/Checkout.jsx'
import PagoCorrecto from '../src/pages/PagoCorrecto.jsx'
import PagoError from '../src/pages/PagoError.jsx'
import Header from '../src/components/layout/Header.jsx'
import { renderTienda, JUEGOS, ADMIN, CLIENTE } from './ayudas.js'

// Escribe en un campo buscándolo por su etiqueta
function escribir(etiqueta, valor) {
  fireEvent.change(screen.getByLabelText(etiqueta), { target: { value: valor } })
}

// Pantallas de la compra: checkout y sus dos resultados posibles
const rutasCompra = (
  <Routes>
    <Route path="/checkout" element={<Checkout />} />
    <Route path="/pago-correcto/:numero" element={<PagoCorrecto />} />
    <Route path="/pago-error" element={<PagoError />} />
  </Routes>
)

function llenarDatosCliente() {
  escribir('Nombre', 'Ana')
  escribir('Apellidos', 'Compradora')
  escribir('Correo electrónico', 'ana.compradora@gmail.com')
  escribir('Calle', 'Av. Test 123')
  escribir('Comuna', 'Santiago')
}

describe('Flujos completos', () => {
  afterEach(() => {
    cleanup()
  })

  it('Login: un cliente con credenciales correctas inicia sesión y vuelve al inicio', () => {
    // El Header se dibuja junto al login para comprobar que cambia al iniciar sesión
    renderTienda(
      <>
        <Header />
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<div>Inicio de prueba</div>} />
        </Routes>
      </>,
      { ruta: '/login' }
    )

    escribir('Correo', CLIENTE.correo)
    escribir('Contraseña', CLIENTE.contrasena)
    fireEvent.click(screen.getByRole('button', { name: 'Iniciar sesión' }))

    expect(screen.getByText('Inicio de prueba')).toBeTruthy()
    expect(screen.getByText('Hola, ' + CLIENTE.nombre)).toBeTruthy()
    expect(screen.queryByText('Panel admin')).toBeNull()
  })

  it('Login: el administrador entra directo al panel', () => {
    renderTienda(
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/admin" element={<div>Panel de prueba</div>} />
      </Routes>,
      { ruta: '/login' }
    )

    escribir('Correo', ADMIN.correo)
    escribir('Contraseña', ADMIN.contrasena)
    fireEvent.click(screen.getByRole('button', { name: 'Iniciar sesión' }))

    expect(screen.getByText('Panel de prueba')).toBeTruthy()
  })

  it('Login: con contraseña incorrecta muestra el error y no inicia sesión', () => {
    renderTienda(<><Header /><Login /></>)

    escribir('Correo', CLIENTE.correo)
    escribir('Contraseña', 'incorrecta1')
    fireEvent.click(screen.getByRole('button', { name: 'Iniciar sesión' }))

    expect(screen.getByRole('alert').textContent).toMatch(/incorrectos/i)
    expect(screen.queryByText(/^Hola,/)).toBeNull()
  })

  it('Registro: valida los campos y luego crea la cuenta', () => {
    renderTienda(<Registro />)

    // Con el formulario vacío aparecen errores y no se crea la cuenta
    fireEvent.click(screen.getByRole('button', { name: 'Registrar cliente' }))
    expect(screen.getByText('El nombre es obligatorio.')).toBeTruthy()
    expect(screen.queryByText(/Cuenta creada/i)).toBeNull()

    escribir('Nombre', 'Prueba')
    escribir('Apellido', 'Registro')
    escribir('Correo electrónico', 'Registro.Prueba@gmail.com')
    escribir('Edad', '25')
    escribir('Contraseña', 'clave123')
    escribir('Repetir contraseña', 'clave123')
    fireEvent.click(screen.getByLabelText('Acepto los términos y condiciones'))
    fireEvent.click(screen.getByRole('button', { name: 'Registrar cliente' }))

    expect(screen.getByText(/Cuenta creada/i)).toBeTruthy()
    // Quedó guardada: persiste en localStorage
    expect(localStorage.getItem('stogUsuarios')).toContain('registro.prueba@gmail.com')
  })

  it('Registro: rechaza contraseñas distintas y correos ya registrados', () => {
    renderTienda(<Registro />)

    escribir('Correo electrónico', CLIENTE.correo)
    escribir('Contraseña', 'clave123')
    escribir('Repetir contraseña', 'otra1234')
    fireEvent.click(screen.getByRole('button', { name: 'Registrar cliente' }))

    expect(screen.getByText('Ya existe una cuenta con ese correo.')).toBeTruthy()
    expect(screen.getByText('Las contraseñas no coinciden.')).toBeTruthy()
  })

  it('Checkout: si hay sesión, los datos y la dirección se completan automáticamente', () => {
    renderTienda(rutasCompra, { ruta: '/checkout', carrito: [[JUEGOS[0], 1]], sesion: CLIENTE })

    expect(screen.getByLabelText('Nombre').value).toBe(CLIENTE.nombre)
    expect(screen.getByLabelText('Correo electrónico').value).toBe(CLIENTE.correo)
    expect(screen.getByLabelText('Calle').value).toBe(CLIENTE.calle)
    expect(screen.getByLabelText('Comuna').value).toBe(CLIENTE.comuna)
  })

  it('Checkout: al cambiar de región, la comuna elegida se borra', () => {
    renderTienda(rutasCompra, { ruta: '/checkout', carrito: [[JUEGOS[0], 1]] })
    escribir('Comuna', 'Santiago')
    expect(screen.getByLabelText('Comuna').value).toBe('Santiago')

    escribir('Región', 'Región de Valparaíso')

    expect(screen.getByLabelText('Comuna').value).toBe('')
    expect(screen.getByRole('option', { name: 'Viña del Mar' })).toBeTruthy()
  })

  it('Checkout: con el formulario incompleto no se paga', () => {
    renderTienda(rutasCompra, { ruta: '/checkout', carrito: [[JUEGOS[0], 1]] })

    fireEvent.click(screen.getByRole('button', { name: /^Pagar/ }))

    expect(screen.queryByText('¡Compra exitosa!')).toBeNull()
    expect(localStorage.getItem('stogOrdenes')).toBe('[]')
  })

  it('Compra: el pago aprobado muestra la compra exitosa con la orden, la dirección y los botones de boleta', () => {
    renderTienda(rutasCompra, { ruta: '/checkout', carrito: [[JUEGOS[0], 2]] })

    llenarDatosCliente()
    fireEvent.click(screen.getByRole('button', { name: /^Pagar/ }))

    expect(screen.getByText('¡Compra exitosa!')).toBeTruthy()
    expect(screen.getByText('ST-ORD-1001')).toBeTruthy()
    expect(screen.getByText(JUEGOS[0].nombre)).toBeTruthy()
    expect(screen.getByLabelText('Calle de entrega').value).toBe('Av. Test 123')
    expect(screen.getByRole('button', { name: 'Imprimir boleta en PDF' })).toBeTruthy()

    fireEvent.click(screen.getByRole('button', { name: 'Enviar boleta por email' }))
    expect(screen.getByText(/Boleta enviada a ana.compradora@gmail.com/)).toBeTruthy()
  })

  it('Compra: el pago aprobado vacía el carrito y descuenta el stock', () => {
    renderTienda(rutasCompra, { ruta: '/checkout', carrito: [[JUEGOS[0], 2]] })

    llenarDatosCliente()
    fireEvent.click(screen.getByRole('button', { name: /^Pagar/ }))

    expect(JSON.parse(localStorage.getItem('stogCarrito'))).toEqual([])
    const guardados = JSON.parse(localStorage.getItem('stogProductos'))
    expect(guardados.find((p) => p.id === JUEGOS[0].id).stock).toBe(JUEGOS[0].stock - 2)
  })

  it('Compra: el pago rechazado muestra el detalle de la compra y permite reintentar sin perder los datos', () => {
    renderTienda(rutasCompra, { ruta: '/checkout', carrito: [[JUEGOS[0], 1]] })

    llenarDatosCliente()
    escribir('Resultado de la pasarela (simulación)', 'rechazado')
    fireEvent.click(screen.getByRole('button', { name: /^Pagar/ }))

    expect(screen.getByText('No se pudo realizar el pago')).toBeTruthy()
    expect(screen.getByText(JUEGOS[0].nombre)).toBeTruthy() // el detalle sigue visible
    expect(localStorage.getItem('stogOrdenes')).toBe('[]') // no se creó ninguna orden

    fireEvent.click(screen.getByRole('link', { name: 'Volver a realizar el pago' }))

    // Volvió al checkout con lo que ya se había escrito
    expect(screen.getByLabelText('Nombre').value).toBe('Ana')
    expect(screen.getByLabelText('Calle').value).toBe('Av. Test 123')
  })
})
