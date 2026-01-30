document.addEventListener('DOMContentLoaded', async function() {
    
    // 1. Cek Apakah User Sudah Login?
    const token = localStorage.getItem('authToken') || sessionStorage.getItem('authToken');
    
    if (!token) {
        alert("Anda belum login! Mengalihkan ke halaman login...");
        window.location.href = 'login.html';
        return;
    }

    // Ambil Elemen Input dari HTML
    const inpCompany  = document.getElementById('companyName');
    const inpEmail    = document.getElementById('email');
    const inpUsername = document.getElementById('username');
    const inpPhone    = document.getElementById('phoneNumber');
    const inpAddress  = document.getElementById('address');
    const formProfile = document.getElementById('profileForm');
    const btnSimpan   = document.getElementById('btnSimpan');

    // ==========================================
    // FUNGSI 1: LOAD DATA SAAT HALAMAN DIBUKA
    // ==========================================
    async function loadProfileData() {
        try {
            // Panggil Endpoint GET /users/profile
            const response = await fetch(ENDPOINTS.PROFILE, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`, // Wajib bawa token
                    'Content-Type': 'application/json'
                }
            });

            if (response.ok) {
                const data = await response.json();
                
                // Masukkan data dari database ke dalam kotak input
                inpCompany.value  = data.companyName || '';
                inpEmail.value    = data.email || '';
                inpUsername.value = data.username || '';
                inpPhone.value    = data.phoneNumber || ''; // Pastikan Backend kirim field ini
                inpAddress.value  = data.address || '';     // Pastikan Backend kirim field ini

                console.log("✅ Data profil berhasil dimuat");
            } else {
                // Jika token expired (403/401), tendang ke login
                if(response.status === 401 || response.status === 403) {
                    localStorage.removeItem('authToken');
                    window.location.href = 'login.html';
                }
            }
        } catch (error) {
            console.error("Gagal load profile:", error);
        }
    }

    // Jalankan fungsi load data
    loadProfileData();

    // ==========================================
    // FUNGSI 2: SIMPAN DATA (UPDATE)
    // ==========================================
    if (formProfile) {
        formProfile.addEventListener('submit', async function(e) {
            e.preventDefault(); // Mencegah reload halaman
            
            // Ubah tombol jadi Loading
            const textAsli = btnSimpan.innerText;
            btnSimpan.innerText = "Menyimpan...";
            btnSimpan.disabled = true;

            // Siapkan data yang mau dikirim ke Backend
            const dataUpdate = {
                companyName: inpCompany.value,
                email: inpEmail.value,
                phoneNumber: inpPhone.value,
                address: inpAddress.value
                // Username tidak kita kirim karena biasanya tidak boleh diubah
            };

            try {
                // Panggil Endpoint PUT /users/profile
                const response = await fetch(ENDPOINTS.PROFILE, {
                    method: 'PUT',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(dataUpdate)
                });

                if (response.ok) {
                    alert("✅ Profil berhasil diperbarui!");
                    
                    // Update LocalStorage biar data di browser juga fresh
                    localStorage.setItem('companyName', dataUpdate.companyName);
                } else {
                    const errorText = await response.text();
                    alert("❌ Gagal update: " + errorText);
                }

            } catch (error) {
                console.error(error);
                alert("❌ Terjadi kesalahan koneksi ke server.");
            } finally {
                // Balikin tombol seperti semula
                btnSimpan.innerText = textAsli;
                btnSimpan.disabled = false;
            }
        });
    }
});