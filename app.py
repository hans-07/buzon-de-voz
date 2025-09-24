from flask import Flask, render_template, session, redirect, request
app = Flask(__name__)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/reporte')
def hacer_reporte():
    pass

@app.route('/admin')
def admin():
    return render_template('admin.html')

if __name__ == "__main__":
   app.run(debug=True)