// NEXO — capa REGLA.
// Este archivo no toca la pantalla. Recibe los tres datos del caso y devuelve el
// resultado escrito en lenguaje claro. Solo están las dos reglas del encargo:
// aquí no se agrega ninguna otra y no se inventan competencias.

(function (global) {
  "use strict";

  var REGLA_1 = {
    numero: 1,
    titulo: "Regla 1: el origen es una residencia particular",
    texto: "Si el origen del ruido o la molestia es una residencia particular (por ejemplo, " +
      "la fiesta de un vecino), se detiene la ruta ambiental: el caso es un asunto de " +
      "convivencia ciudadana y debe dirigirse a la Policía o a la Inspección de Policía. " +
      "Queda cerrada la opción de enviar peticiones a la Secretaría de Ambiente."
  };

  var REGLA_2 = {
    numero: 2,
    titulo: "Regla 2: ruido de local comercial y solo fotos",
    texto: "Si el problema es ruido de un local comercial y las pruebas aportadas hoy son " +
      "solo fotos, la prueba se califica como insuficiente, porque las fotos no miden " +
      "decibeles. Se agrega a la lista de tareas del ciudadano la recolección de videos " +
      "continuos desde la calle con fecha y hora, o de una bitácora de perturbación."
  };

  var NOMBRES = {
    contaminacion: {
      ruido: "Ruido",
      basuras: "Basuras",
      vertimientos: "Vertimientos"
    },
    origen: {
      residencia: "Residencia particular (casa o apartamento de un vecino)",
      local: "Local comercial (bar, tienda, taller, restaurante)",
      obra: "Obra pública"
    },
    pruebas: {
      ninguna: "Ninguna",
      fotos: "Fotos sueltas",
      videos: "Videos",
      firmas: "Recolección de firmas"
    }
  };

  var SIN_ENTIDAD = "La aplicación no tiene una regla escrita que diga qué entidad es " +
    "competente en este caso. Queda por definir: no la inventamos.";

  // Recibe { contaminacion, origen, pruebas } y devuelve el resultado.
  function evaluarCaso(caso) {
    var faltantes = [];

    if (!caso.contaminacion) { faltantes.push("El tipo de contaminación"); }
    if (!caso.origen) { faltantes.push("El origen del problema"); }
    if (!caso.pruebas) { faltantes.push("El formato de las pruebas aportadas hoy"); }

    // Si falta un dato, la aplicación lo pide y no opina.
    if (faltantes.length > 0) {
      return {
        estado: "faltan_datos",
        faltantes: faltantes,
        reglasUsadas: [],
        entidad: null,
        entidadTexto: "",
        tareas: [],
        quedaFuera: [
          "No se opina sobre el caso mientras falte un dato.",
          "No se dice qué entidad es competente."
        ]
      };
    }

    var reglasUsadas = [];
    var entidad = null;
    var entidadTexto = SIN_ENTIDAD;
    var tareas = [];
    var quedaFuera = [];

    // Regla 1.
    if (caso.origen === "residencia") {
      reglasUsadas.push(REGLA_1);
      entidad = "Policía o Inspección de Policía";
      entidadTexto = "Asunto de convivencia ciudadana. Se detiene la ruta ambiental y queda " +
        "cerrada la opción de enviar peticiones a la Secretaría de Ambiente.";
      quedaFuera.push("La ruta ambiental y cualquier petición a la Secretaría de Ambiente.");
    }

    // Regla 2. El campo de pruebas es de una sola opción, así que «fotos» significa
    // que solo hay fotos.
    if (caso.contaminacion === "ruido" && caso.origen === "local" && caso.pruebas === "fotos") {
      reglasUsadas.push(REGLA_2);
      tareas.push("Recolectar una de estas dos pruebas: (1) videos continuos desde la calle, " +
        "con fecha y hora visibles; o (2) una bitácora de perturbación, con el día, la hora " +
        "y qué se escuchó o se sintió.");
    }

    if (entidad === null) {
      quedaFuera.push("Decir qué entidad es competente en este caso.");
    }

    quedaFuera.push("Predecir lo que hará un juez, una autoridad o la contraparte.");
    quedaFuera.push("Redactar el derecho de petición o armar un formato de queja.");
    quedaFuera.push("Decidir por la persona: el criterio queda en manos del estudiante.");

    return {
      estado: reglasUsadas.length > 0 ? "regla_aplicada" : "sin_regla",
      faltantes: [],
      reglasUsadas: reglasUsadas,
      entidad: entidad,
      entidadTexto: entidadTexto,
      tareas: tareas,
      quedaFuera: quedaFuera
    };
  }

  global.NEXO_REGLAS = {
    evaluarCaso: evaluarCaso,
    nombres: NOMBRES,
    regla1: REGLA_1,
    regla2: REGLA_2,
    sinEntidad: SIN_ENTIDAD
  };
})(window);
