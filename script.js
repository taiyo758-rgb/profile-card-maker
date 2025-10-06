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
    const stationInput = document.getElementById('stationInput');
    const stationOutput = document.getElementById('stationOutput');
    const jobInput = document.getElementById('jobInput');
    const jobOutput = document.getElementById('jobOutput');
    const commentInput = document.getElementById('commentInput');
    const commentOutput = document.getElementById('commentOutput');
    
    // 新しいテキスト入出力要素を取得
    const mbtiInput = document.getElementById('mbtiInput');
    const mbtiOutput = document.getElementById('mbtiOutput');
    const clubInput = document.getElementById('clubInput');
    const clubOutput = document.getElementById('clubOutput');
    const hobbyInput = document.getElementById('hobbyInput');
    const hobbyOutput = document.getElementById('hobbyOutput');
    const signInput = document.getElementById('signInput');
    const signOutput = document.getElementById('signOutput');

    // 画像切り取りモーダル関連
    const modal = document.getElementById('cropModal');
    const imageToCrop = document.getElementById('imageToCrop');
    const cropBtn = document.getElementById('cropBtn');

    let cropper;
    let currentPhotoElement;

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
    
    // 新しい項目のリアルタイム反映
    mbtiInput.addEventListener('input', () => mbtiOutput.textContent = "MBTI: " + (mbtiInput.value || '未入力'));
    clubInput.addEventListener('input', () => clubOutput.textContent = "高校時代の部活: " + (clubInput.value || '未入力'));
    hobbyInput.addEventListener('input', () => hobbyOutput.textContent = "したいレク: " + (hobbyInput.value || '未入力'));
    signInput.addEventListener('input', () => signOutput.textContent = "星座: " + (signInput.value || '未入力'));


    // 3. 写真アップロードと切り取り処理
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
                    aspectRatio: 1, // 正方形で切り取る
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

    // 4. ダウンロード機能
    downloadBtn.addEventListener('click', () => {
        html2canvas(card, { scale: 2 }).then(canvas => { // 高解像度でダウンロード
            const link = document.createElement('a');
            link.href = canvas.toDataURL('image/png');
            link.download = 'profile-card.png';
            link.click();
        });
    });
});
