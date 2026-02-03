document.addEventListener("DOMContentLoaded", function() {
    // --- LOGIKA PENCARIAN NOTIFIKASI ---
    const searchInput = document.getElementById('searchInput');
    const notifList = document.getElementById('notifList');
    
    // Pastikan elemen ada sebelum menjalankan script
    if (searchInput && notifList) {
        const cards = notifList.getElementsByClassName('notif-card');

        searchInput.addEventListener('keyup', function(e) {
            const term = e.target.value.toLowerCase(); // Ambil input tanpa peka huruf besar/kecil

            Array.from(cards).forEach(function(card) {
                // Ambil teks dari status dan isi pesan
                const status = card.querySelector('.status-label').textContent.toLowerCase();
                const message = card.querySelector('.msg-text').textContent.toLowerCase();

                // Cek apakah term ada di dalam teks
                if (status.indexOf(term) !== -1 || message.indexOf(term) !== -1) {
                    card.style.display = 'flex'; // Tampilkan sesuai layout flex asli
                } else {
                    card.style.display = 'none'; // Sembunyikan yang tidak cocok
                }
            });
        });
    }
});