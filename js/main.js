const video = document.getElementById('webcam');

// 1. AIモデルを読み込んでからカメラを起動する
Promise.all([
    // 顔の場所を見つける軽量モデル
    faceapi.nets.tinyFaceDetector.loadFromUri('/models'),
    // 表情（笑顔、怒りなど）を判定するモデル
    faceapi.nets.faceExpressionNet.loadFromUri('/models')
]).then(startVideo);

async function startVideo() {
    try {
        const stream = await navigator.mediaDevices.getUserMedia({ 
            video: { width: 640, height: 480 } 
        });
        video.srcObject = stream;
    } catch (err) {
        console.error("カメラエラー:", err);
    }
}

// 2. 動画の再生が始まったらAI分析をスタート
video.addEventListener('play', () => {
    
    // 0.1秒ごとに顔をスキャンし続ける
    setInterval(async () => {
        // AIに映像を渡して、顔の枠と表情(expressions)を抽出！
        const detections = await faceapi.detectSingleFace(
            video, 
            new faceapi.TinyFaceDetectorOptions()
        ).withFaceExpressions();

        // 顔が見つかった時だけハブにデータを送る
        if (detections) {
            // face-apiは detections.expressions に { happy: 0.98, sad: 0.01... } のようなデータを入れています
            const currentFaceData = {
                timestamp: Date.now(),
                smileScore: detections.expressions.happy, // 「happy」の数値を笑顔スコアとして抽出
                allExpressions: detections.expressions    // 今後の拡張のために全ての感情も入れておく
            };

            // ハブに本物のデータを中継！
            window.hub.updateData(currentFaceData);
        }
    }, 100); 
});
