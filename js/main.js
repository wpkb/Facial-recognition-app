const video = document.getElementById('webcam');

// 1. Webカメラを起動する関数
async function startVideo() {
    try {
        const stream = await navigator.mediaDevices.getUserMedia({ 
            video: { width: 640, height: 480 } 
        });
        video.srcObject = stream;
    } catch (err) {
        console.error("カメラの起動に失敗:", err);
        document.getElementById('status').innerText = "カメラのアクセスを許可してください";
    }
}

// 2. 映像を分析して、ハブにデータを送り続けるループ
function processVideo() {
    // 【重要】ここで将来的に face-api.js などのAIを使って「本当の顔データ」を抽出します。
    // 今回はベーステストとして、ランダムな数値を生成してハブに送ります。
    
    const currentFaceData = {
        timestamp: Date.now(),
        // 0.0 〜 1.0 のランダムな数値を「ダミーの笑顔スコア」として生成
        mockSmileScore: Math.random() 
    };

    // ハブにデータを送信！（ここから自動で smileDetector.js などに中継される）
    window.hub.updateData(currentFaceData);

    // 次のフレーム（少し待ってから）再び自分自身を呼び出してループさせる
    // ※デモ用に少しゆっくり（1秒に2回）回しています
    setTimeout(processVideo, 500); 
}

// 3. 動画の再生が始まったら、分析ループをスタート
video.addEventListener('play', () => {
    processVideo();
});

// アプリ起動
startVideo();
