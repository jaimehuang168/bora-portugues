# Bora! v2.2.0 — Brazilian Portuguese neural audio

Voice: Kokoro-82M `pf_dora`, Brazilian Portuguese neural synthesis, not a human recording or a cloned user voice.

The existing 222 original public curriculum phrases were regenerated into 444 MP3 files: normal speed 1.0 and a separately synthesized slow speed 0.75. Output: mono 24 kHz, 96 kbps MP3, with peak normalization and short silence padding.

Generation: Kokoro v1.0 full-precision ONNX with kokoro-onnx 0.6.1. Kokoro model: Apache-2.0; kokoro-onnx: MIT. espeak-ng is used only for grapheme-to-phoneme conversion, not to render the voice. No old eSpeak formant audio is used by the current app. Model files are not distributed in the site; upstream hashes are recorded in the manifest.

The website serves static MP3s. It does not call a TTS API or expose a key. Audio was generated locally on the build runner from public lesson text. Learner records, visitor cards, microphone recordings and private scripts were not accessed. Custom script system voices retain their existing permission flow.

All waveforms were checked for finite values and non-silence; all 444 MP3s were decoded and checked for duration. These checks are not native-speaker pronunciation review or a physical-phone speaker test. Non-English and very short utterances remain model limitations; practice with a teacher.

References:
- https://huggingface.co/hexgrad/Kokoro-82M
- https://huggingface.co/hexgrad/Kokoro-82M/blob/main/VOICES.md
- https://github.com/thewh1teagle/kokoro-onnx
