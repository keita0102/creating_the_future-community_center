document.addEventListener('DOMContentLoaded', function () {
  // URLパラメータから制作者名を取得
  const params = new URLSearchParams(window.location.search);
  const searchText = params.get('serch'); // 例: ?serch=田中

  // ローディング状態を表示
  document.querySelector('.loading_div').style.display = 'flex';
  document.querySelector('.body_div').style.display = 'none';

  if (!searchText) {
    console.error('検索結果がありません');
    const noMatchMessage = document.createElement('p');
    noMatchMessage.textContent = '該当するデータがありません。';
    document.body.appendChild(noMatchMessage);
    noMatchMessage.style.display = "flex"
    noMatchMessage.style.justifyContent = "center"
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

      // 部分一致するレコードを検索
      const matchingRecords = data.filter(row => row['氏名'].includes(searchText.trim()));

      if (matchingRecords.length > 0) {
        const itemsContainer = document.querySelector('.search_items');
        itemsContainer.innerHTML = ''; // 既存の結果をクリア

        matchingRecords.forEach(record => {
          const item = document.createElement('a');
          item.classList.add('outside-item');
          var ua = navigator.userAgent;

          if (ua.includes("iPhone") || (ua.includes("Android") && ua.includes("Mobile"))) {
            item.href = `${record['新聞のアップロード（形式：PDF）']}`;
          } else {
            item.href = `news.html?num=${record['生徒番号（半角英数字で入力お願いします ７４１５ ✕    7415  ◯）']}`;
          }
          item.title = "新聞記事に移動";
          item.style.textDecoration = 'none';
          const searchTextElement = document.querySelector('.search_value');
          searchTextElement.textContent = `検索結果: 「${searchText}」`;

          item.innerHTML = `
            <div class="item image-container">
              <img src="${record['サムネイル画像のアップロード']}" alt="エラー：画像の読み込みに失敗しました">
              <div class="text">
                <h1>${record['タイトル']}</h1>
                <h2><span class="num">${record['生徒番号（半角英数字で入力お願いします ７４１５ ✕    7415  ◯）']}</span><span>${record['氏名']}</span></h2>
                <span class="description">${record['説明（150文字以内）']}</span>
              </div>
            </div>
          `;

          itemsContainer.appendChild(item);
        });
      } else {
        console.error('該当するデータが見つかりませんでした。');
        const noMatchMessage = document.createElement('p');
        noMatchMessage.textContent = '該当する新聞がありません。';
        document.body.appendChild(noMatchMessage);
        noMatchMessage.style.display = "flex"
        noMatchMessage.style.justifyContent = "center"
      }

      document.querySelector('.loading_div').style.display = 'none';
      document.querySelector('.body_div').style.display = 'flex';
    })
    .catch(error => {
      console.error('データの取得中にエラーが発生しました:', error);
      document.body.innerHTML = '<p>データの取得に失敗しました。</p>';
      const noMatchMessage = document.createElement('p');
      noMatchMessage.textContent = '該当するデータがありません。';
      document.body.appendChild(noMatchMessage);
      noMatchMessage.style.display = "flex"
      noMatchMessage.style.justifyContent = "center"
    });
});