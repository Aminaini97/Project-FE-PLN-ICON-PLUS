// Toggle password visibility
const togglePassword = document.querySelector('.toggle-password');
const passwordInput = document.querySelector('input[name="password"]');

    if(togglePassword) {
        togglePassword.addEventListener('click', function (e) {
            const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
            passwordInput.setAttribute('type', type);
            this.classList.toggle('fa-eye');
            this.classList.toggle('fa-eye-slash');
        });
    }

// Handle form submission for registration (local storage)
const registerForm = document.querySelector('form');

        registerForm.addEventListener('submit', function(e) {
            e.preventDefault(); // Mencegah form reload halaman

            // Ambil data yang diketik user
            const companyName = document.querySelector('input[name="company_name"]').value;
            const email = document.querySelector('input[name="email"]').value;
            const username = document.querySelector('input[name="username"]').value;

            // Simpan ke "Memori Browser" (LocalStorage)
            localStorage.setItem('my_company', companyName);
            localStorage.setItem('my_email', email);
            localStorage.setItem('my_username', username);

            alert('Pendaftaran Berhasil! Data tersimpan sementara.');
            
            // Pindahkan ke halaman Profile untuk membuktikan (atau ke Login)
            window.location.href = 'profile.html'; 
        });

// Load data dari LocalStorage ke halaman Profile
window.addEventListener('load', function() {
     // 1. Ambil data dari Memori Browser
    const savedCompany = localStorage.getItem('my_company');
    const savedEmail = localStorage.getItem('my_email');
    const savedUsername = localStorage.getItem('my_username');

    // 2. Jika ada datanya, masukkan ke kolom input
    if (savedCompany) {
        document.querySelector('input[name="company_name"]').value = savedCompany;
    }
            
    if (savedEmail) {
        document.querySelector('input[name="email"]').value = savedEmail;
    }

    if (savedUsername) {
        document.querySelector('input[name="username"]').value = savedUsername;
    }
});


