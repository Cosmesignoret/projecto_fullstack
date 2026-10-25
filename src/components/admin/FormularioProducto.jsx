import { useState } from 'react'
import { validarProducto } from '../../js/validaciones.js'

const VACIO = {
  nombre: '', descripcion: '', categoria: '', precio: '', stock: '', stockCritico: '5',
  imagen: '', enOferta: false, precioOferta: ''
}

// Formulario para crear o editar un producto. Una sola responsabilidad: mostrar los campos,
// validarlos y avisar al padre con onGuardar(datos) cuando están correctos.
//  - producto: si viene, el formulario edita ese producto; si no, crea uno nuevo.
//  - categorias: lista para el <select>.
//  - onGuardar / onCancelar: funciones que entrega el padre (la página decide qué hacer).
function FormularioProducto({ producto = null, categorias, onGuardar, onCancelar }) {
  const [form, setForm] = useState(() => (producto ? { ...VACIO, ...producto } : VACIO))
  const [errores, setErrores] = useState({})

  // Un solo handler para todos los campos: usa "name" para saber qué propiedad actualizar
  function handleChange(e) {
    const { name, value, type, checked } = e.target
    setForm({ ...form, [name]: type === 'checkbox' ? checked : value })
  }

  function handleSubmit(e) {
    e.preventDefault()
    const nuevos = validarProducto(form)
    setErrores(nuevos)
    if (Object.keys(nuevos).length > 0) {
      return
    }

    // Los inputs entregan texto: se convierten a número antes de guardar
    onGuardar({
      nombre: form.nombre.trim(),
      descripcion: form.descripcion.trim(),
      categoria: form.categoria,
      precio: Number(form.precio),
      stock: Number(form.stock),
      stockCritico: Number(form.stockCritico),
      imagen: form.imagen.trim() || '/img/sin-imagen.svg',
      enOferta: form.enOferta,
      precioOferta: form.enOferta ? Number(form.precioOferta) : 0
    })
  }

  const clase = (campo) => 'form-control' + (errores[campo] ? ' is-invalid' : '')
  const error = (campo) => errores[campo] && <div className="invalid-feedback">{errores[campo]}</div>

  return (
    <form noValidate onSubmit={handleSubmit} aria-label={producto ? 'Editar producto' : 'Nuevo producto'}>
      <div className="row g-3">
        <div className="col-md-6">
          <label htmlFor="nombre" className="form-label">Nombre</label>
          <input type="text" id="nombre" name="nombre" className={clase('nombre')}
            maxLength="100" value={form.nombre} onChange={handleChange} />
          {error('nombre')}
        </div>

        <div className="col-md-6">
          <label htmlFor="categoria" className="form-label">Categoría</label>
          {/* El value es el NOMBRE de la categoría, porque cada producto guarda el nombre */}
          <select id="categoria" name="categoria" className={'form-select' + (errores.categoria ? ' is-invalid' : '')}
            value={form.categoria} onChange={handleChange}>
            <option value="">Selecciona una categoría</option>
            {categorias.map((c) => <option key={c.id} value={c.nombre}>{c.nombre}</option>)}
          </select>
          {error('categoria')}
        </div>

        <div className="col-12">
          <label htmlFor="descripcion" className="form-label">Descripción</label>
          <textarea id="descripcion" name="descripcion" className={clase('descripcion')}
            rows="3" maxLength="300" value={form.descripcion} onChange={handleChange}></textarea>
          {error('descripcion')}
        </div>

        <div className="col-md-4">
          <label htmlFor="precio" className="form-label">Precio ($)</label>
          <input type="number" id="precio" name="precio" className={clase('precio')}
            min="1" value={form.precio} onChange={handleChange} />
          {error('precio')}
        </div>

        <div className="col-md-4">
          <label htmlFor="stock" className="form-label">Stock</label>
          <input type="number" id="stock" name="stock" className={clase('stock')}
            min="0" value={form.stock} onChange={handleChange} />
          {error('stock')}
        </div>

        <div className="col-md-4">
          <label htmlFor="stockCritico" className="form-label">Stock crítico</label>
          <input type="number" id="stockCritico" name="stockCritico" className={clase('stockCritico')}
            min="0" value={form.stockCritico} onChange={handleChange} />
          {error('stockCritico')}
        </div>

        <div className="col-md-8">
          <label htmlFor="imagen" className="form-label">Imagen (ruta o URL, opcional)</label>
          <input type="text" id="imagen" name="imagen" className="form-control"
            placeholder="/img/mi-juego.jpg" value={form.imagen} onChange={handleChange} />
        </div>

        <div className="col-md-4 d-flex align-items-end">
          <div className="form-check">
            <input type="checkbox" id="enOferta" name="enOferta" className="form-check-input"
              checked={form.enOferta} onChange={handleChange} />
            <label htmlFor="enOferta" className="form-check-label">En oferta</label>
          </div>
        </div>

        {/* Renderizado condicional: el precio de oferta solo aparece si el producto está en oferta */}
        {form.enOferta && (
          <div className="col-md-4">
            <label htmlFor="precioOferta" className="form-label">Precio de oferta ($)</label>
            <input type="number" id="precioOferta" name="precioOferta" className={clase('precioOferta')}
              min="1" value={form.precioOferta} onChange={handleChange} />
            {error('precioOferta')}
          </div>
        )}
      </div>

      <button type="submit" className="btn btn-success mt-3">
        {producto ? 'Guardar cambios' : 'Crear producto'}
      </button>
      <button type="button" className="btn btn-outline-secondary mt-3 ms-2" onClick={onCancelar}>
        Cancelar
      </button>
    </form>
  )
}

export default FormularioProducto
