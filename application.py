from flask import Flask
from flask import render_template

app = Flask(__name__)

@app.route('/login')
def login():
    return 'Please Login'


#Example with passing params
@app.route('/hello/')
@app.route('/hello/<name>')
def hello(name=None):
    return render_template('hello.html', name=name)

