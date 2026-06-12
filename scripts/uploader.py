#!/usr/local/bin/python3
# lazily made script to upload a collection of files
import os
import json
import argparse
import requests

def loadAuth():
    if not os.path.exists('uploader.json'):
        return ''
    with open('uploader.json') as f:
        data = json.loads(f.read())
        return data['auth']
def loadUrl():
    if not os.path.exists('uploader.json'):
        return ''
    with open('uploader.json') as f:
        data = json.loads(f.read())
        return data['url']

parser = argparse.ArgumentParser()
parser.add_argument('file', nargs='+')
parser.add_argument('--auth', default=loadAuth())
parser.add_argument('--url', default=loadUrl())
args = parser.parse_args()

for file in args.file:
    res = requests.put(url=args.url + '/file', headers={'Authorization': args.auth, 'User-Agent': 'UTMDF/python3/1.0'}, files={'file': open(file, 'rb')})
    print(res.text)