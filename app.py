from flask import Flask, request, redirect, jsonify, flash, Response
from json import loads
import numpy as np
import cv2
import os

app = Flask(__name__)
app.secret_key = "erfgLKJKLJGKLkjLKLGjlSSLKDgjl"

imgRadius = 190
numPins = 360
initPin = 270
numLines = 100
imgPath = 'pictures/t.jpg'
minLoop = 5
lineWeight = 11
lineWidth = 3


UPLOAD_FOLDER = './pictures'
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER


@app.route("/", methods=["GET", "OPTIONS"])
def get():
    resp = Response("Ready for processing data!")
    return resp


@app.route('/', methods=['POST'])
def upload_file():
    if request.method == 'POST':
        if 'file' not in request.files:
            flash('No file part')
            return redirect(request.url)
        file = request.files["file"]
        json = request.form["json"]
        if file.filename == '':
            flash('No selected file')
            return redirect(request.url)
        if file:
            if not os.path.exists("./pictures"):
                os.mkdir("./pictures")
            file.save(os.path.join(app.config['UPLOAD_FOLDER'], "t.jpg"))
            print("Received an post request")
            global numLines
            numLines = int(loads(json)[0])
        else:
            return "Wrong file", 200

    return jsonify(main())  # send_file("threaded.png")


def maskImage(image, radius):
    y, x = np.ogrid[-radius:radius + 1, -radius:radius + 1]
    mask = x**2 + y**2 > radius**2
    image[mask] = 0

    return image


def pinCoords(radius, numPins=200, offset=0, x0=None, y0=None):
    alpha = np.linspace(0 + offset, 2*np.pi + offset, numPins + 1)

    if (x0 == None) or (y0 == None):
        x0 = radius + 1
        y0 = radius + 1

    coords = []
    for angle in alpha[0:-1]:
        x = int(x0 + radius*np.cos(angle))
        y = int(y0 + radius*np.sin(angle))

        coords.append((x, y))
    return coords


def linePixels(pin0, pin1):
    length = int(np.hypot(pin1[0] - pin0[0], pin1[1] - pin0[1]))

    x = np.linspace(pin0[0], pin1[0], length)
    y = np.linspace(pin0[1], pin1[1], length)
    return (x.astype(int)-1, y.astype(int)-1)


def main():
    global numLines
    image = cv2.imread(imgPath)
    height, width = image.shape[0:2]
    minEdge = min(height, width)
    topEdge = int((height - minEdge)/2)
    leftEdge = int((width - minEdge)/2)
    imgCropped = image[topEdge:topEdge + minEdge, leftEdge:leftEdge+minEdge]
    # cv2.imwrite('./cropped.png', imgCropped)

    imgGray = cv2.cvtColor(imgCropped, cv2.COLOR_BGR2GRAY)
    # cv2.imwrite('./gray.png', imgGray)

    imgSized = cv2.resize(imgGray, (2*imgRadius + 1, 2*imgRadius + 1))
    # cv2.imwrite("./sized.png", imgSized)

    imgInverted = 255-imgSized
    # cv2.imwrite('./inverted.png', imgInverted)

    imgMasked = maskImage(imgInverted, imgRadius)
    # cv2.imwrite('./masked.png', imgMasked)

    coords = pinCoords(imgRadius, numPins)
    height, width = imgMasked.shape[0:2]

    imgResult = 255 * np.ones((height, width))

    i = 0
    lines = []
    previousPins = []
    strings = []
    oldPin = initPin
    lineMask = np.zeros((height, width))

    for line in range(numLines):
        i += 1
        bestLine = 0
        oldCoord = coords[oldPin]

        for index in range(1, numPins):
            pin = (oldPin + index) % numPins

            coord = coords[pin]

            xLine, yLine = linePixels(oldCoord, coord)

            lineSum = np.sum(imgMasked[yLine, xLine])

            if (lineSum > bestLine) and not (pin in previousPins):
                bestLine = lineSum
                bestPin = pin

        # Update previous pins
        if len(previousPins) >= minLoop:
            previousPins.pop(0)
        previousPins.append(bestPin)

        # Subtract new line from image
        lineMask = lineMask * 0
        cv2.line(lineMask, oldCoord, coords[bestPin], lineWeight, lineWidth)
        imgMasked = np.subtract(imgMasked, lineMask)

        # Save line to results
        lines.append((oldPin, bestPin))

        # plot results
        xLine, yLine = linePixels(coords[bestPin], coord)
        strings.append([coords[bestPin], coord])
        imgResult[yLine, xLine] = 0

        # Break if no lines possible
        if bestPin == oldPin:
            break

        # Prepare for next loop
        oldPin = bestPin

        # Print progress
        '''sys.stdout.write("\b\b")
        sys.stdout.write("\r")
        sys.stdout.write("[+] Computing line " + str(line + 1)
                         + " of " + str(numLines) + " total")
        sys.stdout.flush()'''

    # print("\n[+] Image threaded")

    # Wait for user and save before exit
    # cv2.imwrite('./threaded.png', imgResult)
    # return imgResult

    #rgb_img = cv2.cvtColor(imgResult.astype('uint8'), cv2.COLOR_BGR2RGB)
    #plt.imshow(rgb_img)
    #plt.show()
    #cv2.imshow("11", imgResult)
    #cv2.waitKey(3000)

    '''svg_output = open('threaded.svg','wb')
    header="""<?xml version="1.0" standalone="no"?>
    <svg width="%i" height="%i" version="1.1" xmlns="http://www.w3.org/2000/svg">
    """ % (width, height)
    footer="</svg>"
    svg_output.write(header.encode('utf8'))
    pather = lambda d : '<path d="%s" stroke="black" stroke-width="0.5" fill="none" />\n' % d
    pathstrings=[]
    pathstrings.append("M" + "%i %i" % coords[lines[0][0]] + " ")
    print(lines)
    for l in lines:
        nn = coords[l[1]]
        pathstrings.append("L" + "%i %i" % nn + " ")
    pathstrings.append("Z")
    d = "".join(pathstrings)
    svg_output.write(pather(d).encode('utf8'))
    svg_output.write(footer.encode('utf8'))
    svg_output.close()'''
    return strings, lines


@app.after_request
def apply_caching(resp):
    resp.headers.set('Access-Control-Allow-Origin', '*')
    resp.headers['Access-Control-Allow-Headers'] = '*'
    resp.headers['Access-Control-Allow-Methods'] = '*'
    return resp


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)