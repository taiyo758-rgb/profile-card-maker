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
    const signInput = document.getElementById('signInput');
    const signOutput = document.getElementById('signOutput');

    // ▼ ここからが新しいコード ▼

    // 数字選択の要素を取得
    const numberInput = document.getElementById('numberInput');
    const numberOutput = document.getElementById('numberOutput');

    const signSelect = document.getElementById('signSelect');
    const signImage = document.getElementById('signImage');

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

    // ▲ ここまでが新しいコード ▲

// script.js

    // 星座が選択されたら画像を表示する処理を追加
    signSelect.addEventListener('change', () => {
        // 選択されたオプションの要素を取得
        const selectedOption = signSelect.options[signSelect.selectedIndex];
        const selectedValue = selectedOption.value; // "aries"など
        const selectedText = selectedOption.text;   // "牡羊座"など

        if (selectedValue) {
            // 画像の処理 (以下の2行をコメントアウト)
            // signImage.src = `images/${selectedValue}.png`;
            // signImage.style.display = 'block';
            
            // 文字の処理 (これは残す)
             signOutput.textContent = "星座: " + selectedText;
        } else {
            // 画像を隠す (以下の1行をコメントアウト)
            // signImage.style.display = 'none';
            
            // 文字をリセット (これは残す)
            signOutput.textContent = "星座: 未選択";
        }
    });


    // 画像切り取りモーダル関連
    const modal = document.getElementById('cropModal');
    const imageToCrop = document.getElementById('imageToCrop');
    const cropBtn = document.getElementById('cropBtn');

    let cropper;
    let currentPhotoElement;

    // --- 既存の機能の実装 ---

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

// script.js (下の方にあります)

    // ダウンロード機能
    downloadBtn.addEventListener('click', () => {
        // ダウンロード前にすべてのスタンプの選択枠（四隅のハンドル）を消す
        document.querySelectorAll('.stamp.is-selected').forEach(s => {
            s.classList.remove('is-selected');
        });

        // --- ▼ ここから追加 ▼ ---
        // スマホ表示の縮小(transform)を一時的に解除
        const previewElement = document.querySelector('.preview');
        // 元のインラインスタイルを保存 (通常は空のはず)
        const originalTransform = previewElement.style.transform;
        // getComputedStyleで現在適用されているtransformを取得
        const computedTransform = window.getComputedStyle(previewElement).transform;

        // transformが 'none' 以外 (つまり縮小がかかっている) なら一時解除
        if (computedTransform !== 'none') {
            previewElement.style.transform = 'none';
        }
        // --- ▲ ここまで追加 ▲ ---

        html2canvas(card, {      
            scale: 2, // 解像度は2倍のまま
            useCORS: true 
        }).then(canvas => {
            const link = document.createElement('a');
            link.href = canvas.toDataURL('image/png');
            link.download = 'profile-card.png';
            link.click();

            // --- ▼ ここから追加 ▼ ---
            // 解除したtransformを元に戻す
            if (computedTransform !== 'none') {
                previewElement.style.transform = originalTransform;
            }
            // --- ▲ ここまで追加 ▲ ---

        }).catch(err => {
            // --- ▼ ここから追加 (エラー時) ▼ ---
            // エラーが起きてもtransformを元に戻す
            console.error('oops, something went wrong!', err);
            if (computedTransform !== 'none') {
                previewElement.style.transform = originalTransform;
            }
            // --- ▲ ここまで追加 ▲ ---
        });
    });
// 既存のDOMContentLoadedの閉じ括弧
});


// --- タブ機能の処理 ---
const tabButtons = document.querySelectorAll('.tab-btn');
const tabContents = document.querySelectorAll('.tab-content');

tabButtons.forEach(button => {
    button.addEventListener('click', () => {
        // クリックされたボタンのdata-tab属性を取得
        const tabId = button.getAttribute('data-tab');

        // すべてのボタンとコンテンツからactiveクラスを削除
        tabButtons.forEach(btn => btn.classList.remove('active'));
        tabContents.forEach(content => content.classList.remove('active'));

        // クリックされたボタンに対応するコンテンツにactiveクラスを追加
        button.classList.add('active');
        document.getElementById(tabId).classList.add('active');
    });
});

// ▼▼▼ この関数を丸ごと置き換えてください ▼▼▼
function makeInteractable(element) {
    const previewElement = document.querySelector('.preview');

    interact(element)
        .draggable({
            ignoreFrom: '.resize-handle', // 四隅のハンドル以外をドラッグした時のみ移動
            listeners: {
                start(event) {
                    const target = event.target;
                    let previewScale = 1;
                    if (previewElement) {
                        const transform = window.getComputedStyle(previewElement).transform;
                        if (transform && transform !== 'none') {
                            const matrix = transform.match(/matrix\(([^)]+)\)/);
                            if (matrix && matrix[1]) {
                                previewScale = parseFloat(matrix[1].split(', ')[0]);
                            } else if (transform.startsWith('scale(')) {
                                previewScale = parseFloat(transform.substring(6));
                            }
                        }
                    }
                    if (!previewScale || previewScale === 0) previewScale = 1;
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
            // 四隅のクラスを指定してリサイズを許可
            edges: { left: '.tl, .bl', right: '.tr, .br', top: '.tl, .tr', bottom: '.bl, .br' },
            modifiers: [
                interact.modifiers.aspectRatio({ ratio: 'preserve' }), // 縦横比を固定
                interact.modifiers.restrictSize({ min: { width: 20, height: 20 } }) // 最小サイズ
            ],
            listeners: {
                start(event) {
                    const target = event.target;
                    // リサイズ開始時のサイズを記憶
                    const rect = target.getBoundingClientRect();
                    const previewScale = parseFloat(target.getAttribute('data-preview-scale')) || 1;
                    target.setAttribute('data-start-w', rect.width / previewScale);
                    target.setAttribute('data-start-fontsize', parseFloat(window.getComputedStyle(target).fontSize) || 50);
                },
                move(event) {
                    const target = event.target;
                    const previewScale = parseFloat(target.getAttribute('data-preview-scale')) || 1;

                    // 位置の更新（左や上を引っ張った際の座標調整）
                    let x = (parseFloat(target.getAttribute('data-x')) || 0) + (event.deltaRect.left / previewScale);
                    let y = (parseFloat(target.getAttribute('data-y')) || 0) + (event.deltaRect.top / previewScale);

                    // 新しい幅と高さ
                    const newWidth = event.rect.width / previewScale;
                    const newHeight = event.rect.height / previewScale;

                    // 幅の比率に合わせてフォントサイズも変更する（絵文字を追従させるため）
                    const startW = parseFloat(target.getAttribute('data-start-w'));
                    const startFontSize = parseFloat(target.getAttribute('data-start-fontsize'));
                    const newFontSize = startFontSize * (newWidth / startW);

                    // 適用
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
        .gesturable({ // スマホのピンチ操作対応
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
        .on('down', (event) => { // タッチまたはクリックされた時
            // 全てのスタンプの選択を解除してから、クリックしたものだけ選択
            document.querySelectorAll('.stamp').forEach(s => s.classList.remove('is-selected'));
            element.classList.add('is-selected');
        })
        .on('doubletap', (event) => { // ダブルタップで削除
            // ハンドルをダブルクリックした場合は削除しない
            if (event.target.classList.contains('resize-handle')) return;
            element.remove();
        });
}

// ▼▼▼ 画面の背景等をクリックしたら選択枠を消す処理 (script.jsの末尾などに追加) ▼▼▼
document.addEventListener('mousedown', (e) => {
    // クリックした要素がスタンプやスタンプメニューでなければ選択解除
    if (!e.target.closest('.stamp') && !e.target.closest('.stamp-option')) {
        document.querySelectorAll('.stamp').forEach(s => s.classList.remove('is-selected'));
    }
});

// ▼▼▼ スタンプ生成処理を丸ごと置き換えてください ▼▼▼
const stampOptions = document.querySelectorAll('.stamp-option');
stampOptions.forEach(option => {
    option.addEventListener('click', () => {
        const targetId = document.querySelector('input[name="stampTarget"]:checked').value;
        const targetContainer = document.getElementById(targetId);
        if (!targetContainer) return;

        const newStamp = document.createElement('div');
        newStamp.classList.add('stamp');

        // スタンプの中身(絵文字等)を入れるコンテナ
        const content = document.createElement('div');
        content.classList.add('stamp-content');
        if (option.classList.contains('mosaic')) {
            content.classList.add('mosaic');
        }
        content.textContent = option.textContent;
        newStamp.appendChild(content);

        // 4隅の操作ハンドル（リサイズ用）を追加
        const corners = ['tl', 'tr', 'bl', 'br'];
        corners.forEach(pos => {
            const handle = document.createElement('div');
            handle.className = `resize-handle ${pos}`;
            newStamp.appendChild(handle);
        });
        
        targetContainer.appendChild(newStamp);
        makeInteractable(newStamp);

        // 追加した瞬間に他の選択を解除し、これを「選択状態」にする
        document.querySelectorAll('.stamp').forEach(s => s.classList.remove('is-selected'));
        newStamp.classList.add('is-selected');
    });
});
        
        targetContainer.appendChild(newStamp);
        makeInteractable(newStamp);
    });
});

// ▼▼▼ 拡大編集用の画面（オーバーレイ）と完了ボタンを作成 ▼▼▼
const overlay = document.createElement('div');
overlay.id = 'stampOverlay';
document.body.appendChild(overlay);

const closeBtn = document.createElement('button');
closeBtn.id = 'closeStampOverlay';
closeBtn.textContent = '完了';
document.body.appendChild(closeBtn);

// 「完了」ボタンを押した時の処理（拡大モードを終了して元に戻す）
closeBtn.addEventListener('click', () => {
    document.querySelectorAll('.photo-container').forEach(container => {
        container.classList.remove('is-editing-stamps');
    });
    overlay.style.display = 'none';
    closeBtn.style.display = 'none';
    
    // 選択枠もついでに消す
    document.querySelectorAll('.stamp').forEach(s => s.classList.remove('is-selected'));
});
