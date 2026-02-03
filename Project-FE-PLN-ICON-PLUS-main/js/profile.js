// 1. Ambil elemen modal Profil
const modal = document.getElementById("profileModal");
const profileIcon = document.querySelector(".user-profile-wrapper"); 
const btnBatal = document.getElementById("btnBatal"); // Satu-satunya tombol penutup profil

// 2. Ambil elemen modal Sukses & Form
const successModal = document.getElementById("successModal");
const profileForm = modal.querySelector("form");
// Menghapus btnOk karena Anda telah menggantinya dengan tanda silang di HTML
const closeSuccess = document.getElementById("closeSuccess"); 

// --- FUNGSI MODAL PROFIL ---

// Buka Modal Profil (Gunakan flex agar rata tengah tetap bekerja)
profileIcon.onclick = function() {
    modal.style.display = "flex"; 
}

// Fungsi menutup modal (Universal)
function closeModal() {
    modal.style.display = "none";
}

// PERBAIKAN: Hanya pasang event pada tombol Batal yang ada di HTML
if (btnBatal) {
    btnBatal.onclick = closeModal;
}

// --- FUNGSI SIMPAN & SUKSES ---

// Logika saat tombol "Simpan Perubahan" diklik
profileForm.onsubmit = function(event) {
    event.preventDefault(); // Mencegah halaman refresh otomatis
    
    // Tutup modal profil
    closeModal();
    
    // Tampilkan modal sukses (Gunakan flex agar rata tengah)
    if (successModal) {
        successModal.style.display = "flex";
    }
}

// Tutup modal sukses saat klik tanda silang (closeSuccess)
if (closeSuccess) {
    closeSuccess.onclick = function() {
        successModal.style.display = "none";
    }
}
