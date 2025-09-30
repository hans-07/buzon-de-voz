document.addEventListener('DOMContentLoaded', function() {
    // Inicializar Lucide icons
    lucide.createIcons();
    
    // Elementos del DOM
    const form = document.getElementById('reportingForm');
    const successMessage = document.getElementById('successMessage');
    const mainForm = document.getElementById('mainForm');
    const declaracionTextarea = document.getElementById('declaracion');
    const charCount = document.getElementById('charCount');
    const submitBtn = document.getElementById('submitBtn');
    const anonymousBtn = document.getElementById('anonymousBtn');
    const tipoReporteSelect = document.getElementById('tipoReporte');
    const severidadHidden = document.getElementById('severidad');

    // Mapeo de severidades automáticas
    const severidadMap = {
        // Graves - Requieren acción inmediata
        'acoso': 'grave',
        'bullying': 'grave', 
        'violencia': 'grave',
        'ciberacoso': 'grave',
        
        // Intermedios - Requieren intervención
        'discriminacion': 'intermedio',
        
        // Leves - Situaciones que requieren atención
        'conflicto': 'leve',
        'indisciplina': 'leve',
        'otro': 'leve'
    };

    // Actualizar severidad automáticamente cuando cambie el tipo de reporte
    if (tipoReporteSelect) {
        tipoReporteSelect.addEventListener('change', function() {
            const tipoSeleccionado = this.value;
            if (tipoSeleccionado && severidadMap[tipoSeleccionado]) {
                severidadHidden.value = severidadMap[tipoSeleccionado];
            } else {
                severidadHidden.value = 'leve'; // Valor por defecto
            }
        });
    }

    // Contador de caracteres
    if (declaracionTextarea && charCount) {
        declaracionTextarea.addEventListener('input', function() {
            charCount.textContent = this.value.length;
            
            // Validación mínima de caracteres
            if (this.value.length < 20) {
                this.style.borderColor = '#e74c3c';
            } else {
                this.style.borderColor = '#27ae60';
            }
        });
    }

    // Validación de RUT chileno (opcional)
    function validarRUT(rut) {
        if (!rut) return false;
        
        // Limpiar RUT
        rut = rut.replace(/\./g, '').replace(/-/g, '').toUpperCase();
        
        if (rut.length < 2) return false;
        
        const cuerpo = rut.slice(0, -1);
        const dv = rut.slice(-1);
        
        // Validar que el cuerpo sea numérico
        if (!/^\d+$/.test(cuerpo)) return false;
        
        // Calcular DV esperado
        let suma = 0;
        let multiplo = 2;
        
        for (let i = cuerpo.length - 1; i >= 0; i--) {
            suma += parseInt(cuerpo.charAt(i)) * multiplo;
            multiplo = multiplo === 7 ? 2 : multiplo + 1;
        }
        
        const dvEsperado = 11 - (suma % 11);
        const dvCalculado = dvEsperado === 11 ? '0' : dvEsperado === 10 ? 'K' : dvEsperado.toString();
        
        return dvCalculado === dv;
    }

    // Validación de formulario
    function validarFormulario() {
        let isValid = true;
        
        // Limpiar errores previos
        document.querySelectorAll('.error-message').forEach(el => {
            el.textContent = '';
        });
        
        document.querySelectorAll('.input, .select, .textarea').forEach(el => {
            el.style.borderColor = '';
        });

        // Validar RUT
        const rutInput = document.getElementById('rut');
        if (rutInput && rutInput.value.trim()) {
            if (!validarRUT(rutInput.value)) {
                document.getElementById('rutError').textContent = 'RUT inválido';
                rutInput.style.borderColor = '#e74c3c';
                isValid = false;
            }
        }

        // Validar campos requeridos
        const requiredFields = ['nombre', 'rut', 'curso', 'tipoReporte', 'declaracion'];
        requiredFields.forEach(fieldId => {
            const field = document.getElementById(fieldId);
            if (field && !field.value.trim()) {
                document.getElementById(fieldId + 'Error').textContent = 'Este campo es requerido';
                field.style.borderColor = '#e74c3c';
                isValid = false;
            }
        });

        // Validar mínimo de caracteres en declaración
        if (declaracionTextarea && declaracionTextarea.value.length < 20) {
            document.getElementById('declaracionError').textContent = 'La descripción debe tener al menos 20 caracteres';
            declaracionTextarea.style.borderColor = '#e74c3c';
            isValid = false;
        }

        return isValid;
    }

    // Manejar envío del formulario
    if (form) {
        form.addEventListener('submit', function(e) {
            if (!validarFormulario()) {
                e.preventDefault();
                return;
            }
            
            // Mostrar loading
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<i data-lucide="loader"></i> Enviando...';
            lucide.createIcons();
        });
    }

    // Botón de reporte anónimo
    if (anonymousBtn) {
        anonymousBtn.addEventListener('click', function() {
            if (confirm('¿Está seguro de que desea enviar un reporte anónimo? No podremos contactarlo para seguimiento.')) {
                // Limpiar campos de identificación
                document.getElementById('nombre').value = 'Anónimo';
                document.getElementById('rut').value = 'Anónimo';
                document.getElementById('correo').value = '';
                
                // Asegurar que la severidad se actualice
                if (tipoReporteSelect.value) {
                    severidadHidden.value = severidadMap[tipoReporteSelect.value] || 'leve';
                }
                
                // Enviar formulario
                if (validarFormulario()) {
                    form.dispatchEvent(new Event('submit'));
                }
            }
        });
    }

    // Mostrar mensajes flash de Flask
    const flashMessages = document.querySelector('.alert');
    if (flashMessages) {
        setTimeout(() => {
            flashMessages.style.display = 'none';
        }, 5000);
    }
});