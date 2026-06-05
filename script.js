// ==========================================
// 1. KONFIGURASI URL API BACKEND (INFINITYFREE)
// ==========================================
const URL_API_AMBIL = 'http://emerald.howto.rocks/ambil_ucapan.php';
const URL_API_SIMPAN = 'http://emerald.howto.rocks/simpan_ucapan.php';

// Dom Elements
const formUcapan = document.getElementById('form-ucapan');
const commentsContainer = document.getElementById('comments-container');
const bgMusik = document.getElementById('musik-undangan'); // Pastiin tag <audio> lu punya id ini
const btnMusik = document.getElementById('btn-kontrol-musik'); // Pastiin tombol musik lu punya id ini

// ==========================================
// 2. FUNGSI MENAMPILKAN HISTORY UCAPAN DARI DATABASE
// ==========================================
function muatUcapan() {
    fetch(URL_API_AMBIL)
        .then(response => {
            if (!response.ok) {
                throw new Error('Jaringan bermasalah saat mengambil data.');
            }
            return response.json();
        })
        .then(data => {
            // Kosongkan wadah ucapan yang lama
            commentsContainer.innerHTML = ''; 
            
            // Jika belum ada data ucapan di database
            if (data.length === 0) {
                commentsContainer.innerHTML = '<p class="no-comment">Belum ada ucapan. Jadi yang pertama mengirim doa!</p>';
                return;
            }

            // Looping data ucapan dan render satu per satu ke HTML
            data.forEach(item => {
                const card = document.createElement('div');
                card.className = 'comment-card';
                card.innerHTML = `
                    <h4>${escapeHTML(item.nama)}</h4>
                    <p>${escapeHTML(item.ucapan)}</p>
                    <small>${item.waktu}</small>
                `;
                commentsContainer.appendChild(card);
            });
        })
        .catch(error => {
            console.error('Gagal memuat ucapan:', error);
            commentsContainer.innerHTML = '<p class="no-comment">Gagal memuat daftar ucapan.</p>';
        });
}

// Fungsi pengaman (XSS Protection) agar tamu gak bisa masukin script aneh-aneh di form
function escapeHTML(str) {
    return str.replace(/[&<>'"]/g, 
        tag => ({
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            "'": '&#39;',
            '"': '&quot;'
        }[tag] || tag)
    );
}

// ==========================================
// 3. FUNGSI KIRIM UCAPAN BARU (SUBMIT FORM)
// ==========================================
if (formUcapan) {
    formUcapan.addEventListener('submit', function(e) {
        e.preventDefault(); // Mencegah halaman reload otomatis

        const formData = new FormData(formUcapan);

        fetch(URL_API_SIMPAN, {
            method: 'POST',
            body: formData // Mengirim data nama & ucapan di background
        })
        .then(response => response.json())
        .then(res => {
            if (res.status === 'success') {
                alert(res.message);
                formUcapan.reset(); // Mengosongkan kembali form inputan setelah sukses
                muatUcapan();       // Refresh daftar ucapan agar pesan baru langsung muncul
            } else {
                alert('Gagal mengirim: ' + res.message);
            }
        })
        .catch(error => {
            console.error('Error saat mengirim ucapan:', error);
            alert('Terjadi kesalahan jaringan saat mengirim ucapan.');
        });
    });
}

// ==========================================
// 4. KONTROL AUDIO / MUSIK LATAR (OPSIONAL)
// ==========================================
if (btnMusik && bgMusik) {
    btnMusik.addEventListener('click', function() {
        if (bgMusik.paused) {
            bgMusik.play();
            btnMusik.classList.remove('paused');
        } else {
            bgMusik.pause();
            btnMusik.classList.add('paused');
        }
    });
}

// ==========================================
// 5. INITIALIZATION (RUN WHEN PAGE LOADED)
// ==========================================
document.addEventListener('DOMContentLoaded', function() {
    // Jalankan fungsi memuat ucapan otomatis saat web pertama kali dibuka
    muatUcapan();
});