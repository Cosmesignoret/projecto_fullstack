import { pesos } from '../js/formato.js'

// Muestra el detalle de una compra: datos del cliente, dirección de entrega y tabla de juegos.
// Lo comparten "Pago correcto" y "Pago con error", por eso es un componente aparte.
// Solo muestra lo que recibe por props (no lee contextos): así es fácil de probar.
//  - cliente: { nombre, apellidos, correo, telefono }
//  - direccion: { calle, departamento, region, comuna, indicaciones } (opcional)
//  - items: [{ id, nombre, precio, cantidad }]
//  - total: número · etiquetaTotal: texto que va antes del total ("Total pagado", "Total a pagar")
function ResumenCompra({ cliente, direccion, items, total, etiquetaTotal = 'Total' }) {
  return (
    <>
      {cliente && (
        <>
          <h2 className="mt-0">Datos del cliente</h2>
          <p>
            {cliente.nombre} {cliente.apellidos} · {cliente.correo}
            {cliente.telefono && <> · {cliente.telefono}</>}
          </p>
        </>
      )}

      {/* Renderizado condicional: si la orden no tiene dirección, no se dibuja la sección */}
      {direccion && (
        <>
          <h2>Dirección de entrega</h2>
          <p className="mb-1">
            {direccion.calle}{direccion.departamento && <>, Depto. {direccion.departamento}</>}
          </p>
          <p className="mb-1">{direccion.comuna}, {direccion.region}</p>
          {direccion.indicaciones && (
            <p className="text-muted">Indicaciones: {direccion.indicaciones}</p>
          )}
        </>
      )}

      <h2>Detalle de la compra</h2>
      <div className="tabla-scroll">
        <table className="tabla-stog">
          <thead>
            <tr>
              <th>Juego</th>
              <th>Precio</th>
              <th>Cantidad</th>
              <th>Subtotal</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item.id}>
                <td>{item.nombre}</td>
                <td>{pesos(item.precio)}</td>
                <td>{item.cantidad}</td>
                <td>{pesos(item.precio * item.cantidad)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="mt-3 fs-5 mb-0"><strong>{etiquetaTotal}: {pesos(total)}</strong></p>
    </>
  )
}

export default ResumenCompra
