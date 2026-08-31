const formulario =
    document.getElementById("formularioLogin");

formulario.addEventListener(
    "submit",
    function (event) {

        // ---------------------------------------
        // EVITAR ENVÍO AUTOMÁTICO
        // ---------------------------------------

        event.preventDefault();


        // ---------------------------------------
        // OBTENER CAMPOS
        // ---------------------------------------

        const inputCorreo =
            document.getElementById("correo");

        const inputPassword =
            document.getElementById("password");


        // ---------------------------------------
        // OBTENER VALORES
        // ---------------------------------------

        const correo =
            inputCorreo.value.trim();

        const password =
            inputPassword.value;


        // ---------------------------------------
        // OBTENER ÁREAS DE ERROR
        // ---------------------------------------

        const errorCorreo =
            document.getElementById("errorCorreo");

        const errorPassword =
            document.getElementById("errorPassword");

        const mensajeFinal =
            document.getElementById("mensajeFinal");


        // ---------------------------------------
        // LIMPIAR ERRORES ANTERIORES
        // ---------------------------------------

        errorCorreo.textContent = "";
        errorPassword.textContent = "";

        mensajeFinal.textContent = "";
        mensajeFinal.className = "mt-3";

        inputCorreo.classList.remove("is-invalid");
        inputPassword.classList.remove("is-invalid");


        // ---------------------------------------
        // SUPONEMOS QUE TODO ESTÁ CORRECTO
        // ---------------------------------------

        let formularioValido = true;


        // ---------------------------------------
        // VALIDAR CORREO
        // ---------------------------------------

        if (correo === "") {

            errorCorreo.textContent =
                "El correo electrónico es obligatorio.";

            inputCorreo.classList.add("is-invalid");

            formularioValido = false;

        } else if (
            !correo.includes("@") ||
            !correo.includes(".")
        ) {

            errorCorreo.textContent =
                "Ingresa un correo válido, por ejemplo nombre@correo.cl.";

            inputCorreo.classList.add("is-invalid");

            formularioValido = false;

        }


        // ---------------------------------------
        // VALIDAR CONTRASEÑA
        // ---------------------------------------

        if (password === "") {

            errorPassword.textContent =
                "La contraseña es obligatoria.";

            inputPassword.classList.add("is-invalid");

            formularioValido = false;

        } else if (password.length < 6) {

            errorPassword.textContent =
                "La contraseña debe tener al menos 6 caracteres.";

            inputPassword.classList.add("is-invalid");

            formularioValido = false;

        }


        // ---------------------------------------
        // RESULTADO FINAL
        // ---------------------------------------

        if (formularioValido) {

            mensajeFinal.textContent =
                "Sesión iniciada correctamente. ¡Bienvenido/a de nuevo!";

            mensajeFinal.className =
                "alert alert-success mt-3";

        } else {

            mensajeFinal.textContent =
                "Revisa los campos marcados antes de continuar.";

            mensajeFinal.className =
                "alert alert-danger mt-3";

        }

    }
);
