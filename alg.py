import cv2
import numpy as np
imgPath = 't.jpg'

# Parameters
imgRadius = 200     # Number of pixels that the image radius is resized to

initPin = 0         # Initial pin to start threading from
numPins = 200       # Number of pins on the circular loom
numLines = 500      # Maximal number of lines

minLoop = 3         # Disallow loops of less than minLoop lines
lineWidth = 3       # The number of pixels that represents the width of a thread
lineWeight = 15     # The weight a single thread has in terms of "darkness"

def invertImage(image):
    return (255-image)

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

    return (x.astype(np.int)-1, y.astype(np.int)-1)

def main():
    image = cv2.imread(imgPath)

    print("[+] loaded " + imgPath + " for threading..")

    height, width = image.shape[0:2]
    minEdge= min(height, width)
    topEdge = int((height - minEdge)/2)
    leftEdge = int((width - minEdge)/2)
    imgCropped = image[topEdge:topEdge+minEdge, leftEdge:leftEdge+minEdge]
    cv2.imwrite('./cropped.png', imgCropped)

    imgGray = cv2.cvtColor(imgCropped, cv2.COLOR_BGR2GRAY)
    cv2.imwrite('./gray.png', imgGray)

    imgSized = cv2.resize(imgGray, (2*imgRadius + 1, 2*imgRadius + 1))

    # Invert image
    imgInverted = invertImage(imgSized)
    cv2.imwrite('./inverted.png', imgInverted)

    # Mask image
    imgMasked = maskImage(imgInverted, imgRadius)
    cv2.imwrite('./masked.png', imgMasked)

    print("[+] image preprocessed for threading..")

    # Define pin coordinates
    coords = pinCoords(imgRadius, numPins)
    height, width = imgMasked.shape[0:2]

    # image result is rendered to
    imgResult = 255 * np.ones((height, width))

    # Initialize variables
    i = 0
    lines = []
    previousPins = []
    oldPin = initPin
    lineMask = np.zeros((height, width))

    imgResult = 255 * np.ones((height, width))

    # Loop over lines until stopping criteria is reached
    for line in range(numLines):
        i += 1
        bestLine = 0
        oldCoord = coords[oldPin]

        # Loop over possible lines
        for index in range(1, numPins):
            pin = (oldPin + index) % numPins

            coord = coords[pin]

            xLine, yLine = linePixels(oldCoord, coord)

            # Fitness function
            lineSum = np.sum(imgMasked[yLine, xLine])

            if (lineSum > bestLine) and not(pin in previousPins):
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
        imgResult[yLine, xLine] = 0
        #cv2.imshow('image', imgResult)
        #cv2.waitKey(1)

        # Break if no lines possible
        if bestPin == oldPin:
            break

        # Prepare for next loop
        oldPin = bestPin

        # Print progress
        #sys.stdout.write("\b\b")
        #sys.stdout.write("\r")
        #sys.stdout.write("[+] Computing line " + str(line + 1) + " of " + str(numLines) + " total")
        #sys.stdout.flush()

    print("\n[+] Image threaded")

    # Wait for user and save before exit
    #cv2.waitKey(0)
    #cv2.destroyAllWindows()
    cv2.imwrite('./threaded.png', imgResult)

    #rgb_img = cv2.cvtColor(imgResult.astype('uint8'), cv2.COLOR_BGR2RGB)
    #plt.imshow(rgb_img)
    #plt.show()

    