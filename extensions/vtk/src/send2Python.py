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
def flterImage():
    data = request.data
    dataPixels = json.loads(data)

    listToArray = np.asarray(list(dataPixels.values()), dtype=np.uint16)

    image = np.reshape(listToArray, [512, 512])

    kernel = np.ones((5, 5), np.float32)/25
    image = cv2.filter2D(image, -1, kernel)
    image = np.reshape(image, listToArray.size)

    print(image.tobytes())
    response = flask.make_response(image.tobytes())
    response.headers.set('Content-Type', 'application/octet-stream')
    # return Response(flask.make_response,  headers={'Access-Control-Allow-Origin': '*'})
    return response


if __name__ == "__main__":
    app.run(port=5000)
