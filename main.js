document.addEventListener('DOMContentLoaded', function () {
  // Google Apps Scriptの公開URL
  const SHEET_URL = 'https://script.google.com/macros/s/AKfycby8EDY1zKgWtfOMiT0XZugGZRzxyTct4VOJ9p5HMJIMWXCiSza5tVjIzdOQP54Q7vuiJw/exec';

  // ページが読み込まれたらloading_divを表示
  document.querySelector('.loading_div').style.display = 'flex';
  document.querySelector('.body_div').style.display = 'none';

  // データを取得して各公民館に表示
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

      data.forEach(row => {
        const communityCenterMap = {
          '川津公民館': 'kawatsu',
          '持田公民館': 'mochida',
          '雑賀公民館': 'saika',
          '城北公民館': 'jyohoku',
          '城西公民館': 'jyosai',
          '朝日公民館': 'asahi',
        };

        const sectionId = communityCenterMap[row['所属公民館']] || 'otherCommunityCenter';
        const section = document.getElementById(sectionId);

        if (section) {
          const itemsContainer = section.querySelector('.items');

          const item = document.createElement('a');
          item.classList.add('outside-item');
          var ua = navigator.userAgent;
          if (ua.includes("iPhone") || (ua.includes("Android") && ua.includes("Mobile"))) {
            item.href = `${row['新聞のアップロード（形式：PDF）']}`;
          } else {
            item.href = `news.html?num=${row['生徒番号（半角英数字で入力お願いします ７４１５ ✕    7415  ◯）']}`;
          }
          item.title = "新聞記事に移動";
          item.style.textDecoration = 'none';

          item.innerHTML = `
            <div class="item image-container">
              <img src="${row['サムネイル画像のアップロード']}" alt="エラー：画像の読み込みに失敗しました">
              <div class="text">
                <h1>${row['タイトル']}</h1>
                <h2><span class="num">${row['生徒番号（半角英数字で入力お願いします ７４１５ ✕    7415  ◯）']}</span><span>${row['氏名']}</span></h2>
                <span class="description">${row['説明（150文字以内）']}</span>
              </div>
            </div>
          `;

          itemsContainer.appendChild(item);
        }
      });

      document.querySelector('.loading_div').style.display = 'none';
      document.querySelector('.body_div').style.display = 'flex';
    })
    .catch(error => {
      console.error('Error fetching data:', error);
      document.querySelector('.loading_div').style.display = 'none';
    });
});
