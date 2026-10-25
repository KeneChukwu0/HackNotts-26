from __future__ import print_function
from http.server import HTTPServer, BaseHTTPRequestHandler
import blink2
import json
import threading


class ApiHandler(BaseHTTPRequestHandler):
    def do_GET(self):

        if self.path != "/blink_detected":
            self.send_error(404)
            return

        try:
            result = blink2.blink_detect()

            response = json.dumps({"blink_detected": result}).encode()
            print(response)
            blink2.blink_detected = False
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

if __name__ == "__main__":
    # Start camera detection only once
    thread = threading.Thread(
        target=blink2.blink,
        daemon=True
    )
    thread.start()
server = HTTPServer(("127.0.0.1", 8080), ApiHandler)
print("Blink API running on http://127.0.0.1:4242")
server.serve_forever()