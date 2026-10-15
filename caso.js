// NEXO — comportamiento de la pantalla «El caso». Capa INTERFAZ.
// Llena el ejemplo inventado y lleva los tres datos a la pantalla de revisión.
// No evalúa reglas, no calcula entidades y no guarda nada: los datos viajan en la
// dirección de la página, que no es una base de datos.

var CASO_INVENTADO = {
  contaminacion: "ruido",
  origen: "local",
  pruebas: "fotos"
};

var CAMPOS = ["contaminacion", "origen", "pruebas"];

var formulario = document.getElementById("formulario-caso");
var confirmacion = document.getElementById("confirmacion-ejemplo");
var ejemploCargado = false;

// Si el estudiante vuelve desde «La revisión», los datos vienen en la dirección.
(function recuperarDatos() {
  var parametros = new URLSearchParams(window.location.search);
  CAMPOS.forEach(function (nombre) {
    var valor = parametros.get(nombre);
    if (valor) { formulario.elements[nombre].value = valor; }
  });
  ejemploCargado = parametros.get("ejemplo") === "1";
})();

document.getElementById("boton-ejemplo").addEventListener("click", function () {
  CAMPOS.forEach(function (nombre) {
    formulario.elements[nombre].value = CASO_INVENTADO[nombre];
  });
  ejemploCargado = true;
  confirmacion.textContent =
    "Ejemplo cargado: ruido, local comercial, fotos sueltas. Revisa los campos antes de seguir.";
});

// Si el estudiante cambia algo a mano, el caso deja de ser el ejemplo.
CAMPOS.forEach(function (nombre) {
  formulario.elements[nombre].addEventListener("change", function () {
    ejemploCargado = false;
    confirmacion.textContent = "";
  });
});

document.getElementById("boton-revisar").addEventListener("click", function () {
  var datos = new URLSearchParams();
  CAMPOS.forEach(function (nombre) {
    datos.set(nombre, formulario.elements[nombre].value);
  });
  if (ejemploCargado) { datos.set("ejemplo", "1"); }
  window.location.href = "revision.html?" + datos.toString();
});
