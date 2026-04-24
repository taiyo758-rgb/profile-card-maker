document.addEventListener('DOMContentLoaded', () => {
    // ==========================================
    // --- 1. 基本設定・テキスト入力 ---
    // ==========================================
    const card = document.getElementById('card');
    const imageUpload1 = document.getElementById('imageUpload1');
    const imageUpload2 = document.getElementById('imageUpload2');
    const photo1 = document.getElementById('photo1');
    const photo2 = document.getElementById('photo2');
    
    const nameInput = document.getElementById('nameInput');
    const nameOutput = document.getElementById('nameOutput');
    const gradeInput = document.getElementById('gradeInput');
    const gradeOutput = document.getElementById('gradeOutput');
    const hometownInput = document.getElementById('hometownInput'); 
    const hometownOutput = document.getElementById('hometownOutput'); 
    const birthInput = document.getElementById('birthInput');
    const birthOutput = document.getElementById('birthOutput');
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

    // 代数ドロップダウンの作成
    if (numberInput) {
        for (let i = 45; i <= 100; i++) {
            const option = document.createElement('option');
            option.value = i;
            option.textContent = i;
            numberInput.appendChild(option);
        }
        numberInput.value = '46';
        numberOutput.textContent = '46';
        numberInput.addEventListener('change', () => {
            numberOutput.textContent = numberInput.value;
        });
    }

    // 星座の処理
    if (signSelect) {
        signSelect.addEventListener('change', () => {
            const selectedOption = signSelect.options[signSelect.selectedIndex];
            if (selectedOption.value) {
                 signOutput.textContent = "星座: " + selectedOption.text;
            } else {
                signOutput.textContent = "星座: 未選択";
            }
        });
    }

    // テキスト入力のリアルタイム反映
    if(nameInput) nameInput.addEventListener('input', () => nameOutput.textContent = "名前: " + (nameInput.value || ''));
    if(gradeInput) gradeInput.addEventListener('input', () => gradeOutput.textContent = "学部学年: " + (gradeInput.value || '未入力'));
    if(hometownInput) hometownInput.addEventListener('input', () => hometownOutput.textContent = "出身地: " + (hometownInput.value || '未入力'));
    if(birthInput) birthInput.addEventListener('input', () => birthOutput.textContent = "誕生日: " + (birthInput.value || '未入力'));
    if(stationInput) stationInput.addEventListener('input', () => stationOutput.textContent = "最寄駅: " + (stationInput.value || '未入力'));
    if(jobInput) jobInput.addEventListener('input', () => jobOutput.textContent = "バイト先: " + (jobInput.value || '未入力'));
    if(commentInput) commentInput.addEventListener('input', () => commentOutput.textContent = "一言コメント: " + (commentInput.value || ''));
    if(mbtiInput) mbtiInput.addEventListener('input', () => mbtiOutput.textContent = "MBTI: " + (mbtiInput.value || '未入力'));
    if(clubInput) clubInput.addEventListener('input', () => clubOutput.textContent = "高校時代の部活: " + (clubInput.value || '未入力'));

    // 背景変更
    document.querySelectorAll('input[name="bg"]').forEach(radio => {
        radio.addEventListener('change', (e) => {
            card.style.backgroundImage = `url(${e.target.value})`;
        });
    });

    // ==========================================
    // --- 2. 画像切り取り機能 ---
    // ==========================================
    const modal = document.getElementById('cropModal');
    const imageToCrop = document.getElementById('imageToCrop');
    const cropBtn = document.getElementById('cropBtn');
    let cropper;
    let currentPhotoElement;

    function setupImageUpload(uploadElement, photoElement) {
        if(!uploadElement) return;
        uploadElement.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (!file) return;
            const reader = new FileReader();
            reader.onload = (event) => {
                imageToCrop.src = event.target.result;
                currentPhotoElement = photoElement;
                modal.style.display = 'flex';
                if (cropper) cropper.destroy();
                cropper = new Cropper(imageToCrop, { aspectRatio: 1, viewMode: 1, autoCropArea: 1 });
            };
            reader.readAsDataURL(file);
        });
    }
    
    setupImageUpload(imageUpload1, photo1);
    setupImageUpload(imageUpload2, photo2);

    if (cropBtn) {
        cropBtn.addEventListener('click', () => {
            if (cropper) {
                const canvas = cropper.getCroppedCanvas();
                currentPhotoElement.src = canvas.toDataURL();
                modal.style.display = 'none';
                cropper.destroy();
            }
        });
    }

    // ==========================================
    // --- 3. タブ切り替え機能 ---
    // ==========================================
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

    // ==========================================
    // --- 4. スタンプ機能 ---
    // ==========================================
    const overlay = document.createElement('div');
    overlay.id = 'stampOverlay';
    document.body.appendChild(overlay);

    const closeBtn = document.createElement('button');
    closeBtn.id = 'closeStampOverlay';
    closeBtn.textContent = '完了';
    document.body.appendChild(closeBtn);

    closeBtn.addEventListener('click', () => {
        const cardElement = document.getElementById('card');
        const signImage = document.getElementById('signImage'); 
        document.querySelectorAll('.photo-container.is-editing-stamps').forEach(container => {
            container.classList.remove('is-editing-stamps');
            cardElement.insertBefore(container, signImage);
        });
        overlay.style.display = 'none';
        closeBtn.style.display = 'none';
        document.querySelectorAll('.stamp').forEach(s => s.classList.remove('is-selected'));
    });

    const stampOptions = document.querySelectorAll('.stamp-option');
    stampOptions.forEach(option => {
        option.addEventListener('click', () => {
            const targetRadio = document.querySelector('input[name="stampTarget"]:checked');
            if(!targetRadio) return;
            const targetContainer = document.getElementById(targetRadio.value);
            if (!targetContainer) return;

            const newStamp = document.createElement('div');
            newStamp.classList.add('stamp');

            const content = document.createElement('div');
            content.classList.add('stamp-content');
            if (option.classList.contains('mosaic')) content.classList.add('mosaic');
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

            document.body.appendChild(targetContainer);
            targetContainer.classList.add('is-editing-stamps');
            
            document.getElementById('stampOverlay').style.display = 'block';
            document.getElementById('closeStampOverlay').style.display = 'block';
            document.getElementById('card').style.overflow = 'visible';
        });
    });

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
                            width: `${newWidth}px`, height: `${newHeight}px`,
                            fontSize: `${newFontSize}px`, transform: `translate(${x}px, ${y}px)`
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
                        width: `${newWidth}px`, height: `${newHeight}px`,
                        fontSize: `${newFontSize}px`, transform: `translate(${x}px, ${y}px)`
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

    document.addEventListener('mousedown', (e) => {
        if (!e.target.closest('.stamp') && !e.target.closest('.stamp-option')) {
            document.querySelectorAll('.stamp').forEach(s => s.classList.remove('is-selected'));
        }
    });

    // ==========================================
    // --- 5. Firebase連携・ギャラリー機能 ---
    // ==========================================
    const firebaseConfig = {
      apiKey: "AIzaSyAgiHmL-A9oM51cA7LxTPf2qPeRJW7XZ6U",
      authDomain: "wasa-card.firebaseapp.com",
      databaseURL: "https://wasa-card-default-rtdb.asia-southeast1.firebasedatabase.app",
      projectId: "wasa-card",
      storageBucket: "wasa-card.firebasestorage.app",
      messagingSenderId: "34755367190",
      appId: "1:34755367190:web:9a6c2515d617899e22c037"
    };

    firebase.initializeApp(firebaseConfig);
    const database = firebase.database();

    let myUserId = localStorage.getItem('myUserId');
    if (!myUserId) {
        myUserId = 'user_' + Date.now() + Math.random().toString(36).substr(2, 9);
        localStorage.setItem('myUserId', myUserId);
    }

    const galleryFilterSelect = document.getElementById('galleryFilterSelect');
    if (galleryFilterSelect) {
        for (let i = 45; i <= 100; i++) {
            const option = document.createElement('option');
            option.value = i;
            option.textContent = i + '代';
            galleryFilterSelect.appendChild(option);
        }
    }

    const uploadBtn = document.getElementById('uploadBtn');
    if (uploadBtn) {
        uploadBtn.addEventListener('click', () => {
            document.querySelectorAll('.stamp.is-selected').forEach(s => s.classList.remove('is-selected'));
            const previewElement = document.querySelector('.preview');
            const originalTransform = previewElement.style.transform;
            const computedTransform = window.getComputedStyle(previewElement).transform;
            if (computedTransform !== 'none') previewElement.style.transform = 'none';

            const searchText = `
                ${document.getElementById('nameInput') ? document.getElementById('nameInput').value : ''} 
                ${document.getElementById('gradeInput') ? document.getElementById('gradeInput').value : ''} 
                ${document.getElementById('hometownInput') ? document.getElementById('hometownInput').value : ''} 
                ${document.getElementById('mbtiInput') ? document.getElementById('mbtiInput').value : ''} 
                ${document.getElementById('jobInput') ? document.getElementById('jobInput').value : ''} 
                ${document.getElementById('clubInput') ? document.getElementById('clubInput').value : ''} 
                ${document.getElementById('stationInput') ? document.getElementById('stationInput').value : ''} 
                ${document.getElementById('signSelect') ? document.getElementById('signSelect').options[document.getElementById('signSelect').selectedIndex].text : ''}
            `.toLowerCase();
            
            const generationNumber = document.getElementById('numberInput') ? document.getElementById('numberInput').value : '46';

            uploadBtn.disabled = true;
            uploadBtn.textContent = 'アップロード中...';

            // ▼ scale（解像度）を 0.8 から 1.5 にアップ ▼
            html2canvas(document.getElementById('card'), { scale: 1.5, useCORS: true }).then(canvas => {
                // ▼ 画質を 0.5（50%）から 0.85（85%）にアップ ▼
                const imageDataUrl = canvas.toDataURL('image/jpeg', 0.85); 
                
                const newCardRef = database.ref('cards').push();
                newCardRef.set({
                    ownerId: myUserId,
                    generation: generationNumber,
                    searchWords: searchText,
                    image: imageDataUrl,
                    createdAt: firebase.database.ServerValue.TIMESTAMP 
                }).then(() => {
                    alert('アップロード完了！');
                }).catch((error) => {
                    console.error("エラーが発生しました: ", error);
                    alert('アップロードに失敗しました。');
                }).finally(() => {
                    if (computedTransform !== 'none') previewElement.style.transform = originalTransform;
                    uploadBtn.disabled = false;
                    uploadBtn.textContent = 'サイトにアップロードして共有';
                });
            });
        });
    }

    let allCards = [];

    database.ref('cards').on('value', (snapshot) => {
        allCards = []; 
        snapshot.forEach((childSnapshot) => {
            const data = childSnapshot.val();
            data.id = childSnapshot.key; 
            allCards.push(data);
        });
        
        // ▼ 変更：代数（期数）の小さい順に並べ替える ▼
        allCards.sort((a, b) => {
            // 文字列で保存されている代数を数値（数字）に変換
            const genA = parseInt(a.generation) || 0;
            const genB = parseInt(b.generation) || 0;
            
            if (genA !== genB) {
                // 代数が違う場合は、小さい順（昇順）にする
                return genA - genB;
            } else {
                // 代数が同じ場合は、投稿が新しい順にする
                return b.createdAt - a.createdAt;
            }
        });
        
        updateGalleryUI(); 
    });

    function updateGalleryUI() {
        const galleryGrid = document.getElementById('galleryGrid');
        if (!galleryGrid) return;
        galleryGrid.innerHTML = ''; 

        const searchInput = document.getElementById('searchInput');
        const searchQuery = searchInput ? searchInput.value.toLowerCase() : '';
        const filterValue = galleryFilterSelect ? galleryFilterSelect.value : 'all';

        allCards.forEach(card => {
            if (filterValue !== 'all' && card.generation !== filterValue) return;
            if (searchQuery && !card.searchWords.includes(searchQuery)) return;

            const item = document.createElement('div');
            item.className = 'gallery-item';

            const img = document.createElement('img');
            img.src = card.image;
            img.style.cursor = 'pointer'; // タップできることを示す指マーク
        
        // ▼ 追加：画像をタップしたときの処理（拡大表示） ▼
            img.addEventListener('click', () => {
                const imageModal = document.getElementById('imageModal');
                const expandedImage = document.getElementById('expandedImage');
                if (imageModal && expandedImage) {
                    expandedImage.src = card.image; // タップした画像をセット
                    imageModal.style.display = 'flex'; // モーダルを表示
                }
            });
        // ▲ 追加ここまで ▲

            item.appendChild(img);

            if (card.ownerId === myUserId) {
                const delBtn = document.createElement('button');
                delBtn.className = 'delete-btn';
                delBtn.innerHTML = '×';
                delBtn.onclick = () => {
                    if(confirm('本当に自分のカードを削除しますか？')) {
                        database.ref('cards/' + card.id).remove();
                    }
                };
                item.appendChild(delBtn);
            }
            galleryGrid.appendChild(item);
        });
    }

    const searchInput = document.getElementById('searchInput');
    if (searchInput) searchInput.addEventListener('input', updateGalleryUI);
    if (galleryFilterSelect) galleryFilterSelect.addEventListener('change', updateGalleryUI);

    // ==========================================
    // --- 6. 管理者一括ダウンロード機能 ---
    // ==========================================
    const adminDownloadBtn = document.getElementById('adminDownloadBtn');
    if (adminDownloadBtn) {
        adminDownloadBtn.addEventListener('click', () => {
            const password = prompt('管理者パスワードを入力してください:');
            const adminPassword = 'wasawasa2026'; // パスワード

            if (password === null) return;
            if (password === adminPassword) {
                if (allCards.length === 0) {
                    alert('ダウンロードするカードがありません。');
                    return;
                }
                alert('ZIPファイルの作成を開始します。カードの枚数によっては少し時間がかかります...');
                adminDownloadBtn.disabled = true;
                adminDownloadBtn.textContent = '📦 ZIPファイル作成中...';

                const zip = new JSZip();
                allCards.forEach((card, index) => {
                    const base64Data = card.image.split(',')[1];
                    const searchWordsArray = card.searchWords.trim().split(/\s+/);
                    const userName = searchWordsArray[0] || '名無し'; 
                    const fileName = `${card.generation}代_${userName}_${index + 1}.jpg`;
                    zip.file(fileName, base64Data, {base64: true});
                });

                zip.generateAsync({type:"blob"}).then(function(content) {
                    const link = document.createElement('a');
                    link.href = URL.createObjectURL(content);
                    link.download = "WASA天文_自己紹介カード一覧.zip"; 
                    link.click();
                    adminDownloadBtn.disabled = false;
                    adminDownloadBtn.textContent = '🤫 管理者専用：全カード一括ダウンロード';
                });
            } else {
                alert('パスワードが違います！');
            }
        });
    }
    // ▼ 追加：拡大画像を閉じる処理 ▼
    const imageModal = document.getElementById('imageModal');
    if (imageModal) {
        imageModal.addEventListener('click', () => {
            imageModal.style.display = 'none';
        });
    }
}); // <--- DOMContentLoaded ここで終了
