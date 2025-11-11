let tOptimoGlobal = 0;
  let tiempoInicial = 0;

  function calcularFatiga() {
    const respuestas = document.querySelectorAll('input[type="radio"]:checked');
    const tiempoInput = document.getElementById('tiempoDisponible');
    
    if (respuestas.length < 5) {
      alert("Responde todas las preguntas.");
      return;
    }
    if (!tiempoInput.value || tiempoInput.value < 1 || tiempoInput.value > 16) {
      alert("Ingresa un tiempo válido (1–16 horas).");
      return;
    }

    let puntaje = 0;
    respuestas.forEach(r => puntaje += parseInt(r.value));
    tiempoInicial = parseFloat(tiempoInput.value);

    let a, perfil;
    if (puntaje <= 7) { a = -0.2; perfil = "Fresco"; }
    else if (puntaje <= 10) { a = -0.5; perfil = "Promedio"; }
    else if (puntaje <= 13) { a = -0.8; perfil = "Estresado"; }
    else { a = -1.2; perfil = "Trasnochado"; }

    document.getElementById('resultadoFatiga').innerHTML = `
      <p><strong>${perfil}</strong> → Tasa de fatiga: <strong>${a}</strong></p>
      <p>Tiempo disponible: <strong>${tiempoInicial} h</strong></p>
      <button onclick="aplicarFatiga(${a})" class="success">
        Calcular tiempo óptimo
      </button>
    `;
  }

  function aplicarFatiga(valorA) {
    document.getElementById('a').value = valorA;
    document.getElementById('cuestionario').classList.add('hide');
    document.getElementById('calculadora').classList.remove('hide');
    
    document.getElementById('tiempoEditable').value = tiempoInicial;
    calcular();
  }

  function calcular() {
    const a = parseFloat(document.getElementById('a').value);
    const b = parseFloat(document.getElementById('b').value);

    if (a >= 0 || b <= 0) {
      alert("a debe ser negativo, b positivo.");
      return;
    }

    tOptimoGlobal = -b / (2 * a);
    const rMax = a * tOptimoGlobal**2 + b * tOptimoGlobal;

    document.getElementById('resultado').innerHTML = `
      <h3 style="color:var(--success); margin:0;">Tiempo ÓPTIMO: <strong>${tOptimoGlobal.toFixed(1)} horas</strong></h3>
      <p>Rendimiento máximo: <strong>${rMax.toFixed(1)} puntos</strong></p>
    `;

    actualizarAlerta();
  }

  function actualizarAlerta() {
    const a = parseFloat(document.getElementById('a').value);
    const b = parseFloat(document.getElementById('b').value);
    const tUser = parseFloat(document.getElementById('tiempoEditable').value) || 0;

    if (isNaN(tUser) || tUser < 0) return;

    const rMax = a * tOptimoGlobal**2 + b * tOptimoGlobal;
    const rActual = a * tUser * tUser + b * tUser;
    const margen = 1;

    let alertaHTML = '';
    let clase = '';

    if (tUser < tOptimoGlobal - margen) {
      clase = 'optimo';
      alertaHTML = `
        <p>Estás en <strong>zona óptima</strong>.</p>
        <p>Ganarás <strong>${rActual.toFixed(1)} puntos</strong> (máximo: ${rMax.toFixed(1)}).</p>
        <p>Te faltan <strong>${(tOptimoGlobal - tUser).toFixed(1)} h</strong> para el pico.</p>
      `;
    } else if (tUser <= tOptimoGlobal + margen) {
      clase = 'cerca';
      const diferencia = Math.abs(tUser - tOptimoGlobal);
      const perdida = rMax - rActual;
      alertaHTML = `
        <p>Estás <strong>muy cerca del máximo</strong> (±${margen} h).</p>
        <p>Obtendrás <strong>${rActual.toFixed(1)} puntos</strong> (solo <strong>${Math.abs(perdida).toFixed(1)} puntos</strong> menos que el óptimo).</p>
        <p>Diferencia: <strong>${diferencia.toFixed(1)} h</strong> del tiempo ideal.</p>
        <p><strong>¡Excelente decisión!</strong> Estás en el rango ideal.</p>
      `;
    } else {
      clase = 'perdiendo';
      const perdida = rMax - rActual;
      alertaHTML = `
        <p>¡Estás <strong>perdiendo ${perdida.toFixed(1)} puntos</strong>!</p>
        <p>Has estudiado <strong>${(tUser - tOptimoGlobal).toFixed(1)} h de más</strong>.</p>
        <p><strong>¡Para ya!</strong> Descansa o repasa lo aprendido.</p>
      `;
    }

    const div = document.getElementById('alertaTiempo');
    div.innerHTML = alertaHTML;
    div.className = clase;
  }

  function volverEncuesta() {
    document.getElementById('calculadora').classList.add('hide');
    document.getElementById('cuestionario').classList.remove('hide');

    document.querySelectorAll('input[type="radio"]').forEach(r => r.checked = false);
    document.getElementById('tiempoDisponible').value = '8';
    document.getElementById('resultadoFatiga').innerHTML = '';
    document.getElementById('resultado').innerHTML = '';
    document.getElementById('alertaTiempo').innerHTML = '';
  }

  window.onload = () => {
    document.getElementById('calculadora').classList.add('hide');
  };