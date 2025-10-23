from flask import Flask, render_template, request, flash, redirect, url_for, session, jsonify
from reportes import Reporte
from ia import chat

app = Flask(__name__)
app.config['SECRET_KEY'] = 'una_clave_secreta_muy_segura'

# Credenciales fijas para admin (sin base de datos)
ADMIN_CREDENTIALS = {
    'email': 'admin@colegio.com',
    'password': 'admin123'
}

# Página principal landing
@app.route('/')
def index():
    return render_template('index.html')


# Página para enviar reportes (acceso libre para estudiantes)
@app.route('/enviar_reporte', methods=['GET', 'POST'])
def hacer_reporte():
    """Página para enviar reportes (acceso libre para estudiantes)"""
    if request.method == 'POST':
        # Determinar si es anónimo
        es_anonimo = request.form.get('es_anonimo') == 'true'
        if es_anonimo:
            # Datos para reporte anónimo
            nombre = "Anónimo"
            rut = request.form.get('rut')
            curso = "No especificado"
            correo = None
        else:
            # Datos para reporte normal
            nombre = request.form.get('nombre')
            rut = request.form.get('rut')
            curso = request.form.get('curso')
            correo = request.form.get('correo')
        categoria = request.form.get('tipoReporte')
        descripcion = request.form.get('declaracion')
        
        # Validaciones
        if not es_anonimo and not all([nombre, rut, curso, categoria, descripcion]):
            flash('Por favor complete todos los campos requeridos', 'error')
            return render_template('reporte.html')
        if es_anonimo and not all([rut, categoria, descripcion]):
            flash('Por favor seleccione categoría y describa el incidente', 'error')
            return render_template('reporte.html')
        
        try:
            # Determinar prioridad automáticamente
            prioridad_map = {
                'acoso': 'alta', 
                'bullying': 'alta', 
                'violencia': 'alta',
                'ciberacoso': 'alta', 
                'discriminacion': 'media',
                'conflicto': 'baja', 
                'indisciplina': 'baja', 
                'otro': 'baja'
            }
            prioridad = prioridad_map.get(categoria, 'media')
            
            # Obtener prioridad sugerida por IA (si está disponible)
            ia_prioridad = chat(descripcion)
            print("----------------------")
            print(f"IA returned: {ia_prioridad}")
            
            # Normalizar valor devuelto por IA
            if ia_prioridad in ('alta', 'media', 'baja', 'spam'):
                prioridad = ia_prioridad
            
            # Crear reporte — pasar prioridad explícita
            if prioridad != "spam":
                if Reporte.crear_reporte(nombre, rut, curso, correo, categoria, descripcion, prioridad, es_anonimo):
                    if es_anonimo:
                        flash('Reporte anónimo enviado exitosamente. Será revisado pronto.', 'success')
                    else:
                        flash('Reporte enviado exitosamente. Será revisado pronto.', 'success')
                else:
                    flash('Error al enviar el reporte', 'error')
            else:
                flash('Reporte identificado como no relevante. Si es un error, por favor contacte al administrador.', 'info')
                
        except Exception as e:
            flash(f'Error: {str(e)}', 'error')
        
        return redirect(url_for('index'))
    
    return render_template('reporte.html')


@app.route('/enviar_anonimo', methods=['POST'])
def enviar_anonimo():
    """Endpoint para enviar reporte anónimo (AJAX)"""
    try:
        data = request.get_json()
        rut = data.get('rut')
        categoria = data.get('categoria')
        descripcion = data.get('descripcion')
        if not all([categoria, descripcion, rut]):
            return jsonify({'success': False, 'message': 'Categoría y descripción son requeridas'})
        # Determinar prioridad
        prioridad_map = {
            'acoso': 'alta', 'bullying': 'alta', 'violencia': 'alta',
            'ciberacoso': 'alta', 'discriminacion': 'media',
            'conflicto': 'baja', 'indisciplina': 'baja', 'otro': 'baja'
        }
        prioridad = prioridad_map.get(categoria, 'media')
        # Crear reporte anónimo
        resultado = Reporte.crear_reporte(
            nombre="Anónimo",
            rut="No proporcionado",
            curso="No especificado",
            correo=None,
            categoria=categoria,
            descripcion=descripcion,
            prioridad=prioridad,
            es_anonimo=True
        )
        if resultado:
            return jsonify({
                'success': True, 
                'message': 'Reporte anónimo enviado exitosamente'
            })
        else:
            return jsonify({'success': False, 'message': 'Error al enviar el reporte'})   
    except Exception as e:
        return jsonify({'success': False, 'message': f'Error: {str(e)}'})



@app.route('/admin')
def admin():
    """Panel de administración (solo con login)"""
    if 'admin_logged_in' not in session:
        flash('Debe iniciar sesión como administrador', 'error')
        return redirect(url_for('login'))
    try:
        reportes = Reporte.obtener_todos()
        # OCULTAR RUT en reportes anónimos para la vista
        for reporte in reportes:
            if getattr(reporte, 'es_anonimo', False):
                reporte.rut = "No proporcionado"
        return render_template('admin.html', reportes=reportes)
    except Exception as e:
        flash(f'Error al cargar los reportes: {str(e)}', 'error')
        return render_template('admin.html', reportes=[])


@app.route('/detalle_reporte/<int:reporte_id>')
def detalle_reporte(reporte_id):
    """Ver detalles completos de un reporte"""
    if 'admin_logged_in' not in session:
        flash('Debe iniciar sesión como administrador', 'error')
        return redirect(url_for('login'))
    try:
        reporte = Reporte.obtener_por_id(reporte_id)
        if not reporte:
            flash('Reporte no encontrado', 'error')
            return redirect(url_for('admin'))
        # OCULTAR RUT si es anónimo
        if getattr(reporte, 'es_anonimo', False):
            reporte.rut = "No proporcionado"
        return render_template('detalle_reporte.html', reporte=reporte)
    except Exception as e:
        flash(f'Error al cargar el reporte: {str(e)}', 'error')
        return redirect(url_for('admin'))


# Página de login solo para administrativos
@app.route('/login', methods=['GET', 'POST'])
def login():
    # Si ya está logueado, redirigir al admin
    if 'admin_logged_in' in session:
        return redirect(url_for('admin'))
    if request.method == 'POST':
        email = request.form.get('email')
        password = request.form.get('password')
        if not all([email, password]):
            flash('Por favor complete email y contraseña', 'error')
            return render_template('login.html')
        # Verificar credenciales fijas
        if email == ADMIN_CREDENTIALS['email'] and password == ADMIN_CREDENTIALS['password']:
            session['admin_logged_in'] = True
            session['user_name'] = 'Administrador'
            flash('Bienvenido Administrador', 'success')
            return redirect(url_for('admin'))
        else:
            flash('Credenciales incorrectas', 'error')
    return render_template('login.html')


# Cerrar sesión
@app.route('/logout')
def logout():
    session.clear()
    flash('Sesión cerrada correctamente', 'success')
    return redirect(url_for('index'))


# Cambiar estado de un reporte
@app.route('/cambiar_estado/<int:reporte_id>/<nuevo_estado>')
def cambiar_estado(reporte_id, nuevo_estado):
    if 'admin_logged_in' not in session:
        flash('Acceso denegado', 'error')
        return redirect(url_for('login'))
    try:
        if Reporte.actualizar_estado(reporte_id, nuevo_estado):
            flash(f'Estado actualizado a {nuevo_estado}', 'success')
        else:
            flash('Error al actualizar estado', 'error')
    except Exception as e:
        flash(f'Error: {str(e)}', 'error')
    return redirect(url_for('admin'))



if __name__ == "__main__": 
    app.run(debug=True)