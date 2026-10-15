// NEXO — pantalla «La revisión». Capa INTERFAZ.
// Toma los tres datos que vienen en la dirección, se los pasa a la capa de regla
// (reglas.js) y pinta el resultado. Aquí no hay reglas escritas ni cálculos propios.

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
  var contenedor = document.getElementById("resultado");

  function lineaDireccion(extra) {
    var datos = new URLSearchParams();
    ["contaminacion", "origen", "pruebas"].forEach(function (nombre) {
      datos.set(nombre, caso[nombre]);
    });
    if (esEjemplo) { datos.set("ejemplo", "1"); }
    return extra + "?" + datos.toString();
  }

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

  function nombre(campo) {
    return reglas.nombres[campo][caso[campo]] || "Sin dato";
  }

  function mostrarResumen() {
    parrafo("Caso revisado: " + nombre("contaminacion") + " · " + nombre("origen") +
      " · " + nombre("pruebas") + ".", "resumen");
  }

  function mostrarFaltantes(resultado) {
    titulo("Falta un dato para poder revisar");
    parrafo("Todavía no podemos decir nada del caso. Necesitamos:");
    lista(resultado.faltantes);
    parrafo("Vuelve a la pantalla del caso, completa el dato que falta y revisa otra vez. " +
      "La aplicación no opina mientras falte un dato.", "nota");
    var volver = document.createElement("a");
    volver.className = "boton";
    volver.href = lineaDireccion("caso.html");
    volver.textContent = "Corregir el caso →";
    contenedor.appendChild(volver);
  }

  function mostrarResultado(resultado) {
    titulo("Qué ocurre");
    if (resultado.estado === "sin_regla") {
      parrafo("Ninguna de las dos reglas escritas cubre esta combinación todavía. " +
        "La aplicación no inventa una respuesta para llenar el hueco.", "sin-regla");
    } else {
      parrafo("El caso entra en " + resultado.reglasUsadas.length +
        (resultado.reglasUsadas.length === 1 ? " regla escrita." : " reglas escritas."));
    }

    titulo("Qué regla se usó");
    if (resultado.reglasUsadas.length === 0) {
      parrafo("Ninguna.");
    } else {
      resultado.reglasUsadas.forEach(function (regla) {
        var caja = document.createElement("div");
        caja.className = "regla";
        var h = document.createElement("h3");
        h.textContent = "Regla " + regla.numero + ": " + regla.titulo;
        var p = document.createElement("p");
        p.textContent = regla.texto;
        caja.appendChild(h);
        caja.appendChild(p);
        contenedor.appendChild(caja);
      });
    }

    titulo("Entidad a la que se dirige el caso");
    if (resultado.entidad) {
      parrafo(resultado.entidad, "entidad definida");
      parrafo(resultado.entidadTexto, "nota");
    } else {
      parrafo("Sin definir.", "entidad pendiente");
      parrafo(resultado.entidadTexto, "nota");
    }

    titulo("Lista de tareas del ciudadano");
    if (resultado.tareas.length === 0) {
      parrafo("Estas reglas no agregan tareas de pruebas para este caso.");
    } else {
      parrafo("Lo que el ciudadano quedó debiendo:");
      lista(resultado.tareas);
    }

    titulo("Qué queda expresamente fuera");
    lista(resultado.quedaFuera);

    var enlace = document.createElement("a");
    enlace.className = "boton";
    enlace.href = lineaDireccion("memoria.html");
    enlace.textContent = "Dejar constancia (la memoria) →";
    var cajaEnlace = document.createElement("p");
    cajaEnlace.className = "siguiente";
    cajaEnlace.appendChild(enlace);
    contenedor.appendChild(cajaEnlace);

    var corregir = document.createElement("p");
    corregir.className = "volver";
    var enlaceCorregir = document.createElement("a");
    enlaceCorregir.href = lineaDireccion("caso.html");
    enlaceCorregir.textContent = "← Corregir el caso";
    corregir.appendChild(enlaceCorregir);
    contenedor.appendChild(corregir);
  }

  var resultado = reglas.evaluarCaso(caso);
  mostrarResumen();
  if (resultado.estado === "faltan_datos") {
    mostrarFaltantes(resultado);
  } else {
    mostrarResultado(resultado);
  }
})();
