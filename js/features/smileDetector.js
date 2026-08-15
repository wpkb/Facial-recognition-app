window.hub.addFeature((faceData) => {
    const statusDiv = document.getElementById('status');
    
    // 本物のAIが判定した笑顔スコア（0.0 〜 1.0）を受け取る
    const score = faceData.smileScore;

    if (score > 0.8) {
        statusDiv.innerText = "😊 素晴らしい笑顔です！";
        statusDiv.style.color = "green";
    } else if (score > 0.4) {
        statusDiv.innerText = "🙂 微笑んでいますね";
        statusDiv.style.color = "orange";
    } else {
        statusDiv.innerText = "😐 真顔です";
        statusDiv.style.color = "black";
    }
});
