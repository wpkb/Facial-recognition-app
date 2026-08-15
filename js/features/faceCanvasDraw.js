// ハブに「画面への描画機能」を登録
window.hub.addFeature((faceData) => {
    // 1. 必要な要素を取得
    const video = document.getElementById('webcam');
    const canvas = document.getElementById('overlay');
    
    // face-api.jsから渡された生の認識結果データ
    const detections = faceData.rawDetections;
    if (!detections) return;

    // 2. キャンバスのサイズをビデオに合わせる（初回のみ、またはサイズ変更時）
    if (canvas.width !== video.videoWidth || canvas.height !== video.videoHeight) {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
    }

    // 3. 描画コンテキストを取得し、前のフレームの描画をクリアする（これ重要！）
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // 4. face-api.js の描画ユーティリティを使って描画
    
    // 描画オプションの設定（枠の色など）
    const drawOptions = {
        lineWidth: 4,
        lineColor: 'rgba(0, 255, 0, 1)', // 緑色
        fillColor: 'rgba(0, 255, 0, 0.1)'  // 薄い緑の塗りつぶし
    };

    // ① 顔の枠（Detection）を描画
    faceapi.draw.drawDetections(canvas, detections, drawOptions);

    // ② 感情（Expressions）を枠の横にテキストで描画
    // テキストの設定（フォントサイズなど）
    const exprOptions = {
        textColor: 'rgba(255, 255, 255, 1)', // 白色
        fontSize: 20,
        fontStyle: 'Arial'
    };
    faceapi.draw.drawFaceExpressions(canvas, detections, 0.5, undefined, exprOptions);
});
