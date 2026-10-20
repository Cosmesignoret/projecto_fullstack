/* global describe, it, expect, beforeAll, beforeEach, afterEach, spyOn, jasmine */
import React, { act } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';

describe('Tienda Stog', () => {
  let container;
  let root;

  function renderApp(route = 'inicio') {
    window.location.hash = `#/${route}`;
    container = document.createElement('div');
    document.body.appendChild(container);
    root = createRoot(container);
    act(() => root.render(<App />));
  }

  function navigate(route) {
    act(() => {
      window.location.hash = `#/${route}`;
      window.dispatchEvent(new Event('hashchange'));
    });
  }

  function click(element) {
    act(() => {
      element.click();
      window.dispatchEvent(new Event('hashchange'));
    });
  }

  function enterText(input, value) {
    act(() => {
      const setter = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value').set;
      setter.call(input, value);
      input.dispatchEvent(new Event('input', { bubbles: true }));
    });
  }

  beforeAll(() => {
    globalThis.IS_REACT_ACT_ENVIRONMENT = true;
  });

  beforeEach(() => {
    window.localStorage.clear();
    renderApp();
  });

  afterEach(() => {
    if (root) act(() => root.unmount());
    if (container) container.remove();
    window.localStorage.clear();
    window.location.hash = '';
  });

  it('muestra la marca y la navegación principal', () => {
    expect(container.querySelector('.navbar-brand').textContent).toBe('Stog');
    expect(container.querySelector('a[href="#/productos"]')).not.toBeNull();
  });

  it('presenta el inicio y sus juegos destacados', () => {
    expect(container.querySelector('h1').textContent).toContain('Tu próxima aventura');
    expect(container.querySelectorAll('.product-card').length).toBe(4);
  });

  it('abre el catálogo desde el menú', () => {
    click(container.querySelector('a[href="#/productos"]'));
    expect(container.querySelector('h1').textContent).toBe('Videojuegos');
  });

  it('filtra los juegos por nombre', () => {
    navigate('productos');
    enterText(container.querySelector('#product-search'), 'Doom');
    expect(container.querySelectorAll('.product-card').length).toBe(1);
    expect(container.querySelector('.product-title').textContent).toBe('Doom');
  });

  it('muestra el detalle del juego solicitado', () => {
    navigate('producto/gta');
    expect(container.querySelector('h1').textContent).toBe('GTA VI');
    expect(container.querySelector('#quantity').value).toBe('1');
  });

  it('agrega un juego y actualiza el contador del carrito', () => {
    navigate('productos');
    click(container.querySelector('.product-card button'));
    expect(container.querySelector('a[href="#/carrito"]').textContent).toContain('Carrito (1)');
  });

  it('guarda el carrito en el almacenamiento del navegador', () => {
    spyOn(Storage.prototype, 'setItem').and.callThrough();
    navigate('productos');
    click(container.querySelector('.product-card button'));
    expect(Storage.prototype.setItem).toHaveBeenCalledWith('stog-cart', jasmine.any(String));
    expect(JSON.parse(window.localStorage.getItem('stog-cart'))[0].id).toBe('gta');
  });

  it('suma la cantidad seleccionada al carrito desde el detalle', () => {
    navigate('producto/gta');
    act(() => {
      const select = container.querySelector('#quantity');
      select.value = '2';
      select.dispatchEvent(new Event('change', { bubbles: true }));
    });
    click(container.querySelector('button.btn-success'));
    expect(container.querySelector('a[href="#/carrito"]').textContent).toContain('Carrito (2)');
  });

  it('permite quitar un producto del carrito', () => {
    navigate('productos');
    click(container.querySelector('.product-card button'));
    navigate('carrito');
    click(container.querySelector('.cart-row button'));
    expect(container.textContent).toContain('Tu carrito está vacío.');
  });

  it('confirma el envío del formulario de contacto', () => {
    navigate('contacto');
    act(() => container.querySelector('form').dispatchEvent(new Event('submit', { bubbles: true, cancelable: true })));
    expect(container.querySelector('[role="status"]').textContent).toContain('Recibimos tu mensaje');
  });

  it('muestra el formulario de registro y confirma su envío', () => {
    navigate('registro');
    act(() => container.querySelector('form').dispatchEvent(new Event('submit', { bubbles: true, cancelable: true })));
    expect(container.querySelector('[role="status"]').textContent).toContain('Registro recibido');
  });
});
