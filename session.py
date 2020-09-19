from flask import Flask, session, redirect, url_for, request
from markupsafe import escape

app = Flask(__name__)

# Set the secret key to some random bytes. Keep this really secret!
app.secret_key = b'_5#y2L"F4Q8z\n\xec]/'

loggedInUsers = []

@app.route('/')
def index():
    if 'username' in session:
        if session['username'] not in loggedInUsers:
            loggedInUsers.append(session['username'])
        return 'Logged in as %s' % escape(session['username'])
    return 'You are not logged in'

@app.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        if request.form['username'] in loggedInUsers:
            return '{} is already logged in you son of a beach'.format(request.form['username'])
        if 'username' in session:
            if session['username'] is not None:
                return 'You are already logged in as {}'.format(session['username'])
    if request.method == 'POST':
        session['username'] = request.form['username'] #TODO: change to uuid
        loggedInUsers.append(request.form['username'])
        return redirect(url_for('index'))
    return '''
        <form method="post">
            <p><input type=text name=username>
            <p><input type=submit value=Login>
        </form>
    '''




@app.route('/logout')
def logout():
    # remove the username from the session if it's there
    # TODO: change to uuid
    loggedInUsers.remove(session['username'])
    session.pop('username', None)
    return redirect(url_for('index'))

