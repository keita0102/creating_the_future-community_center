// Google Apps Scriptの公開URL
const SHEET_URL = 'https://script.google.com/macros/s/AKfycby8EDY1zKgWtfOMiT0XZugGZRzxyTct4VOJ9p5HMJIMWXCiSza5tVjIzdOQP54Q7vuiJw/exec';

class Item {
    constructor(title, studentNumber, name, description, imageUrl, linkUrl) {
        this.title = title;
        this.studentNumber = studentNumber;
        this.name = name;
        this.description = description;
        this.imageUrl = imageUrl;
        this.linkUrl = linkUrl;
    }

    createElement() {
        const anchor = document.createElement('a');
        anchor.href = this.linkUrl;
        anchor.style.textDecoration = 'none';

        const container = document.createElement('div');
        container.className = 'item image-container';

        const img = document.createElement('img');
        img.src = this.imageUrl;
        img.alt = '画像が読み込めません。学校のアカウントでログインしてください。';

        const altText = document.createElement('div');
        altText.className = 'alt-text';
        altText.innerHTML = '画像が読み込めません。<br>学校のアカウントで<br>ログインしてください。';

        const textDiv = document.createElement('div');
        textDiv.className = 'text';

        const titleElement = document.createElement('h1');
        titleElement.textContent = this.title;

        const h2 = document.createElement('h2');
        const spanStudentNumber = document.createElement('span');
        spanStudentNumber.textContent = this.studentNumber;
        const spanName = document.createElement('span');
        spanName.textContent = this.name;

        h2.appendChild(spanStudentNumber);
        h2.appendChild(spanName);

        const descriptionElement = document.createElement('span');
        descriptionElement.textContent = this.description;

        textDiv.appendChild(titleElement);
        textDiv.appendChild(h2);
        textDiv.appendChild(descriptionElement);

        container.appendChild(img);
        container.appendChild(altText);
        container.appendChild(textDiv);
        anchor.appendChild(container);

        return anchor;
    }
}

fetch(SHEET_URL)
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok: ' + response.statusText);
        }
        return response.json();
    })
    .then(data => {
        const container = document.getElementById('container');

        container.innerHTML = ''; // 以前の内容をクリア

        if (data.length > 0) {
            data.forEach(row => {
                const item = new Item(
                    row['タイトル'],
                    row['生徒番号'],
                    row['氏名'],
                    row['説明'],
                    row['サムネイル画像のアップロード'],
                    row['新聞のアップロード']
                );

                const itemElement = item.createElement();
                container.appendChild(itemElement);
            });
        } else {
            console.warn('No data found.');
            container.innerHTML = '<p>データがありません。</p>';
        }
    })
    .catch(error => console.error('Error fetching data:', error));
