import { useState } from 'react'
import { useTienda } from '../context/TiendaContext.jsx'
import { validarEntero } from '../js/validaciones.js'

// Productos con stock igual o menor a su stock crítico. Desde aquí se repone stock sin ir a editar.
function AdminProductosCriticos() {
  const { productosCriticos, actualizarProducto } = useTienda()
  // Cantidad escrita en cada fila, guardada por id: { 4: '10' }
  const [cantidades, setCantidades] = useState({})
  const [error, setError] = useState('')
  const [mensaje, setMensaje] = useState('')

  function handleReponer(producto) {
    setMensaje('')
    const texto = cantidades[producto.id] ?? ''

    const errorCantidad = validarEntero(texto, 'La cantidad', 1, 100000)
    if (errorCantidad) {
      setError('Producto "' + producto.nombre + '": ' + errorCantidad)
      return
    }

    setError('')
    const nuevoStock = producto.stock + Number(texto)
    actualizarProducto(producto.id, { stock: nuevoStock })
    setCantidades({ ...cantidades, [producto.id]: '' })
    setMensaje('Se repusieron ' + texto + ' unidades de "' + producto.nombre + '". Stock actual: ' + nuevoStock + '.')
  }

  return (
    <>
      <div className="admin-topbar"><h1>Productos críticos</h1></div>

      {error && <div className="alert alert-danger" role="alert">{error}</div>}
      {mensaje && <div className="alert alert-success" role="status">{mensaje}</div>}

      <section className="admin-panel">
        <h2>Stock bajo ({productosCriticos.length})</h2>
        {productosCriticos.length === 0 ? (
          <p className="mb-0">Todos los productos tienen stock suficiente.</p>
        ) : (
          <div className="tabla-scroll">
            <table className="tabla-stog">
              <thead>
                <tr><th>Código</th><th>Nombre</th><th>Stock</th><th>Crítico</th><th>Reponer unidades</th></tr>
              </thead>
              <tbody>
                {productosCriticos.map((p) => (
                  <tr key={p.id}>
                    <td>{p.codigo}</td>
                    <td>{p.nombre}</td>
                    <td className="stock-critico">{p.stock}</td>
                    <td>{p.stockCritico}</td>
                    <td className="text-nowrap">
                      <input type="number" min="1" className="form-control d-inline-block"
                        style={{ width: '90px' }} aria-label={'Unidades a reponer de ' + p.nombre}
                        value={cantidades[p.id] ?? ''}
                        onChange={(e) => setCantidades({ ...cantidades, [p.id]: e.target.value })} />
                      <button className="btn btn-success ms-2" onClick={() => handleReponer(p)}>Reponer</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </>
  )
}

export default AdminProductosCriticos
