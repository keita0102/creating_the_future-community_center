document.addEventListener('DOMContentLoaded', function () {
  // Google Apps Scriptの公開URL
  const SHEET_URL = 'https://script.google.com/macros/s/AKfycby8EDY1zKgWtfOMiT0XZugGZRzxyTct4VOJ9p5HMJIMWXCiSza5tVjIzdOQP54Q7vuiJw/exec';

  // ページが読み込まれたらloading_divを表示
  document.querySelector('.loading_div').style.display = 'flex';

  // データを取得して各公民館に表示
  fetch(SHEET_URL)
    .then(response => response.json())
    .then(data => {
      // データが空の場合の処理
      if (data.length === 0) {
        document.querySelector('.loading_div').style.display = 'none';
        const noDataMessage = document.querySelector('.nodata');
        noDataMessage.style.display = 'flex'; // ここで表示する
        document.querySelector('.body_div').style.display = 'flex';
        return; // ここで処理を終了
      }

      data.forEach(row => {
        let sectionId;
        // 公民館名に応じたセクションIDを設定
        if (row['所属公民館'] === '川津公民館') {
          sectionId = 'kawatsu';
        } else if (row['所属公民館'] === '持田公民館') {
          sectionId = 'mochida';
        } else if (row['所属公民館'] === '雑賀公民館') {
          sectionId = 'saika';
        } else if (row['所属公民館'] === '城北公民館') {
          sectionId = 'johoku';
        } else if (row['所属公民館'] === '城西公民館') {
          sectionId = 'josei';
        } else if (row['所属公民館'] === '朝日公民館') {
          sectionId = 'asahi';
        } else {
          sectionId = 'otherCommunityCenter';
        }

        const section = document.getElementById(sectionId);
        if (section) {
          const itemsContainer = section.querySelector('.items');

          // 各アイテムを生成してセクションに追加
          const item = document.createElement('a');
          item.classList.add('outside-item');
          item.href = row['新聞のアップロード（形式：PDF）'];
          item.title = "新聞記事に移動"
          item.style.textDecoration = 'none'; // テキストデコレーションを削除

          item.innerHTML = `
            <div class="item image-container">
              <img src="${row['サムネイル画像のアップロード']}" alt="エラー：画像の読み込みに失敗しました">
              <div class="text">
                <h1>${row['タイトル']}</h1>
                <h2><span class="num">${row['生徒番号']}</span><span>${row['氏名']}</span></h2>
                <span class="description">${row['説明（150文字以内）']}</span>
              </div>
            </div>
          `;

          itemsContainer.appendChild(item);
        }
      });

      // データの読み込みが完了したら、loading_divを非表示にしてbody_divを表示
      document.querySelector('.loading_div').style.display = 'none';
      document.querySelector('.body_div').style.display = 'flex';
    })
    .catch(error => {
      console.error('Error fetching data:', error);

      // エラー発生時にも読み込み表示を終了する
      document.querySelector('.loading_div').style.display = 'none';
    });
});
