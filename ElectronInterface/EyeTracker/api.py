
from http.server import ThreadingHTTPServer, BaseHTTPRequestHandler
import blink2
import json
import threading
import traceback


class ApiHandler(BaseHTTPRequestHandler):
    def do_GET(self):
        if self.path != "/blink_detected":
            self.send_error(404)
            return

        try:
            result = blink2.consume_blink()

            response = json.dumps({
                "blink_detected": result
            }).encode("utf-8")

            self.send_response(200)
            self.send_header("Content-Type", "application/json")
            self.send_header("Content-Length", str(len(response)))
            self.end_headers()
            self.wfile.write(response)

        except Exception:
            traceback.print_exc()
            self.send_error(500)

    def log_message(self, format, *args):
        pass


def run_blink():
    try:
        blink2.blink()
    except Exception:
        traceback.print_exc()


if __name__ == "__main__":
    camera_thread = threading.Thread(
        target=run_blink,
        name="CameraThread",
        daemon=True
    )
    camera_thread.start()

    server = ThreadingHTTPServer(
        ("127.0.0.1", 8080),
        ApiHandler
    )

    print("Blink API running on http://127.0.0.1:8080")
    server.serve_forever()
