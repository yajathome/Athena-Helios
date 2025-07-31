import flet as ft
import threading
import cv2
import base64
import time
import numpy as np
from tensorflow.keras.models import load_model
from tensorflow.keras.preprocessing import image

m = load_model("classifier.keras")
c_n = ["Biological", "Clothes", "Green-Glass", "plastic"]
r = True
l_f = None

def cap_frames():
    global l_f
    cap = cv2.VideoCapture(0)
    cap.set(cv2.CAP_PROP_FRAME_WIDTH, 240)
    cap.set(cv2.CAP_PROP_FRAME_HEIGHT, 240)
    while r:
        ret, f = cap.read()
        if ret:
            l_f = f
        time.sleep(0.03)
    cap.release()

def f_to_b64(f):
    _, b = cv2.imencode(".jpg", f)
    return base64.b64encode(b).decode()

def main(p: ft.Page):
    p.title = "Waste Classification"
    p.scroll = "auto"
    i_c = ft.Image(width=240, height=240)
    s = ft.Text()
    p_t = ft.Text()

    def u_ui():
        while r:
            if l_f is not None:
                i_c.src_base64 = f_to_b64(l_f)
                p.update()
            time.sleep(0.03)

    def cap_img(e):
        if l_f is not None:
            cv2.imwrite("capture.jpg", l_f)
            s.value = "Saved"
        else:
            s.value = "No frame"
        p.update()

    def pred(e):
        try:
            img = image.load_img("capture.jpg", target_size=(240, 240))
            arr = image.img_to_array(img)
            arr = np.expand_dims(arr, axis=0)
            arr = arr / 255.0
            pred = m.predict(arr)
            cls = c_n[np.argmax(pred)]
            p_t.value = f"Prediction: {cls}"
        except Exception as err:
            p_t.value = f"Prediction failed: {err}"
        p.update()

    def stop(_):
        global r
        r = False

    p.on_disconnect = stop
    p.on_window_event = stop

    p.add(
        ft.Container(
            content=ft.Column(
                controls=[
                    ft.Text("Waste Classification", size=50),
                    i_c,
                    ft.ElevatedButton("Capture", on_click=cap_img),
                    ft.ElevatedButton("Predict", on_click=pred),
                    s,
                    p_t,
                ],
                alignment=ft.MainAxisAlignment.CENTER,
                horizontal_alignment=ft.CrossAxisAlignment.CENTER,
            ),
            alignment=ft.alignment.center,
            expand=True,
        )
    )

    threading.Thread(target=cap_frames, daemon=True).start()
    threading.Thread(target=u_ui, daemon=True).start()

ft.app(target=main)