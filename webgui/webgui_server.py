#!/system/bin/env python3
from http.server import BaseHTTPRequestHandler, HTTPServer
import json
import os
import threading
CONFIG_PATH='/system/etc/popup_light.conf'
STATE={'enabled':True,'rule':'always','speed_ms':250,'pattern':'150,150,150,150'}

def load_config():
    try:
        with open(CONFIG_PATH,'r') as f:
            for line in f:
                if '=' in line:
                    k,v=line.strip().split('=',1)
                    STATE[k.lower()]=v
    except FileNotFoundError:
        pass


def save_config():
    with open(CONFIG_PATH,'w') as f:
        f.write('ENABLED={}\n'.format('1' if STATE.get('enabled') else '0'))
        f.write('RULE={}\n'.format(STATE.get('rule','always')))
        f.write('SPEED_MS={}\n'.format(STATE.get('speed_ms',250)))
        f.write('PATTERN={}\n'.format(STATE.get('pattern','150,150,150,150')))


class Handler(BaseHTTPRequestHandler):
    def do_GET(self):
        if self.path == '/api/status':
            load_config()
            data={'status':'ok','config':STATE}
            self.respond(200,data)
            return
        if self.path == '/':
            self.send_response(200)
            self.send_header('Content-Type','text/html')
            self.end_headers()
            with open(os.path.join(os.path.dirname(__file__),'index.html'),'rb') as f:
                self.wfile.write(f.read())
            return
        if self.path.endswith('.js'):
            self.serve_file('application/javascript')
            return
        if self.path.endswith('.css'):
            self.serve_file('text/css')
            return
        self.send_response(404)
        self.end_headers()

    def do_POST(self):
        if self.path != '/api/config':
            self.send_response(404)
            self.end_headers()
            return
        length=int(self.headers.get('content-length',0))
        body=self.rfile.read(length).decode('utf-8')
        data=json.loads(body)
        STATE['enabled']=bool(data.get('enabled',True))
        STATE['rule']=data.get('rule','always')
        STATE['speed_ms']=int(data.get('speed_ms',250))
        STATE['pattern']=data.get('pattern','150,150,150,150')
        save_config()
        self.respond(200,{'status':'saved','config':STATE})

    def respond(self, code, obj):
        self.send_response(code)
        self.send_header('Content-Type','application/json')
        self.end_headers()
        self.wfile.write(json.dumps(obj).encode('utf-8'))

    def serve_file(self, mimetype):
        path=os.path.join(os.path.dirname(__file__),self.path.lstrip('/'))
        if os.path.isfile(path):
            self.send_response(200)
            self.send_header('Content-Type',mimetype)
            self.end_headers()
            with open(path,'rb') as f:
                self.wfile.write(f.read())
            return
        self.send_response(404)
        self.end_headers()


def run():
    load_config()
    server=HTTPServer(('127.0.0.1',8080),Handler)
    thread=threading.Thread(target=server.serve_forever)
    thread.daemon=True
    thread.start()
    try:
        thread.join()
    except KeyboardInterrupt:
        server.shutdown()

if __name__=='__main__':
    run()
