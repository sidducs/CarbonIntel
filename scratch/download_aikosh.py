import aikosh

aikosh.set_api_key("ec1ef1164f0ec39580fdb2d30ecfbeb6b584bbb237b34171adb18eb7d38925f4")

print("Starting download from AIKosh...")
try:
    result = aikosh.download(
        {
            "identifier": "403283a7-2042-4b42-946b-b51babcc58b3",
            "type": "dataset",
            "destination_path": "./downloads/dataset"
        }
    )
    print("Download completed. Result:", result)
except Exception as e:
    print("Download failed with error:", e)
