<!-- BORA-PAGES-MANAGED-V1 -->
# Bora! 巴西葡語練習室 v2.1.1

繁體中文介面，巴西葡語學習、18 個月計畫與 222 段內建基礎合成發音。

## 手機發音修正

練習網站：https://jaimehuang168.github.io/bora-portugues/?audiofix=2.1.1#home

獨立聲音測試：https://jaimehuang168.github.io/bora-portugues/audio-test.html

首頁應顯示「手機發音修正版 v2.1.1」。按「測試手機聲音」；若未出聲，可直接按下方原生播放器的 ▶。
固定教材在「自動」模式優先使用內建 MP3，避免先等待系統 TTS。自訂講稿仍需系統 pt-BR 語音。
遇到瀏覽器拒絕播放時，會明確顯示重試按鈕，不要求清除學習紀錄。

修正檔案的 SHA-256 已與本地測試版本核對。34 項瀏覽器檢查通過，涵蓋真實 MP3 解碼、連續朗讀、模擬的播放拒絕與重試、行動版面及原有路由。測試使用 Chromium 的手機尺寸視窗；localStorage、系統 TTS 與權限拒絕採模擬。不代表 iPhone、Android 實機揚聲器、Safari 或原生跨重啟儲存均已驗證。

## 使用

手機需用 Safari / Chrome 等完整瀏覽器，不是 GitHub 的原始碼檢視頁。
按播放按鈕才會開始發音；本版不是背景音訊播放器，鎖定畫面或切到背景會停止朗讀。
播放時調高手機媒體音量，並確認聲音沒有送到藍牙耳機或車機。

## 檔案

`index.html` 為完整單檔 App，含 CSS、JavaScript 及合成 MP3，不需要建置工具。
`.nojekyll` 讓 GitHub 直接發布靜態檔案。
`AUDIO_CREDITS.md` 說明聲音來源。
`audio-test.html` 與 `audio-sample.mp3` 提供不依賴 App JavaScript 或系統葡語聲音的原生音訊測試。
`audio-fix-report.json` 記錄版本、修改項目與檔案校驗碼。
`tools/fix_mobile_audio.py` 是具來源版本檢查的修補工具；遇到不同來源即停止，不覆蓋未知版本。

## 資料與範圍

此網站及教材是公開的。學習進度、老師資料、訪客卡與作品存於使用者自己的瀏覽器，不由 App 同步至 GitHub。音檔是機械合成音，不是真人或 AI 發音評分。
請勿將進度備份、錄音、客戶名單、機密簡報或帳號密碼加入此公開儲存庫。

本次修正未更改儲存鍵、備份格式或學習資料。請不要為了修聲音而清除瀏覽器網站資料。
換手機或由本機 HTML 改用網站前，先在舊環境匯出進度 JSON，再到新環境匯入。匯入是取代，不是合併。
本單檔版本不包含 Service Worker：線上網頁不保證離線重開。完整 PWA 原始碼另見先前的原始碼包。
