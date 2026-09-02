document.getElementById("formularioUsuario").addEventListener("submit", function (event) {
  event.preventDefault();


  const inputRun = document.getElementById("run");
  const inputNombre = document.getElementById("nombre");
  const inputApellidos = document.getElementById("apellidos");
  const inputCorreo = document.getElementById("correo");
  const selectTipoUsuario = document.getElementById("tipoUsuario");
  const inputDireccion = document.getElementById("direccion");

  const run = inputRun.value.trim();
  const nombre = inputNombre.value.trim();
  const apellidos = inputApellidos.value.trim();
  const correo = inputCorreo.value.trim().toLowerCase();
  const tipoUsuario = selectTipoUsuario.value;
  const direccion = inputDireccion.value.trim();


  const errorRun = document.getElementById("errorRun");
  const errorNombre = document.getElementById("errorNombre");
  const errorApellidos = document.getElementById("errorApellidos");
  const errorCorreo = document.getElementById("errorCorreo");
  const errorTipoUsuario = document.getElementById("errorTipoUsuario");
  const errorDireccion = document.getElementById("errorDireccion");
  const mensajeFinal = document.getElementById("mensajeFinal");


  errorRun.textContent = "";
  errorNombre.textContent = "";
  errorApellidos.textContent = "";
  errorCorreo.textContent = "";
  errorTipoUsuario.textContent = "";
  errorDireccion.textContent = "";
  mensajeFinal.textContent = "";

  inputRun.classList.remove("is-invalid");
  inputNombre.classList.remove("is-invalid");
  inputApellidos.classList.remove("is-invalid");
  inputCorreo.classList.remove("is-invalid");
  selectTipoUsuario.classList.remove("is-invalid");
  inputDireccion.classList.remove("is-invalid");

  let formularioValido = true;


  if (run === "") {
    errorRun.textContent = "El RUN es obligatorio.";
    inputRun.classList.add("is-invalid");
    formularioValido = false;
  } else if (run.length < 7 || run.length > 9) {
    errorRun.textContent = "El RUN debe tener entre 7 y 9 caracteres (ej: 19011022K).";
    inputRun.classList.add("is-invalid");
    formularioValido = false;
  } else if (!validarRutChileno(run)) {
    errorRun.textContent = "El RUN ingresado no es válido.";
    inputRun.classList.add("is-invalid");
    formularioValido = false;
  }


  if (nombre === "") {
    errorNombre.textContent = "El nombre es obligatorio.";
    inputNombre.classList.add("is-invalid");
    formularioValido = false;
  } else if (nombre.length > 50) {
    errorNombre.textContent = "El nombre no puede tener más de 50 caracteres.";
    inputNombre.classList.add("is-invalid");
    formularioValido = false;
  }


  if (apellidos === "") {
    errorApellidos.textContent = "Los apellidos son obligatorios.";
    inputApellidos.classList.add("is-invalid");
    formularioValido = false;
  } else if (apellidos.length > 100) {
    errorApellidos.textContent = "Los apellidos no pueden tener más de 100 caracteres.";
    inputApellidos.classList.add("is-invalid");
    formularioValido = false;
  }


  if (correo === "") {
    errorCorreo.textContent = "El correo es obligatorio.";
    inputCorreo.classList.add("is-invalid");
    formularioValido = false;
  } else if (correo.length > 100) {
    errorCorreo.textContent = "El correo no puede tener más de 100 caracteres.";
    inputCorreo.classList.add("is-invalid");
    formularioValido = false;
  } else if (
    !correo.endsWith("@duoc.cl") &&
    !correo.endsWith("@profesor.duoc.cl") &&
    !correo.endsWith("@gmail.com")
  ) {
    errorCorreo.textContent = "Solo se permiten correos @duoc.cl, @profesor.duoc.cl o @gmail.com";
    inputCorreo.classList.add("is-invalid");
    formularioValido = false;
  }


  if (tipoUsuario === "") {
    errorTipoUsuario.textContent = "Debe seleccionar un tipo de usuario.";
    selectTipoUsuario.classList.add("is-invalid");
    formularioValido = false;
  }


  if (direccion === "") {
    errorDireccion.textContent = "La dirección es obligatoria.";
    inputDireccion.classList.add("is-invalid");
    formularioValido = false;
  } else if (direccion.length > 300) {
    errorDireccion.textContent = "La dirección no puede superar los 300 caracteres.";
    inputDireccion.classList.add("is-invalid");
    formularioValido = false;
  }


  if (formularioValido) {
    mensajeFinal.textContent = "¡Usuario creado exitosamente!";
    mensajeFinal.style.color = "green";
  } else {
    mensajeFinal.textContent = "Por favor, corrija los campos marcados.";
    mensajeFinal.style.color = "red";
  }
});


// Función auxiliar para calcular el dígito verificador del RUN
function validarRutChileno(rut) {
  const rutLimpio = rut.toUpperCase();
  if (!/^[0-9]{7,8}[0-9K]$/.test(rutLimpio)) return false;

  const cuerpo = rutLimpio.slice(0, -1);
  const dvIngresado = rutLimpio.slice(-1);

  let suma = 0;
  let multiplicador = 2;

  for (let i = cuerpo.length - 1; i >= 0; i--) {
    suma += parseInt(cuerpo.charAt(i), 10) * multiplicador;
    multiplicador = multiplicador < 7 ? multiplicador + 1 : 2;
  }

  const mod = 11 - (suma % 11);
  let dvEsperado = "";

  if (mod === 11) dvEsperado = "0";
  else if (mod === 10) dvEsperado = "K";
  else dvEsperado = mod.toString();

  return dvIngresado === dvEsperado;
}