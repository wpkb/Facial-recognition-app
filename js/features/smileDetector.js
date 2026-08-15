// ハブに「笑顔を判定して画面の文字を変える機能」を追加
window.hub.addFeature((faceData) => {
    const statusDiv = document.getElementById('status');
    
    // （※この段階ではまだAIが入っていないので、main.jsから送られてくるモックデータを使います）
    if (faceData.mockSmileScore > 0.8) {
        statusDiv.innerText = "😊 素晴らしい笑顔です！";
        statusDiv.style.color = "green";
    } else if (faceData.mockSmileScore > 0.4) {
        statusDiv.innerText = "🙂 微笑んでいますね";
        statusDiv.style.color = "orange";
    } else {
        statusDiv.innerText = "😐 真顔です";
        statusDiv.style.color = "black";
    }
});
