import React, { useEffect, useMemo, useState } from 'react';
import './App.css';

const products = [
  { id: 'gta', name: 'GTA VI', category: 'Mundo abierto', price: 89990, image: 'gta.webp', description: 'Explora una ciudad viva, completa misiones y vive una aventura de mundo abierto.' },
  { id: 'doom', name: 'Doom', category: 'Acción', price: 19990, image: 'doom.webp', description: 'Enfréntate a hordas de demonios en un intenso juego de acción.' },
  { id: 'gwf', name: 'Gamble With Your Friends', category: 'Casino', price: 4990, image: 'gwf.jpg', description: 'Comparte una noche de casino y juegos con tus amigos.' },
  { id: 'bh', name: 'Detroit: Become Human', category: 'Aventura', price: 29990, image: 'bh.jpg', description: 'Tus decisiones cambian el destino de una historia sobre androides.' },
];

const offers = { gta: 71990, doom: 13990, gwf: 4240, bh: 22490 };
const imageUrl = (file) => `${process.env.PUBLIC_URL}/imagenes/${file}`;
const money = (value) => `$${Number(value).toLocaleString('es-CL')}`;

function readCart() {
  try {
    const saved = JSON.parse(window.localStorage.getItem('stog-cart') || '[]');
    return Array.isArray(saved) ? saved : [];
  } catch {
    return [];
  }
}

function routeFromHash() {
  const route = window.location.hash.replace(/^#\/?/, '');
  return route || 'inicio';
}

function Navbar({ route, cartCount }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const links = [
    ['inicio', 'Inicio'], ['productos', 'Productos'], ['nosotros', 'Nosotros'],
    ['blogs', 'Blogs'], ['ofertas', 'Ofertas'], ['contacto', 'Contacto'],
  ];

  return (
    <>
      <div className="topbar">
        <div className="container text-end">
          <a href="#/login">Iniciar sesión</a><a href="#/registro">Crear cuenta</a>
        </div>
      </div>
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
        <div className="container">
          <a className="navbar-brand" href="#/inicio">Stog</a>
          <button className="navbar-toggler" type="button" aria-label="Mostrar navegación" aria-expanded={menuOpen} onClick={() => setMenuOpen(!menuOpen)}>
            <span className="navbar-toggler-icon" />
          </button>
          <div className={`collapse navbar-collapse ${menuOpen ? 'show' : ''}`}>
            <ul className="navbar-nav me-auto">
              {links.map(([path, label]) => (
                <li className="nav-item" key={path}>
                  <a className={`nav-link ${route === path ? 'active' : ''}`} href={`#/${path}`} onClick={() => setMenuOpen(false)}>{label}</a>
                </li>
              ))}
            </ul>
            <a className="nav-link cart-link" href="#/carrito">🛒 Carrito ({cartCount})</a>
          </div>
        </div>
      </nav>
    </>
  );
}

function ProductCard({ product, price, oldPrice, onAdd }) {
  return (
    <article className="card h-100 product-card">
      <a href={`#/producto/${product.id}`} aria-label={`Ver ${product.name}`}>
        <div className="product-image"><img src={imageUrl(product.image)} alt={product.name} /></div>
      </a>
      <div className="card-body d-flex flex-column">
        <span className="text-muted small">{product.category}</span>
        <h2 className="h5 mt-1"><a className="product-title" href={`#/producto/${product.id}`}>{product.name}</a></h2>
        <p className="text-muted">{product.description}</p>
        {oldPrice && <p className="old-price mb-0">Antes {money(oldPrice)}</p>}
        <p className="price mt-auto">{money(price)}</p>
        <div className="d-flex gap-2">
          <a className="btn btn-outline-success flex-fill" href={`#/producto/${product.id}`}>Ver detalle</a>
          <button className="btn btn-success flex-fill" onClick={() => onAdd(product)}>Añadir</button>
        </div>
      </div>
    </article>
  );
}

function ProductGrid({ items, onAdd, discounted = false }) {
  return (
    <div className="row g-4">
      {items.map((product) => (
        <div className="col-12 col-sm-6 col-xl-3" key={product.id}>
          <ProductCard product={product} price={discounted ? offers[product.id] : product.price} oldPrice={discounted ? product.price : null} onAdd={onAdd} />
        </div>
      ))}
    </div>
  );
}

function HomePage({ onAdd }) {
  return (
    <>
      <section className="hero py-5">
        <div className="container">
          <div className="row align-items-center g-4">
            <div className="col-12 col-lg-6">
              <p className="eyebrow">Juega a tu manera</p>
              <h1 className="display-4 fw-bold">Tu próxima aventura comienza aquí.</h1>
              <p className="lead text-muted">Encuentra videojuegos de acción, mundo abierto y mucho más.</p>
              <a href="#/productos" className="btn btn-success btn-lg">Explorar productos</a>
            </div>
            <div className="col-12 col-lg-6"><img className="hero-image" src={imageUrl('gta.webp')} alt="Videojuego destacado de Stog" /></div>
          </div>
        </div>
      </section>
      <main className="container py-5">
        <div className="section-heading"><div><p className="eyebrow">Selección Stog</p><h2>Juegos destacados</h2></div><a href="#/productos">Ver todo →</a></div>
        <ProductGrid items={products} onAdd={onAdd} />
      </main>
    </>
  );
}

function CatalogPage({ onAdd, discounted = false }) {
  const [query, setQuery] = useState('');
  const items = useMemo(() => products.filter((product) => `${product.name} ${product.category}`.toLowerCase().includes(query.toLowerCase())), [query]);
  return (
    <main className="container py-5">
      <div className="section-heading"><div><p className="eyebrow">{discounted ? 'Precios especiales' : 'Catálogo Stog'}</p><h1>{discounted ? 'Ofertas' : 'Videojuegos'}</h1></div></div>
      <label className="visually-hidden" htmlFor="product-search">Buscar juegos</label>
      <input id="product-search" className="form-control search-input mb-4" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Buscar por nombre o categoría" />
      {items.length ? <ProductGrid items={items} onAdd={onAdd} discounted={discounted} /> : <p role="status">No encontramos juegos con esa búsqueda.</p>}
    </main>
  );
}

function DetailPage({ product, onAdd }) {
  const [quantity, setQuantity] = useState(1);
  if (!product) return <NotFound />;
  return (
    <main className="container py-5">
      <p><a href="#/productos">Productos</a> / {product.name}</p>
      <div className="row g-5 align-items-center">
        <div className="col-12 col-lg-6"><img className="detail-image" src={imageUrl(product.image)} alt={product.name} /></div>
        <div className="col-12 col-lg-6">
          <span className="eyebrow">{product.category}</span><h1 className="display-5 fw-bold">{product.name}</h1>
          <p className="price fs-2">{money(product.price)}</p><p className="lead">{product.description}</p>
          <label className="form-label" htmlFor="quantity">Cantidad</label>
          <select id="quantity" className="form-select quantity-select mb-3" value={quantity} onChange={(event) => setQuantity(Number(event.target.value))}>
            {[1, 2, 3].map((amount) => <option key={amount} value={amount}>{amount}</option>)}
          </select>
          <button className="btn btn-success btn-lg" onClick={() => onAdd(product, quantity)}>Añadir al carrito</button>
        </div>
      </div>
      <section className="mt-5"><h2 className="h3 mb-4">También te puede interesar</h2><ProductGrid items={products.filter((item) => item.id !== product.id)} onAdd={onAdd} /></section>
    </main>
  );
}

function CartPage({ cart, onQuantity, onRemove }) {
  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  return (
    <main className="container py-5">
      <p className="eyebrow">Tu selección</p><h1 className="mb-4">Carrito de compras</h1>
      {!cart.length ? <div className="empty-state"><p>Tu carrito está vacío.</p><a href="#/productos" className="btn btn-success">Ver productos</a></div> : <>
        <div className="list-group mb-4">{cart.map((item) => <div className="list-group-item cart-row" key={item.id}>
          <img src={imageUrl(item.image)} alt="" /><div className="cart-info"><strong>{item.name}</strong><span>{money(item.price)} c/u</span></div>
          <label className="visually-hidden" htmlFor={`qty-${item.id}`}>Cantidad de {item.name}</label>
          <input id={`qty-${item.id}`} type="number" min="1" className="form-control cart-quantity" value={item.quantity} onChange={(event) => onQuantity(item.id, Math.max(1, Number(event.target.value) || 1))} />
          <strong>{money(item.price * item.quantity)}</strong><button className="btn btn-outline-danger" onClick={() => onRemove(item.id)}>Quitar</button>
        </div>)}</div>
        <div className="text-end"><p className="fs-4">Total: <strong>{money(total)}</strong></p><button className="btn btn-success btn-lg" onClick={() => window.alert('¡Gracias! El proceso de pago aún no está conectado.')}>Continuar compra</button></div>
      </>}
    </main>
  );
}

function ContactPage() {
  const [sent, setSent] = useState(false);
  return <main className="container py-5 narrow-page"><p className="eyebrow">Estamos para ayudarte</p><h1>Contacto</h1><p className="text-muted">¿Tienes dudas? Escríbenos.</p>
    {sent ? <div className="alert alert-success" role="status">Recibimos tu mensaje. ¡Gracias por escribirnos!</div> : <form className="card form-card" onSubmit={(event) => { event.preventDefault(); setSent(true); }}>
      <label className="form-label" htmlFor="contact-name">Nombre</label><input id="contact-name" className="form-control mb-3" required />
      <label className="form-label" htmlFor="contact-email">Correo electrónico</label><input id="contact-email" type="email" className="form-control mb-3" required />
      <label className="form-label" htmlFor="contact-message">Mensaje</label><textarea id="contact-message" className="form-control mb-3" rows="4" required />
      <button className="btn btn-success">Enviar mensaje</button>
    </form>}
  </main>;
}

function AccountPage({ register = false }) {
  const [message, setMessage] = useState('');
  return <main className="container py-5 narrow-page"><p className="eyebrow">Cuenta Stog</p><h1>{register ? 'Crear cuenta' : 'Iniciar sesión'}</h1>
    {message ? <div className="alert alert-success" role="status">{message}</div> : <form className="card form-card" onSubmit={(event) => { event.preventDefault(); setMessage(register ? 'Registro recibido correctamente.' : 'Formulario enviado correctamente.'); }}>
      {register && <><label className="form-label" htmlFor="account-name">Nombre</label><input id="account-name" className="form-control mb-3" minLength="3" required /></>}
      <label className="form-label" htmlFor="account-email">Correo electrónico</label><input id="account-email" type="email" className="form-control mb-3" required />
      <label className="form-label" htmlFor="account-password">Contraseña</label><input id="account-password" type="password" className="form-control mb-3" minLength="6" required />
      <button className="btn btn-success">{register ? 'Registrar' : 'Ingresar'}</button>
    </form>}
  </main>;
}

function SimplePage({ page }) {
  const content = {
    nosotros: ['Nosotros', 'Somos una tienda en línea dedicada a los videojuegos. Queremos ayudarte a encontrar tu próxima aventura.'],
    blogs: ['Blogs', 'Historias, recomendaciones y novedades del mundo de los videojuegos.'],
  }[page];
  return <main className="container py-5 narrow-page"><p className="eyebrow">Stog</p><h1>{content[0]}</h1><p className="lead text-muted">{content[1]}</p><a href="#/productos" className="btn btn-outline-success">Conocer los juegos</a></main>;
}

function NotFound() {
  return <main className="container py-5"><h1>No encontramos esa página</h1><a href="#/inicio">Volver al inicio</a></main>;
}

function Footer() {
  return <footer className="site-footer"><div className="container d-flex flex-column flex-md-row justify-content-between gap-2"><span>Stog · Videojuegos para tu próxima aventura</span><span>© 2026 Stog</span></div></footer>;
}

function App() {
  const [route, setRoute] = useState(routeFromHash);
  const [cart, setCart] = useState(readCart);

  useEffect(() => {
    const updateRoute = () => setRoute(routeFromHash());
    window.addEventListener('hashchange', updateRoute);
    return () => window.removeEventListener('hashchange', updateRoute);
  }, []);

  useEffect(() => {
    window.localStorage.setItem('stog-cart', JSON.stringify(cart));
  }, [cart]);

  const addToCart = (product, quantity = 1) => {
    setCart((current) => {
      const found = current.find((item) => item.id === product.id);
      if (found) return current.map((item) => item.id === product.id ? { ...item, quantity: item.quantity + quantity } : item);
      return [...current, { ...product, quantity }];
    });
  };
  const updateQuantity = (id, quantity) => setCart((current) => current.map((item) => item.id === id ? { ...item, quantity } : item));
  const removeFromCart = (id) => setCart((current) => current.filter((item) => item.id !== id));
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const [page, productId] = route.split('/');
  const selectedProduct = products.find((product) => product.id === productId);

  let content;
  if (page === 'inicio') content = <HomePage onAdd={addToCart} />;
  else if (page === 'productos') content = <CatalogPage onAdd={addToCart} />;
  else if (page === 'ofertas') content = <CatalogPage onAdd={addToCart} discounted />;
  else if (page === 'producto') content = <DetailPage product={selectedProduct} onAdd={addToCart} />;
  else if (page === 'carrito') content = <CartPage cart={cart} onQuantity={updateQuantity} onRemove={removeFromCart} />;
  else if (page === 'contacto') content = <ContactPage />;
  else if (page === 'login') content = <AccountPage />;
  else if (page === 'registro') content = <AccountPage register />;
  else if (page === 'nosotros' || page === 'blogs') content = <SimplePage page={page} />;
  else content = <NotFound />;

  return <div className="app-shell"><Navbar route={page} cartCount={cartCount} />{content}<Footer /></div>;
}

export default App;
