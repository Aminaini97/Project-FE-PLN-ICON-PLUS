const registerForm = document.getElementById('registerForm');

if (registerForm) {
    initTogglePassword();
    registerForm.addEventListener('submit', async function(e) {
        e.preventDefault();

        const btnSubmit = document.getElementById('btnSubmit');
        const messageBox = document.getElementById('message');

        setLoading(btnSubmit, messageBox, true, "Memproses Pendaftaran...");

        const requestData = {
            companyName: document.getElementById('companyName').value,
            email: document.getElementById('email').value,
            password: document.getElementById('password').value,
            username: document.getElementById('username').value ,
            address: document.getElementById('address').value,
            phoneNumber: document.getElementById('phoneNumber').value
        };

        try {
            const response = await fetch(ENDPOINTS.REGISTER, { 
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(requestData)
            });

            if (response.ok) {
                showMessage(messageBox, "Registrasi Berhasil!", "success");
                registerForm.reset();
                setTimeout(() => { window.location.href = 'index.html'; }, 1500);
            } else {
                const errorText = await response.text();
                showMessage(messageBox, "Gagal: " + errorText, "error");
            }
        } catch (error) {
            console.error(error);
            showMessage(messageBox, "Gagal terhubung ke server.", "error");
        } finally {
            setLoading(btnSubmit, messageBox, false, "Daftar");
        }
    });
}

const loginForm = document.getElementById('loginForm');

if (loginForm) {

    initTogglePassword();

    loginForm.addEventListener('submit', async function(e) {
        e.preventDefault();

        const btnLogin = document.getElementById('btnLogin');
        const messageBox = document.getElementById('loginMessage');

        setLoading(btnLogin, messageBox, true, "Sedang Masuk...");

        const loginData = {
            username: document.getElementById('username').value,
            password: document.getElementById('password').value
        };

        try {
            const response = await fetch(ENDPOINTS.LOGIN, { 
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(loginData)
            });

            const contentType = response.headers.get("content-type");
            let data;
            
            if (contentType && contentType.indexOf("application/json") !== -1) {
                data = await response.json(); 
            } else {
                data = { message: await response.text() }; 
            }

            if (response.ok) {
                showMessage(messageBox, "Login Berhasil! Mengalihkan...", "success");

                const token = data.token;
                const user = data.user;

                const rememberMeCheckbox = document.getElementById('rememberMe');
                const isRemembered = rememberMeCheckbox && rememberMeCheckbox.checked;

                if (isRemembered) {
                    localStorage.setItem('authToken', token);
                    localStorage.setItem('username', user.username);
                    localStorage.setItem('companyName', user.companyName);
                } else {
                    sessionStorage.setItem('authToken', token);
                    sessionStorage.setItem('username', user.username);
                    sessionStorage.setItem('companyName', user.companyName);
                }

                setTimeout(() => { window.location.href = 'index.html'; }, 1000);
            } else {
                const errorMsg = data.message || "Gagal Login.";
                showMessage(messageBox, errorMsg, "error");
            }

        } catch (error) {
            console.error(error);
            showMessage(messageBox, "Gagal terhubung ke server.", "error");
        } finally {
            setLoading(btnLogin, messageBox, false, "Masuk");
        }
    });
}

const sectionRequest = document.getElementById('section-request-email');
const sectionReset   = document.getElementById('section-reset-password');

if (sectionRequest && sectionReset) {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('token');
    const msgBox = document.getElementById('msgBox');

    initTogglePassword(); 

    if (token) {
        sectionRequest.style.display = 'none';
        sectionReset.style.display = 'block';
    } else {
        sectionRequest.style.display = 'block';
        sectionReset.style.display = 'none';
    }

    const formRequest = document.getElementById('formRequestEmail');
    if (formRequest) {
        formRequest.addEventListener('submit', async function(e) {
            e.preventDefault();
            const btn = document.getElementById('btnRequest');
            const emailVal = document.getElementById('emailInput').value;

            console.log("📧 Email yang diambil: ", emailVal);
            console.log("🔗 Mengirim ke URL: ", ENDPOINTS.FORGOT_PASSWORD);

            setLoading(btn, msgBox, true, "Mengirim...");

            try {
                const response = await fetch(`${ENDPOINTS.FORGOT_PASSWORD}?email=${emailVal}`, {
                    method: 'POST'
                });
                
                const textRes = await response.text();

                if (response.ok) {
                    showMessage(msgBox, "✅ Cek email Anda! Link reset telah dikirim.", "success");
                    formRequest.reset();
                } else {
                    showMessage(msgBox, "❌ " + textRes, "error");
                }
            } catch (error) {
                console.error(error);
                showMessage(msgBox, "❌ Gagal terhubung ke server.", "error");
            } finally {
                setLoading(btn, msgBox, false, "Kirim Tautan Reset");
            }
        });
    }

    const formReset = document.getElementById('formResetPassword');
    if (formReset) {
        formReset.addEventListener('submit', async function(e) {
            e.preventDefault();
            const btn = document.getElementById('btnSave');
            const newPass = document.getElementById('newPassword').value;

            if (newPass.length < 6) {
                showMessage(msgBox, "❌ Password minimal 6 karakter!", "error");
                return;
            }

            setLoading(btn, msgBox, true, "Menyimpan...");

            const dataKirim = {
                token: token,
                newPassword: newPass
            };

            try {
                const response = await fetch(ENDPOINTS.RESET_PASSWORD, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(dataKirim)
                });
                
                const textRes = await response.text();

                if (response.ok) {
                    showMessage(msgBox, "✅ Berhasil! Mengalihkan ke Login...", "success");
                    formReset.reset();
                    setTimeout(() => { window.location.href = 'login.html'; }, 2000);
                } else {
                    showMessage(msgBox, "❌ " + textRes, "error");
                }
            } catch (error) {
                console.error(error);
                showMessage(msgBox, "❌ Gagal terhubung ke server.", "error");
            } finally {
                if (btn) setLoading(btn, null, false, "Simpan Kata Sandi");
            }
        });
    }
}

function initTogglePassword() {
    document.querySelectorAll('.toggle-password').forEach(icon => {
        const newIcon = icon.cloneNode(true);
        icon.parentNode.replaceChild(newIcon, icon);

        newIcon.addEventListener('click', function () {
            const passwordInput = this.previousElementSibling;
            if (passwordInput) {
                const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
                passwordInput.setAttribute('type', type);
                this.classList.toggle('fa-eye-slash');
            }
        });
    });
}

function setLoading(button, messageBox, isLoading, text) {
    button.disabled = isLoading;
    button.innerText = text;
    if (isLoading) {
        if(messageBox) {
            messageBox.innerText = "";
            messageBox.className = "message-box";
        }
    }
}

function showMessage(element, text, type) {
    if(element) {
        element.innerText = text;
        element.className = "message-box " + type; 
        
        // Style manual kalau CSS class belum ada
        if (type === 'error') element.style.color = 'red';
        if (type === 'success') element.style.color = 'green';
    }
}