document.addEventListener('DOMContentLoaded', () => {
    // HTML要素を取得
    const card = document.getElementById('card');
    const imageUpload1 = document.getElementById('imageUpload1');
    const imageUpload2 = document.getElementById('imageUpload2');
    const photo1 = document.getElementById('photo1');
    const photo2 = document.getElementById('photo2');
    const downloadBtn = document.getElementById('downloadBtn');
    
    // テキスト入出力要素を取得
    const nameInput = document.getElementById('nameInput');
    const nameOutput = document.getElementById('nameOutput');
    const birthInput = document.getElementById('birthInput');
    const birthOutput = document.getElementById('birthOutput');
    const gradeInput = document.getElementById('gradeInput');
    const gradeOutput = document.getElementById('gradeOutput');
    const stationInput = document.getElementById('stationInput');
    const stationOutput = document.getElementById('stationOutput');
    const jobInput = document.getElementById('jobInput');
    const jobOutput = document.getElementById('jobOutput');
    const commentInput = document.getElementById('commentInput');
    const commentOutput = document.getElementById('commentOutput');
    const mbtiInput = document.getElementById('mbtiInput');
    const mbtiOutput = document.getElementById('mbtiOutput');
    const clubInput = document.getElementById('clubInput');
    const clubOutput = document.getElementById('clubOutput');
    const signOutput = document.getElementById('signOutput');

    const numberInput = document.getElementById('numberInput');
    const numberOutput = document.getElementById('numberOutput');
    const signSelect = document.getElementById('signSelect');

    // 1. ドロップダウンに45から100までの選択肢を作成
    for (let i = 45; i <= 100; i++) {
        const option = document.createElement('option');
        option.value = i;
        option.textContent = i;
        numberInput.appendChild(option);
    }

    // 2. 数字の初期値を46に設定
    numberInput.value = '46';
    numberOutput.textContent = '46';

    // 3. ドロップダウンが変更されたら、カードの数字を更新
    numberInput.addEventListener('change', () => {
        numberOutput.textContent = numberInput.value;
    });

    // 星座が選択されたら文字を表示する処理
    signSelect.addEventListener('change', () => {
        const selectedOption = signSelect.options[signSelect.selectedIndex];
        const selectedValue = selectedOption.value;
        const selectedText = selectedOption.text;

        if (selectedValue) {
             signOutput.textContent = "星座: " + selectedText;
        } else {
            signOutput.textContent = "星座: 未選択";
        }
    });

    // 画像切り取りモーダル関連
    const modal = document.getElementById('cropModal');
    const imageToCrop = document.getElementById('imageToCrop');
    const cropBtn = document.getElementById('cropBtn');

    let cropper;
    let currentPhotoElement;

    // 背景画像の変更
    document.querySelectorAll('input[name="bg"]').forEach(radio => {
        radio.addEventListener('change', (e) => {
            card.style.backgroundImage = `url(${e.target.value})`;
        });
    });

    // テキスト入力のリアルタイム反映
    nameInput.addEventListener('input', () => nameOutput.textContent = "名前: " + (nameInput.value || ''));
    birthInput.addEventListener('input', () => birthOutput.textContent = "生年月日: " + (birthInput.value || '未入力'));
    gradeInput.addEventListener('input', () => gradeOutput.textContent = "学部学年: " + (gradeInput.value || '未入力'));
    stationInput.addEventListener('input', () => stationOutput.textContent = "最寄駅: " + (stationInput.value || '未入力'));
    jobInput.addEventListener('input', () => jobOutput.textContent = "バイト先: " + (jobInput.value || '未入力'));
    commentInput.addEventListener('input', () => commentOutput.textContent = "一言コメント: " + (commentInput.value || ''));
    mbtiInput.addEventListener('input', () => mbtiOutput.textContent = "MBTI: " + (mbtiInput.value || '未入力'));
    clubInput.addEventListener('input', () => clubOutput.textContent = "高校時代の部活: " + (clubInput.value || '未入力'));

    // 写真アップロードと切り取り処理
    function setupImageUpload(uploadElement, photoElement) {
        uploadElement.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (!file) return;

            const reader = new FileReader();
            reader.onload = (event) => {
                imageToCrop.src = event.target.result;
                currentPhotoElement = photoElement;
                modal.style.display = 'flex';

                if (cropper) {
                    cropper.destroy();
                }
                cropper = new Cropper(imageToCrop, {
                    aspectRatio: 1,
                    viewMode: 1,
                    autoCropArea: 1,
                });
            };
            reader.readAsDataURL(file);
        });
    }
    
    setupImageUpload(imageUpload1, photo1);
    setupImageUpload(imageUpload2, photo2);

    cropBtn.addEventListener('click', () => {
        if (cropper) {
            const canvas = cropper.getCroppedCanvas();
            currentPhotoElement.src = canvas.toDataURL();
            modal.style.display = 'none';
            cropper.destroy();
        }
    });

    // ダウンロード機能
    downloadBtn.addEventListener('click', () => {
        // ダウンロード前にすべてのスタンプの選択枠（四隅のハンドル）を消す
        document.querySelectorAll('.stamp.is-selected').forEach(s => {
            s.classList.remove('is-selected');
        });

        // スマホ表示の縮小(transform)を一時的に解除
        const previewElement = document.querySelector('.preview');
        const originalTransform = previewElement.style.transform;
        const computedTransform = window.getComputedStyle(previewElement).transform;

        if (computedTransform !== 'none') {
            previewElement.style.transform = 'none';
        }

        html2canvas(card, {     
            scale: 2,
            useCORS: true 
        }).then(canvas => {
            const link = document.createElement('a');
            link.href = canvas.toDataURL('image/png');
            link.download = 'profile-card.png';
            link.click();

            if (computedTransform !== 'none') {
                previewElement.style.transform = originalTransform;
            }
        }).catch(err => {
            console.error('oops, something went wrong!', err);
            if (computedTransform !== 'none') {
                previewElement.style.transform = originalTransform;
            }
        });
    });
}); // <--- ここまでが DOMContentLoaded (初期設定)


// ==========================================
// --- ここから下はタブ機能やスタンプの処理 ---
// ==========================================

// --- タブ機能の処理 ---
const tabButtons = document.querySelectorAll('.tab-btn');
const tabContents = document.querySelectorAll('.tab-content');

tabButtons.forEach(button => {
    button.addEventListener('click', () => {
        const tabId = button.getAttribute('data-tab');
        tabButtons.forEach(btn => btn.classList.remove('active'));
        tabContents.forEach(content => content.classList.remove('active'));
        button.classList.add('active');
        document.getElementById(tabId).classList.add('active');
    });
});

// --- 拡大編集用の画面（オーバーレイ）と完了ボタンを作成 ---
const overlay = document.createElement('div');
overlay.id = 'stampOverlay';
document.body.appendChild(overlay); // body直下に配置

const closeBtn = document.createElement('button');
closeBtn.id = 'closeStampOverlay';
closeBtn.textContent = '完了';
document.body.appendChild(closeBtn); // body直下に配置

// 「完了」ボタンを押した時の処理
closeBtn.addEventListener('click', () => {
    const cardElement = document.getElementById('card');
    const signImage = document.getElementById('signImage'); // 元に戻す位置の目印

    document.querySelectorAll('.photo-container.is-editing-stamps').forEach(container => {
        container.classList.remove('is-editing-stamps');
        // 【重要】編集が終わったら、元のカードの中（星座画像の前）に戻す
        cardElement.insertBefore(container, signImage);
    });
    
    overlay.style.display = 'none';
    closeBtn.style.display = 'none';
    document.querySelectorAll('.stamp').forEach(s => s.classList.remove('is-selected'));
});

// --- スタンプ生成処理 ---
const stampOptions = document.querySelectorAll('.stamp-option');
stampOptions.forEach(option => {
    option.addEventListener('click', () => {
        const targetId = document.querySelector('input[name="stampTarget"]:checked').value;
        const targetContainer = document.getElementById(targetId);
        if (!targetContainer) return;

        const newStamp = document.createElement('div');
        newStamp.classList.add('stamp');

        const content = document.createElement('div');
        content.classList.add('stamp-content');
        if (option.classList.contains('mosaic')) {
            content.classList.add('mosaic');
        }
        content.textContent = option.textContent;
        newStamp.appendChild(content);

        const corners = ['tl', 'tr', 'bl', 'br'];
        corners.forEach(pos => {
            const handle = document.createElement('div');
            handle.className = `resize-handle ${pos}`;
            newStamp.appendChild(handle);
        });
        
        targetContainer.appendChild(newStamp);
        makeInteractable(newStamp);

        document.querySelectorAll('.stamp').forEach(s => s.classList.remove('is-selected'));
        newStamp.classList.add('is-selected');

        // 【重要】編集中だけ、写真をカードの外（body直下）に移動させて画面中央に表示！
        document.body.appendChild(targetContainer);
        targetContainer.classList.add('is-editing-stamps');
        
        document.getElementById('stampOverlay').style.display = 'block';
        document.getElementById('closeStampOverlay').style.display = 'block';
        document.getElementById('card').style.overflow = 'visible';
    });
});

// --- スタンプのドラッグ＆リサイズ処理 ---
function makeInteractable(element) {
    const getParentScale = (target) => {
        const parent = target.parentElement;
        if (!parent) return 1;
        const rect = parent.getBoundingClientRect();
        const offsetWidth = parent.offsetWidth;
        return offsetWidth > 0 ? (rect.width / offsetWidth) : 1;
    };

    interact(element)
        .draggable({
            ignoreFrom: '.resize-handle',
            listeners: {
                start(event) {
                    const target = event.target;
                    const previewScale = getParentScale(target);
                    target.setAttribute('data-preview-scale', previewScale);
                },
                move(event) {
                    const target = event.target;
                    const previewScale = parseFloat(target.getAttribute('data-preview-scale')) || 1;
                    
                    const x = (parseFloat(target.getAttribute('data-x')) || 0) + (event.dx / previewScale);
                    const y = (parseFloat(target.getAttribute('data-y')) || 0) + (event.dy / previewScale);

                    target.style.transform = `translate(${x}px, ${y}px)`;
                    target.setAttribute('data-x', x);
                    target.setAttribute('data-y', y);
                }
            }
        })
        .resizable({
            edges: { left: '.tl, .bl', right: '.tr, .br', top: '.tl, .tr', bottom: '.bl, .br' },
            modifiers: [
                interact.modifiers.aspectRatio({ ratio: 'preserve' }),
                interact.modifiers.restrictSize({ min: { width: 20, height: 20 } })
            ],
            listeners: {
                start(event) {
                    const target = event.target;
                    const rect = target.getBoundingClientRect();
                    const previewScale = getParentScale(target);
                    target.setAttribute('data-preview-scale', previewScale);
                    
                    target.setAttribute('data-start-w', rect.width / previewScale);
                    target.setAttribute('data-start-fontsize', parseFloat(window.getComputedStyle(target).fontSize) || 50);
                },
                move(event) {
                    const target = event.target;
                    const previewScale = parseFloat(target.getAttribute('data-preview-scale')) || 1;

                    let x = (parseFloat(target.getAttribute('data-x')) || 0) + (event.deltaRect.left / previewScale);
                    let y = (parseFloat(target.getAttribute('data-y')) || 0) + (event.deltaRect.top / previewScale);

                    const newWidth = event.rect.width / previewScale;
                    const newHeight = event.rect.height / previewScale;

                    const startW = parseFloat(target.getAttribute('data-start-w'));
                    const startFontSize = parseFloat(target.getAttribute('data-start-fontsize'));
                    const newFontSize = startFontSize * (newWidth / startW);

                    Object.assign(target.style, {
                        width: `${newWidth}px`,
                        height: `${newHeight}px`,
                        fontSize: `${newFontSize}px`,
                        transform: `translate(${x}px, ${y}px)`
                    });

                    Object.assign(target.dataset, { x, y });
                }
            }
        })
        .gesturable({
            onstart(event) {
                const target = event.target;
                target.setAttribute('data-start-w', target.offsetWidth);
                target.setAttribute('data-start-h', target.offsetHeight);
                target.setAttribute('data-start-fontsize', parseFloat(window.getComputedStyle(target).fontSize) || 50);
            },
            onmove(event) {
                const target = event.target;
                const startW = parseFloat(target.getAttribute('data-start-w'));
                const startH = parseFloat(target.getAttribute('data-start-h'));
                const startFontSize = parseFloat(target.getAttribute('data-start-fontsize'));
                
                const scale = event.scale;
                const newWidth = Math.max(20, startW * scale);
                const newHeight = Math.max(20, startH * scale);
                const newFontSize = startFontSize * (newWidth / startW);

                const x = parseFloat(target.getAttribute('data-x')) || 0;
                const y = parseFloat(target.getAttribute('data-y')) || 0;

                Object.assign(target.style, {
                    width: `${newWidth}px`,
                    height: `${newHeight}px`,
                    fontSize: `${newFontSize}px`,
                    transform: `translate(${x}px, ${y}px)`
                });
            }
        })
        .on('down', (event) => { 
            document.querySelectorAll('.stamp').forEach(s => s.classList.remove('is-selected'));
            element.classList.add('is-selected');
        })
        .on('doubletap', (event) => { 
            if (event.target.classList.contains('resize-handle')) return;
            element.remove();
        });
}

// 画面の背景等をクリックしたら選択枠を消す処理
document.addEventListener('mousedown', (e) => {
    if (!e.target.closest('.stamp') && !e.target.closest('.stamp-option')) {
        document.querySelectorAll('.stamp').forEach(s => s.classList.remove('is-selected'));
    }
});

// ==========================================
// --- ここから下はギャラリー・検索・アップロード機能 ---
// ==========================================

// 1. 自分を識別するための「マイID」を発行（削除権限の確認用）
let myUserId = localStorage.getItem('myUserId');
if (!myUserId) {
    myUserId = 'user_' + Date.now() + Math.random().toString(36).substr(2, 9);
    localStorage.setItem('myUserId', myUserId);
}

// 2. ギャラリー用の代数フィルター（ドロップダウン）を準備
const galleryFilterSelect = document.getElementById('galleryFilterSelect');
for (let i = 45; i <= 100; i++) {
    const option = document.createElement('option');
    option.value = i;
    option.textContent = i + '代';
    galleryFilterSelect.appendChild(option);
}

// 3. アップロードボタンの処理
const uploadBtn = document.getElementById('uploadBtn');
uploadBtn.addEventListener('click', () => {
    // 選択枠を消す、transform解除などの下準備（ダウンロードと同じ）
    document.querySelectorAll('.stamp.is-selected').forEach(s => s.classList.remove('is-selected'));
    const previewElement = document.querySelector('.preview');
    const originalTransform = previewElement.style.transform;
    const computedTransform = window.getComputedStyle(previewElement).transform;
    if (computedTransform !== 'none') previewElement.style.transform = 'none';

    // 検索用に、入力されたすべてのテキストを合体させた文字列を作る
    const searchText = `
        ${document.getElementById('nameInput').value} 
        ${document.getElementById('mbtiInput').value} 
        ${document.getElementById('jobInput').value} 
        ${document.getElementById('clubInput').value} 
        ${document.getElementById('stationInput').value} 
        ${document.getElementById('signSelect').options[document.getElementById('signSelect').selectedIndex].text}
    `.toLowerCase(); // 小文字にして検索しやすくする

    const generationNumber = document.getElementById('numberInput').value;

    // 画像化（画質を少し落としてデータ量を節約 scale: 1）
    html2canvas(document.getElementById('card'), { scale: 1, useCORS: true }).then(canvas => {
        const imageDataUrl = canvas.toDataURL('image/jpeg', 0.8);
        
        // 保存するデータのまとまりを作る
        const newCardData = {
            id: 'card_' + Date.now(),
            ownerId: myUserId, // これが自分と一致すれば削除できる
            generation: generationNumber,
            searchWords: searchText,
            image: imageDataUrl
        };

        // ローカルストレージ（ブラウザの擬似データベース）に保存
        let db = JSON.parse(localStorage.getItem('fakeDatabase')) || [];
        db.unshift(newCardData); // 一番上に追加
        localStorage.setItem('fakeDatabase', JSON.stringify(db));

        alert('アップロード完了！みんなのギャラリーに表示されました。');
        
        // 元に戻す
        if (computedTransform !== 'none') previewElement.style.transform = originalTransform;
        
        // ギャラリーを更新
        renderGallery();
    });
});

// 4. ギャラリーを表示する関数
function renderGallery() {
    const galleryGrid = document.getElementById('galleryGrid');
    galleryGrid.innerHTML = ''; // 一旦空にする

    // 検索ワードとフィルターの値を取得
    const searchQuery = document.getElementById('searchInput').value.toLowerCase();
    const filterValue = galleryFilterSelect.value;

    let db = JSON.parse(localStorage.getItem('fakeDatabase')) || [];

    // ※テスト用：他人が作ったダミーデータを1つ追加して、他人の消せないことを見るため
    if(db.length === 0) {
        db.push({
            id: 'dummy1', ownerId: 'other_user_123', generation: '45', searchWords: 'ダミー テスト',
            image: 'https://via.placeholder.com/600x375.png?text=Someone+Else%27s+Card'
        });
    }

    db.forEach(card => {
        // --- 絞り込み（フィルター・検索）処理 ---
        // 1. 代数が「すべて」じゃない ＆ カードの代数が一致しないならスキップ
        if (filterValue !== 'all' && card.generation !== filterValue) return;
        // 2. 検索ワードが入力されている ＆ ワードが含まれていないならスキップ
        if (searchQuery && !card.searchWords.includes(searchQuery)) return;

        // カードのHTMLを作る
        const item = document.createElement('div');
        item.className = 'gallery-item';

        const img = document.createElement('img');
        img.src = card.image;
        item.appendChild(img);

        // もしこのカードの作成者(ownerId)が、自分(myUserId)なら削除ボタンを付ける
        if (card.ownerId === myUserId) {
            const delBtn = document.createElement('button');
            delBtn.className = 'delete-btn';
            delBtn.innerHTML = '×';
            delBtn.onclick = () => {
                if(confirm('自分のカードを削除しますか？')) {
                    // 自分以外のデータを残す＝自分を消す
                    let updatedDb = db.filter(c => c.id !== card.id);
                    localStorage.setItem('fakeDatabase', JSON.stringify(updatedDb));
                    renderGallery(); // 再描画
                }
            };
            item.appendChild(delBtn);
        }

        galleryGrid.appendChild(item);
    });
}

// 5. 検索窓やフィルターが変更されたら、リアルタイムにギャラリーを更新
document.getElementById('searchInput').addEventListener('input', renderGallery);
galleryFilterSelect.addEventListener('change', renderGallery);

// 画面読み込み時に1回ギャラリーを表示
renderGallery();
