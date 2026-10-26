import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useCarrito } from '../context/CarritoContext.jsx'
import { useTienda } from '../context/TiendaContext.jsx'
import { regiones, comunasDe } from '../data/regiones.js'
import { pesos, urlImagen } from '../js/formato.js'

// Datos con los que arranca el formulario. Si hay sesión, se rellenan solos con los datos
// del usuario (nombre, correo y dirección guardada).
function datosIniciales(sesion, usuarios) {
  const usuario = sesion ? usuarios.find((u) => u.id === sesion.id) : null
  return {
    nombre: sesion ? sesion.nombre : '',
    apellidos: sesion ? sesion.apellidos : '',
    correo: sesion ? sesion.correo : '',
    calle: usuario ? usuario.calle || '' : '',
    departamento: usuario ? usuario.departamento || '' : '',
    region: usuario ? usuario.region || regiones[0].nombre : regiones[0].nombre,
    comuna: usuario ? usuario.comuna || '' : '',
    indicaciones: '',
    // La pasarela es simulada: este selector permite mostrar el pago aprobado o el rechazado
    simulacion: 'aprobado'
  }
}

function Checkout() {
  const { carrito, total, vaciarCarrito } = useCarrito()
  const { sesion, usuarios, buscarProductoPorId, comprar } = useTienda()
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
    return datosIniciales(sesion, usuarios)
  })

  // Un solo handler para todos los campos: usa el atributo "name" del input
  // para saber qué propiedad de "datos" actualizar (propiedad calculada [name]).
  function handleChange(e) {
    const { name, value } = e.target
    setDatos({ ...datos, [name]: value })
  }

  // Al cambiar de región, la comuna elegida deja de valer: se borra
  function handleRegion(e) {
    setDatos({ ...datos, region: e.target.value, comuna: '' })
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
      cliente: { nombre: datos.nombre, apellidos: datos.apellidos, correo: datos.correo },
      direccion: {
        calle: datos.calle,
        departamento: datos.departamento,
        region: datos.region,
        comuna: datos.comuna,
        indicaciones: datos.indicaciones
      },
      items: carrito.map((item) => ({
        id: item.id, nombre: item.nombre, precio: item.precio, cantidad: item.cantidad, imagen: item.imagen
      })),
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
        <h1>Carrito de compra</h1>
        <p className="mb-0">Completa la siguiente información para recibir tus juegos.</p>
      </section>

      <section className="formulario">
        <div className="d-flex flex-wrap justify-content-between align-items-center gap-2">
          <h2 className="mt-0">Resumen de tu compra</h2>
          <span className="badge fs-6" style={{ background: 'var(--stog-accent-dark)' }}>Total a pagar: {pesos(total)}</span>
        </div>
        <div className="tabla-scroll">
          <table className="tabla-stog">
            <thead>
              <tr><th>Imagen</th><th>Nombre</th><th>Precio</th><th>Cantidad</th><th>Subtotal</th></tr>
            </thead>
            <tbody>
              {carrito.map((item) => (
                <tr key={item.id}>
                  <td>
                    <img src={urlImagen(item.imagen)} alt="" width="64" height="36"
                      className="rounded" style={{ objectFit: 'cover' }} />
                  </td>
                  <td>{item.nombre}</td>
                  <td>{pesos(item.precio)}</td>
                  <td>{item.cantidad}</td>
                  <td>{pesos(item.precio * item.cantidad)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="formulario mt-3">
        {/* noValidate desactiva los mensajes nativos del navegador: los mostramos nosotros con Bootstrap */}
        <form noValidate onSubmit={handleSubmit} className={validated ? 'was-validated' : ''}>
          <h2 className="mt-0">Información del cliente</h2>
          {sesion && <p className="text-muted">Tus datos se completaron automáticamente con tu cuenta.</p>}
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

            <div className="col-12">
              <label htmlFor="correo" className="form-label">Correo electrónico</label>
              <input type="email" className="form-control" id="correo" name="correo"
                required maxLength="100" value={datos.correo} onChange={handleChange} />
              <div className="invalid-feedback">Ingresa un correo válido.</div>
            </div>
          </div>

          <h2>Dirección de entrega de los productos</h2>
          <div className="row g-3">
            <div className="col-md-6">
              <label htmlFor="calle" className="form-label">Calle</label>
              <input type="text" className="form-control" id="calle" name="calle"
                required maxLength="100" value={datos.calle} onChange={handleChange} />
              <div className="invalid-feedback">Ingresa la calle y el número.</div>
            </div>

            <div className="col-md-6">
              <label htmlFor="departamento" className="form-label">Departamento (opcional)</label>
              <input type="text" className="form-control" id="departamento" name="departamento"
                maxLength="20" placeholder="Ej: 603" value={datos.departamento} onChange={handleChange} />
            </div>

            <div className="col-md-6">
              <label htmlFor="region" className="form-label">Región</label>
              <select className="form-select" id="region" name="region" required
                value={datos.region} onChange={handleRegion}>
                {regiones.map((r) => <option key={r.nombre} value={r.nombre}>{r.nombre}</option>)}
              </select>
            </div>

            <div className="col-md-6">
              <label htmlFor="comuna" className="form-label">Comuna</label>
              <select className="form-select" id="comuna" name="comuna" required
                value={datos.comuna} onChange={handleChange}>
                <option value="">-- Seleccione --</option>
                {comunasDe(datos.region).map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
              <div className="invalid-feedback">Selecciona una comuna.</div>
            </div>

            <div className="col-12">
              <label htmlFor="indicaciones" className="form-label">Indicaciones para la entrega (opcional)</label>
              <textarea className="form-control" id="indicaciones" name="indicaciones" rows="2" maxLength="250"
                placeholder="Ej: Entre calles, color del edificio, no tiene timbre."
                value={datos.indicaciones} onChange={handleChange}></textarea>
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
          <button className="btn btn-success mt-4" type="submit">Pagar ahora {pesos(total)}</button>
          <Link to="/carrito" className="btn btn-outline-secondary mt-4 ms-2">Volver al carrito</Link>
        </form>
      </section>
    </>
  )
}

export default Checkout
