// Pruebas de estado y eventos.
// Todas siguen los mismos 3 pasos: preparar, actuar y comprobar.
import { fireEvent, cleanup } from '@testing-library/react'
import { useCarrito } from '../src/context/CarritoContext.jsx'
import Checkout from '../src/pages/Checkout.jsx'
import Carrito from '../src/pages/Carrito.jsx'
import Productos from '../src/pages/Productos.jsx'
import TarjetaProducto from '../src/components/TarjetaProducto.jsx'
import { renderTienda, IMAGEN_PRUEBA, JUEGOS } from './ayudas.js'

// Componente auxiliar que solo existe en este archivo. Muestra el contador del carrito y tiene
// un botón que agrega un producto: así se prueba el estado del Context sin depender de otra página.
function CarritoDePrueba({ producto }) {
  const { cantidadTotal, agregarAlCarrito } = useCarrito()
  return (
    <div>
      <span data-testid="cantidad">{cantidadTotal}</span>
      <button onClick={() => agregarAlCarrito(producto, 2)}>Agregar de prueba</button>
    </div>
  )
}

describe('Pruebas de estado y eventos', () => {
  const producto = JUEGOS[0]

  // Después de cada prueba se desmonta lo renderizado para que no afecte a la siguiente
  afterEach(() => {
    cleanup()
  })

  it('Cambia el estado del formulario cuando el usuario escribe', () => {
    // PREPARAR: Checkout solo muestra el formulario si el carrito tiene algo
    const { getByLabelText } = renderTienda(<Checkout />, { carrito: [[producto, 1]] })
    const inputNombre = getByLabelText('Nombre')

    // ACTUAR: simula que el usuario escribe en el campo
    fireEvent.change(inputNombre, { target: { value: 'Ignacio' } })

    // COMPROBAR: el input es "controlado" (su value viene del estado de React). Si el estado
    // no se hubiera actualizado con lo escrito, React lo devolvería a vacío.
    expect(inputNombre.value).toBe('Ignacio')
  })

  it('Cambia el estado del carrito al agregar un producto', () => {
    const { getByTestId, getByRole } = renderTienda(<CarritoDePrueba producto={producto} />)

    // Antes de agregar, el carrito está vacío
    expect(getByTestId('cantidad').textContent).toBe('0')

    fireEvent.click(getByRole('button', { name: /agregar de prueba/i }))

    // textContent siempre es texto, por eso se compara con '2' y no con el número 2
    expect(getByTestId('cantidad').textContent).toBe('2')
  })

  it('Ejecuta la función al hacer clic en Añadir al carrito', () => {
    // Un "espía" es una función falsa que anota si la llamaron y cuántas veces
    const espia = jasmine.createSpy('onAgregarCarrito')
    const { getByRole } = renderTienda(
      <TarjetaProducto
        nombre="Producto de prueba"
        precio={1000}
        stock={5}
        descripcion="Descripción de prueba"
        imagen={IMAGEN_PRUEBA}
        onAgregarCarrito={espia}
      />
    )

    fireEvent.click(getByRole('button', { name: /añadir al carrito/i }))

    expect(espia).toHaveBeenCalledTimes(1)
  })

  it('Saca el producto del carrito al hacer clic en Quitar', () => {
    const { getByText, queryByText, getByRole } = renderTienda(<Carrito />, { carrito: [[producto, 1]] })

    // Antes de quitar, el producto aparece en la tabla
    expect(getByText(producto.nombre)).toBeTruthy()

    // "Quitar" es un <a>, por eso su rol es 'link' y no 'button'
    fireEvent.click(getByRole('link', { name: /quitar/i }))

    // getBy... lanza error si no encuentra el elemento; queryBy... devuelve null.
    // Por eso, para comprobar que algo YA NO está, se usa queryBy.
    expect(queryByText(producto.nombre)).toBeNull()
    expect(queryByText(/vacío/i)).toBeTruthy()
  })

  it('Filtra los productos mientras el usuario escribe en la búsqueda', () => {
    const buscado = JUEGOS[0]
    // Un producto cuyo nombre NO contiene lo buscado: debería desaparecer al filtrar.
    const otro = JUEGOS.find((p) => !p.nombre.includes(buscado.nombre))

    const { getByPlaceholderText, queryByRole } = renderTienda(<Productos />)

    // Antes de escribir se ven los dos (el nombre de cada tarjeta es un <h5>, rol 'heading')
    expect(queryByRole('heading', { name: otro.nombre })).toBeTruthy()

    fireEvent.change(getByPlaceholderText('Buscar producto...'), { target: { value: buscado.nombre } })

    expect(queryByRole('heading', { name: buscado.nombre })).toBeTruthy()
    expect(queryByRole('heading', { name: otro.nombre })).toBeNull()
  })

  it('Cambiar la cantidad en el carrito actualiza el subtotal, y no deja superar el stock', () => {
    const { getByLabelText, getByText } = renderTienda(<Carrito />, { carrito: [[producto, 1]] })
    const campo = getByLabelText('Cantidad de ' + producto.nombre)

    fireEvent.change(campo, { target: { value: '2' } })
    expect(campo.value).toBe('2')

    // Un valor mayor al stock se rechaza y se avisa
    fireEvent.change(campo, { target: { value: String(producto.stock + 1) } })
    expect(campo.value).toBe('2')
    expect(getByText(/unidades disponibles/i)).toBeTruthy()
  })
})
