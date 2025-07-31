from tensorflow.keras.models import load_model
import cv2
import numpy as np

model = load_model("classifier.keras")
class_names = [ "Plastic", "Green-Glass","Clothes", ]


image = cv2.imread("test/Screenshot 2025-07-31 at 10.09.21 AM.png")
if image is None:
    raise ValueError("Failed to load image.")

display_image = image.copy()


image = cv2.resize(image, (model.input_shape[1], model.input_shape[2]))


image = image / 255.0
image = np.expand_dims(image, axis=0)


prediction = model.predict(image)
predicted_class = class_names[np.argmax(prediction)]

print(predicted_class)


cv2.imshow("Prediction", display_image)
cv2.waitKey(0)
cv2.destroyAllWindows()