"""Serve the website on your own computer the way GitHub Pages does: /terms shows terms.html, /app shows app.html.

    python tools/serve.py          # http://127.0.0.1:8000
    python tools/serve.py 8765     # another port

On localhost the site uses the TEST database (config.js). Run it from anywhere: it always serves the web folder.
"""
import functools, http.server, os, sys

WEB = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))


class Pages(http.server.SimpleHTTPRequestHandler):
    def translate_path(self, path):
        p = super().translate_path(path)
        # a clean URL is the .html file of that name, like on GitHub Pages. A folder that isn't published (app/, the
        # phone app's source, is left out in _config.yml) doesn't count, so /app is app.html here too.
        if os.path.exists(p + '.html') and (not os.path.exists(p) or not os.path.exists(os.path.join(p, 'index.html'))):
            return p + '.html'
        return p


if __name__ == '__main__':
    port = int(sys.argv[1]) if len(sys.argv) > 1 else 8000
    handler = functools.partial(Pages, directory=WEB)
    print(f'Serving {WEB} at http://127.0.0.1:{port}/')
    http.server.ThreadingHTTPServer(('127.0.0.1', port), handler).serve_forever()
