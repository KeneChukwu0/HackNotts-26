from __future__ import print_function
from http.server import HTTPServer, BaseHTTPRequestHandler
from blink2 import blink
import json
import sys
import zerorpc

class ApiHandler(BaseHTTPRequestHandler):
    def do_GET(self):
        if self.path != "/blink":
            self.send_error(404)
            return

        try:
            result = blink()

            response = json.dumps({"blink": result}).encode()

            self.send_response(200)
            self.send_header("Content-Type", "application/json")
            self.send_header("Content-Length", str(len(response)))
            self.end_headers()
            self.wfile.write(response)

        except Exception as e:
            print("Blink detection error:", e)
            self.send_error(500)

    def log_message(self, format, *args):
        pass


server = HTTPServer(("127.0.0.1", 8080), ApiHandler())
print("Blink API running on http://127.0.0.1:4242")
server.serve_forever()