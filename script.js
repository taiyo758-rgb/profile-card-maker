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

    // 星座が選択されたら画像を表示する処理を追加
    signSelect.addEventListener('change', () => {
        // 選択されたオプションの要素を取得
        const selectedOption = signSelect.options[signSelect.selectedIndex];
        const selectedValue = selectedOption.value; // "aries"など
        const selectedText = selectedOption.text;   // "牡羊座"など

        if (selectedValue) {
            // 画像の処理
            signImage.src = `images/${selectedValue}.png`;
            signImage.style.display = 'block';
            // 文字の処理
             signOutput.textContent = "星座: " + selectedText;
        } else {
            // 画像を隠す
            signImage.style.display = 'none';
            // 文字をリセット
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

    // ダウンロード機能
    downloadBtn.addEventListener('click', () => {
        // ダウンロード前に選択中のスタンプの枠線を消す
        const selectedStamp = document.querySelector('.stamp:focus');
        if(selectedStamp) { selectedStamp.blur(); }
    
        html2canvas(card, {      
            scale: 2,
            useCORS: true 
        }).then(canvas => {
            const link = document.createElement('a');
            link.href = canvas.toDataURL('image/png');
            link.download = 'profile-card.png';
            link.click();
        });
    });
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
    interact(element)
        .draggable({
            listeners: {
                move(event) {
                    const target = event.target;
                    const x = (parseFloat(target.getAttribute('data-x')) || 0) + event.dx;
                    const y = (parseFloat(target.getAttribute('data-y')) || 0) + event.dy;
                    target.style.transform = `translate(${x}px, ${y}px)`;
                    target.setAttribute('data-x', x);
                    target.setAttribute('data-y', y);
                }
            }
        })
        .resizable({
            edges: { top: true, left: true, bottom: true, right: true },
            listeners: {
                move: function (event) {
                    const target = event.target;
                    target.style.width = `${event.rect.width}px`;
                    target.style.height = `${event.rect.height}px`;
                    if (!target.classList.contains('mosaic')) {
                        target.style.fontSize = `${event.rect.height * 0.9}px`;
                    }
                }
            },
            modifiers: [
                interact.modifiers.restrictSize({
                    min: { width: 20, height: 20 }
                })
            ]
        })
        // 【新しいコード】スマホのダブルタップで削除する処理
        .on('doubletap', (event) => {
            event.target.remove();
        });

    // 【削除】古いダブルクリックの処理は不要なので消します
    // element.addEventListener('dblclick', (e) => {
    //     e.target.remove();
    // });
}

const stampOptions = document.querySelectorAll('.stamp-option');
stampOptions.forEach(option => {
    option.addEventListener('click', () => {
        const targetId = document.querySelector('input[name="stampTarget"]:checked').value;
        const targetContainer = document.getElementById(targetId);
        if (!targetContainer) return;

        const newStamp = document.createElement('div');
        newStamp.classList.add('stamp');
        newStamp.setAttribute('tabindex', 0); // 選択できるようにする

        if (option.classList.contains('mosaic')) {
            newStamp.classList.add('mosaic');
        } else {
            newStamp.textContent = option.textContent;
        }
        
        targetContainer.appendChild(newStamp);
        makeInteractable(newStamp);
    });
});
