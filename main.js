// Google Apps Scriptの公開URL
const SHEET_URL = 'https://script.google.com/macros/s/AKfycbzHAp5bqDfFkQ9nxGuVii34StLURq2xgiHSXMwFn59upLQtBzaSuVXwxn3bndZ6AnSY6g/exec';

fetch(SHEET_URL)
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok: ' + response.statusText);
        }
        return response.json();
    })
    .then(data => {
        const tableHead = document.querySelector('#sheetData thead tr');
        const tableBody = document.querySelector('#sheetData tbody');

        // ヘッダー行を作成
        if (data.length > 0) {
            // ヘッダーを初期化
            tableHead.innerHTML = ''; // 以前の内容をクリア
            Object.keys(data[0]).forEach(header => {
                const th = document.createElement('th');
                th.textContent = header;
                tableHead.appendChild(th);
            });

            // データ行を作成
            tableBody.innerHTML = ''; // 以前の内容をクリア
            data.forEach(row => {
                const tr = document.createElement('tr');
                Object.values(row).forEach(cell => {
                    const td = document.createElement('td');
                    td.textContent = cell;
                    tr.appendChild(td);
                });
                tableBody.appendChild(tr);
            });
        } else {
            console.warn('No data found.');
        }
    })
    .catch(error => console.error('Error fetching data:', error));
