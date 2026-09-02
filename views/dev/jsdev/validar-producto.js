document.getElementById("formularioProducto").addEventListener("submit", function (event) {
  event.preventDefault();

  // 1. OBTENER INPUTS
  const inputCodigo = document.getElementById("codigo");
  const inputCategoria = document.getElementById("categoria");
  const inputNombre = document.getElementById("nombre");
  const inputPrecio = document.getElementById("precio");
  const inputStock = document.getElementById("stock");
  const inputDescripcion = document.getElementById("descripcion");

  // 2. OBTENER VALORES
  const codigo = inputCodigo.value.trim();
  const categoria = inputCategoria.value;
  const nombre = inputNombre.value.trim();
  const precio = Number(inputPrecio.value);
  const stock = Number(inputStock.value);
  const descripcion = inputDescripcion.value.trim();

  // 3. ERRORES
  const errorCodigo = document.getElementById("errorCodigo");
  const errorCategoria = document.getElementById("errorCategoria");
  const errorNombre = document.getElementById("errorNombre");
  const errorPrecio = document.getElementById("errorPrecio");
  const errorStock = document.getElementById("errorStock");
  const errorDescripcion = document.getElementById("errorDescripcion");
  const mensajeFinal = document.getElementById("mensajeFinal");

  // 4. LIMPIAR ESTADOS
  const inputs = [inputCodigo, inputCategoria, inputNombre, inputPrecio, inputStock, inputDescripcion];
  const errores = [errorCodigo, errorCategoria, errorNombre, errorPrecio, errorStock, errorDescripcion];

  inputs.forEach(el => el.classList.remove("is-invalid"));
  errores.forEach(el => el.textContent = "");
  mensajeFinal.textContent = "";

  let esValido = true;

  // VALIDAR CÓDIGO (3 a 10 caracteres)
  if (codigo === "") {
    errorCodigo.textContent = "El código es obligatorio.";
    inputCodigo.classList.add("is-invalid");
    esValido = false;
  } else if (codigo.length < 3 || codigo.length > 10) {
    errorCodigo.textContent = "Debe tener entre 3 y 10 caracteres.";
    inputCodigo.classList.add("is-invalid");
    esValido = false;
  }

  // VALIDAR CATEGORÍA
  if (categoria === "") {
    errorCategoria.textContent = "Seleccione una categoría.";
    inputCategoria.classList.add("is-invalid");
    esValido = false;
  }

  // VALIDAR NOMBRE (Máx 60)
  if (nombre === "") {
    errorNombre.textContent = "El nombre del producto es obligatorio.";
    inputNombre.classList.add("is-invalid");
    esValido = false;
  } else if (nombre.length > 60) {
    errorNombre.textContent = "El nombre no puede superar los 60 caracteres.";
    inputNombre.classList.add("is-invalid");
    esValido = false;
  }

  // VALIDAR PRECIO (Número positivo)
  if (inputPrecio.value.trim() === "") {
    errorPrecio.textContent = "El precio es obligatorio.";
    inputPrecio.classList.add("is-invalid");
    esValido = false;
  } else if (isNaN(precio) || precio <= 0) {
    errorPrecio.textContent = "Ingrese un precio mayor a $0.";
    inputPrecio.classList.add("is-invalid");
    esValido = false;
  }

  // VALIDAR STOCK (Número >= 0)
  if (inputStock.value.trim() === "") {
    errorStock.textContent = "El stock es obligatorio.";
    inputStock.classList.add("is-invalid");
    esValido = false;
  } else if (isNaN(stock) || stock < 0) {
    errorStock.textContent = "El stock no puede ser negativo.";
    inputStock.classList.add("is-invalid");
    esValido = false;
  }

  // VALIDAR DESCRIPCIÓN (Máx 250)
  if (descripcion === "") {
    errorDescripcion.textContent = "La descripción es obligatoria.";
    inputDescripcion.classList.add("is-invalid");
    esValido = false;
  } else if (descripcion.length > 250) {
    errorDescripcion.textContent = "La descripción no puede superar los 250 caracteres.";
    inputDescripcion.classList.add("is-invalid");
    esValido = false;
  }

  // RESULTADO
  if (esValido) {
    mensajeFinal.textContent = "¡Producto guardado exitosamente!";
    mensajeFinal.style.color = "green";
  } else {
    mensajeFinal.textContent = "Por favor, solucione los errores indicados.";
    mensajeFinal.style.color = "red";
  }
});