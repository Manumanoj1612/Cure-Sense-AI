import requests
import json

BASE_URL = "http://127.0.0.1:8001"

def test_predict_disease():
    print("Testing /predict_disease...")
    try:
        response = requests.post(f"{BASE_URL}/predict_disease", json={"symptoms": "fever, cough"})
        print(f"Status: {response.status_code}")
        if response.status_code != 200:
            print(f"Error: {response.text}")
    except Exception as e:
        print(f"Failed: {e}")

def test_chat():
    print("\nTesting /chat...")
    try:
        response = requests.post(f"{BASE_URL}/chat", json={"message": "Hello"})
        print(f"Status: {response.status_code}")
        if response.status_code != 200:
            print(f"Error: {response.text}")
    except Exception as e:
        print(f"Failed: {e}")

def test_recommend_doctors():
    print("\nTesting /recommend_doctors...")
    try:
        response = requests.post(f"{BASE_URL}/recommend_doctors", json={"location": "NY", "symptoms": "fever"})
        print(f"Status: {response.status_code}")
        if response.status_code != 200:
            print(f"Error: {response.text}")
    except Exception as e:
        print(f"Failed: {e}")

def test_parse_medicine_reminder():
    print("\nTesting /parse_medicine_reminder...")
    try:
        response = requests.post(f"{BASE_URL}/parse_medicine_reminder", json={"instruction": "Take 1 pill daily"})
        print(f"Status: {response.status_code}")
        if response.status_code != 200:
            print(f"Error: {response.text}")
    except Exception as e:
        print(f"Failed: {e}")

if __name__ == "__main__":
    test_predict_disease()
    test_chat()
    test_recommend_doctors()
    test_parse_medicine_reminder()
