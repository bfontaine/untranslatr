# -*- coding: utf-8 -*-

from flask import json, Flask, request, render_template

import requests
from bs4 import BeautifulSoup

app = Flask(__name__)
app.debug = True

HEADERS = {
	"User-Agent": "Mozilla/4.0 (compatible; MSIE 6.0; Windows NT 5.1; SV1; .NET CLR 1.1.4322; .NET CLR 2.0.50727; .NET CLR 3.0.04506.30)",
}

def translate(text, to_language='auto', from_langage='auto'):
	page = requests.get("http://translate.google.com/m", params={
		"hl": to_language,
		"sl": from_langage,
		"q": text,
	}, headers=HEADERS)

	soup = BeautifulSoup(page.text, "html.parser")
	el = soup.select_one(".t0")
	if el:
		return el.text

@app.route('/')
def my_form():
	return render_template('index.html')

@app.route('/', methods=['POST'])
def my_form_post():
	params = json.loads(request.data)

	text = params['userText']
	texts = {lang: translate(text, "en", lang) for lang in params["l"]}

	return json.dumps({'translatedText': texts})

if __name__ == '__main__':
	app.run(port=8000)
