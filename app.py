from flask import Flask, render_template, session, redirect, request, flash, url_for
from usuario import Usuario
from reportes import Reportes

app = Flask(__name__)
app.config['SECRET_KEY'] = 'una_clave_secreta_muy_segura'

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/login')
def login_unificado():
    return render_template('login_unificado.html')
    
@app.route('/enviar_reporte', methods=['GET', 'POST'])
def hacer_reporte():
    if request.method == 'POST':
        # Obtener datos del formulario
        nombre = request.form.get('nombre')
        rut = request.form.get('rut')
        curso = request.form.get('curso')
        correo = request.form.get('correo')  # Nuevo campo
        tipo_reporte = request.form.get('tipoReporte')
        declaracion = request.form.get('declaracion')
        
        # Validar campos requeridos
        if not all([nombre, rut, curso, tipo_reporte, declaracion]):
            flash('Por favor complete todos los campos requeridos', 'error')
            return redirect('reporte.html')
        
        # Enviar a la base de datos
        try:
            Usuario.enviar(nombre, rut, curso, correo, declaracion, tipo_reporte)
            flash('Reporte enviado exitosamente', 'success')
            return redirect(url_for('index'))
        except Exception as e:
            flash('Error al enviar el reporte: ' + str(e), 'error')
            return render_template('reporte.html')
    
    # Si es GET, mostrar el formulario
    return render_template('reporte.html')

@app.route('/admin')
def admin():
    try:
        reportes = Usuario.get_all()
        print(f"Total reportes: {len(reportes)}")
        
        return render_template('admin.html', reportes=reportes)
    except Exception as e:
        print(f"Error en ruta admin: {e}")
        flash('Error al cargar los reportes', 'error')
        return render_template('admin.html', reportes=[])
    
@app.route('/detalle_reporte/<int:reporte_id>')
def detalle_reporte(reporte_id):
    try:
        reporte = Usuario.get_by_id(reporte_id)
        if reporte:
            return render_template('detalle_reporte.html', reporte=reporte)
        else:
            flash('Reporte no encontrado', 'error')
            return redirect(url_for('admin'))
    except Exception as e:
        print(f"Error en detalle_reporte: {e}")
        flash('Error al cargar el detalle del reporte', 'error')
        return redirect(url_for('admin'))

if __name__ == "__main__": 
    app.run(debug=True)