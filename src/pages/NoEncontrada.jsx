import { Link } from 'react-router-dom'

function NoEncontrada() {
  return (
    <div className="text-center py-5">
      <h1 className="display-1 fw-bold" style={{ color: 'var(--stog-accent)' }}>404</h1>
      <p>La página que buscas no existe.</p>
      <Link to="/" className="btn btn-success">Volver al inicio</Link>
    </div>
  )
}

export default NoEncontrada
