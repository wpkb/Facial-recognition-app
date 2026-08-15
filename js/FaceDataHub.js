class FaceDataHub {
  constructor() {
    this.features = []; // 拡張機能を入れておくリスト
  }

  // 拡張機能を登録する
  addFeature(featureFunction) {
    this.features.push(featureFunction);
    console.log("✅ 新しい拡張機能がハブに登録されました");
  }

  // カメラ側からデータを受け取り、保存＆中継する
  updateData(faceData) {
    if (!faceData) return;

    // 1. localStorageに最新データを保存 (Cookieの代わり)
    localStorage.setItem('latestFaceData', JSON.stringify(faceData));
    
    // 2. 登録されたすべての拡張機能にデータを渡して実行！
    this.features.forEach(feature => feature(faceData));
  }
}

// どこからでもハブにアクセスできるように window オブジェクトに紐付ける
window.hub = new FaceDataHub();
