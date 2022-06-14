from contextlib import nullcontext
from ctypes import sizeof
import json
from flask import Flask, request, Response
import flask
from flask_cors import CORS, cross_origin
import cv2
import numpy as np
from json import JSONEncoder


# Setup flask server
app = Flask(__name__)
CORS(app)

# Setup url route which will calculate
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
    #print(dataPixels[2], ",", dataPixels[1], ",", dataPixels[0])
    arrayNP = np.array(dataPixels[3:], dtype=np.uint16)
    # print(np.shape(arrayNP))
    image = np.reshape(arrayNP, (dataPixels[2], dataPixels[1], dataPixels[0]))

    kernel = np.ones((5, 5), np.uint16)/25
    for slice in image:
        slice = cv2.filter2D(slice, -1, kernel)
    image = np.reshape(image, arrayNP.size)
    print(image)

    image = image.tobytes()
    response = flask.make_response(image)
    response.headers.set('Content-Type', 'application/octet-stream')
    return Response(flask.make_response,  headers={'Access-Control-Allow-Origin': '*'})


if __name__ == "__main__":
    app.run(port=5000)
