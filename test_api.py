import time
import subprocess
import requests
import sys

def run_api_tests():
    print("Starting FastAPI server for integration testing...")
    
    # Start the FastAPI server using uvicorn as a subprocess.
    # Note: we do not pipe stdout/stderr to a pipe unless we read it, 
    # to avoid blocking when the buffer fills. We will print it directly.
    server_process = subprocess.Popen(
        [sys.executable, "-m", "uvicorn", "app:app", "--host", "127.0.0.1", "--port", "8000"],
        stdout=subprocess.PIPE,
        stderr=subprocess.STDOUT,
        text=True
    )
    
    # Wait for the server to spin up
    print("Waiting 5 seconds for server to start...")
    time.sleep(5)
    
    # Read any early output to see if it crashed
    try:
        # Check if process died
        ret = server_process.poll()
        if ret is not None:
            print(f"Error: Server process exited immediately with code {ret}")
            out, _ = server_process.communicate()
            print("Server Output:")
            print(out)
            return
            
        # 1. Test GET / (Root Endpoint)
        print("\n--- Testing GET / endpoint ---")
        root_url = "http://127.0.0.1:8000/"
        res_root = requests.get(root_url, timeout=5)
        print(f"Status Code: {res_root.status_code}")
        print("Response Content:")
        print(res_root.json())
        
        # 2. Test POST /predict (Valid Request)
        print("\n--- Testing POST /predict with a valid sample request ---")
        predict_url = "http://127.0.0.1:8000/predict"
        sample_payload = {
            "Crop_Type": "Rice",
            "SOC": 0.8,
            "N_Content": 120,
            "P_Content": 30,
            "K_Content": 150,
            "pH": 6.5,
            "Fertilizer_Type": "Urea",
            "Fertilizer_Amount": 100,
            "Temperature": 30,
            "Rainfall": 800,
            "Humidity": 70
        }
        res_predict = requests.post(predict_url, json=sample_payload, timeout=5)
        print(f"Status Code: {res_predict.status_code}")
        print("Response Content:")
        print(res_predict.json())
        
        # 3. Test POST /predict with an invalid Crop_Type (Should trigger validation error)
        print("\n--- Testing POST /predict with an invalid crop type ---")
        invalid_payload = sample_payload.copy()
        invalid_payload["Crop_Type"] = "Pineapple"  # Not in dataset
        res_invalid = requests.post(predict_url, json=invalid_payload, timeout=5)
        print(f"Status Code: {res_invalid.status_code}")
        print("Response Content:")
        print(res_invalid.json())
        
    except Exception as e:
        print(f"Error during API testing: {e}")
        # Terminate and read whatever we have
        server_process.terminate()
        out, _ = server_process.communicate()
        print("Server output before failure:")
        print(out)
    finally:
        # Shutdown the server
        if server_process.poll() is None:
            print("\nShutting down the FastAPI server...")
            server_process.terminate()
            out, _ = server_process.communicate()
            print("Final server output:")
            print(out)
            server_process.wait()
            print("Server shutdown completed.")

if __name__ == '__main__':
    run_api_tests()
