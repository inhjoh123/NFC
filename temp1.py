import cv2
import numpy as np

img = cv2.imread('./4.jpg', cv2.IMREAD_GRAYSCALE)

suma = 0
count = 0
h,w = img.shape

for j in range(0,h):
    for i in range(0,w):
        suma = suma + img[j,i]
        count+=1

pixVal = suma / count
print("pixVal(t):", pixVal)
maxval = 0

for j in range(0,h):
    for i in range(0,w):
        if img[j,i] > maxval:
            maxval = img[j,i]
 #       if img[j,i] >= pixVal:
 #           suma = suma + img[j,i]
 #           count+=1

#mVal = suma / count
mVal = maxval
print(mVal)
#result = mVal * 0.04 - 273.15
#result = 0.0465 * mVal - 349.44
#result = 0.0217 * (mVal - 8192) + 30
result = (0.0217 * mVal) + 30
#result = (0.0217 * mVal) - 177.77
print("result(pixval t):", result)

 
