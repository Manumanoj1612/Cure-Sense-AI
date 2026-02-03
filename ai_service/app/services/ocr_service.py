import easyocr
import numpy as np
import io
from PIL import Image

# Load reader once
reader = easyocr.Reader(['en'])

def extract_text_from_image(image_bytes):
    try:
        image = Image.open(io.BytesIO(image_bytes))
        image_np = np.array(image)
        result = reader.readtext(image_np, detail=0)
        return " ".join(result)
    except Exception as e:
        print(f"OCR Error: {e}")
        return ""
