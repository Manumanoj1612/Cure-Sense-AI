try:
    print("Importing numpy...")
    import numpy
    print("numpy imported")
except Exception as e:
    print(f"numpy failed: {e}")

try:
    print("Importing pandas...")
    import pandas
    print("pandas imported")
except Exception as e:
    print(f"pandas failed: {e}")

try:
    print("Importing cv2...")
    import cv2
    print("cv2 imported")
except Exception as e:
    print(f"cv2 failed: {e}")

try:
    print("Importing spacy...")
    import spacy
    print("spacy imported")
except Exception as e:
    print(f"spacy failed: {e}")

try:
    print("Importing joblib...")
    import joblib
    print("joblib imported")
except Exception as e:
    print(f"joblib failed: {e}")
