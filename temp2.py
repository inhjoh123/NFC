import cv2
import numpy as np
from pylepton import Lepton



#img = cv2.imread('./sample.jpg', cv2.IMREAD_GRAYSCALE)
with Lepton() as l:
    a, _ = l.capture()
    cv2.normalize(a,a,0,65535,cv2.NORM_MINMAX) 
    np.right_shift(a,8,a)
    thermal_image = np.uint8(a)
    #cv2.imshow('Thermal image', thermal)
   

suma = 0
count = 0
h,w,c = a.shape
#print("a shape: ", a.shape)
#print("a[0,0] shape:", a[0,0].shape,"a[0,0] :" ,a[0,0])
#print("a[0,0,0] shape:", a[0,0,0].shape,"a[0,0,0] :" ,a[0,0,0])


for j in range(0,h):
    for i in range(0,w):
        suma = suma + a[j,i,0]
        count+=1
        print("shape:",a[j,i,0].shape, "value:",a[j,i,0])


pixVal = suma / count
print("pixVal(a):", pixVal)
suma = 0
count = 0

for j in range(0,h):
    for i in range(0,w):
        if a[j,i,0] >= pixVal:
            suma = suma + a[j,i,0]
            count+=1

mVal = suma / count
print(mVal)


 