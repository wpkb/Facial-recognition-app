const video = document.getElementById('webcam');
const statusDiv = document.getElementById('status');

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
        statusDiv.innerText = "カメラ起動成功！顔を映してください。";
    } catch (err) {
        console.error("カメラエラー:", err);
        statusDiv.innerText = "カメラのアクセスを許可してください";
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

        // 顔が見つかった場合
        if (detections) {
            const currentFaceData = {
                timestamp: Date.now(),
                
                // 描画機能などで使えるよう、AIの生の戻り値をそのまま入れる
                rawDetections: detections,

                // （これまでの互換性のために残しておく）
                smileScore: detections.expressions.happy,
                allExpressions: detections.expressions
            };

            // ハブに本物のデータを中継！
            window.hub.updateData(currentFaceData);
        } else {
            // 顔が映っていない時は、キャンバスをクリアしたり
            // テキストをリセットするために空のデータ（nullや0）を送る
            window.hub.updateData({ 
                rawDetections: null, 
                smileScore: 0 
            });
        }
    }, 100); 
});
