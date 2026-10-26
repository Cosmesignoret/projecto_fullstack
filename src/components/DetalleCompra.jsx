import { pesos, urlImagen } from '../js/formato.js'

// Muestra una compra: datos del cliente, dirección de entrega, juegos y total.
// Lo comparten la pantalla de compra exitosa, la de pago rechazado y la boleta del panel admin.
// Recibe todo por props, así que no depende de ningún contexto (es fácil de probar).
function DetalleCompra({ cliente, direccion, items, total, etiquetaTotal = 'Total pagado' }) {
  return (
    <>
      <h2 className="mt-0">Datos del cliente</h2>
      <div className="row g-2">
        <div className="col-md-4"><label className="form-label">Nombre</label>
          <input className="form-control" readOnly value={cliente.nombre} aria-label="Nombre del cliente" /></div>
        <div className="col-md-4"><label className="form-label">Apellidos</label>
          <input className="form-control" readOnly value={cliente.apellidos} aria-label="Apellidos del cliente" /></div>
        <div className="col-md-4"><label className="form-label">Correo</label>
          <input className="form-control" readOnly value={cliente.correo} aria-label="Correo del cliente" /></div>
      </div>

      <h2>Dirección de entrega de los productos</h2>
      <div className="row g-2">
        <div className="col-md-6"><label className="form-label">Calle</label>
          <input className="form-control" readOnly value={direccion.calle} aria-label="Calle de entrega" /></div>
        <div className="col-md-6"><label className="form-label">Departamento (opcional)</label>
          <input className="form-control" readOnly value={direccion.departamento || ''} aria-label="Departamento de entrega" /></div>
        <div className="col-md-6"><label className="form-label">Región</label>
          <input className="form-control" readOnly value={direccion.region} aria-label="Región de entrega" /></div>
        <div className="col-md-6"><label className="form-label">Comuna</label>
          <input className="form-control" readOnly value={direccion.comuna} aria-label="Comuna de entrega" /></div>
        <div className="col-12"><label className="form-label">Indicaciones para la entrega (opcional)</label>
          <textarea className="form-control" readOnly rows="2" value={direccion.indicaciones || ''}
            aria-label="Indicaciones de entrega"></textarea></div>
      </div>

      <h2>Juegos</h2>
      <div className="tabla-scroll">
        <table className="tabla-stog">
          <thead>
            <tr><th>Imagen</th><th>Nombre</th><th>Precio</th><th>Cantidad</th><th>Subtotal</th></tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item.id}>
                <td>
                  {item.imagen && <img src={urlImagen(item.imagen)} alt="" width="64" height="36"
                    className="rounded" style={{ objectFit: 'cover' }} />}
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
      <p className="mt-3 fs-5 text-center"><strong>{etiquetaTotal}: {pesos(total)}</strong></p>
    </>
  )
}

export default DetalleCompra
