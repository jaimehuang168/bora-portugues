"""Offline tests: both binaries must match trusted size and SHA before synthesis."""
import hashlib
import io
from pathlib import Path
import tempfile
from unittest.mock import patch
import model_assets

def fixture(responses):
    expected={'kokoro-v1.0.onnx':b'model', 'voices-v1.0.bin':b'voice'}
    fields={k:(len(v),hashlib.sha256(v).hexdigest()) for k,v in expected.items()}
    def source(url,timeout):
        assert timeout>0
        return io.BytesIO(responses[url.rsplit('/',1)[1]])
    with tempfile.TemporaryDirectory() as d, patch.object(model_assets,'FILES',fields),patch.object(model_assets.urllib.request,'urlopen',source):
        got=model_assets.download_verified(d)
        assert got==fields['kokoro-v1.0.onnx'][1]
        assert (Path(d)/'voices-v1.0.bin').read_bytes()==b'voice'
fixture({'kokoro-v1.0.onnx':b'model','voices-v1.0.bin':b'voice'})
for changed in [b'wrong',b'too long',b'v']:
    try: fixture({'kokoro-v1.0.onnx':b'model','voices-v1.0.bin':changed})
    except ValueError: pass
    else: raise AssertionError('Unexpected voice data was accepted')
print('Both binary identities checked; altered length or digest refused.')
