# 聲音來源與授權說明

## 這一版提供什麼

音檔來源為 App 既有原創固定教學文字，使用 eSpeak 1.48.15 的 `pt-br`（brazil）聲音合成，再用 FFmpeg 編碼為 MP3。不是網路抓取的真人教材、老師錄音或神經語音。沒有把使用者資料送往第三方合成服務。

eSpeak 以共振峰合成（formant synthesis）產生聲音，音色較機械。葡文的開閉母音、鼻音、連音和不同地區韻律，仍需和合格老師或可信賴的母語錄音對照；本版不宣稱完成母語教師逐句發音審核。

## 製作規格

- 合成聲音：eSpeak 1.48.15 / `pt-br` / brazil。
- 指令參數：`-v pt-br -s 145 -a 145`，以 UTF-8 stdin 輸入固定教材。
- 輸出：MP3，單聲道，22,050 Hz，48 kbps。
- 222 段不重複音檔；以正規化文字為查找鍵。
- `audio-bank.js` 收錄 data URI、文字、長度及 SHA-256。
- `tools/audio-manifest.json` 提供無 base64 的清單。
- `tools/build_audio.py` 與 `tools/collect-audio.cjs` 提供重建流程。這些是開發工具，不是使用者的安裝要求。
- `assets/voice-sample.mp3` 是「Oi, tudo bem?」的實際同源示範，不是另配較好聽的聲音。

## 第三方軟體

App 只附合成完成的聲音和自寫的瀏覽器播放器，不分發 eSpeak 或 FFmpeg 執行檔、語音引擎、系統字型。音訊來源列示供追溯，不表示 eSpeak 為此 App 提供背書或通過發音品質認證。開發者另行安裝或分發上述工具時應遵守各軟體的授權條款。

## 參考文件（2026-09-21 查閱）

- eSpeak 官方介紹與合成方式：https://espeak.sourceforge.net/
- eSpeak 語言表：https://espeak.sourceforge.net/languages.html
- eSpeak 指令說明：https://espeak.sourceforge.net/commands.html
- MDN getVoices：https://developer.mozilla.org/en-US/docs/Web/API/SpeechSynthesis/getVoices
- MDN voiceschanged：https://developer.mozilla.org/en-US/docs/Web/API/SpeechSynthesis/voiceschanged_event
- Apple Mac 語音設定：https://support.apple.com/guide/mac-help/change-the-voice-your-mac-uses-to-speak-text-mchlp2290/mac
