import cv2
import numpy as np
from pylepton import Lepton

i = 1

def thermal_image(event, x,y,flags,param):
    global i
    if event == cv2.EVENT_LBUTTONUP:
        with Lepton() as l:
            a, _ = l.capture()
            cv2.normalize(a,a,0,65535,cv2.NORM_MINMAX)
            np.right_shift(a,8,a)
            thermal_image = np.uint8(a)
            filename = './' + str(i) + '.jpg'
            cv2.imshow('Thermal image', thermal_image)
            cv2.imwrite(filename,thermal_image)
            i += 1

img = np.zeros((512,512,3),np.uint8)
cv2.namedWindow('image')
cv2.setMouseCallback('image',thermal_image)

while True:
    cv2.imshow('image',img)
    if cv2.waitKey(20) & 0xFF == 27:
        break

cv2.destroyAllWindows()
