// Toggle entre identificado y anónimo
const btnIdentificado = document.getElementById('btnIdentificado');
const btnAnonimo = document.getElementById('btnAnonimo');
const seccionPersonal = document.getElementById('seccionPersonal');
const esAnonimoInput = document.getElementById('esAnonimoInput');
const formulario = document.getElementById('reportingForm');
const rutDescription = document.getElementById('rutDescription');

// Variable para controlar las alertas
let rutAlertMostrada = false;

// Inicializar estado
btnAnonimo.addEventListener('click', () => {
  btnAnonimo.classList.add('active');
  btnIdentificado.classList.remove('active');
  seccionPersonal.style.display = 'none';
  esAnonimoInput.value = 'true';
  
  // Actualizar descripción del RUT para modo anónimo
  rutDescription.textContent = "En reportes anónimos, su RUT será tratado con máxima confidencialidad";
  rutDescription.style.color = "var(--color-warning)";
  
  // Remover required solo de campos personales (excepto RUT)
  document.getElementById('nombre').required = false;
  document.getElementById('curso').required = false;
  document.getElementById('correo').required = false;
  
  // RUT sigue siendo requerido
  document.getElementById('rut').required = true;
});

btnIdentificado.addEventListener('click', () => {
  btnIdentificado.classList.add('active');
  btnAnonimo.classList.remove('active');
  seccionPersonal.style.display = 'block';
  esAnonimoInput.value = 'false';
  
  // Restaurar descripción normal del RUT
  rutDescription.textContent = "Ingrese su RUT (con o sin puntos y guión)";
  rutDescription.style.color = "var(--color-text-muted)";
  
  // Agregar required a campos personales
  document.getElementById('nombre').required = true;
  document.getElementById('curso').required = true;
  document.getElementById('rut').required = true;
});

// Contador de caracteres
const declaracion = document.getElementById('declaracion');
const charCount = document.getElementById('charCount');
if (declaracion && charCount) {
  declaracion.addEventListener('input', () => {
    charCount.textContent = `${declaracion.value.length} caracteres (mínimo 20)`;
  });
}

// Validación antes de enviar
formulario.addEventListener('submit', (e) => {
  const esAnonimo = esAnonimoInput.value === 'true';
  const descripcion = declaracion.value.trim();
  const rutInput = document.getElementById('rut');
  const rut = rutInput.value.trim();
  
  // Resetear flag de alerta al enviar
  rutAlertMostrada = false;
  
  // Validar descripción
  if (descripcion.length < 20) {
    e.preventDefault();
    alert('La descripción debe tener al menos 20 caracteres');
    declaracion.focus();
    return;
  }
  
  // Validar RUT (siempre requerido)
  if (!rut) {
    e.preventDefault();
    alert('Por favor ingrese su RUT');
    rutInput.focus();
    return;
  }
  
  // Validar formato y dígito verificador del RUT
  if (!validarRUTCompleto(rut)) {
    e.preventDefault();
    
    // Mensaje específico según el tipo de error
    const rutLimpio = rut.replace(/\./g, '').replace(/-/g, '').replace(/\s/g, '').toUpperCase();
    const cuerpo = rutLimpio.slice(0, -1);
    
    let mensaje = 'Por favor ingrese un RUT válido.';
    if (esPatronRepetitivo(cuerpo)) {
      mensaje = 'El RUT ingresado parece no ser válido. Por favor verifique los datos.';
    } else if (parseInt(cuerpo) === 0) {
      mensaje = 'El RUT no puede ser todos ceros.';
    }
    
    alert(mensaje + '\n\nEjemplos válidos: 12345678-9, 9876543-K');
    rutInput.focus();
    return;
  }
  
  // Validar campos adicionales para modo identificado
  if (!esAnonimo) {
    const nombre = document.getElementById('nombre').value.trim();
    const curso = document.getElementById('curso').value.trim();
    
    if (!nombre || !curso) {
      e.preventDefault();
      alert('Por favor complete todos los campos requeridos');
      return;
    }
  }
});

// Validación en tiempo real del RUT - MEJORADA
document.getElementById('rut').addEventListener('blur', function() {
  const rut = this.value.trim();
  
  // Solo validar si hay contenido y no se ha mostrado alerta recientemente
  if (rut && !rutAlertMostrada) {
    if (!validarRUTCompleto(rut)) {
      rutAlertMostrada = true; // Marcar que ya se mostró la alerta
      
      // Mensaje específico según el tipo de error
      const rutLimpio = rut.replace(/\./g, '').replace(/-/g, '').replace(/\s/g, '').toUpperCase();
      const cuerpo = rutLimpio.slice(0, -1);
      
      let mensaje = 'Por favor ingrese un RUT válido.';
      if (esPatronRepetitivo(cuerpo)) {
        mensaje = 'El RUT ingresado parece no ser válido. Por favor verifique los datos.';
      } else if (parseInt(cuerpo) === 0) {
        mensaje = 'El RUT no puede ser todos ceros.';
      }
      
      alert(mensaje + '\n\nEjemplos válidos: 12345678-9, 9876543-K');
      
      // Enfocar pero permitir que el usuario pueda hacer clic en otro lugar
      setTimeout(() => {
        this.focus();
      }, 100);
    }
  }
});

// Resetear la flag cuando el usuario empiece a editar el RUT
document.getElementById('rut').addEventListener('focus', function() {
  rutAlertMostrada = false; // Permitir nueva alerta si es necesario
  this.classList.remove('error'); // Remover clase de error si existe
});

// También agregar una clase de error visual en lugar de solo alerta
document.getElementById('rut').addEventListener('input', function() {
  const rut = this.value.trim();
  
  // Validación visual en tiempo real
  if (rut) {
    if (validarRUTCompleto(rut)) {
      this.classList.remove('error');
      this.classList.add('success');
    } else {
      this.classList.remove('success');
      // No agregamos clase error inmediatamente, solo después de blur
    }
  } else {
    this.classList.remove('success', 'error');
  }
});

// Función mejorada para validar RUT chileno
function validarRUTCompleto(rut) {
  // Limpiar el RUT: quitar puntos, guiones y espacios
  rut = rut.replace(/\./g, '').replace(/-/g, '').replace(/\s/g, '').toUpperCase();
  
  // Validar longitud mínima
  if (rut.length < 2) return false;
  
  // Separar cuerpo y dígito verificador
  const cuerpo = rut.slice(0, -1);
  const dv = rut.slice(-1);
  
  // Validar que el cuerpo sea numérico
  if (!/^\d+$/.test(cuerpo)) return false;
  
  // Validar que no sea un RUT con ceros (00000000-0)
  if (parseInt(cuerpo) === 0) return false;
  
  // Validar que el cuerpo no sea muy grande (máximo 99.999.999)
  if (parseInt(cuerpo) > 99999999) return false;
  
  // NUEVA VALIDACIÓN: Rechazar patrones repetitivos
  if (esPatronRepetitivo(cuerpo)) {
    return false;
  }
  
  // Validar formato del dígito verificador
  if (!/^[0-9K]$/.test(dv)) return false;
  
  // Calcular dígito verificador esperado
  let suma = 0;
  let multiplo = 2;
  
  // Recorrer el cuerpo de derecha a izquierda
  for (let i = cuerpo.length - 1; i >= 0; i--) {
    suma += parseInt(cuerpo.charAt(i)) * multiplo;
    multiplo = multiplo === 7 ? 2 : multiplo + 1;
  }
  
  // Calcular dígito verificador esperado
  const dvEsperado = 11 - (suma % 11);
  const dvCalculado = dvEsperado === 11 ? '0' : dvEsperado === 10 ? 'K' : dvEsperado.toString();
  
  // Comparar con el dígito verificador ingresado
  return dvCalculado === dv;
}

// Función para detectar patrones repetitivos
function esPatronRepetitivo(cuerpo) {
  // Convertir a string y verificar patrones
  const str = cuerpo.toString();
  
  // Patrones comunes a rechazar
  const patronesInvalidos = [
    /^(\d)\1+$/, // Todos los dígitos iguales: 22222222, 11111111, etc.
    /^(\d{2})\1+$/, // Patrón repetido de 2 dígitos: 12121212
    /^(\d{3})\1+$/, // Patrón repetido de 3 dígitos: 12312312
    /^(\d{4})\1+$/, // Patrón repetido de 4 dígitos
    /^012345678/, // Secuencia ascendente
    /^987654321/, // Secuencia descendente
  ];
  
  // Verificar si coincide con algún patrón inválido
  for (let patron of patronesInvalidos) {
    if (patron.test(str)) {
      return true;
    }
  }
  
  // También rechazar si tiene más de 6 dígitos repetidos consecutivos
  if (/(\d)\1{5,}/.test(str)) {
    return true;
  }
  
  return false;
}

// Función para formatear RUT automáticamente
document.getElementById('rut').addEventListener('input', function(e) {
  let rut = e.target.value.replace(/\./g, '').replace(/-/g, '').toUpperCase();
  
  // Guardar posición del cursor
  const cursorPosition = e.target.selectionStart;
  
  // Si el RUT tiene más de 1 carácter, formatearlo
  if (rut.length > 1) {
    // Separar cuerpo y DV
    const cuerpo = rut.slice(0, -1);
    const dv = rut.slice(-1);
    
    // Formatear cuerpo con puntos
    let cuerpoFormateado = '';
    for (let i = 0; i < cuerpo.length; i++) {
      if (i > 0 && (cuerpo.length - i) % 3 === 0) {
        cuerpoFormateado += '.';
      }
      cuerpoFormateado += cuerpo[i];
    }
    
    // Unir cuerpo formateado con DV
    const nuevoValor = cuerpoFormateado + '-' + dv;
    e.target.value = nuevoValor;
    
    // Intentar mantener la posición del cursor
    setTimeout(() => {
      // Calcular nueva posición aproximada
      let nuevaPosicion = cursorPosition;
      if (cursorPosition >= cuerpo.length - 3) nuevaPosicion += 1;
      if (cursorPosition >= cuerpo.length - 6) nuevaPosicion += 1;
      
      e.target.setSelectionRange(nuevaPosicion, nuevaPosicion);
    }, 0);
  }
});

// Agregar estos estilos CSS para feedback visual
const style = document.createElement('style');
style.textContent = `
  #rut.success {
    border-color: #28a745 !important;
    box-shadow: 0 0 0 0.2rem rgba(40, 167, 69, 0.25) !important;
  }
  
  #rut.error {
    border-color: #dc3545 !important;
    box-shadow: 0 0 0 0.2rem rgba(220, 53, 69, 0.25) !important;
  }
  
  /* Estilos para los botones de toggle */
  .toggle-btn {
    transition: all 0.3s ease;
  }
  
  .toggle-btn.active {
    background-color: #2563EB !important;
    color: white !important;
    border-color: #2563EB !important;
  }
`;
document.head.appendChild(style);

// Función auxiliar para mostrar ejemplos de RUT válidos (para debugging)
function mostrarEjemplosRUT() {
  const ejemplos = [
    '12345678-9',
    '9876543-K', 
    '11222333-4',
    '55666777-8',
    '123456789', // Sin formato
    '9876543k'   // Con k minúscula
  ];
  console.log('Ejemplos de RUT válidos:', ejemplos);
}

// Inicialización adicional cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', function() {
  // Asegurar que el modo identificado esté activo por defecto
  if (btnIdentificado && !btnIdentificado.classList.contains('active')) {
    btnIdentificado.click();
  }
  
  // Agregar tooltip o ayuda contextual para el RUT
  const rutInput = document.getElementById('rut');
  if (rutInput) {
    rutInput.setAttribute('title', 'Ejemplos: 12345678-9 o 123456789');
  }
});

// También puedes agregar esta función para testing
function testRUTs() {
  const tests = [
    { rut: '22222222-2', esperado: false, razon: 'Todos dígitos iguales' },
    { rut: '11111111-1', esperado: false, razon: 'Todos dígitos iguales' },
    { rut: '12345678-9', esperado: true, razon: 'RUT válido' },
    { rut: '00000000-0', esperado: false, razon: 'Todos ceros' },
    { rut: '12121212-1', esperado: false, razon: 'Patrón repetitivo' },
    { rut: '123456789', esperado: true, razon: 'RUT válido sin formato' }
  ];
  
  console.log('🧪 Testing validación de RUTs:');
  tests.forEach(test => {
    const resultado = validarRUTCompleto(test.rut);
    const status = resultado === test.esperado ? '✅' : '❌';
    console.log(`${status} ${test.rut} - Esperado: ${test.esperado}, Obtenido: ${resultado} - ${test.razon}`);
  });
}

// Descomenta la siguiente línea para ejecutar tests en consola:
// testRUTs();