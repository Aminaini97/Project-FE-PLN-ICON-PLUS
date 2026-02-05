/* =========================================
   MANAJEMEN PERANGKAT - INTEGRATED LOGIC
   ========================================= */

document.addEventListener("DOMContentLoaded", function() {
    
    // --- 1. INISIALISASI ELEMEN ---
    const dropdowns = document.querySelectorAll('.custom-dropdown');
    const deviceToggles = document.querySelectorAll('.toggle-input');
    const categoryParents = document.querySelectorAll('.category-row.parent');

    // --- 2. LOGIKA DROPDOWN INTERAKTIF ---
    dropdowns.forEach(dropdown => {
        const trigger = dropdown.querySelector('.dropdown-trigger');
        const menuItems = dropdown.querySelectorAll('.dropdown-menu li');
        
        if (trigger) {
            trigger.addEventListener('click', (e) => {
                e.stopPropagation();
                dropdowns.forEach(d => { 
                    if (d !== dropdown) d.classList.remove('active'); 
                });
                dropdown.classList.toggle('active');
            });
        }

        menuItems.forEach(item => {
            item.addEventListener('click', () => {
                const selectedText = item.innerText;
                if (trigger) {
                    trigger.innerHTML = `${selectedText} <i class="fa-solid fa-caret-down"></i>`;
                }
                dropdown.classList.remove('active');
                console.log(`Filter applied: ${selectedText}`);
            });
        });
    });

    // --- 3. LOGIKA TOMBOL SAKELAR (ON/OFF) ---
    function updateToggleStyle(toggle) {
        const label = toggle.nextElementSibling; 
        if (!label) return;

        const handle = label.querySelector('.toggle-handle');
        const textOn = label.querySelector('.on');   
        const textOff = label.querySelector('.off'); 

        if (toggle.checked) {
            // STATUS: ON (Handle di kiri - Biru)
            if (handle) {
                handle.style.backgroundColor = '#00B0F2'; 
                handle.style.transform = 'translateX(0)'; 
            }
            if (textOn) textOn.style.color = '#FFFFFF';
            if (textOff) textOff.style.color = '#4B5563';
        } else {
            // STATUS: OFF (Handle di kanan - Abu-abu)
            if (handle) {
                handle.style.backgroundColor = '#A3AED0'; 
                handle.style.transform = 'translateX(100%)'; 
            }
            if (textOn) textOn.style.color = '#4B5563';
            if (textOff) textOff.style.color = '#FFFFFF';
        }
    }

    deviceToggles.forEach(toggle => {
        // Inisialisasi posisi awal (Default OFF jika tidak ada attribute checked)
        updateToggleStyle(toggle);

        // Listener perubahan status
        toggle.addEventListener('change', function() {
            updateToggleStyle(this);
            console.log(`Perangkat [${this.id}] berubah menjadi: ${this.checked ? 'ON' : 'OFF'}`);
        });
    });

    // --- 4. LOGIKA AKORDEON (COLLAPSE) TABEL KATEGORI ---
    categoryParents.forEach(parent => {
        parent.addEventListener('click', function(e) {
            // Mencegah klik pada area toggle switch memicu collapse
            if (e.target.closest('.toggle-container') || e.target.closest('.action-dots')) {
                return;
            }

            const group = this.parentElement;
            const subContainer = group.querySelector('.sub-category-container');
            const icon = this.querySelector('.icon-toggle');

            if (subContainer) {
                const isHidden = subContainer.style.display === "none" || subContainer.style.display === "";
                
                if (isHidden) {
                    subContainer.style.display = "block";
                    if (icon) icon.style.transform = "rotate(0deg)";
                } else {
                    subContainer.style.display = "none";
                    if (icon) icon.style.transform = "rotate(-90deg)";
                }
            }
        });
    });

    // --- 5. GLOBAL CLICK HANDLER ---
    window.addEventListener('click', () => {
        // Tutup semua dropdown jika klik di luar area
        dropdowns.forEach(d => d.classList.remove('active'));
    });
});