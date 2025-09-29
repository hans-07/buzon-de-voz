from flask import Flask, render_template, session, redirect, request, flash, url_for
app = Flask(__name__)

@app.route('/')
def index():
    return render_template('index.html')

#Ruta para el login unificado
@app.route('/login')
def login_unificado():
    return render_template('login_unificado.html')
    
@app.route('/reporte')
def hacer_reporte():
    return render_template('reporte.html')

@app.route('/admin')
def admin():
    return render_template('admin.html')

if __name__ == "__main__":
   app.run(debug=True)