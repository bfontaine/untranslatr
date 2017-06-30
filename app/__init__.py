'''
(c) Varun Malhotra 2015
LICENSE: MIT
'''
# -*- coding: utf-8 -*-

from flask import json, Flask, request, render_template

import requests

app = Flask(__name__)

HEADERS = {'User-Agent':"Mozilla/4.0 (compatible; MSIE 6.0; Windows NT 5.1; SV1; .NET CLR 1.1.4322; .NET CLR 2.0.50727; .NET CLR 3.0.04506.30)"}

def translate(text_to_translate, to_language='auto', from_langage='auto'):
	before_trans = 'class="t0">'
	link = "http://translate.google.com/m?hl=%s&sl=%s&q=%s" % (to_language, from_langage, text_to_translate.replace(" ", "+"))

	page = requests.get(link, headers=HEADERS).text
	result = page[page.find(before_trans) + len(before_trans):]
	return result.split("<", 1)[0]

@app.route('/')
def my_form():
	return render_template('index.html')

@app.route('/', methods=['POST'])
def my_form_post():
	params = json.loads(request.data)

	text = params['userText']
	texts = {lang: translate(text, lang) for lang in params["l"]}

	return json.dumps({'translatedText': texts})

if __name__ == '__main__':
	app.run(debug=True, port=8000)
