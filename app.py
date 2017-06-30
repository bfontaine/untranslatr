# -*- coding: utf-8 -*-

import requests
from bs4 import BeautifulSoup
from flask import json, Flask, request, render_template

app = Flask(__name__)
app.debug = True

HEADERS = {
	"User-Agent": "Mozilla/4.0 (compatible; MSIE 6.0; Windows NT 5.1; SV1)",
}

def translate(text, to_language="auto", from_langage="auto"):
	page = requests.get("http://translate.google.com/m", params={
		"hl": to_language,
		"sl": from_langage,
		"q": text,
	}, headers=HEADERS)

	soup = BeautifulSoup(page.text, "html.parser")
	el = soup.select_one(".t0")
	if el:
		return el.text

@app.route("/", methods=["GET", "POST"])
def translate_form():
	if not request.data:
		return render_template("index.html")

	params = json.loads(request.data)

	text = params["userText"]
	texts = {lang: translate(text, "en", lang) for lang in params["l"]}

	return json.dumps({"translatedText": texts})
