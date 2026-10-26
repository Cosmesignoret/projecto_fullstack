import { useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { useTienda } from '../context/TiendaContext.jsx'
import { validarProducto } from '../js/validaciones.js'

// Imágenes disponibles en public/img (las portadas de los juegos)
const IMAGENES = [
  { valor: '/img/gta.webp', texto: 'GTA VI' },
  { valor: '/img/doom.webp', texto: 'Doom' },
  { valor: '/img/gwf.jpg', texto: 'Gamble Whit Your Friends' },
  { valor: '/img/bh.jpg', texto: 'Detroit: Become Human' }
]

const VACIO = {
  codigo: '', categoria: '', nombre: '', precio: '', stock: '', stockCritico: '',
  descripcion: '', imagen: IMAGENES[0].valor, enOferta: false, precioOferta: ''
}

// Sirve para crear (/admin/productos/nuevo) y para editar (/admin/productos/:id/editar).
// Si la URL trae un id, el formulario arranca con los datos de ese producto.
function AdminProductoForm() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { productos, categorias, buscarProductoPorId, crearProducto, actualizarProducto } = useTienda()
  const existente = id ? buscarProductoPorId(id) : null
  const [form, setForm] = useState(existente ? { ...VACIO, ...existente, precioOferta: existente.enOferta ? existente.precioOferta : '' } : VACIO)
  const [error, setError] = useState('')

  if (id && existente === null) {
    return (
      <section className="admin-panel">
        <h1>Producto no encontrado</h1>
        <Link to="/admin/productos" className="btn btn-success">Volver a productos</Link>
      </section>
    )
  }

  // Un solo handler para todos los campos. Los checkbox usan "checked" en vez de "value".
  function handleChange(e) {
    const { name, value, type, checked } = e.target
    setForm({ ...form, [name]: type === 'checkbox' ? checked : value })
  }

  function handleGuardar(e) {
    e.preventDefault()
    setError('')

    const problema = validarProducto(form)
    if (problema) {
      setError(problema)
      return
    }

    // El código no puede repetirse (se ignora el propio producto al editar)
    const codigo = form.codigo.trim().toUpperCase()
    if (productos.some((p) => p.codigo.toUpperCase() === codigo && (!existente || p.id !== existente.id))) {
      setError('Ya existe un producto con el código "' + codigo + '".')
      return
    }

    const datos = {
      codigo,
      categoria: form.categoria,
      nombre: form.nombre.trim(),
      descripcion: form.descripcion.trim(),
      precio: Number(form.precio),
      stock: Number(form.stock),
      stockCritico: Number(form.stockCritico),
      imagen: form.imagen,
      enOferta: form.enOferta,
      precioOferta: form.enOferta ? Number(form.precioOferta) : 0
    }

    if (existente) {
      actualizarProducto(existente.id, datos)
    } else {
      crearProducto(datos)
    }
    navigate('/admin/productos')
  }

  return (
    <>
      <div className="admin-topbar">
        <h1>{existente ? 'Editar producto' : 'Nuevo producto'}</h1>
      </div>

      {error && <div className="alert alert-danger" role="alert">{error}</div>}

      <section className="admin-panel">
        <form onSubmit={handleGuardar} noValidate>
          <div className="row g-3">
            <div className="col-md-3">
              <label htmlFor="codigo" className="form-label">Código / SKU*</label>
              <input type="text" className="form-control" id="codigo" name="codigo"
                maxLength="10" value={form.codigo} onChange={handleChange} />
            </div>

            <div className="col-md-4">
              <label htmlFor="categoria" className="form-label">Categoría*</label>
              {/* El value es el NOMBRE de la categoría, porque cada producto guarda el nombre */}
              <select className="form-select" id="categoria" name="categoria"
                value={form.categoria} onChange={handleChange}>
                <option value="">-- Seleccione --</option>
                {categorias.map((c) => <option key={c.id} value={c.nombre}>{c.nombre}</option>)}
              </select>
            </div>

            <div className="col-md-5">
              <label htmlFor="nombre" className="form-label">Nombre del producto*</label>
              <input type="text" className="form-control" id="nombre" name="nombre"
                maxLength="60" value={form.nombre} onChange={handleChange} />
            </div>

            <div className="col-md-3">
              <label htmlFor="precio" className="form-label">Precio ($ CLP)*</label>
              <input type="number" className="form-control" id="precio" name="precio"
                min="1" value={form.precio} onChange={handleChange} />
            </div>

            <div className="col-md-3">
              <label htmlFor="stock" className="form-label">Stock*</label>
              <input type="number" className="form-control" id="stock" name="stock"
                min="0" value={form.stock} onChange={handleChange} />
            </div>

            <div className="col-md-3">
              <label htmlFor="stockCritico" className="form-label">Stock crítico*</label>
              <input type="number" className="form-control" id="stockCritico" name="stockCritico"
                min="0" value={form.stockCritico} onChange={handleChange} />
            </div>

            <div className="col-md-3">
              <label htmlFor="imagen" className="form-label">Portada</label>
              <select className="form-select" id="imagen" name="imagen"
                value={form.imagen} onChange={handleChange}>
                {IMAGENES.map((i) => <option key={i.valor} value={i.valor}>{i.texto}</option>)}
              </select>
            </div>

            <div className="col-12">
              <label htmlFor="descripcion" className="form-label">Descripción del videojuego*</label>
              <textarea className="form-control" id="descripcion" name="descripcion"
                rows="3" maxLength="250" value={form.descripcion} onChange={handleChange}></textarea>
            </div>

            <div className="col-md-3">
              <div className="form-check mt-md-4">
                <input type="checkbox" className="form-check-input" id="enOferta" name="enOferta"
                  checked={form.enOferta} onChange={handleChange} />
                <label htmlFor="enOferta" className="form-check-label">En oferta</label>
              </div>
            </div>

            {form.enOferta && (
              <div className="col-md-3">
                <label htmlFor="precioOferta" className="form-label">Precio de oferta ($)</label>
                <input type="number" className="form-control" id="precioOferta" name="precioOferta"
                  min="1" value={form.precioOferta} onChange={handleChange} />
              </div>
            )}
          </div>

          <button type="submit" className="btn btn-success mt-3">Guardar producto</button>
          <Link to="/admin/productos" className="btn btn-outline-secondary mt-3 ms-2">Cancelar</Link>
        </form>
      </section>
    </>
  )
}

export default AdminProductoForm
