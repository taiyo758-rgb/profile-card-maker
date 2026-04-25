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

    // ▼ 再編集モードで使用する変数 ▼
    let editingCardId = null;

    const uploadBtn = document.getElementById('uploadBtn');
    if (uploadBtn) {
        uploadBtn.addEventListener('click', () => {
            document.querySelectorAll('.stamp.is-selected').forEach(s => s.classList.remove('is-selected'));
            const previewElement = document.querySelector('.preview');
            const cardElement = document.getElementById('card'); // #card要素を取得

            // --- ▼ 修正：html2canvas実行前にレンダリングをリセット ▼ ---
            // スマホでの scale 縮小をインラインスタイルで強制的にオフにする (!important付き)
            const originalPreviewStyle = previewElement.getAttribute('style') || '';
            const originalCardStyle = cardElement.getAttribute('style') || '';

            // スマホ用の縮小を完全に打ち消す (!importantが必要)
            previewElement.style.setProperty('transform', 'none', 'important');
            previewElement.style.setProperty('margin-bottom', '0', 'important');
            
            // #card 自体の縮小も打ち消す
            cardElement.style.setProperty('transform', 'none', 'important');
            cardElement.style.setProperty('margin-bottom', '0', 'important');

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
            uploadBtn.textContent = 'アップロード中... (高画質生成中)';

            // ブラウザにレンダリングを強制させるための小さなウェイト
            setTimeout(() => {
                // ▼ 変更：バグが直ったので、scaleを 1.5 に下げてデータサイズを劇的に軽くする ▼
                html2canvas(cardElement, { 
                    scale: 1.5, 
                    useCORS: true 
                }).then(canvas => {
                    const imageDataUrl = canvas.toDataURL('image/jpeg', 0.85); // JPEG 85%
                    
                    // --- ▼ 保存するデータ (rawFieldsも含めて保存) ▼ ---
                    const cardData = {
                        ownerId: myUserId,
                        generation: generationNumber,
                        searchWords: searchText,
                        image: imageDataUrl,
                        rawFields: {
                            name: document.getElementById('nameInput') ? document.getElementById('nameInput').value : '',
                            grade: document.getElementById('gradeInput') ? document.getElementById('gradeInput').value : '',
                            hometown: document.getElementById('hometownInput') ? document.getElementById('hometownInput').value : '',
                            birth: document.getElementById('birthInput') ? document.getElementById('birthInput').value : '',
                            station: document.getElementById('stationInput') ? document.getElementById('stationInput').value : '',
                            job: document.getElementById('jobInput') ? document.getElementById('jobInput').value : '',
                            mbti: document.getElementById('mbtiInput') ? document.getElementById('mbtiInput').value : '',
                            club: document.getElementById('clubInput') ? document.getElementById('clubInput').value : '',
                            comment: document.getElementById('commentInput') ? document.getElementById('commentInput').value : '',
                            sign: document.getElementById('signSelect') ? document.getElementById('signSelect').value : ''
                        }
                    };
                    
                    if (editingCardId) {
                        // 【上書きモード】既存のカードを上書きする
                        database.ref('cards/' + editingCardId).update(cardData).then(() => {
                            alert('カードを上書き保存しました！');
                            editingCardId = null; // 編集モード解除
                            uploadBtn.style.backgroundColor = '#28a745'; // 緑色に戻す
                        }).catch((error) => {
                            console.error("エラー: ", error);
                            alert('上書きに失敗しました。');
                        }).finally(() => {
                            // --- ▼ 修正：処理が終わったらインラインスタイルを元に戻す ▼ ---
                            previewElement.setAttribute('style', originalPreviewStyle);
                            cardElement.setAttribute('style', originalCardStyle);
                            uploadBtn.disabled = false;
                            uploadBtn.textContent = 'サイトにアップロードして共有';
                        });
                    } else {
                        // 【新規作成モード】新しいカードとして追加する
                        cardData.createdAt = firebase.database.ServerValue.TIMESTAMP;
                        const newCardRef = database.ref('cards').push();
                        newCardRef.set(cardData).then(() => {
                            alert('アップロード完了！');
                        }).catch((error) => {
                            console.error("エラー: ", error);
                            alert('アップロードに失敗しました。');
                        }).finally(() => {
                            // --- ▼ 修正：処理が終わったらインラインスタイルを元に戻す ▼ ---
                            previewElement.setAttribute('style', originalPreviewStyle);
                            cardElement.setAttribute('style', originalCardStyle);
                            uploadBtn.disabled = false;
                            uploadBtn.textContent = 'サイトにアップロードして共有';
                        });
                    }
                }).catch((error) => {
                    console.error("html2canvasエラー: ", error);
                    alert('画像の生成に失敗しました。');
                    // 失敗してもスタイルは戻す
                    previewElement.setAttribute('style', originalPreviewStyle);
                    cardElement.setAttribute('style', originalCardStyle);
                    uploadBtn.disabled = false;
                    uploadBtn.textContent = 'サイトにアップロードして共有';
                });
            }, 100); // 100ミリ秒待つ
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
        
        // ▼ 代数（期数）の小さい順に並べ替える処理（復活！） ▼
        allCards.sort((a, b) => {
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
            img.loading = 'lazy'; // ▼ 追加：画面にスクロールして見えた分だけ描画する（超高速化）
            
            // ▼ 画像をタップしたときの処理（拡大表示） ▼
            img.addEventListener('click', () => {
                const imageModal = document.getElementById('imageModal');
                const expandedImage = document.getElementById('expandedImage');
                if (imageModal && expandedImage) {
                    expandedImage.src = card.image; // タップした画像をセット
                    imageModal.style.display = 'flex'; // モーダルを表示
                }
            });
            item.appendChild(img);

            if (card.ownerId === myUserId) {
                // --- 削除ボタン ---
                const delBtn = document.createElement('button');
                delBtn.className = 'delete-btn';
                delBtn.innerHTML = '×';
                delBtn.onclick = (e) => {
                    e.stopPropagation(); // 拡大表示させない
                    if(confirm('本当に自分のカードを削除しますか？')) {
                        database.ref('cards/' + card.id).remove();
                    }
                };
                item.appendChild(delBtn);

                // --- ▼ 再編集ボタン（✏️） ▼ ---
                const editBtn = document.createElement('button');
                editBtn.className = 'edit-btn';
                editBtn.innerHTML = '✏️';
                editBtn.onclick = (e) => {
                    e.stopPropagation(); // 画像を拡大表示させない
                    
                    if (!card.rawFields) {
                        alert('このカードは古いバージョンで作られているため、再編集できません。（お手数ですが新しく作り直してください🙇‍♂️）');
                        return;
                    }

                    if (confirm('入力内容を復元して再編集しますか？\n（※写真は保存されていないため、再度選び直す必要があります）')) {
                        // 入力欄にデータを復元
                        if(document.getElementById('nameInput')) document.getElementById('nameInput').value = card.rawFields.name || '';
                        if(document.getElementById('gradeInput')) document.getElementById('gradeInput').value = card.rawFields.grade || '';
                        if(document.getElementById('hometownInput')) document.getElementById('hometownInput').value = card.rawFields.hometown || '';
                        if(document.getElementById('birthInput')) document.getElementById('birthInput').value = card.rawFields.birth || '';
                        if(document.getElementById('stationInput')) document.getElementById('stationInput').value = card.rawFields.station || '';
                        if(document.getElementById('jobInput')) document.getElementById('jobInput').value = card.rawFields.job || '';
                        if(document.getElementById('mbtiInput')) document.getElementById('mbtiInput').value = card.rawFields.mbti || '';
                        if(document.getElementById('clubInput')) document.getElementById('clubInput').value = card.rawFields.club || '';
                        if(document.getElementById('commentInput')) document.getElementById('commentInput').value = card.rawFields.comment || '';
                        if(document.getElementById('signSelect')) document.getElementById('signSelect').value = card.rawFields.sign || '';

                        // プレビューの文字もリアルタイムに更新させる
                        ['nameInput', 'gradeInput', 'hometownInput', 'birthInput', 'stationInput', 'jobInput', 'mbtiInput', 'clubInput', 'commentInput'].forEach(id => {
                            const el = document.getElementById(id);
                            if(el) el.dispatchEvent(new Event('input'));
                        });
                        const signEl = document.getElementById('signSelect');
                        if(signEl) signEl.dispatchEvent(new Event('change'));

                        // アップロードボタンを「上書きモード」の見た目に変更
                        editingCardId = card.id;
                        const uploadBtn = document.getElementById('uploadBtn');
                        if (uploadBtn) {
                            uploadBtn.textContent = '✏️ 変更を保存して上書きする';
                            uploadBtn.style.backgroundColor = '#ffc107'; // 注意を引く黄色に
                        }

                        // 一番上（設定エリア）までスクロールしてあげる
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                    }
                };
                item.appendChild(editBtn);
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

    // --- 拡大画像を閉じる処理 ---
    const imageModal = document.getElementById('imageModal');
    if (imageModal) {
        imageModal.addEventListener('click', () => {
            imageModal.style.display = 'none';
        });
    }

    // ==========================================
    // --- 7. 管理者一括軽量化（圧縮）機能 ---
    // ==========================================
    const adminCompressBtn = document.getElementById('adminCompressBtn');
    if (adminCompressBtn) {
        adminCompressBtn.addEventListener('click', async () => {
            const password = prompt('管理者パスワードを入力してください:');
            const adminPassword = 'wasawasa2026';

            if (password === null) return;
            if (password !== adminPassword) {
                alert('パスワードが違います！');
                return;
            }

            if (!confirm('【警告】\n既存のギャラリー画像をすべて自動で軽量化（圧縮）します。\n※この処理には数分かかる場合があります。途中で画面を閉じないでください。よろしいですか？')) {
                return;
            }

            adminCompressBtn.disabled = true;
            adminCompressBtn.textContent = '🔄 軽量化処理中... 絶対に画面を閉じないでください！';

            let successCount = 0;

            // 1枚ずつ順番に処理する
            for (let i = 0; i < allCards.length; i++) {
                const card = allCards[i];
                
                await new Promise((resolve) => {
                    const img = new Image();
                    img.crossOrigin = "Anonymous"; // エラー回避
                    img.onload = () => {
                        // 横幅が1800px（scale: 1.5相当）より大きい重い画像だけを縮小対象にする
                        if (img.width > 1800) {
                            const canvas = document.createElement('canvas');
                            const ctx = canvas.getContext('2d');
                            
                            // 横幅を1800pxに縮小し、縦幅をそれに合わせる
                            const targetWidth = 1800;
                            const targetHeight = img.height * (1800 / img.width);
                            
                            canvas.width = targetWidth;
                            canvas.height = targetHeight;
                            
                            // キャンバスに縮小して描画
                            ctx.drawImage(img, 0, 0, targetWidth, targetHeight);
                            
                            // 圧縮した新しいデータを作成 (画質80%)
                            const compressedData = canvas.toDataURL('image/jpeg', 0.8);
                            
                            // データベースの画像を上書き
                            database.ref('cards/' + card.id).update({ image: compressedData }).then(() => {
                                successCount++;
                                resolve();
                            }).catch((err) => {
                                console.error(err);
                                resolve();
                            });
                        } else {
                            // すでに軽い画像は何もしないで次へ
                            resolve();
                        }
                    };
                    img.onerror = () => resolve(); // エラーが起きたらスキップ
                    img.src = card.image;
                });
            }
            
            alert(`処理完了！\n${successCount}枚の重いカードを軽量化しました。これでギャラリーの読み込みが速くなります！`);
            adminCompressBtn.disabled = false;
            adminCompressBtn.textContent = '🛠 管理者専用：重いカードを一括軽量化';
        });
    }
}); // <--- DOMContentLoaded ここで終了
