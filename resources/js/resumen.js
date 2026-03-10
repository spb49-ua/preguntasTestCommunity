// resumen.js

// Esta es una versión simplificada de tu función cargarPreguntas.
// Puedes necesitar ajustarla según tus necesidades.
async function cargarPreguntas(archivo) {
  const response = await fetch("data/" + archivo);
  let preguntasTxt = await response.text();
  preguntasTxt = preguntasTxt
    .replace(/\r\n/g, "\n")
    .replace(/\r/g, "\n")
    .trim();
  return preguntasTxt;
}

window.onload = function() {
  const urlParams = new URLSearchParams(window.location.search);
  const archivo = urlParams.get('preguntas');
  
  if (archivo) {
    if (archivo === "SDSFULL") {
      // Caso especial para SDSFULL
      const archivos = JSON.parse(sessionStorage.getItem("sdsfullArchivos") || "[]");
      
      if (archivos.length > 0) {
        // Cargar y procesar todos los archivos SDS
        cargarMultiplesArchivos(archivos).then((preguntas) => {
          const resumenContainer = document.getElementById('app');
          preguntas.forEach((pregunta, index) => {
            const preguntaElement = document.createElement('p');
            preguntaElement.textContent = (index + 1) + '. ' + pregunta.pregunta;
            resumenContainer.appendChild(preguntaElement);
            
            const respuestaElement = document.createElement('span');
            respuestaElement.textContent = 'Respuesta correcta: ' + pregunta.opciones[pregunta.respuesta - 1];
            respuestaElement.className = 'correct';
            resumenContainer.appendChild(respuestaElement);
          });
        });
      }
    } else {
      cargarPreguntas(archivo).then(preguntasTxt => {
        const preguntas = preguntasTxt.split(/\n{2,}/).map((preguntaTxt) => {
          const [pregunta, respuesta, ...opciones] = preguntaTxt.split("\n");
          const opcionesMezcladas = shuffleArray([...opciones]);
          const respuestaMezclada = opcionesMezcladas.indexOf(opciones[respuesta - 1]) + 1;
          return { pregunta, respuesta: respuestaMezclada, opciones: opcionesMezcladas };
        });
        
        const resumenContainer = document.getElementById('app');
        preguntas.forEach((pregunta, index) => {
          const preguntaElement = document.createElement('p');
          preguntaElement.textContent = (index + 1) + '. ' + pregunta.pregunta;
          resumenContainer.appendChild(preguntaElement);

          const respuestaElement = document.createElement('span');
          respuestaElement.textContent = 'Respuesta correcta: ' + pregunta.opciones[pregunta.respuesta - 1];
          respuestaElement.className = 'correct'; 
          resumenContainer.appendChild(respuestaElement);
        });
      });
    }
  }
};

async function cargarMultiplesArchivos(archivos) {
  let todasLasPreguntas = [];
  
  for (const archivo of archivos) {
    try {
      const preguntasTxt = await cargarPreguntas(archivo);
      const preguntasDelArchivo = preguntasTxt.split(/\n{2,}/).map((preguntaTxt) => {
        const [pregunta, respuesta, ...opciones] = preguntaTxt.split("\n");
        const respuestasNum = parseInt(respuesta);
        const opcionesMezcladas = shuffleArray([...opciones]);
        const respuestaMezclada = opcionesMezcladas.indexOf(opciones[respuestasNum - 1]) + 1;
        return { pregunta, respuesta: respuestaMezclada, opciones: opcionesMezcladas };
      });
      
      todasLasPreguntas = todasLasPreguntas.concat(preguntasDelArchivo);
    } catch (error) {
      console.error(`Error cargando el archivo ${archivo}:`, error);
    }
  }
  
  return todasLasPreguntas;
}


function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

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