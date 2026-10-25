import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useCarrito } from '../context/CarritoContext.jsx'
import { useTienda } from '../context/TiendaContext.jsx'
import { pesos } from '../js/formato.js'

const METODOS_PAGO = ['Tarjeta de crédito', 'Tarjeta de débito', 'WebPay', 'Transferencia']

function Checkout() {
  const { carrito, total, vaciarCarrito } = useCarrito()
  const { sesion, buscarProductoPorId, comprar } = useTienda()
  const navigate = useNavigate()
  const location = useLocation()
  const [validated, setValidated] = useState(false)
  const [errorStock, setErrorStock] = useState('')

  const [datos, setDatos] = useState(() => {
    // Si venimos de un pago rechazado, la pantalla de error devuelve lo que el usuario
    // había escrito (viaja en location.state). Tiene prioridad sobre los datos de la sesión.
    if (location.state && location.state.datos) {
      return location.state.datos
    }
    return {
      nombre: sesion ? sesion.nombre : '',
      apellidos: sesion ? sesion.apellidos : '',
      correo: sesion ? sesion.correo : '',
      telefono: '',
      metodoPago: 'Tarjeta de crédito',
      // La pasarela es simulada: este selector permite mostrar el pago aprobado o el rechazado
      simulacion: 'aprobado'
    }
  })

  // Un solo handler para todos los campos: usa el atributo "name" del input
  // para saber qué propiedad de "datos" actualizar (propiedad calculada [name]).
  function handleChange(e) {
    const { name, value } = e.target
    setDatos({ ...datos, [name]: value })
  }

  // Decide si el pago pasa. "aleatorio" aprueba 3 de cada 4 intentos.
  function pagoAprobado() {
    if (datos.simulacion === 'aprobado') return true
    if (datos.simulacion === 'rechazado') return false
    return Math.random() < 0.75
  }

  function handleSubmit(e) {
    e.preventDefault()
    setValidated(true)
    setErrorStock('')

    if (!e.currentTarget.checkValidity()) {
      return
    }

    // Revisa el stock otra vez: pudo cambiar desde que se agregó al carrito.
    // find devuelve el primer juego que ya no alcanza, o undefined si todos alcanzan.
    const sinStock = carrito.find((item) => {
      const producto = buscarProductoPorId(item.id)
      return producto === null || item.cantidad > producto.stock
    })
    if (sinStock) {
      setErrorStock('No hay stock suficiente de "' + sinStock.nombre + '". Ajusta la cantidad en el carrito.')
      return
    }

    if (!pagoAprobado()) {
      // El state viaja con la navegación sin quedar escrito en la URL.
      navigate('/pago-error', { state: { datos } })
      return
    }

    // Pago aprobado. comprar() (TiendaContext) crea la orden con una copia de lo comprado y
    // descuenta el stock; después se vacía el carrito y se muestra la compra exitosa.
    const orden = comprar({
      cliente: { nombre: datos.nombre, apellidos: datos.apellidos, correo: datos.correo, telefono: datos.telefono },
      metodoPago: datos.metodoPago,
      items: carrito.map((item) => ({ id: item.id, nombre: item.nombre, precio: item.precio, cantidad: item.cantidad })),
      total: total
    })
    vaciarCarrito()
    navigate('/pago-correcto/' + orden.numero)
  }

  // Los hooks siempre van ANTES de cualquier return, por eso este return anticipado va después.
  if (carrito.length === 0) {
    return (
      <section className="formulario">
        <h1>Checkout</h1>
        <p>Tu carrito está vacío, no hay nada que pagar.</p>
        <Link to="/productos" className="boton">Ver juegos</Link>
      </section>
    )
  }

  return (
    <>
      <section className="hero">
        <h1>Checkout</h1>
        <p className="mb-0">Revisa tu compra y completa tus datos para recibir tus juegos.</p>
      </section>

      <section className="formulario">
        <h2 className="mt-0">Resumen de tu compra</h2>
        <div className="tabla-scroll">
          <table className="tabla-stog">
            <thead>
              <tr>
                <th>Juego</th>
                <th>Cantidad</th>
                <th>Subtotal</th>
              </tr>
            </thead>
            <tbody>
              {carrito.map((item) => (
                <tr key={item.id}>
                  <td>{item.nombre}</td>
                  <td>{item.cantidad}</td>
                  <td>{pesos(item.precio * item.cantidad)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-3"><strong>Total: {pesos(total)}</strong></p>
      </section>

      <section className="formulario mt-3">
        {/* noValidate desactiva los mensajes nativos del navegador: los mostramos nosotros con Bootstrap */}
        <form noValidate onSubmit={handleSubmit} className={validated ? 'was-validated' : ''}>
          <h2 className="mt-0">Datos del cliente</h2>
          <p className="text-muted">Te enviaremos las claves de descarga a tu correo.</p>
          <div className="row g-3">
            <div className="col-md-6">
              <label htmlFor="nombre" className="form-label">Nombre</label>
              <input type="text" className="form-control" id="nombre" name="nombre"
                required maxLength="100" value={datos.nombre} onChange={handleChange} />
              <div className="invalid-feedback">Ingresa tu nombre.</div>
            </div>

            <div className="col-md-6">
              <label htmlFor="apellidos" className="form-label">Apellidos</label>
              <input type="text" className="form-control" id="apellidos" name="apellidos"
                required maxLength="100" value={datos.apellidos} onChange={handleChange} />
              <div className="invalid-feedback">Ingresa tus apellidos.</div>
            </div>

            <div className="col-md-6">
              <label htmlFor="correo" className="form-label">Correo electrónico</label>
              <input type="email" className="form-control" id="correo" name="correo"
                required maxLength="100" value={datos.correo} onChange={handleChange} />
              <div className="invalid-feedback">Ingresa un correo válido.</div>
            </div>

            <div className="col-md-6">
              <label htmlFor="telefono" className="form-label">Teléfono (opcional)</label>
              <input type="tel" className="form-control" id="telefono" name="telefono"
                maxLength="15" value={datos.telefono} onChange={handleChange} />
            </div>
          </div>

          <h2>Pago</h2>
          <div className="row g-3">
            <div className="col-md-6">
              <label htmlFor="metodoPago" className="form-label">Método de pago</label>
              <select className="form-select" id="metodoPago" name="metodoPago"
                required value={datos.metodoPago} onChange={handleChange}>
                {METODOS_PAGO.map((m) => <option key={m} value={m}>{m}</option>)}
              </select>
            </div>

            <div className="col-md-6">
              <label htmlFor="simulacion" className="form-label">Resultado de la pasarela (simulación)</label>
              <select className="form-select" id="simulacion" name="simulacion"
                value={datos.simulacion} onChange={handleChange}>
                <option value="aprobado">Pago aprobado</option>
                <option value="rechazado">Pago rechazado</option>
                <option value="aleatorio">Aleatorio</option>
              </select>
            </div>
          </div>

          {errorStock && <p className="error">{errorStock}</p>}
          <button className="btn btn-success mt-4" type="submit">Pagar {pesos(total)}</button>
          <Link to="/carrito" className="btn btn-outline-secondary mt-4 ms-2">Volver al carrito</Link>
        </form>
      </section>
    </>
  )
}

export default Checkout
