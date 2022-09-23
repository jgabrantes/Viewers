from codecs import utf_16_be_decode
from contextlib import nullcontext
from ctypes import sizeof
from email.mime import application
import json
from unittest import result
from flask import Flask, request, Response, redirect, url_for, after_this_request
import flask
from flask_cors import CORS, cross_origin
import cv2
import numpy as np
from json import JSONEncoder
from flask import render_template
import pdfkit
import webbrowser
from threading import Timer
from flask import session
import requests
from fpdf import FPDF
import os
# Setup flask server
app = Flask(__name__)
app.secret_key = "string"
CORS(app)

# Setup url route whixch will calculate
# total sum of array.


class NumpyArrayEncoder(JSONEncoder):
    def default(self, obj):
        if isinstance(obj, np.ndarray):
            return obj.tolist()
        return JSONEncoder.default(self, obj)


@app.route('/filterImage', methods=['POST'])
def filterImage():
    data = request.data
    dataPixels = json.loads(data)

    print(dataPixels[2], ",", dataPixels[1], ",", dataPixels[0])
    arrayNP = np.array(dataPixels[3:], dtype=np.uint16)

    image = np.reshape(arrayNP, (dataPixels[2], dataPixels[1], dataPixels[0]))
    kernel = np.ones((5, 5), np.uint16)/25
    processedSlices = np.empty(np.shape(image), dtype=np.uint16)

    for i in range(dataPixels[2]):
        processedSlices[i] = cv2.filter2D(image[i], -1, kernel)
    # print(processedSlices)

    results = np.empty((1, dataPixels[2]), dtype=float)

    for slice in image:
        np.append(results, np.average(slice))
    # print(results)

    image = np.reshape(processedSlices, arrayNP.size)
    # print(image)

    image = image.tobytes()  # processed image array
    response = flask.make_response(image)

    response.headers.set('Content-Type', 'application/octet-stream')
    res = requests.post('http://127.0.0.1:5000/results',
                        json=json.dumps(results.tolist()))
    # webbrowser.open_new('http://127.0.0.1:5000/results/res=hello')
    # return response
    return response


@app.route('/results', methods=['POST'])
def makePDF():

    #results = np.array(json.loads(request.args['results']))
    data = json.loads(request.data)

    print(data)
    rendered = render_template(
        'pdf_template.html', results=data)

    pdf = pdfkit.from_string(rendered, "static/out.pdf")
    webbrowser.open_new('http://127.0.0.1:5000/static/out.pdf')

    @after_this_request
    def delete(response):
        os.remove('static/out.pdf')
        return response
    response = flask.make_response('')
    response.headers['Content-Type'] = 'application/pdf'
    response.headers['Content-Disposition'] = 'inline; filename=output.pdf'
    return response, 200


def open_browser():
    webbrowser.open_new('http://127.0.0.1:5000/pdf_Viewer')


if __name__ == "__main__":
    # app.secret_key = 'super secret key'
    app.run(port=5000)
