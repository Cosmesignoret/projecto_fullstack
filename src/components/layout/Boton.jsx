// Botón reutilizable (también lo usan las pruebas de Karma/Jasmine).
export default function Boton({ texto, onClick }) {
  return (
    <button
      type="submit"
      className="btn btn-success mt-4"
      onClick={onClick}
    >
      {texto}
    </button>
  )
}
