document.addEventListener('DOMContentLoaded', () => {
    // --- 1. 基本設定・テキスト入力 ---
    const card = document.getElementById('card');
    const imageUpload1 = document.getElementById('imageUpload1');
    const imageUpload2 = document.getElementById('imageUpload2');
    const photo1 = document.getElementById('photo1');
    const photo2 = document.getElementById('photo2');
    
    // （入力項目の取得とリアルタイム反映）
    const setupInput = (inputId, outputId, prefix) => {
        const input = document.getElementById(inputId);
        const output = document.getElementById(outputId);
        if(input && output) input.addEventListener('input', () => output.textContent = prefix + (input.value || '未入力'));
    };
    setupInput('nameInput', 'nameOutput', '名前: ');
    setupInput('gradeInput', 'gradeOutput', '学部学年: ');
    setupInput('hometownInput', 'hometownOutput', '出身地: ');
    setupInput('birthInput', 'birthOutput', '誕生日: ');
    setupInput('stationInput', 'stationOutput', '最寄駅: ');
    setupInput('jobInput', 'jobOutput', 'バイト先: ');
    setupInput('mbtiInput', 'mbtiOutput', 'MBTI: ');
    setupInput('clubInput', 'clubOutput', '高校時代の部活: ');
    
    const commentInput = document.getElementById('commentInput');
    const commentOutput = document.getElementById('commentOutput');
    if(commentInput && commentOutput) commentInput.addEventListener('input', () => commentOutput.textContent = "一言コメント: " + (commentInput.value || ''));

    const numberInput = document.getElementById('numberInput');
    const numberOutput = document.getElementById('numberOutput');
    if (numberInput) {
        for (let i = 45; i <= 100; i++) {
            const option = document.createElement('option'); option.value = i; option.textContent = i; numberInput.appendChild(option);
        }
        numberInput.value = '46'; numberOutput.textContent = '46';
        numberInput.addEventListener('change', () => numberOutput.textContent = numberInput.value);
    }

    const signSelect = document.getElementById('signSelect');
    const signOutput = document.getElementById('signOutput');
    if (signSelect && signOutput) {
        signSelect.addEventListener('change', () => {
            const selectedOption = signSelect.options[signSelect.selectedIndex];
            signOutput.textContent = selectedOption.value ? "星座: " + selectedOption.text : "星座: 未選択";
        });
    }

    document.querySelectorAll('input[name="bg"]').forEach(radio => {
        radio.addEventListener('change', (e) => card.style.backgroundImage = `url(${e.target.value})`);
    });

    // --- 2. 画像切り取り機能 ---
    const modal = document.getElementById('cropModal');
    const imageToCrop = document.getElementById('imageToCrop');
    const cropBtn = document.getElementById('cropBtn');
    let cropper, currentPhotoElement;

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
    setupImageUpload(imageUpload1, photo1); setupImageUpload(imageUpload2, photo2);

    if (cropBtn) {
        cropBtn.addEventListener('click', () => {
            if (cropper) {
                currentPhotoElement.src = cropper.getCroppedCanvas().toDataURL();
                modal.style.display = 'none'; cropper.destroy();
            }
        });
    }

    // --- 3. タブ切り替え機能 ---
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');
    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            const tabId = button.getAttribute('data-tab');
            tabButtons.forEach(btn => btn.classList.remove('active'));
            tabContents.forEach(content => content.classList.remove('active'));
            button.classList.add('active'); document.getElementById(tabId).classList.add('active');
        });
    });

    // --- 4. スタンプ機能 ---
    const overlay = document.createElement('div'); overlay.id = 'stampOverlay'; document.body.appendChild(overlay);
    const closeBtn = document.createElement('button'); closeBtn.id = 'closeStampOverlay'; closeBtn.textContent = '完了'; document.body.appendChild(closeBtn);

    closeBtn.addEventListener('click', () => {
        const cardElement = document.getElementById('card');
        const signImage = document.getElementById('signImage'); 
        document.querySelectorAll('.photo-container.is-editing-stamps').forEach(container => {
            container.classList.remove('is-editing-stamps'); cardElement.insertBefore(container, signImage);
        });
        overlay.style.display = 'none'; closeBtn.style.display = 'none';
        document.querySelectorAll('.stamp').forEach(s => s.classList.remove('is-selected'));
    });

    document.querySelectorAll('.stamp-option').forEach(option => {
        option.addEventListener('click', () => {
            const targetRadio = document.querySelector('input[name="stampTarget"]:checked');
            if(!targetRadio) return;
            const targetContainer = document.getElementById(targetRadio.value);
            if (!targetContainer) return;

            const newStamp = document.createElement('div'); newStamp.classList.add('stamp');
            const content = document.createElement('div'); content.classList.add('stamp-content');
            if (option.classList.contains('mosaic')) content.classList.add('mosaic');
            content.textContent = option.textContent; newStamp.appendChild(content);

            ['tl', 'tr', 'bl', 'br'].forEach(pos => {
                const handle = document.createElement('div'); handle.className = `resize-handle ${pos}`; newStamp.appendChild(handle);
            });
            targetContainer.appendChild(newStamp); makeInteractable(newStamp);
            document.querySelectorAll('.stamp').forEach(s => s.classList.remove('is-selected')); newStamp.classList.add('is-selected');

            document.body.appendChild(targetContainer); targetContainer.classList.add('is-editing-stamps');
            document.getElementById('stampOverlay').style.display = 'block'; document.getElementById('closeStampOverlay').style.display = 'block';
            document.getElementById('card').style.overflow = 'visible';
        });
    });

    function makeInteractable(element) {
        const getParentScale = (target) => {
            const parent = target.parentElement;
            if (!parent) return 1;
            const offsetWidth = parent.offsetWidth;
            return offsetWidth > 0 ? (parent.getBoundingClientRect().width / offsetWidth) : 1;
        };

        interact(element)
            .draggable({
                ignoreFrom: '.resize-handle',
                listeners: {
                    start(event) { event.target.setAttribute('data-preview-scale', getParentScale(event.target)); },
                    move(event) {
                        const target = event.target;
                        const previewScale = parseFloat(target.getAttribute('data-preview-scale')) || 1;
                        const x = (parseFloat(target.getAttribute('data-x')) || 0) + (event.dx / previewScale);
                        const y = (parseFloat(target.getAttribute('data-y')) || 0) + (event.dy / previewScale);
                        target.style.transform = `translate(${x}px, ${y}px)`; target.setAttribute('data-x', x); target.setAttribute('data-y', y);
                    }
                }
            })
            .resizable({
                edges: { left: '.tl, .bl', right: '.tr, .br', top: '.tl, .tr', bottom: '.bl, .br' },
                modifiers: [ interact.modifiers.aspectRatio({ ratio: 'preserve' }), interact.modifiers.restrictSize({ min: { width: 20, height: 20 } }) ],
                listeners: {
                    start(event) {
                        const target = event.target; const previewScale = getParentScale(target);
                        target.setAttribute('data-preview-scale', previewScale); target.setAttribute('data-start-w', target.getBoundingClientRect().width / previewScale);
                        target.setAttribute('data-start-fontsize', parseFloat(window.getComputedStyle(target).fontSize) || 50);
                    },
                    move(event) {
                        const target = event.target; const previewScale = parseFloat(target.getAttribute('data-preview-scale')) || 1;
                        let x = (parseFloat(target.getAttribute('data-x')) || 0) + (event.deltaRect.left / previewScale);
                        let y = (parseFloat(target.getAttribute('data-y')) || 0) + (event.deltaRect.top / previewScale);
                        const newWidth = event.rect.width / previewScale;
                        const startW = parseFloat(target.getAttribute('data-start-w')); const startFontSize = parseFloat(target.getAttribute('data-start-fontsize'));
                        Object.assign(target.style, { width: `${newWidth}px`, height: `${event.rect.height / previewScale}px`, fontSize: `${startFontSize * (newWidth / startW)}px`, transform: `translate(${x}px, ${y}px)` });
                        Object.assign(target.dataset, { x, y });
                    }
                }
            })
            .on('down', (e) => { document.querySelectorAll('.stamp').forEach(s => s.classList.remove('is-selected')); element.classList.add('is-selected'); })
            .on('doubletap', (e) => { if (!e.target.classList.contains('resize-handle')) element.remove(); });
    }

    document.addEventListener('mousedown', (e) => {
        if (!e.target.closest('.stamp') && !e.target.closest('.stamp-option')) document.querySelectorAll('.stamp').forEach(s => s.classList.remove('is-selected'));
    });

    // --- 5. Firebase連携・ギャラリー機能 ---
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
    if (!myUserId) { myUserId = 'user_' + Date.now() + Math.random().toString(36).substr(2, 9); localStorage.setItem('myUserId', myUserId); }

    const galleryFilterSelect = document.getElementById('galleryFilterSelect');
    if (galleryFilterSelect) {
        for (let i = 45; i <= 100; i++) { const option = document.createElement('option'); option.value = i; option.textContent = i + '代'; galleryFilterSelect.appendChild(option); }
    }

    let editingCardId = null;
    const uploadBtn = document.getElementById('uploadBtn');
    
    // ▼ データアップロード処理（画像分離） ▼
    if (uploadBtn) {
        uploadBtn.addEventListener('click', () => {
            document.querySelectorAll('.stamp.is-selected').forEach(s => s.classList.remove('is-selected'));
            const previewElement = document.querySelector('.preview');
            const cardElement = document.getElementById('card'); 

            const originalPreviewStyle = previewElement.getAttribute('style') || '';
            const originalCardStyle = cardElement.getAttribute('style') || '';
            previewElement.style.setProperty('transform', 'none', 'important'); previewElement.style.setProperty('margin-bottom', '0', 'important');
            cardElement.style.setProperty('transform', 'none', 'important'); cardElement.style.setProperty('margin-bottom', '0', 'important');

            const safeVal = (id) => document.getElementById(id) ? document.getElementById(id).value : '';
            const searchText = `${safeVal('nameInput')} ${safeVal('gradeInput')} ${safeVal('hometownInput')} ${safeVal('mbtiInput')} ${safeVal('jobInput')} ${safeVal('clubInput')} ${safeVal('stationInput')}`.toLowerCase();
            const generationNumber = safeVal('numberInput') || '46';

            uploadBtn.disabled = true; uploadBtn.textContent = 'アップロード中...';

            setTimeout(() => {
                html2canvas(cardElement, { scale: 1.5, useCORS: true }).then(canvas => {
                    const imageDataUrl = canvas.toDataURL('image/jpeg', 0.85); 
                    
                    const cardInfo = {
                        ownerId: myUserId, generation: generationNumber, searchWords: searchText,
                        rawFields: {
                            name: safeVal('nameInput'), grade: safeVal('gradeInput'), hometown: safeVal('hometownInput'),
                            birth: safeVal('birthInput'), station: safeVal('stationInput'), job: safeVal('jobInput'),
                            mbti: safeVal('mbtiInput'), club: safeVal('clubInput'), comment: safeVal('commentInput'), sign: safeVal('signSelect')
                        }
                    };
                    
                    if (editingCardId) {
                        database.ref('cards/' + editingCardId).update(cardInfo)
                        .then(() => database.ref('card_images/' + editingCardId).set(imageDataUrl))
                        .then(() => { alert('上書き保存しました！'); editingCardId = null; uploadBtn.style.backgroundColor = '#28a745'; })
                        .finally(() => resetUploadState());
                    } else {
                        cardInfo.createdAt = firebase.database.ServerValue.TIMESTAMP;
                        const newCardRef = database.ref('cards').push();
                        newCardRef.set(cardInfo)
                        .then(() => database.ref('card_images/' + newCardRef.key).set(imageDataUrl))
                        .then(() => alert('アップロード完了！'))
                        .finally(() => resetUploadState());
                    }
                });
            }, 100);
            
            function resetUploadState() {
                previewElement.setAttribute('style', originalPreviewStyle); cardElement.setAttribute('style', originalCardStyle);
                uploadBtn.disabled = false; uploadBtn.textContent = 'サイトにアップロードして共有';
            }
        });
    }

    let allCards = [];
    
    // ▼ 軽い文字データだけを読み込む ▼
    database.ref('cards').on('value', (snapshot) => {
        allCards = []; 
        snapshot.forEach((childSnapshot) => {
            const data = childSnapshot.val(); data.id = childSnapshot.key; allCards.push(data);
        });
        
        allCards.sort((a, b) => {
            const genA = parseInt(a.generation) || 0; const genB = parseInt(b.generation) || 0;
            return genA !== genB ? genA - genB : b.createdAt - a.createdAt;
        });
        updateGalleryUI(); 
    });

    // ▼ 無限スクロール（遅延読み込み） ▼
    let displayedCardCount = 0; const cardsPerLoad = 6; let filteredCards = []; let scrollObserver = null; 

    function updateGalleryUI() {
        const galleryGrid = document.getElementById('galleryGrid');
        if (!galleryGrid) return;
        
        galleryGrid.innerHTML = ''; displayedCardCount = 0; 
        if (scrollObserver) scrollObserver.disconnect();

        const searchInput = document.getElementById('searchInput');
        const searchQuery = searchInput ? searchInput.value.toLowerCase() : '';
        const filterValue = galleryFilterSelect ? galleryFilterSelect.value : 'all';

        filteredCards = allCards.filter(card => {
            if (filterValue !== 'all' && card.generation !== filterValue) return false;
            return !(searchQuery && !card.searchWords.includes(searchQuery));
        });
        loadMoreCards();
    }

    function loadMoreCards() {
        const galleryGrid = document.getElementById('galleryGrid');
        if (!galleryGrid) return;

        const nextCount = Math.min(displayedCardCount + cardsPerLoad, filteredCards.length);
        
        for (let i = displayedCardCount; i < nextCount; i++) {
            const card = filteredCards[i];
            const item = document.createElement('div'); item.className = 'gallery-item';
            const img = document.createElement('img'); img.style.cursor = 'pointer'; 
            
            // Safari対策：灰色の仮画像を置き、CSSのaspect-ratioで枠を確保する
            img.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 10 10'%3E%3Crect width='10' height='10' fill='%23e0e0e0'/%3E%3C/svg%3E";
            
            const setupImageClick = (imageSrc) => {
                img.addEventListener('click', () => {
                    const imageModal = document.getElementById('imageModal');
                    const expandedImage = document.getElementById('expandedImage');
                    if (imageModal && expandedImage) { expandedImage.src = imageSrc; imageModal.style.display = 'flex'; }
                });
            };

            // 分離された画像を裏側で取得
            if (card.image) {
                img.src = card.image; setupImageClick(card.image);
            } else {
                database.ref('card_images/' + card.id).once('value').then(snap => {
                    const base64Img = snap.val();
                    if (base64Img) { img.src = base64Img; setupImageClick(base64Img); }
                });
            }
            item.appendChild(img);

            // --- 削除・編集ボタン ---
            if (card.ownerId === myUserId) {
                const delBtn = document.createElement('button'); delBtn.className = 'delete-btn'; delBtn.innerHTML = '×';
                delBtn.onclick = (e) => {
                    e.stopPropagation(); 
                    if(confirm('本当に削除しますか？')) {
                        database.ref('cards/' + card.id).remove(); database.ref('card_images/' + card.id).remove();
                    }
                };
                item.appendChild(delBtn);

                const editBtn = document.createElement('button'); editBtn.className = 'edit-btn'; editBtn.innerHTML = '✏️';
                editBtn.onclick = (e) => {
                    e.stopPropagation(); 
                    if (!card.rawFields) return alert('古いバージョンで作られているため、再編集できません。');
                    if (confirm('内容を復元して再編集しますか？\n（写真は再度選び直す必要があります）')) {
                        const fields = ['name', 'grade', 'hometown', 'birth', 'station', 'job', 'mbti', 'club', 'comment'];
                        fields.forEach(f => {
                            const el = document.getElementById(f + 'Input');
                            if(el) { el.value = card.rawFields[f] || ''; el.dispatchEvent(new Event('input')); }
                        });
                        const signEl = document.getElementById('signSelect');
                        if(signEl) { signEl.value = card.rawFields.sign || ''; signEl.dispatchEvent(new Event('change')); }

                        editingCardId = card.id;
                        const uBtn = document.getElementById('uploadBtn');
                        if (uBtn) { uBtn.textContent = '✏️ 変更を保存して上書きする'; uBtn.style.backgroundColor = '#ffc107'; }
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                    }
                };
                item.appendChild(editBtn);
            }
            galleryGrid.appendChild(item);
        }
        
        displayedCardCount = nextCount;

        // スクロール検知
        if (displayedCardCount < filteredCards.length) {
            const sentinel = document.createElement('div'); sentinel.style.height = '1px'; galleryGrid.appendChild(sentinel);
            scrollObserver = new IntersectionObserver((entries) => {
                if (entries[0].isIntersecting) { scrollObserver.disconnect(); sentinel.remove(); loadMoreCards(); }
            }, { rootMargin: '300px' });
            scrollObserver.observe(sentinel);
        }
    }

    const searchInput = document.getElementById('searchInput');
    if (searchInput) searchInput.addEventListener('input', updateGalleryUI);
    if (galleryFilterSelect) galleryFilterSelect.addEventListener('change', updateGalleryUI);

    // --- 6. 管理者専用ツール ---
    const adminDownloadBtn = document.getElementById('adminDownloadBtn');
    if (adminDownloadBtn) {
        adminDownloadBtn.addEventListener('click', async () => {
            const password = prompt('パスワード:'); if (password !== 'wasawasa2026') return;
            if (allCards.length === 0) return alert('カードがありません。');
            
            adminDownloadBtn.disabled = true; adminDownloadBtn.textContent = '📦 ZIPファイル作成中...';
            const zip = new JSZip();
            for (let i = 0; i < allCards.length; i++) {
                const card = allCards[i]; let base64Data = '';
                if (card.image) base64Data = card.image.split(',')[1];
                else {
                    const snap = await database.ref('card_images/' + card.id).once('value');
                    if (snap.val()) base64Data = snap.val().split(',')[1];
                }
                const userName = card.searchWords.trim().split(/\s+/)[0] || '名無し'; 
                if (base64Data) zip.file(`${card.generation}代_${userName}_${i + 1}.jpg`, base64Data, {base64: true});
            }
            zip.generateAsync({type:"blob"}).then(function(content) {
                const link = document.createElement('a'); link.href = URL.createObjectURL(content); link.download = "WASA天文_自己紹介カード一覧.zip"; link.click();
                adminDownloadBtn.disabled = false; adminDownloadBtn.textContent = '🤫 管理者専用：全カード一括ダウンロード';
            });
        });
    }

    const adminMigrateBtn = document.getElementById('adminMigrateBtn');
    if (adminMigrateBtn) {
        adminMigrateBtn.addEventListener('click', async () => {
            const password = prompt('パスワード:'); if (password !== 'wasawasa2026') return;
            if (!confirm('既存のデータを分離して超高速化します。\n画面を絶対に閉じないでください。')) return;

            adminMigrateBtn.disabled = true; adminMigrateBtn.textContent = '🚀 データベース最適化中...';
            let count = 0;
            for (let i = 0; i < allCards.length; i++) {
                const card = allCards[i];
                if (card.image) {
                    try {
                        await database.ref('card_images/' + card.id).set(card.image);
                        await database.ref('cards/' + card.id + '/image').remove();
                        count++;
                    } catch (e) { console.error('移行エラー:', e); }
                }
            }
            alert(`最適化完了！\n${count}件の重いカードを分離しました！`);
            adminMigrateBtn.textContent = '🚀 管理者専用：データベースを超高速化（データ分離）'; adminMigrateBtn.disabled = false;
        });
    }

    const adminCompressBtn = document.getElementById('adminCompressBtn');
    if (adminCompressBtn) {
        adminCompressBtn.addEventListener('click', async () => {
            const password = prompt('パスワード:'); if (password !== 'wasawasa2026') return;
            if (!confirm('重い画像を圧縮します。')) return;
            
            adminCompressBtn.disabled = true; adminCompressBtn.textContent = '🔄 軽量化処理中...';
            let successCount = 0;

            for (let i = 0; i < allCards.length; i++) {
                const card = allCards[i];
                let currentImgStr = card.image;
                if (!currentImgStr) {
                    const snap = await database.ref('card_images/' + card.id).once('value');
                    currentImgStr = snap.val();
                }
                
                await new Promise((resolve) => {
                    if (!currentImgStr) return resolve();
                    const img = new Image(); img.crossOrigin = "Anonymous"; 
                    img.onload = () => {
                        if (img.width > 1800) { 
                            const canvas = document.createElement('canvas'); const ctx = canvas.getContext('2d');
                            const targetWidth = 1800; const targetHeight = img.height * (1800 / img.width);
                            canvas.width = targetWidth; canvas.height = targetHeight;
                            ctx.drawImage(img, 0, 0, targetWidth, targetHeight);
                            database.ref('card_images/' + card.id).set(canvas.toDataURL('image/jpeg', 0.8)).then(() => {
                                if (card.image) database.ref('cards/' + card.id + '/image').remove();
                                successCount++; resolve();
                            });
                        } else resolve();
                    };
                    img.onerror = () => resolve(); img.src = currentImgStr;
                });
            }
            alert(`処理完了！\n${successCount}枚のカードを軽量化しました。`);
            adminCompressBtn.disabled = false; adminCompressBtn.textContent = '🛠 管理者専用：重いカードを一括軽量化';
        });
    }

    const imageModal = document.getElementById('imageModal');
    if (imageModal) imageModal.addEventListener('click', () => imageModal.style.display = 'none');
});
