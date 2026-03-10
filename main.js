let totalPreguntas = 0;
let preguntasCorrectas = 0;
let archivoActual = '';

async function cargarPreguntas(archivo) {
  const response = await fetch("data/" + archivo);
  let preguntasTxt = await response.text();
  preguntasTxt = preguntasTxt
    .replace(/\r\n/g, "\n")
    .replace(/\r/g, "\n")
    .trim();
  return preguntasTxt;
}

async function cargarMultiplesArchivos(archivos) {
  let todasLasPreguntas = [];
  
  // Cargar cada archivo y combinar las preguntas
  for (const archivo of archivos) {
    try {
      const preguntasTxt = await cargarPreguntas(archivo);
      const preguntasDelArchivo = preguntasTxt.split(/\n{2,}/).map((preguntaTxt) => {
        const [pregunta, respuesta, ...opciones] = preguntaTxt.split("\n");
        const respuestasCorrectasOriginal = respuesta.split(',').map(r => parseInt(r.trim()));
        
        // Detectar duplicados
        const respuestasUnicas = Array.from(new Set(respuestasCorrectasOriginal));
        const hasDuplicates = respuestasCorrectasOriginal.length !== respuestasUnicas.length;
        
        const opcionesMezcladas = shuffleArray([...opciones]);
        const respuestasMezcladas = respuestasUnicas.map(r => opcionesMezcladas.indexOf(opciones[r - 1]) + 1);
        
        return { 
          pregunta, 
          respuestas: respuestasMezcladas, 
          opciones: opcionesMezcladas,
          multiple: hasDuplicates || respuestasMezcladas.length > 1
        };
      });
      
      todasLasPreguntas = todasLasPreguntas.concat(preguntasDelArchivo);
    } catch (error) {
      console.error(`Error cargando el archivo ${archivo}:`, error);
    }
  }
  
  return todasLasPreguntas;
}

document.getElementById("resumenBtn").addEventListener("click", function() {
  if (archivoActual === "SDSFULL") {
    // Almacenamos la lista de archivos en sessionStorage para recuperarla en la página de resumen
    sessionStorage.setItem("sdsfullArchivos", JSON.stringify([
      "sds01-presentacionPreguntas.txt",
      "sds02-introgoPreguntas.txt",
      "sds03-introcriptoPreguntas.txt", 
      "sds04-aleatoriosPreguntas.txt",
      "sds05-flujoPreguntas.txt",
      "sds06-bloquePreguntas.txt",
      "sds07-hashPreguntas.txt",
      "sds08-publicaPreguntas.txt",
      "sds09-transportePreguntas.txt",
      "sds10-ejerciciosPreguntas.txt",
      "sds11-malwarePreguntas.txt",
      "sds12-ataquesPreguntas.txt",
      "sds13-wirelessPreguntas.txt",
      "sds14-recomendacionesPreguntas.txt"
    ]));
    window.location.href = "resumen.html?preguntas=SDSFULL";
  } else {
    window.location.href = "resumen.html?preguntas=" + archivoActual;
  }
});

let preguntas = [];

function hideElement(id) {
  document.getElementById(id).classList.add("hidden");
}

function showElement(id) {
  document.getElementById(id).classList.remove("hidden");
}

function cerrarTodasLasSublistas() {
  // Obtener todas las sublistas (elementos que terminan con -sublist)
  const sublistas = document.querySelectorAll('[id$="-sublist"]');
  // Ocultar cada sublista
  sublistas.forEach(sublista => {
    sublista.style.display = "none";
  });
}

function iniciarAsignatura(archivo) {
  resetAppState(); // Llama a resetAppState al iniciar una asignatura
  document.getElementById("resumenBtn").style.display = "block";
  document.getElementById("copyButton").style.display = "block";
  archivoActual = archivo;

  const asignaturaNombre = archivo.split("Preguntas.txt")[0].toUpperCase();
  document.getElementById("asignatura-nombre").innerText = asignaturaNombre;

  cargarPreguntas(archivo).then((preguntasTxt) => {
    preguntas = preguntasTxt.split(/\n{2,}/).map((preguntaTxt) => {
      const [pregunta, respuesta, ...opciones] = preguntaTxt.split("\n");
      const respuestasCorrectasOriginal = respuesta.split(',').map(r => parseInt(r.trim()));
      
      // Detectar duplicados
      const respuestasUnicas = Array.from(new Set(respuestasCorrectasOriginal));
      const hasDuplicates = respuestasCorrectasOriginal.length !== respuestasUnicas.length;
      
      const opcionesMezcladas = shuffleArray([...opciones]);
      const respuestasMezcladas = respuestasUnicas.map(r => opcionesMezcladas.indexOf(opciones[r - 1]) + 1);
      
      return { 
        pregunta, 
        respuestas: respuestasMezcladas, 
        opciones: opcionesMezcladas,
        multiple: hasDuplicates || respuestasMezcladas.length > 1
      };
    });

    document.getElementById("total-preguntas").innerText = `Total: ${preguntas.length}`;

    shuffle(preguntas);
    mostrarPregunta();
  });

  hideElement("asignaturas-container");
  hideElement("app-title");
  showElement("verificar");
  showElement("volver");
  showElement("total-preguntas"); // Muestra el elemento al seleccionar una asignatura
  showElement("contador"); // Muestra el elemento al seleccionar una asignatura
}

document.getElementById("volver").addEventListener("click", () => {
  resetAppState(); // Llama a resetAppState al hacer clic en "Volver"
  resetearContador();
  hideElement("total-preguntas"); // Oculta el elemento al hacer clic en "Volver"
  hideElement("contador"); // Oculta el elemento al hacer clic en "Volver"
  document.getElementById("asignatura-nombre").innerHTML = `
    <span class="title-main">Preguntas y Respuestas</span>
    <span class="title-badge">Community Edition</span>
  `;
  document.querySelector("#resumenBtn").style.display = "none";
  document.querySelector("#copyButton").style.display = "none";
});

// [Mantén todos los listeners de asignaturas existentes]

// Manejo de la sublista de ac-NO-OFICIAL
document.getElementById("ac").addEventListener("click", () => {
  const sublist = document.getElementById("ac-sublist");
    if (sublist.style.display === "none") {
    cerrarTodasLasSublistas();
    sublist.style.display = "block";
  } else {
    sublist.style.display = "none";
  }
});

// Asegúrate de mantener los listeners para todas las asignaturas
document.getElementById("ac_CP-F2").addEventListener("click", () => {
  iniciarAsignatura("ac_CP-F2_Preguntas.txt");
});

document.getElementById("ac_CP-F3").addEventListener("click", () => {
  iniciarAsignatura("ac_CP-F3_Preguntas.txt");
});

document.getElementById("ac_CT3-4").addEventListener("click", () => {
  iniciarAsignatura("ac_CT3-4_Preguntas.txt");
});

document.getElementById("ac_CT1-2").addEventListener("click", () => {
  iniciarAsignatura("ac_CT1-2_Preguntas.txt");
});

document.getElementById("dss").addEventListener("click", () => {
  iniciarAsignatura("dssPreguntas.txt");
});

document.getElementById("gpi").addEventListener("click", () => {
  iniciarAsignatura("gpiPreguntas.txt");
});

document.getElementById("ic-p1").addEventListener("click", () => {
  iniciarAsignatura("ic-p1.txt");
});

document.getElementById("taes-definitivo").addEventListener("click", () => {
  iniciarAsignatura("taesDefinitivoPreguntas.txt");
});

document.getElementById("ppss").addEventListener("click", () => {
  const sublist = document.getElementById("ppss-sublist");
    if (sublist.style.display === "none") {
    cerrarTodasLasSublistas();
    sublist.style.display = "block";
  } else {
    sublist.style.display = "none";
  }
});

document.getElementById("ppss-p1").addEventListener("click", () => {
  iniciarAsignatura("ppss-p1Preguntas.txt");
});

document.getElementById("ppss-p2").addEventListener("click", () => {
  iniciarAsignatura("ppss-p2Preguntas.txt");
});

document.getElementById("ada").addEventListener("click", () => {
  const sublist = document.getElementById("ada-sublist");
    if (sublist.style.display === "none") {
    cerrarTodasLasSublistas();
    sublist.style.display = "block";
  } else {
    sublist.style.display = "none";
  }
});

document.getElementById("ada-full").addEventListener("click", () => {
  iniciarAsignatura("adaPreguntas.txt");
});

// document.getElementById("ada_descartadas").addEventListener("click", () => {
//   iniciarAsignatura("ada_descartadasPreguntas.txt");
// });

document.getElementById("ada-p2").addEventListener("click", () => {
  iniciarAsignatura("ada-p2Preguntas.txt");
});

document.getElementById("ada-p1").addEventListener("click", () => {
  iniciarAsignatura("ada-p1Preguntas.txt");
});

document.getElementById("redes").addEventListener("click", () => {
  const sublist = document.getElementById("redes-sublist");
    if (sublist.style.display === "none") {
    cerrarTodasLasSublistas();
    sublist.style.display = "block";
  } else {
    sublist.style.display = "none";
  }
});

document.getElementById("redes_full").addEventListener("click", () => {
  const archivosREDESParaCargar = [
    "redesPreguntas.txt",
    "redesEnero2324Preguntas.txt",
    "redesEnero2425Preguntas.txt",
    "redesJulio2425Preguntas.txt",
    "redesEnero2526Preguntas.txt"
  ];

  // Restablecer el estado de la aplicación
  resetAppState();
  document.getElementById("resumenBtn").style.display = "block";
  document.getElementById("copyButton").style.display = "block";
  archivoActual = "REDESFULL";

  // Nombre visible arriba
  document.getElementById("asignatura-nombre").innerText = "REDESFULL";

  // Cargar y procesar todos los archivos de REDES
  cargarMultiplesArchivos(archivosREDESParaCargar).then((todasLasPreguntas) => {
    preguntas = todasLasPreguntas;
    document.getElementById("total-preguntas").innerText = `Total: ${preguntas.length}`;

    shuffle(preguntas);
    mostrarPregunta();
  });

  // UI
  hideElement("asignaturas-container");
  hideElement("app-title");
  showElement("verificar");
  showElement("volver");
  showElement("total-preguntas");
  showElement("contador");
});


document.getElementById("redesEnero2324").addEventListener("click", () => {
  iniciarAsignatura("redesEnero2324Preguntas.txt");
});

document.getElementById("redesEnero2425").addEventListener("click", () => {
  iniciarAsignatura("redesEnero2425Preguntas.txt");
});

document.getElementById("redesJulio2425").addEventListener("click", () => {
  iniciarAsignatura("redesJulio2425Preguntas.txt");
});

document.getElementById("redesEnero2526").addEventListener("click", () => {
  iniciarAsignatura("redesEnero2526Preguntas.txt");
});

document.getElementById("hada").addEventListener("click", () => {
  iniciarAsignatura("hadaPreguntas.txt");
});

document.getElementById("ped").addEventListener("click", () => {
  iniciarAsignatura("pedPreguntas.txt");
});

document.getElementById("sti").addEventListener("click", () => {
  iniciarAsignatura("stiPreguntas.txt");
});

// document.getElementById("si").addEventListener("click", () => {
//   iniciarAsignatura("siPreguntas.txt");
// });

// document.getElementById("adi").addEventListener("click", () => {
//   iniciarAsignatura("adiPreguntas.txt");
// });

// Manejo de la sublista de DCA
document.getElementById("dca").addEventListener("click", () => {
  const sublist = document.getElementById("dca-sublist");
    if (sublist.style.display === "none") {
    cerrarTodasLasSublistas();
    sublist.style.display = "block";
  } else {
    sublist.style.display = "none";
  }
});

document.getElementById("dca-oficial").addEventListener("click", () => {
  iniciarAsignatura("dcaPreguntas.txt");
});

document.getElementById("dca-NO-OFICIAL").addEventListener("click", () => {
  iniciarAsignatura("dca-NO-OFICIALPreguntas.txt");
});

document.getElementById("MADS-NO-OFICIAL").addEventListener("click", () => {
  const sublist = document.getElementById("mads-sublist");
    if (sublist.style.display === "none") {
    cerrarTodasLasSublistas();
    sublist.style.display = "block";
  } else {
    sublist.style.display = "none";
  }
});

document.getElementById("MADS-NO-OFICIAL-P1").addEventListener("click", () => {
  iniciarAsignatura("MADS-NO-OFICIAL-P1Preguntas.txt");
});

document.getElementById("MADS-NO-OFICIAL-P2").addEventListener("click", () => {
  iniciarAsignatura("MADS-NO-OFICIAL-P2Preguntas.txt");
});

// Manejo de la sublista de GCS
document.getElementById("gcs").addEventListener("click", () => {
  const sublist = document.getElementById("gcs-sublist");
    if (sublist.style.display === "none") {
    cerrarTodasLasSublistas();
    sublist.style.display = "block";
  } else {
    sublist.style.display = "none";
  }
});

document.getElementById("gcsp1nooficial").addEventListener("click", () => {
  iniciarAsignatura("gcsp1nooficialPreguntas.txt");
});

document.getElementById("gcsp1old").addEventListener("click", () => {
  iniciarAsignatura("gcsp1oldPreguntas.txt");
});

document.getElementById("gcsp2old").addEventListener("click", () => {
  iniciarAsignatura("gcsp2oldPreguntas.txt");
});

// Manejo de la sublista de SDS-NO-OFICIAL
document.getElementById("sds-no-oficial").addEventListener("click", () => {
  const sublist = document.getElementById("sds-sublist");
    if (sublist.style.display === "none") {
    cerrarTodasLasSublistas();
    sublist.style.display = "block";
  } else {
    sublist.style.display = "none";
  }
});

// Manejadores para los botones de la sublista
document.getElementById("sds01-presentacion").addEventListener("click", () => {
  iniciarAsignatura("sds01-presentacionPreguntas.txt");
});
document.getElementById("sds02-introgo").addEventListener("click", () => {
  iniciarAsignatura("sds02-introgoPreguntas.txt");
});
document.getElementById("sds03-introcripto").addEventListener("click", () => {
  iniciarAsignatura("sds03-introcriptoPreguntas.txt");
});
document.getElementById("sds04-aleatorios").addEventListener("click", () => {
  iniciarAsignatura("sds04-aleatoriosPreguntas.txt");
});
document.getElementById("sds05-flujo").addEventListener("click", () => {
  iniciarAsignatura("sds05-flujoPreguntas.txt");
});
document.getElementById("sds06-bloque").addEventListener("click", () => {
  iniciarAsignatura("sds06-bloquePreguntas.txt");
});
document.getElementById("sds07-hash").addEventListener("click", () => {
  iniciarAsignatura("sds07-hashPreguntas.txt");
});
document.getElementById("sds08-publica").addEventListener("click", () => {
  iniciarAsignatura("sds08-publicaPreguntas.txt");
});
document.getElementById("sds09-transporte").addEventListener("click", () => {
  iniciarAsignatura("sds09-transportePreguntas.txt");
});
document.getElementById("sds10-ejercicios").addEventListener("click", () => {
  iniciarAsignatura("sds10-ejerciciosPreguntas.txt");
});
document.getElementById("sds11-malware").addEventListener("click", () => {
  iniciarAsignatura("sds11-malwarePreguntas.txt");
});
document.getElementById("sds12-ataques").addEventListener("click", () => {
  iniciarAsignatura("sds12-ataquesPreguntas.txt");
});
document.getElementById("sds13-wireless").addEventListener("click", () => {
  iniciarAsignatura("sds13-wirelessPreguntas.txt");
});
document.getElementById("sds14-recomendaciones").addEventListener("click", () => {
  iniciarAsignatura("sds14-recomendacionesPreguntas.txt");
});

// Añade el manejador para el botón SDSFULL después de los otros manejadores SDS
document.getElementById("sdsfull").addEventListener("click", () => {
  const archivosSDSParaCargar = [
    "sds01-presentacionPreguntas.txt",
    "sds02-introgoPreguntas.txt",
    "sds03-introcriptoPreguntas.txt", 
    "sds04-aleatoriosPreguntas.txt",
    "sds05-flujoPreguntas.txt",
    "sds06-bloquePreguntas.txt",
    "sds07-hashPreguntas.txt",
    "sds08-publicaPreguntas.txt",
    "sds09-transportePreguntas.txt",
    "sds10-ejerciciosPreguntas.txt",
    "sds11-malwarePreguntas.txt",
    "sds12-ataquesPreguntas.txt",
    "sds13-wirelessPreguntas.txt",
    "sds14-recomendacionesPreguntas.txt"
  ];
  
  // Restablecer el estado de la aplicación
  resetAppState();
  document.getElementById("resumenBtn").style.display = "block";
  document.getElementById("copyButton").style.display = "block";
  archivoActual = "SDSFULL";
  
  // Actualizar el nombre de la asignatura
  document.getElementById("asignatura-nombre").innerText = "SDSFULL";
  
  // Cargar y procesar todos los archivos
  cargarMultiplesArchivos(archivosSDSParaCargar).then((todasLasPreguntas) => {
    preguntas = todasLasPreguntas;
    document.getElementById("total-preguntas").innerText = `Total: ${preguntas.length}`;
    
    shuffle(preguntas);
    mostrarPregunta();
  });
  
  // Actualizar la interfaz
  hideElement("asignaturas-container");
  hideElement("app-title");
  showElement("verificar");
  showElement("volver");
  showElement("total-preguntas");
  showElement("contador");
});

let preguntaActual = 0;

function mostrarPregunta() {
  const pregunta = preguntas[preguntaActual];
  const contenedorPregunta = document.getElementById("pregunta");
  const contenedorOpciones = document.getElementById("opciones");

  // Establece el contenido de la pregunta
  contenedorPregunta.innerHTML = formatTextWithCode(pregunta.pregunta);

  // Resaltar el código, si hay alguno en la pregunta
  Prism.highlightAll();

  // Establece el contenido de las opciones
  contenedorOpciones.innerHTML = "";
  pregunta.opciones.forEach((opcion, i) => {
    // Omitir si es "NO MARCAR" o cualquier otra lógica que tengas
    if (opcion.toUpperCase() !== "NO MARCAR") {
      const input = document.createElement(pregunta.multiple ? "input" : "input");
      input.type = pregunta.multiple ? "checkbox" : "radio";
      input.name = "opcion";
      input.id = `opcion${i + 1}`;
      input.value = i + 1;
      const label = document.createElement("label");
      label.htmlFor = `opcion${i + 1}`;
      const span = document.createElement("span");
      span.innerHTML = opcion; // Usa innerHTML si la opción podría contener LaTeX
      label.appendChild(span);
      contenedorOpciones.appendChild(input);
      contenedorOpciones.appendChild(label);
      contenedorOpciones.appendChild(document.createElement("br"));
    }
  });

  // Renderizar LaTeX en la pregunta y las opciones
  renderMathInElement(contenedorPregunta, {
    delimiters: [
      { left: "$$", right: "$$", display: false }
    ]
  });
  renderMathInElement(contenedorOpciones, {
    delimiters: [
      { left: "$$", right: "$$", display: false }
    ]
  });
}

// Función para escapar caracteres HTML
function escapeHTML(str) {
  return str.replace(/&/g, '&amp;') // Debe ser el primero en reemplazarse.
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#39;');
}

// Función para escapar caracteres HTML
function escapeHTML(str) {
  return str.replace(/&/g, '&amp;') // Debe ser el primero en reemplazarse.
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#39;');
}

// Función para formatear el texto con código y procesar imágenes Markdown con dimensiones
function formatTextWithCode(text) {
  // 1. Divide el texto en partes basadas en el delimitador '```'.
  const parts = text.split('```');
  let finalText = '';

  parts.forEach((part, index) => {
    if (index % 2 === 1) {
      // Esta parte es código. Reemplaza '\\n' con '<br>' y '\\t' con espacios.
      // Además, escapa los caracteres especiales de HTML.
      finalText += '<pre><code class="language-cpp">' +
                   escapeHTML(part)
                     .replace(/\\n/g, '<br>') // Reemplaza '\\n' con '<br>'.
                     .replace(/\\t/g, '&nbsp;&nbsp;&nbsp;&nbsp;') + // Reemplaza '\\t' con cuatro espacios.
                   '</code></pre>';
    } else {
      // Esta parte es texto normal.
      let escapedText = escapeHTML(part)
                         .replace(/\\n/g, '<br>') // Asegúrate de que los saltos de línea también se conviertan.
                         .replace(/\\t/g, '&nbsp;&nbsp;&nbsp;&nbsp;'); // Y los tabuladores también.

      // 2. Reemplazar la sintaxis de imágenes Markdown por etiquetas <img> con dimensiones.
      // Soporta la sintaxis: ![Alt](URL){width=300 height=200}
      const imageRegex = /!\[([^\]]*)\]\(([^)]+)\)(?:\{([^}]+)\})?/g;
      escapedText = escapedText.replace(imageRegex, (match, alt, url, attrs) => {
        let style = 'max-width: 100%; height: auto;'; // Estilo por defecto

        if (attrs) {
          // Parsear los atributos de dimensiones
          const attrPairs = attrs.split(/\s+/);
          attrPairs.forEach(pair => {
            const [key, value] = pair.split('=');
            if (key && value) {
              if (key.toLowerCase() === 'width') {
                style += ` width:${value}px;`;
              } else if (key.toLowerCase() === 'height') {
                style += ` height:${value}px;`;
              }
            }
          });
        }

        return `<img src="${url}" alt="${alt}" style="${style}" />`;
      });

      finalText += escapedText;
    }
  });

  return finalText;
}

function verificarRespuesta() {
  totalPreguntas++; // Incrementa el total de preguntas contestadas

  const respuestaSeleccionada = document.querySelectorAll('input[name="opcion"]:checked');
  if (respuestaSeleccionada.length === 0) {
    alert("Selecciona una opción antes de verificar.");
    return;
  }

  const respuestaCorrecta = preguntas[preguntaActual].respuestas; // Array de respuestas correctas
  const opciones = document.getElementById("opciones");
  const labels = opciones.getElementsByTagName("label");

  let respuestaEsCorrecta = false;

  // Crear un array con las opciones seleccionadas
  const seleccionadas = Array.from(respuestaSeleccionada).map(input => parseInt(input.value));

  // Comparar arrays de respuestas
  const correctas = [...respuestaCorrecta].sort((a, b) => a - b);
  const seleccionadasOrdenadas = [...seleccionadas].sort((a, b) => a - b);

  if (arraysEqual(correctas, seleccionadasOrdenadas)) {
    respuestaEsCorrecta = true;
    preguntasCorrectas++;
  }

  // Resaltar las opciones correctas e incorrectas
  for (let i = 0; i < labels.length; i++) {
    const span = labels[i].querySelector("span");
    const valor = parseInt(labels[i].htmlFor.replace('opcion', ''));
    if (respuestaCorrecta.includes(valor)) {
      span.classList.add("correct");
    }
    if (seleccionadas.includes(valor) && !respuestaCorrecta.includes(valor)) {
      span.classList.add("incorrect");
    }
  }

  document
    .getElementById("verificar")
    .removeEventListener("click", verificarRespuesta);
  document
    .getElementById("verificar")
    .addEventListener("click", siguientePregunta);
  document.getElementById("verificar").innerText = "Siguiente";

  actualizarContador();
}

function arraysEqual(a, b) {
  if (a.length !== b.length) return false;
  for(let i = 0; i < a.length; i++) {
    if(a[i] !== b[i]) return false;
  }
  return true;
}

function siguientePregunta() {
  preguntaActual = (preguntaActual + 1) % preguntas.length;
  mostrarPregunta();

  const opciones = document.getElementById("opciones");
  const inputs = opciones.querySelectorAll("input");
  inputs.forEach(input => {
    input.checked = false;
    const span = input.nextElementSibling.querySelector("span");
    span.classList.remove("correct", "incorrect");
  });

  document
    .getElementById("verificar")
    .removeEventListener("click", siguientePregunta);
  document
    .getElementById("verificar")
    .addEventListener("click", verificarRespuesta);
  document.getElementById("verificar").innerText = "Verificar";
  document.getElementById("resultado").innerText = "";
}

document
  .getElementById("verificar")
  .addEventListener("click", verificarRespuesta);

function toggleTheme() {
  const themeToggle = document.getElementById("theme-toggle");
  const body = document.querySelector("body");

  if (body.classList.contains("dark-theme")) {
    body.classList.remove("dark-theme");
    themeToggle.innerHTML = "&#9728;"; // Sol
    themeToggle.classList.remove("dark-mode");
    themeToggle.classList.add("light-mode");
  } else {
    body.classList.add("dark-theme");
    themeToggle.innerHTML = "&#9790;"; // Luna
    themeToggle.classList.remove("light-mode");
    themeToggle.classList.add("dark-mode");
  }
}

document.getElementById("theme-toggle").addEventListener("click", toggleTheme);

function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

function resetAppState() {
  hideElement("verificar");
  hideElement("volver");
  showElement("asignaturas-container");
  showElement("app-title");
  document.getElementById("pregunta").innerText = "";
  document.getElementById("opciones").innerHTML = "";
  document.getElementById("resultado").innerText = "";

  document
    .getElementById("verificar")
    .removeEventListener("click", siguientePregunta);
  document
    .getElementById("verificar")
    .addEventListener("click", verificarRespuesta);
  document.getElementById("verificar").innerText = "Verificar";
}

function actualizarContador() {
  const contador = document.getElementById("contador");
  
  let porcentaje = "";
  if (totalPreguntas !== 0) {
    porcentaje = `| ${Math.round((preguntasCorrectas / totalPreguntas) * 100)}%`;
  }
  
  contador.innerText = `Correctas: ${preguntasCorrectas} | Contestadas: ${totalPreguntas} ${porcentaje}`;
}

function mostrarContador() {
  const contador = document.getElementById("contador");
  contador.classList.toggle("hidden");
}

document.addEventListener("keydown", (event) => {
  if (event.key === "c" || event.key === "C") {
    mostrarContador();
  }
});

function resetearContador() {
  totalPreguntas = 0;
  preguntasCorrectas = 0;
  actualizarContador();
}

function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

document.addEventListener("keydown", (event) => {
  const opciones = document.getElementsByName("opcion");
  if (opciones.length > 0) {
    if (event.key === "1" || event.key === "Numpad1") {
      opciones[0].checked = true;
    } else if (event.key === "2" || event.key === "Numpad2") {
      opciones[1].checked = true;
    } else if (event.key === "3" || event.key === "Numpad3") {
      opciones[2].checked = true;
    } else if (event.key === "4" || event.key === "Numpad4") {
      opciones[3].checked = true;
    } else if (event.key === "5" || event.key === "Numpad5") {
      opciones[4].checked = true;
    } else if (event.key === "Enter" || event.key === "NumpadEnter") {
      const verificarBtn = document.getElementById("verificar");
      verificarBtn.click();
    }
  }
});

document.getElementById("copyButton").addEventListener("click", function() {
  const pregunta = document.getElementById("pregunta").innerText;
  const opciones = Array.from(document.getElementById("opciones").getElementsByTagName("span")).map(e => e.innerText);
  const contenidoParaCopiar = pregunta + '\n\n' + '- ' + opciones.join('\n- ');
  
  navigator.clipboard.writeText(contenidoParaCopiar).then(function() {
    console.log('Copying to clipboard was successful!');
  }, function(err) {
    console.error('Could not copy text: ', err);
  });
});


