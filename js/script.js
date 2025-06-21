// Base de conocimientos
const knowledgeBase = {
  cursos: {
    "Ingeniería de Software": {
      requisito: "Programación I",
      creditos: 4,
      horario: "Lunes y Miércoles 10:00-12:00",
      departamento: "Computación",
    },
    "Programación I": {
      requisito: null,
      creditos: 3,
      horario: "Martes y Jueves 14:00-16:00",
      departamento: "Computación",
    },
    "Programación II": {
      requisito: "Programación I",
      creditos: 4,
      horario: "Martes y Jueves 16:00-18:00",
      departamento: "Computación",
    },
    "Bases de Datos": {
      requisito: "Programación I",
      creditos: 4,
      horario: "Viernes 8:00-12:00",
      departamento: "Computación",
    },
    "Inteligencia Artificial": {
      requisito: "Matemáticas Discretas AND Programación I",
      creditos: 5,
      horario: "Lunes 16:00-19:00",
      departamento: "Computación",
    },
    "Matemáticas Discretas": {
      requisito: null,
      creditos: 4,
      horario: "Miércoles 16:00-19:00",
      departamento: "Matemáticas",
    },
    "Algoritmos y Estructuras de Datos": {
      requisito: "Programación II",
      creditos: 4,
      horario: "Miércoles y Viernes 10:00-12:00",
      departamento: "Computación",
    },
    "Redes de Computadoras": {
      requisito: "Sistemas Operativos",
      creditos: 4,
      horario: "Martes 8:00-12:00",
      departamento: "Computación",
    },
    "Sistemas Operativos": {
      requisito: "Algoritmos y Estructuras de Datos",
      creditos: 4,
      horario: "Lunes y Miércoles 14:00-16:00",
      departamento: "Computación",
    },
    "Teoría de la Computación": {
      requisito: "Matemáticas Discretas",
      creditos: 4,
      horario: "Jueves 10:00-12:00",
      departamento: "Computación",
    },
    "Arquitectura de Computadoras": {
      requisito: "Programación II",
      creditos: 3,
      horario: "Miércoles 8:00-10:00",
      departamento: "Ingeniería Eléctrica",
    },
    "Ingeniería de Requisitos": {
      requisito: "Ingeniería de Software",
      creditos: 3,
      horario: "Viernes 10:00-12:00",
      departamento: "Computación",
    },
    "Pruebas de Software": {
      requisito: "Ingeniería de Software",
      creditos: 3,
      horario: "Martes 10:00-12:00",
      departamento: "Computación",
    },
    "Desarrollo Web": {
      requisito: "Programación II",
      creditos: 3,
      horario: "Jueves 14:00-17:00",
      departamento: "Computación",
    },
    Compiladores: {
      requisito:
        "Teoría de la Computación AND Algoritmos y Estructuras de Datos",
      creditos: 4,
      horario: "Viernes 14:00-17:00",
      departamento: "Computación",
    },
  },

  puedeTomar: function (curso, cursosAprobados) {
    const requisitos = this.cursos[curso].requisito;
    if (!requisitos) return { puede: true, faltantes: [] };

    // Procesar requisitos separados por "AND"
    const requisitosArray = requisitos.split("AND").map((req) => req.trim());
    const faltantes = requisitosArray.filter(
      (req) => !cursosAprobados.includes(req),
    );

    return {
      puede: faltantes.length === 0,
      faltantes: faltantes,
    };
  },

  evaluarExpresionLogica: function (expresion, cursosAprobados) {
    // Método preparado para evaluar expresiones lógicas complejas
    const partes = expresion.split("AND").map((p) => p.trim());
    let resultado = partes.every((curso) => cursosAprobados.includes(curso));
    if (expresion.includes("NOT")) {
      resultado = !resultado;
    }
    return resultado;
  },
};

// Clase del Chatbot
class Chatbot {
  constructor() {
    this.cursosAprobados = [];
    this.historial = [];
    this.ultimoCursoMencionado = null; // esto se inicializa en el constructor o al principio
  }

  // Buscar curso en base a la pregunta
  buscarCurso(pregunta) {
    const preguntaLower = pregunta.toLowerCase();
    let primerCurso = null;
    let primerIndice = Infinity;

    for (const curso in knowledgeBase.cursos) {
      const indice = preguntaLower.indexOf(curso.toLowerCase());
      if (indice !== -1 && indice < primerIndice) {
        primerIndice = indice;
        primerCurso = curso;
      }
    }
    return primerCurso;
  }

  // Procesar la pregunta del usuario
  procesarPregunta(pregunta) {
    // Registrar en el historial
    this.historial.push(`Usuario: ${pregunta}`);
    const preguntaLower = pregunta.toLowerCase();

    // Evaluación de expresiones lógicas
    if (
      preguntaLower.includes("evalúa") ||
      preguntaLower.includes("verifica") ||
      preguntaLower.includes("evalua")
    ) {
      // Evaluar expresiones lógicas
      const regex = /(evalúa|verifica)\s+(.+)/i; // Para capturar la expresión después de "Evalúa" o "Verifica"
      const match = pregunta.match(regex);

      if (match) {
        const expresion = match[2].trim();

        // Validar si contiene al menos un operador lógico válido
        const operadores = ["AND", "OR", "NOT"];
        const contieneOperador = operadores.some((op) =>
          expresion.toUpperCase().includes(op),
        );

        if (!contieneOperador) {
          return `Operador no válido. Solo se permiten los operadores <strong>AND</strong>, <strong>OR</strong> y <strong>NOT</strong>.`;
        }

        const resultado = this.evaluarExpresionLogica(
          expresion,
          this.cursosAprobados,
        );
        return resultado
          ? `La expresión <strong>${expresion}</strong> es verdadera.`
          : `La expresión <strong>${expresion}</strong> es falsa.`;
      }
    } else if (
      preguntaLower.includes("necesito saber si puedo tomar") &&
      preguntaLower.includes("habiendo aprobado solo")
    ) {
      const cursoMatch = pregunta.match(
        /necesito saber si puedo tomar\s+(.+?)\s+habiendo/i,
      );
      const aprobadoMatch = pregunta.match(/habiendo aprobado solo\s+(.+)$/i);

      if (cursoMatch && cursoMatch[1] && aprobadoMatch && aprobadoMatch[1]) {
        const curso = cursoMatch[1].trim();
        const cursoAprobado = aprobadoMatch[1].trim();
        const cursosSimulados = [cursoAprobado.toLowerCase()];

        const resultado = knowledgeBase.puedeTomar(curso, cursosSimulados);
        if (resultado.puede) {
          return `Sí, puedes tomar <strong>${curso}</strong> habiendo aprobado solo <strong>${cursoAprobado}</strong>.`;
        } else {
          return `No puedes tomar <strong>${curso}</strong> habiendo aprobado solo <strong>${cursoAprobado}</strong>. Te faltan: <div class="requirements">${resultado.faltantes.join(", ")}</div>`;
        }
      } else {
        return "No pude entender bien qué curso quieres tomar o cuál has aprobado. ¿Podrías reformular la pregunta?";
      }
    } else if (
      (preguntaLower.includes("qué cursos puedo tomar") ||
        preguntaLower.includes("que cursos puedo tomar")) &&
      preguntaLower.includes("solo he aprobado")
    ) {
      const regex = /solo he aprobado\s+(.+?)\??$/i;
      const match = pregunta.match(regex);

      if (match && match[1]) {
        const cursoAprobado = match[1].trim();
        const cursosSimulados = [cursoAprobado.toLowerCase()];

        const cursosDisponibles = Object.keys(knowledgeBase.cursos).filter(
          (curso) => {
            const resultado = knowledgeBase.puedeTomar(curso, cursosSimulados);
            return resultado.puede;
          },
        );

        if (cursosDisponibles.length > 0) {
          return `Con solo haber aprobado <strong>${cursoAprobado}</strong>, puedes tomar los siguientes cursos: <div class="course-list">${cursosDisponibles.join(", ")}</div>`;
        } else {
          return `Con solo haber aprobado <strong>${cursoAprobado}</strong>, no puedes tomar ningún otro curso aún.`;
        }
      } else {
        return "No pude identificar el curso que mencionas. ¿Podrías reformular la pregunta?";
      }
    } else if (
      (preguntaLower.includes("si aprobé") ||
        preguntaLower.includes("si aprobe")) &&
      preguntaLower.includes("puedo tomar")
    ) {
      const regex = /si aprobé\s+(.+?),?\s*(puedo|¿puedo)\s+tomar\s+(.+?)\??$/i;
      const match = pregunta.match(regex);

      if (match && match[1] && match[3]) {
        const cursoAprobado = match[1].trim();
        const cursoDeseado = match[3].trim();

        console.log("Curso aprobado detectado:", cursoAprobado);
        console.log("Curso deseado detectado:", cursoDeseado);

        if (!knowledgeBase.cursos[cursoDeseado]) {
          const cursosDisponibles = Object.keys(knowledgeBase.cursos).join(
            ", ",
          );
          return `No reconozco el curso <strong>${cursoDeseado}</strong>. Cursos disponibles: <div class="course-list">${cursosDisponibles}</div>`;
        }

        const cursosSimulados = [
          ...this.cursosAprobados.map((c) => c.toLowerCase()),
          cursoAprobado.toLowerCase(),
        ];

        const resultado = knowledgeBase.puedeTomar(
          cursoDeseado,
          cursosSimulados,
        );

        if (resultado.puede) {
          return `Sí, si apruebas <strong>${cursoAprobado}</strong>, podrás tomar <strong>${cursoDeseado}</strong>.`;
        } else {
          return `Aunque apruebes <strong>${cursoAprobado}</strong>, aún necesitas aprobar los siguientes cursos para tomar <strong>${cursoDeseado}</strong>: <div class="requirements">${resultado.faltantes.join(", ")}</div>`;
        }
      } else {
        return "No pude entender bien tu pregunta. ¿Podrías reformularla?";
      }
    }
    // Consulta de cursos aprobados
    if (
      preguntaLower.includes("qué cursos aprobé") ||
      preguntaLower.includes("mis cursos") ||
      preguntaLower.includes("cursos aprobados")
    ) {
      if (this.cursosAprobados.length === 0) {
        return "Aún no has aprobado ningún curso registrado.";
      }
      return `Tus cursos aprobados son: <div class="course-list">${this.cursosAprobados.join(", ")}</div>`;
    }

    // Registro de cursos aprobados
    else if (
      preguntaLower.includes("aprobé") ||
      preguntaLower.includes("he aprobado") ||
      preguntaLower.includes("registra que pasé") ||
      preguntaLower.includes("registra que pase") ||
      preguntaLower.includes("ya terminé") ||
      preguntaLower.includes("ya termine")
    ) {
      const curso = this.buscarCurso(pregunta);
      if (!curso) {
        const cursosDisponibles = Object.keys(knowledgeBase.cursos).join(", ");
        return `No reconozco ese curso. Cursos disponibles: <div class="course-list">${cursosDisponibles}</div>`;
      }
      if (!this.cursosAprobados.includes(curso)) {
        // Registrar el curso principal
        this.cursosAprobados.push(curso);

        // Verificar si el curso tiene requisitos y registrarlos automáticamente
        const prereq = knowledgeBase.cursos[curso].requisito;
        let prereqRegistrados = [];
        if (prereq) {
          // Separar los requisitos en caso de que haya más de uno
          const prereqArray = prereq.split("AND").map((r) => r.trim());
          prereqArray.forEach((req) => {
            if (!this.cursosAprobados.includes(req)) {
              this.cursosAprobados.push(req);
              prereqRegistrados.push(req);
            }
          });
        }

        // Construir el mensaje de éxito
        let mensaje = `<span class="success">✓ He registrado que aprobaste <strong>${curso}</strong>.</span>`;
        if (prereqRegistrados.length > 0) {
          mensaje += `<br>También se han registrado los requisitos: <strong>${prereqRegistrados.join(", ")}</strong>.`;
        }
        return mensaje;
      } else {
        return `Ya tenías registrado que aprobaste <strong>${curso}</strong>.`;
      }
    } else if (preguntaLower.includes("horario")) {
      let curso = this.buscarCurso(pregunta);

      if (!curso && this.ultimoCursoMencionado) {
        curso = this.ultimoCursoMencionado;
      }

      if (!curso) {
        return "¿Podrías especificar a qué curso te refieres?";
      }

      const horario = knowledgeBase.cursos[curso]?.horario;
      if (horario) {
        return `El horario de <strong>${curso}</strong> es: <div class="horario">${horario}</div>`;
      } else {
        return `No tengo información de horario para <strong>${curso}</strong>.`;
      }
    }
    // Consulta sobre el horario de un curso
    else if (
      preguntaLower.includes("cuál es el horario de") ||
      preguntaLower.includes("cual es el horario de") ||
      preguntaLower.includes("a que hora es") ||
      preguntaLower.includes("a qué hora es") ||
      preguntaLower.includes("horario de")
    ) {
      const curso = this.buscarCurso(pregunta);
      if (!curso) {
        const cursosDisponibles = Object.keys(knowledgeBase.cursos).join(", ");
        return `
      No encontré el curso que mencionaste. 
      ¿Podrías verificar si escribiste bien el nombre? 
      Estos son los cursos disponibles: 
      <div class="course-list">${cursosDisponibles}</div>
    `;
      }
      return `El horario de <strong>${curso}</strong> es: <strong>${knowledgeBase.cursos[curso].horario}</strong>.`;
    }

    // Consulta sobre los días en que se imparte un curso
    else if (
      preguntaLower.includes("qué días se imparte") ||
      preguntaLower.includes("que dias se imparte")
    ) {
      const curso = this.buscarCurso(pregunta);
      if (!curso) {
        const cursosDisponibles = Object.keys(knowledgeBase.cursos).join(", ");
        return `No reconozco ese curso. Cursos disponibles: <div class="course-list">${cursosDisponibles}</div>`;
      }
      const horario = knowledgeBase.cursos[curso].horario;
      const dias = horario.split(" ")[0]; // Obtener los días (antes de la hora)
      return `El curso <strong>${curso}</strong> se imparte los días: <strong>${dias}</strong>.`;
    }

    // Consulta sobre los créditos de un curso
    else if (
      preguntaLower.includes("cuántos créditos vale") ||
      preguntaLower.includes("cuantos creditos vale")
    ) {
      const curso = this.buscarCurso(pregunta);
      if (!curso) {
        const cursosDisponibles = Object.keys(knowledgeBase.cursos).join(", ");
        return `No reconozco ese curso. Cursos disponibles: <div class="course-list">${cursosDisponibles}</div>`;
      }
      return `El curso <strong>${curso}</strong> vale <strong>${knowledgeBase.cursos[curso].creditos}</strong> créditos.`;
    }
    // Consulta sobre requisitos para tomar un curso
    else if (
      preguntaLower.includes("puedo tomar") ||
      preguntaLower.includes("qué necesito para tomar") ||
      preguntaLower.includes("que necesito para tomar")
    ) {
      // Primero, se extrae el curso principal de la pregunta
      const curso = this.buscarCurso(pregunta);
      if (!curso) {
        const cursosDisponibles = Object.keys(knowledgeBase.cursos).join(", ");
        return `No reconozco ese curso. Cursos disponibles: <div class="course-list">${cursosDisponibles}</div>`;
      }

      this.ultimoCursoMencionado = curso; // Guardamos el curso

      // Luego, se evalúa si la pregunta menciona "sin haber aprobado"
      if (preguntaLower.includes("sin haber aprobado")) {
        // Utilizamos una expresión regular para capturar el nombre del curso después de "sin haber aprobado"
        const regex = /sin haber aprobado\s+([a-záéíóúñ\s]+)/i;
        const match = pregunta.match(regex);
        if (match && match[1]) {
          const cursoNoAprobado = match[1].trim();
          // Comparamos en minúsculas para mayor robustez
          if (
            this.cursosAprobados
              .map((c) => c.toLowerCase())
              .includes(cursoNoAprobado.toLowerCase())
          ) {
            return `Ya has aprobado <strong>${cursoNoAprobado}</strong>, por lo tanto, puedes tomar <strong>${curso}</strong>.`;
          } else {
            return `No puedes tomar <strong>${curso}</strong> porque no has aprobado <strong>${cursoNoAprobado}</strong>.`;
          }
        } else {
          // Si no se logra extraer el curso de la parte "sin haber aprobado", se muestra la información de requisitos guardados
          const requisito = knowledgeBase.cursos[curso].requisito;
          if (!requisito) {
            return `El curso <strong>${curso}</strong> no requiere aprobar ningún otro curso.`;
          } else {
            return `Para tomar <strong>${curso}</strong> debes aprobar: <div class="requirements">${requisito}</div>`;
          }
        }
      }

      // Caso general: se evalúa si el usuario cumple con todos los requisitos del curso
      const resultado = knowledgeBase.puedeTomar(curso, this.cursosAprobados);
      if (resultado.puede) {
        return `Sí, puedes tomar <strong>${curso}</strong>.`;
      } else {
        return `No puedes tomar <strong>${curso}</strong> porque necesitas aprobar los siguientes cursos: <div class="requirements">${resultado.faltantes.join(", ")}</div>`;
      }
    }

    // Respuesta por defecto
    return "Lo siento, no entendí la pregunta. ¿Puedes reformularla?";
  }

  evaluarExpresionLogica(expresion, cursosAprobados) {
    // Limpiar la expresión: eliminar espacios adicionales y convertir a mayúsculas
    const expresionLimpia = expresion.replace(/\s+/g, " ").toUpperCase();

    // Asegúrate de que los cursos aprobados también estén en el formato adecuado
    const cursosAprobadosLimpios = cursosAprobados.map((curso) =>
      curso.trim().toUpperCase(),
    );

    let resultado = false;

    // Evaluar OR
    if (expresionLimpia.includes("OR")) {
      const partes = expresionLimpia.split("OR");
      // Verifica si al menos una de las partes está en los cursos aprobados
      resultado = partes.some((parte) =>
        this.evaluarParte(parte.trim(), cursosAprobadosLimpios),
      );
    }

    // Evaluar AND por defecto
    else if (expresionLimpia.includes("AND")) {
      const partes = expresionLimpia.split("AND");
      // Verifica si todas las partes están en los cursos aprobados
      resultado = partes.every((parte) =>
        this.evaluarParte(parte.trim(), cursosAprobadosLimpios),
      );
    }

    // Si la expresión contiene 'NOT', solo se evalúa cuando sea necesario
    else if (expresionLimpia.includes("NOT")) {
      const partes = expresionLimpia.split("NOT");
      // Aplicamos NOT solo a las partes donde es relevante
      resultado = partes.every(
        (parte) => !cursosAprobadosLimpios.includes(parte.trim()),
      );
    }

    // Si no hay 'OR', 'AND', ni 'NOT', evaluamos la expresión directamente
    else {
      resultado = cursosAprobadosLimpios.includes(expresionLimpia.trim());
    }

    return resultado;
  }

  // Función auxiliar para evaluar partes con NOT y otros operadores lógicos
  evaluarParte(parte, cursosAprobadosLimpios) {
    // Si la parte contiene 'NOT', negamos la comprobación
    if (parte.includes("NOT")) {
      const curso = parte.replace("NOT", "").trim();
      return !cursosAprobadosLimpios.includes(curso);
    }
    return cursosAprobadosLimpios.includes(parte.trim());
  }
}

// Instancia del Chatbot
const chatbot = new Chatbot();

// Función para enviar mensaje
function sendMessage() {
  const userInput = document.getElementById("user-input").value.trim();
  if (!userInput) return;

  const chatContainer = document.getElementById("chat-container");

  // Crear mensaje de usuario
  const userMessage = document.createElement("div");
  userMessage.classList.add("message", "user-message");
  userMessage.innerHTML = userInput;
  chatContainer.appendChild(userMessage);

  // Limpiar el campo de entrada
  document.getElementById("user-input").value = "";

  // Mostrar indicador de escritura
  const typingIndicator = document.getElementById("typing-indicator");
  typingIndicator.style.display = "block";

  setTimeout(() => {
    typingIndicator.style.display = "none";
    // Procesar respuesta del chatbot
    const botResponse = chatbot.procesarPregunta(userInput);
    const botMessage = document.createElement("div");
    botMessage.classList.add("message", "bot-message");
    botMessage.innerHTML = botResponse;
    chatContainer.appendChild(botMessage);
    // Hacer scroll para mostrar el último mensaje
    chatContainer.scrollTop = chatContainer.scrollHeight;
  }, 1000);
}

// Función para insertar un ejemplo en el campo de texto
function insertExample(example) {
  document.getElementById("user-input").value = example;
}

// Función para mostrar mensajes de bienvenida al cargar la página
function mostrarBienvenida() {
  const chatContainer = document.getElementById("chat-container");

  // Primer mensaje de bienvenida
  const welcomeMsg1 = document.createElement("div");
  welcomeMsg1.classList.add("message", "bot-message");
  welcomeMsg1.innerHTML = "¡Bienvenido al ChatBot Universitario!";
  chatContainer.appendChild(welcomeMsg1);

  // Segundo mensaje de bienvenida
  const welcomeMsg2 = document.createElement("div");
  welcomeMsg2.classList.add("message", "bot-message");
  welcomeMsg2.innerHTML = "¿En qué puedo ayudarte hoy?";
  chatContainer.appendChild(welcomeMsg2);

  // Ajustar scroll para mostrar los mensajes
  chatContainer.scrollTop = chatContainer.scrollHeight;
}

// Asignar event listeners
document.getElementById("send-button").addEventListener("click", sendMessage);
document.getElementById("user-input").addEventListener("keydown", (e) => {
  if (e.key === "Enter") sendMessage();
});

// Mostrar mensajes de bienvenida al cargar la página
mostrarBienvenida();
