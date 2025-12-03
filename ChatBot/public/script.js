document.addEventListener('DOMContentLoaded', () => {

    // ==========================================
    // 1. 🔥 PAKSA NYALAKAN EFEK 3D (NEW FIX) 🔥
    // ==========================================
    const card3d = document.querySelector(".card-3d");

    if (card3d) {
        // Cek apakah mesin 3D (VanillaTilt) sudah ada?
        if (typeof VanillaTilt === 'undefined') {
            console.log("Mesin 3D belum ada, sedang download manual...");
            
            // Kita suntikkan scriptnya secara paksa
            const script = document.createElement('script');
            script.src = "https://cdnjs.cloudflare.com/ajax/libs/vanilla-tilt/1.7.0/vanilla-tilt.min.js";
            
            // Tunggu script selesai download, baru nyalakan
            script.onload = () => {
                console.log("Mesin 3D Siap! Menyalakan...");
                VanillaTilt.init(card3d, {
                    max: 35,        // Kemiringan ekstrem
                    speed: 400,     // Kecepatan gerak
                    glare: true,    // Efek kilau kaca
                    "max-glare": 0.5,
                    perspective: 1000
                });
            };
            document.body.appendChild(script);
        } else {
            // Kalau sudah ada, langsung gas!
            VanillaTilt.init(card3d, { max: 35, speed: 400, glare: true, "max-glare": 0.5 });
        }
    }

    // ==========================================
    // 2. INISIALISASI ANIMASI SCROLL (AOS)
    // ==========================================
    if (typeof AOS !== 'undefined') {
        AOS.init({ duration: 1000, once: false });
    }

    // Efek Klik Muncul Hati
    document.addEventListener('click', (e) => {
        if (e.target.tagName === 'BUTTON' || e.target.closest('button')) return;
        const heart = document.createElement('div');
        heart.classList.add('click-heart');
        heart.innerHTML = '❤️';
        heart.style.left = e.pageX + 'px';
        heart.style.top = e.pageY + 'px';
        document.body.appendChild(heart);
        setTimeout(() => heart.remove(), 1000);
    });

// ==========================================
    // 🎵 FITUR MUSIC PLAYER (PLAYLIST KAPSUL)
    // ==========================================
    const audio = document.getElementById('audio');
    const playBtn = document.getElementById('play-btn');
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');
    const songTitle = document.getElementById('song-title');

    // --- DAFTAR LAGU KAMU ---
    // Pastikan nama file di sini SAMA PERSIS dengan di folder assets
    const songs = [
        { file: 'assets/music1.mp3', title: '🎵 Lagu Pertama - penjaga hatimu 1 🎵' },
        { file: 'assets/music2.mp3', title: '🎵 Lagu Kedua - justin bieber 2 🎵' },
        { file: 'assets/music3.mp3', title: '🎵 Lagu Ketiga - bergema selamanya 3 🎵' },
        { file: 'assets/music4.mp3', title: '🎵 Lagu Ketiga - kota ini tan sama tanpamu 4 🎵' },
    ];

    let songIndex = 0; // Mulai dari lagu pertama

    // Fungsi: Muat info lagu ke layar
    function loadSong(song) {
        if(songTitle) songTitle.innerText = song.title; // Update teks berjalan
        if(audio) audio.src = song.file; // Masukkan file lagu
    }

    // Fungsi: Mainkan
    function playSong() {
        if(audio) {
            audio.play();
            if(playBtn) playBtn.innerHTML = '⏸'; // Ikon Pause
        }
    }

    // Fungsi: Stop/Pause
    function pauseSong() {
        if(audio) {
            audio.pause();
            if(playBtn) playBtn.innerHTML = '▶'; // Ikon Play
        }
    }

    // Fungsi: Lagu Mundur (Previous)
    function prevSong() {
        songIndex--;
        if (songIndex < 0) {
            songIndex = songs.length - 1; // Kalau habis, balik ke terakhir
        }
        loadSong(songs[songIndex]);
        playSong();
    }

    // Fungsi: Lagu Maju (Next)
    function nextSong() {
        songIndex++;
        if (songIndex > songs.length - 1) {
            songIndex = 0; // Kalau habis, balik ke awal
        }
        loadSong(songs[songIndex]);
        playSong();
    }

    // --- JALANKAN SAAT WEB DIBUKA ---
    if (audio) {
        // 1. Siapkan lagu pertama (tapi jangan langsung play biar gak kaget)
        loadSong(songs[songIndex]);

        // 2. Tombol Play/Pause diklik
        if(playBtn) {
            playBtn.addEventListener('click', () => {
                const isPlaying = !audio.paused; // Cek lagi nyala apa enggak
                if (isPlaying) {
                    pauseSong();
                } else {
                    playSong();
                }
            });
        }

        // 3. Tombol Next & Prev diklik
        if(prevBtn) prevBtn.addEventListener('click', prevSong);
        if(nextBtn) nextBtn.addEventListener('click', nextSong);

        // 4. Kalau lagu habis, otomatis lanjut ke lagu berikutnya
        audio.addEventListener('ended', nextSong);
    }
    // ==========================================
    // 4. FITUR CHATBOT BUCIN (SOBRI & REVA)
    // ==========================================
    const chatBox = document.getElementById('chat-box');
    const userInput = document.getElementById('user-input');
    const sendBtn = document.getElementById('send-btn');
    const historyBtn = document.getElementById('history-btn');
    const clearBtn = document.getElementById('clear-btn');

    function appendMessage(text, sender) {
        const div = document.createElement('div');
        div.classList.add('msg', sender);
        div.innerText = text;
        chatBox.appendChild(div);
        chatBox.scrollTop = chatBox.scrollHeight;
        return div;
    }

    if (chatBox) {
        chatBox.innerHTML = ''; 
        appendMessage("Hai Reva sayang! ❤️ Mau ngobrol apa sama pacarmu yang ganteng ini?", 'ai');
    }

    // Tombol Riwayat
    if (historyBtn) {
        historyBtn.addEventListener('click', async () => {
            historyBtn.innerText = "⏳";
            try {
                const res = await fetch('/api/history');
                const history = await res.json();
                chatBox.innerHTML = ''; 
                appendMessage("Membuka lembaran kenangan lama... 📖", 'ai');
                if (history.length === 0) {
                    setTimeout(() => appendMessage("Belum ada riwayat chat nih! 🥰", 'ai'), 1000);
                } else {
                    history.forEach(msg => appendMessage(msg.text, msg.role));
                }
            } catch (err) { alert("Gagal ambil history."); } 
            finally { historyBtn.innerText = "📜"; }
        });
    }

    // Tombol Hapus
    if (clearBtn) {
        clearBtn.addEventListener('click', async () => {
            if (!confirm("Yakin mau hapus semua chat?")) return;
            try {
                await fetch('/api/history', { method: 'DELETE' });
                chatBox.innerHTML = '';
                appendMessage("Chat sudah dihapus. Kita mulai dari nol ya sayang! ❤️", 'ai');
            } catch (err) { alert("Gagal hapus."); }
        });
    }

    // Kirim Pesan
    async function sendMessage() {
        const text = userInput.value.trim();
        if (!text) return;

        appendMessage(text, 'user');
        userInput.value = '';
        const loadingDiv = appendMessage('Sobri lagi ngetik... ❤️', 'ai');

        try {
            const response = await fetch('/api/chat-sobri', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message: text })
            });
            const data = await response.json();
            loadingDiv.remove();
            appendMessage(data.reply, 'ai');
        } catch (error) {
            loadingDiv.remove();
            appendMessage("Sayang, sinyal aku jelek nih... 🥺", 'ai');
        }
    }

    if (sendBtn && userInput) {
        sendBtn.addEventListener('click', sendMessage);
        userInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') sendMessage();
        });
    }
});
// ==========================================
// 📸 FITUR POPUP GALERI (LIGHTBOX)
// ==========================================

// Fungsi Buka Popup
function openModal(element) {
    const modal = document.getElementById("imageModal");
    const modalImg = document.getElementById("img01");
    const captionText = document.getElementById("caption");

    // Ambil data foto & cerita dari elemen yang diklik
    const imgSrc = element.getAttribute("data-img");
    const story = element.getAttribute("data-caption");

    // Tampilkan
    modal.style.display = "block";
    modalImg.src = imgSrc;
    captionText.innerText = story ? story : "Kenangan manis kita ❤️"; // Default text
}

// Fungsi Tutup Popup
function closeModal() {
    const modal = document.getElementById("imageModal");
    modal.style.display = "none";
}

// Tutup kalau klik sembarang tempat (di area hitam)
window.onclick = function(event) {
    const modal = document.getElementById("imageModal");
    if (event.target == modal) {
        modal.style.display = "none";
    }
}