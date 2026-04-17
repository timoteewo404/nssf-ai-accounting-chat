import http.server
import socketserver
from urllib.parse import parse_qs
import html

PORT = 8000

# Simple username/password pairs for demo
USERS = {
    'admin': 'password123',
    'user': 'secret',
}

LOGIN_PAGE = '''<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Simple Login Server</title>
  <style>
    body { background: #0f172a; color: #e2e8f0; font-family: Arial, sans-serif; display: flex; justify-content: center; align-items: center; min-height: 100vh; margin: 0; }
    .container { background: rgba(15, 23, 42, 0.95); padding: 32px; border-radius: 18px; box-shadow: 0 20px 50px rgba(0,0,0,0.3); width: 320px; }
    h1 { margin-top: 0; font-size: 1.6rem; }
    label { display: block; margin-top: 16px; font-size: 0.95rem; }
    input { width: 100%; padding: 12px 14px; border-radius: 12px; border: 1px solid rgba(148,163,184,0.2); margin-top: 6px; background: #111827; color: #f8fafc; }
    button { width: 100%; margin-top: 24px; padding: 12px; border: none; border-radius: 12px; background: #2563eb; color: #fff; cursor: pointer; font-weight: 700; }
    .message { margin-top: 16px; padding: 12px 14px; border-radius: 12px; background: rgba(255,255,255,0.08); }
  </style>
</head>
<body>
  <div class="container">
    <h1>Login</h1>
    <form method="POST" action="/login">
      <label>Username</label>
      <input type="text" name="username" required />
      <label>Password</label>
      <input type="password" name="password" required />
      <button type="submit">Sign in</button>
    </form>
    {message}
  </div>
</body>
</html>'''

SUCCESS_PAGE = '''<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Login Successful</title>
  <style>
    body { background: #0f172a; color: #e2e8f0; display: flex; justify-content: center; align-items: center; min-height: 100vh; margin: 0; font-family: Arial, sans-serif; }
    .box { background: rgba(15, 23, 42, 0.95); padding: 32px; border-radius: 18px; box-shadow: 0 20px 50px rgba(0,0,0,0.3); text-align: center; }
    a { color: #60a5fa; text-decoration: none; font-weight: 700; }
  </style>
</head>
<body>
  <div class="box">
    <h1>Welcome, {user}!</h1>
    <p>You are now signed in.</p>
    <p><a href="/login">Return to login page</a></p>
  </div>
</body>
</html>'''

class LoginHandler(http.server.BaseHTTPRequestHandler):
    def do_GET(self):
        if self.path != '/login':
            self.send_response(302)
            self.send_header('Location', '/login')
            self.end_headers()
            return

        self.send_response(200)
        self.send_header('Content-Type', 'text/html; charset=utf-8')
        self.end_headers()
        self.wfile.write(LOGIN_PAGE.format(message='').encode('utf-8'))

    def do_POST(self):
        if self.path != '/login':
            self.send_response(404)
            self.end_headers()
            return

        length = int(self.headers.get('Content-Length', 0))
        body = self.rfile.read(length).decode('utf-8')
        data = parse_qs(body)
        username = html.escape(data.get('username', [''])[0])
        password = data.get('password', [''])[0]

        if username in USERS and USERS[username] == password:
            self.send_response(200)
            self.send_header('Content-Type', 'text/html; charset=utf-8')
            self.end_headers()
            self.wfile.write(SUCCESS_PAGE.format(user=username).encode('utf-8'))
            return

        self.send_response(401)
        self.send_header('Content-Type', 'text/html; charset=utf-8')
        self.end_headers()
        message = '<div class="message">Invalid username or password. Try <strong>admin/password123</strong>.</div>'
        self.wfile.write(LOGIN_PAGE.format(message=message).encode('utf-8'))

    def log_message(self, format, *args):
        return

if __name__ == '__main__':
    with socketserver.TCPServer(('', PORT), LoginHandler) as httpd:
        print(f'Serving login server at http://localhost:{PORT}/login')
        httpd.serve_forever()
