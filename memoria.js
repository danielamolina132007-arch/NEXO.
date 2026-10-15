// NEXO — pantalla «La memoria». Capa MEMORIA.
// Arma la constancia del caso de práctica: el caso inventado, la fecha del día y la
// regla aplicada. No guarda nada en el computador: no usa base de datos, ni archivos,
// ni memoria del navegador. Solo pinta lo que ya está en la pantalla.

(function () {
  "use strict";

  var reglas = window.NEXO_REGLAS;
  var parametros = new URLSearchParams(window.location.search);

  var caso = {
    contaminacion: parametros.get("contaminacion") || "",
    origen: parametros.get("origen") || "",
    pruebas: parametros.get("pruebas") || ""
  };

  var esEjemplo = parametros.get("ejemplo") === "1";
  var contenedor = document.getElementById("constancia");

  var TITULO_EJEMPLO = "El bar de la esquina (ruido excesivo)";
  var RELATO_EJEMPLO = "«Mire, abrieron un bar de cócteles hace tres meses en la esquina " +
    "de mi cuadra, que es netamente residencial. Ponen música a todo volumen de jueves a " +
    "domingo hasta las 3:00 de la mañana. No podemos dormir, mis ventanas vibran. Fui a " +
    "hablar con el dueño y me ignoró, dice que él tiene permiso de funcionamiento.»";

  function titulo(texto, clase) {
    var h = document.createElement("h2");
    h.textContent = texto;
    if (clase) { h.className = clase; }
    contenedor.appendChild(h);
  }

  function parrafo(texto, clase) {
    var p = document.createElement("p");
    p.textContent = texto;
    if (clase) { p.className = clase; }
    contenedor.appendChild(p);
    return p;
  }

  function lista(items) {
    var ul = document.createElement("ul");
    items.forEach(function (texto) {
      var li = document.createElement("li");
      li.textContent = texto;
      ul.appendChild(li);
    });
    contenedor.appendChild(ul);
  }

  function fechaDeHoy() {
    var hoy = new Date();
    try {
      return hoy.toLocaleDateString("es-CO", { day: "numeric", month: "long", year: "numeric" });
    } catch (error) {
      return hoy.getDate() + "/" + (hoy.getMonth() + 1) + "/" + hoy.getFullYear();
    }
  }

  function nombre(campo) {
    return reglas.nombres[campo][caso[campo]] || "Sin dato";
  }

  var resultado = reglas.evaluarCaso(caso);

  parrafo("Fecha de la constancia: " + fechaDeHoy() + ".", "resumen");

  if (resultado.estado === "faltan_datos") {
    titulo("No hay constancia que dejar todavía");
    parrafo("Faltan datos del caso y la aplicación no opina ni completa nada por su cuenta:");
    lista(resultado.faltantes);
    var enlace = document.createElement("a");
    enlace.className = "boton";
    enlace.href = "caso.html";
    enlace.textContent = "Volver al caso →";
    contenedor.appendChild(enlace);
    return;
  }

  titulo("Caso de práctica");
  if (esEjemplo) {
    parrafo(TITULO_EJEMPLO + " (caso inventado).", "ejemplo-titulo");
    parrafo(RELATO_EJEMPLO, "relato");
  } else {
    parrafo("Caso inventado por el estudiante para practicar. No se registran datos de " +
      "personas reales.");
  }

  titulo("Datos que se usaron");
  lista([
    "Tipo de contaminación: " + nombre("contaminacion") + ".",
    "Origen del problema: " + nombre("origen") + ".",
    "Formato de las pruebas aportadas hoy: " + nombre("pruebas") + "."
  ]);

  titulo("Regla aplicada");
  if (resultado.reglasUsadas.length === 0) {
    parrafo("Ninguna de las dos reglas escritas cubre este caso.");
  } else {
    resultado.reglasUsadas.forEach(function (regla) {
      parrafo("Regla " + regla.numero + ": " + regla.titulo + ".", "regla-titulo");
      parrafo(regla.texto);
    });
  }

  titulo("Entidad");
  if (resultado.entidad) {
    parrafo(resultado.entidad, "entidad definida");
  } else {
    parrafo("Sin definir. " + resultado.entidadTexto, "entidad pendiente");
  }

  titulo("Tareas que el ciudadano quedó debiendo");
  if (resultado.tareas.length === 0) {
    parrafo("Ninguna. Estas reglas no agregan tareas de pruebas para este caso.");
  } else {
    lista(resultado.tareas);
  }

  titulo("Qué queda expresamente fuera");
  lista(resultado.quedaFuera);

  parrafo("Constancia de un caso inventado. Esto no es asesoría jurídica y no reemplaza " +
    "el análisis del estudiante.", "nota");
})();
