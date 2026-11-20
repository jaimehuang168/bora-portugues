"""Verify both original upstream binary artifacts before giving either to the synthesizer."""
import hashlib
import urllib.request
from pathlib import Path

BASE = "https://github.com/thewh1teagle/kokoro-onnx/releases/download/model-files-v1.1/"
FILES = {
    "kokoro-v1.0.onnx": (325505369, "beb0d1848dee9a49da392cc3df26958d46cfa35d321edf434f52949153f0df3a"),
    "voices-v1.0.bin": (28214398, "bca610b8308e8d99f32e6fe4197e7ec01679264efed0cac9140fe9c29f1fbf7d"),
}

def download_verified(folder):
    for name, (size, digest) in FILES.items():
        path = Path(folder) / name
        hashed = hashlib.sha256()
        total = 0
        with urllib.request.urlopen(BASE + name, timeout=90) as remote, path.open('wb') as dst:
            while chunk := remote.read(1024 * 1024):
                total += len(chunk)
                if total > size:
                    raise ValueError('Unexpected model asset length: ' + name)
                hashed.update(chunk)
                dst.write(chunk)
        if total != size or hashed.hexdigest() != digest:
            raise ValueError('Unexpected model asset; generation stopped: ' + name)
    return FILES["kokoro-v1.0.onnx"][1]
