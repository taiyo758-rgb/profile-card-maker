document.addEventListener('DOMContentLoaded', () => {
    // HTML要素を取得
    const card = document.getElementById('card');
    const imageUpload1 = document.getElementById('imageUpload1');
    const imageUpload2 = document.getElementById('imageUpload2');
    const photo1 = document.getElementById('photo1');
    const photo2 = document.getElementById('photo2');
    const nameInput = document.getElementById('nameInput');
    const nameOutput = document.getElementById('nameOutput');
    const birthInput = document.getElementById('birthInput');
    const birthOutput = document.getElementById('birthOutput');
    const stationInput = document.getElementById('stationInput');
    const stationOutput = document.getElementById('stationOutput');
    const jobInput = document.getElementById('jobInput');
    const jobOutput = document.getElementById('jobOutput');
    const commentInput = document.getElementById('commentInput');
    const commentOutput = document.getElementById('commentOutput');
    const downloadBtn = document.getElementById('downloadBtn');
    
    // 画像切り取りモーダル関連
    const modal = document.getElementById('cropModal');
    const imageToCrop = document.getElementById('imageToCrop');
    const cropBtn = document.getElementById('cropBtn');

    let cropper;
    let currentPhotoElement; // 現在切り取り中の写真要素 (photo1 or photo2)

    // --- 機能の実装 ---

    // 1. 背景画像の変更
    document.querySelectorAll('input[name="bg"]').forEach(radio => {
        radio.addEventListener('change', (e) => {
            card.style.backgroundImage = `url(${e.target.value})`;
        });
    });

    // 2. テキスト入力のリアルタイム反映
    nameInput.addEventListener('input', () => nameOutput.textContent = nameInput.value || '名前');
    birthInput.addEventListener('input', () => birthOutput.textContent = "生年月日: " + (birthInput.value || '未入力'));
    stationInput.addEventListener('input', () => stationOutput.textContent = "最寄駅: " + (stationInput.value || '未入力'));
    jobInput.addEventListener('input', () => jobOutput.textContent = "バイト先: " + (jobInput.value || '未入力'));
    commentInput.addEventListener('input', () => commentOutput.textContent = commentInput.value || '一言コメント');

    // 3. 写真アップロードと切り取り処理
    function setupImageUpload(uploadElement, photoElement) {
        uploadElement.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (!file) return;

            const reader = new FileReader();
            reader.onload = (event) => {
                imageToCrop.src = event.target.result;
                currentPhotoElement = photoElement; // 対象のimg要素を保存
                modal.style.display = 'flex'; // モーダルを表示

                if (cropper) {
                    cropper.destroy();
                }
                // Cropper.jsを初期化
                cropper = new Cropper(imageToCrop, {
                    aspectRatio: photoElement.id === 'photo1' ? 200 / 250 : 1, // photo1は縦長、photo2は1:1
                    viewMode: 1,
                    autoCropArea: 1,
                });
            };
            reader.readAsDataURL(file);
        });
    }
    
    setupImageUpload(imageUpload1, photo1);
    setupImageUpload(imageUpload2, photo2);

    // 「切り取る」ボタンが押されたときの処理
    cropBtn.addEventListener('click', () => {
        if (cropper) {
            const canvas = cropper.getCroppedCanvas();
            currentPhotoElement.src = canvas.toDataURL(); // 切り取った画像をカードに設定
            modal.style.display = 'none'; // モーダルを非表示
            cropper.destroy();
        }
    });

    // 4. ダウンロード機能
    downloadBtn.addEventListener('click', () => {
        // html2canvasを使ってカード要素を画像に変換
        html2canvas(card).then(canvas => {
            const link = document.createElement('a');
            link.href = canvas.toDataURL('image/png');
            link.download = 'profile-card.png';
            link.click();
        });
    });
});
