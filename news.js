document.addEventListener('DOMContentLoaded', function () {
  // URLパラメータから生徒番号を取得
  const params = new URLSearchParams(window.location.search);
  const studentNumber = params.get('num'); // 例: ?num=7001

  // ローディング状態を表示
  document.querySelector('.loading_div').style.display = 'flex';
  document.querySelector('.body_div').style.display = 'none';

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
      if (data.length === 0) {
        document.querySelector('.loading_div').style.display = 'none';
        const noDataMessage = document.querySelector('.nodata');
        noDataMessage.style.display = 'flex';
        document.querySelector('.body_div').style.display = 'flex';
        return;
      }

      // 生徒番号に一致するレコードを検索
      const record = data.find(row => row['生徒番号'] == studentNumber);

      if (record && record['新聞のアップロード（形式：PDF）']) {
        // Google DriveのURLをiframeに設定
        const pdfUrl = record['新聞のアップロード（形式：PDF）']
          .replace('/open?', '/file/d/')
          .replace('id=', '');

        const iframe = document.querySelector('iframe');
        iframe.src = pdfUrl;

        // ページタイトルを設定
        document.title = `${record['氏名']}さんの新聞`;
      } else {
        console.error('該当するデータが見つかりませんでした。');
        document.body.innerHTML = '<p>該当するデータがありません。</p>';
      }

      document.querySelector('.loading_div').style.display = 'none';
      document.querySelector('.body_div').style.display = 'flex';
    })
    .catch(error => {
      console.error('データの取得中にエラーが発生しました:', error);
      document.body.innerHTML = '<p>データの取得に失敗しました。</p>';
    });
});
