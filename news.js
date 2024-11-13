document.addEventListener('DOMContentLoaded', function () {
  // URLパラメータから生徒番号を取得
  const params = new URLSearchParams(window.location.search);
  const studentNumber = params.get('num'); // 例: ?num=7001

  if (!studentNumber) {
    console.error('生徒番号が指定されていません。');
    document.body.innerHTML = '<p>生徒番号が指定されていません。</p>';
    return;
  }

  // Google Apps Scriptの公開URL
  const SHEET_URL = 'https://script.google.com/macros/s/AKfycby8EDY1zKgWtfOMiT0XZugGZRzxyTct4VOJ9p5HMJIMWXCiSza5tVjIzdOQP54Q7vuiJw/exec';

  // データを取得
  fetch(SHEET_URL)
    .then(response => response.json())
    .then(data => {
      // 生徒番号に一致するレコードを検索
      const record = data.find(row => row['生徒番号'] == studentNumber);

      if (record && record['新聞のアップロード（形式：PDF）']) {
        // Google DriveのURLをimgに設定
        const pdfUrl = record['新聞のアップロード（形式：PDF）'].replace('/open?', '/file/d/').replace('id=', '') + '/preview';

        const img = document.querySelector('img');
        img.src = pdfUrl;
      } else {
        console.error('該当するデータが見つかりませんでした。');
        document.body.innerHTML = '<p>該当するデータがありません。</p>';
      }
    })
    .catch(error => {
      console.error('データの取得中にエラーが発生しました:', error);
      document.body.innerHTML = '<p>データの取得に失敗しました。</p>';
    });
});
