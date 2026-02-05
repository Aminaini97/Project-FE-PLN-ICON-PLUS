document.addEventListener("DOMContentLoaded", function() {
    
    // --- 1. KONFIGURASI DATA ---
    const maxkWh = 500; 
    const tarifPerkWh = 1444.70; 
    let currentkWh = 100; 

    // Database dummy untuk simulasi filter perangkat
    const dbPerangkat = [
        { nama: "AC", area: "ruang meeting", jumlah: 2, kategori: "ac" },
        { nama: "TV", area: "laboratorium", jumlah: 1, kategori: "elektronik" },
        { nama: "Lampu", area: "kantor pusat", jumlah: 2, kategori: "lampu" },
        { nama: "Proyektor", area: "ruang meeting", jumlah: 1, kategori: "elektronik" },
        { nama: "Stop Kontak", area: "lab", jumlah: 2, kategori: "elektronik" }
    ];

    const dataNotifikasi = [
        { 
            status: "SIAGA", 
            pesan: "Perangkat AC Ruang Meeting menunjukkan konsumsi arus tidak stabil. Periksa kondisi unit!", 
            tipe: "alert" 
        }
    ];

    // --- 2. FUNGSI LOGIKA FILTER PERANGKAT ---
    function updateManajemenPerangkat() {
        const triggerArea = document.querySelector('#filterArea .dropdown-trigger').innerText.trim().toLowerCase();
        const triggerKat = document.querySelector('#filterKategori .dropdown-trigger').innerText.trim().toLowerCase();

        // Tentukan nilai seleksi (default 'area' atau 'kategori perangkat' dianggap 'semua')
        const selectedArea = triggerArea === "area" ? "semua" : triggerArea;
        const selectedKat = triggerKat === "kategori perangkat" ? "semua" : 
                            triggerKat.includes("ac") ? "ac" : 
                            triggerKat.includes("lampu") ? "lampu" : "elektronik";

        const deviceItems = document.querySelectorAll('.info-card-detail:last-child .parameter-item');

        deviceItems.forEach(item => {
            const namaPerangkat = item.querySelector('.item-label span:first-child').innerText.trim();
            const countText = item.querySelector('.count-text');
            const barFill = item.querySelector('.progress-fill');
            
            // Cari data di database dummy
            const data = dbPerangkat.find(d => d.nama === namaPerangkat);
            let finalJumlah = 0;

            if (data) {
                // Logika Filter Terikat: Cocokkan Area DAN Kategori
                const matchArea = (selectedArea === "semua" || data.area === selectedArea);
                const matchKat = (selectedKat === "semua" || data.kategori === selectedKat);

                if (matchArea && matchKat) {
                    finalJumlah = data.jumlah;
                }
            }

            // Update Tampilan
            countText.innerText = `${finalJumlah} Perangkat`;
            barFill.style.width = finalJumlah > 0 ? (finalJumlah * 35) + '%' : '0%';
        });
    }

    // --- 3. LOGIKA DROPDOWN (FILTER & EKSPOR) ---
    const dropdowns = document.querySelectorAll('.custom-dropdown');

    dropdowns.forEach(dropdown => {
        const trigger = dropdown.querySelector('button');
        
        trigger.addEventListener('click', (e) => {
            e.stopPropagation();
            dropdowns.forEach(d => {
                if (d !== dropdown) d.classList.remove('active');
            });
            dropdown.classList.toggle('active');
        });

        const items = dropdown.querySelectorAll('.dropdown-menu li');
        items.forEach(item => {
            item.addEventListener('click', () => {
                if (!dropdown.id.includes('exportMenu')) {
                    trigger.innerHTML = `${item.innerText} <i class="fa-solid fa-caret-down"></i>`;
                    // Jalankan update filter setiap kali dropdown ditekan
                    updateManajemenPerangkat();
                }
                dropdown.classList.remove('active');
            });
        });
    });

    window.addEventListener('click', () => {
        dropdowns.forEach(d => d.classList.remove('active'));
    });

    // --- 4. FUNGSI PERKIRAAN BIAYA ---
    function updateCostPrediction(kWhValue) {
        const costEl = document.getElementById('totalCost');
        if (costEl) {
            const totalCost = Math.round(kWhValue * tarifPerkWh);
            const formatter = new Intl.NumberFormat('id-ID', {
                style: 'currency',
                currency: 'IDR',
                minimumFractionDigits: 0
            });
            costEl.textContent = formatter.format(totalCost).replace("IDR", "Rp") + ",-";
        }
    }

    // --- 5. UPDATE WAKTU REAL-TIME ---
    function updateDashboardTime() {
        const now = new Date();
        const clockEl = document.getElementById('clockText');
        const dateEl = document.getElementById('dateText');

        if (clockEl) {
            const hours = String(now.getHours()).padStart(2, '0');
            const minutes = String(now.getMinutes()).padStart(2, '0');
            clockEl.textContent = `${hours}:${minutes}`;
        }

        if (dateEl) {
            const options = { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' };
            dateEl.textContent = now.toLocaleDateString('id-ID', options);
        }
    }

    // --- 6. GRAFIK DONAT (KONSUMSI SAAT INI) ---
    function initEnergyDonutChart() {
        const chartCanvas = document.getElementById('energyPieChart');
        if (!chartCanvas) return;

        const ctx = chartCanvas.getContext('2d');
        window.energyChart = new Chart(ctx, {
            type: 'doughnut',
            data: {
                datasets: [{
                    data: [currentkWh, maxkWh - currentkWh],
                    backgroundColor: ['#00B0F2', '#F0F2F5'], 
                    borderWidth: 0,
                    circumference: 270, 
                    rotation: 225, 
                    borderRadius: 10,
                    cutout: '85%'
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    tooltip: { enabled: false },
                    legend: { display: false }
                }
            }
        });
    }

    // --- 7. GRAFIK GARIS (TREN BULANAN) ---
    function initMainLineChart() {
        const chartCanvas = document.getElementById('mainEnergyChart');
        if (!chartCanvas) return;

        const ctx = chartCanvas.getContext('2d');
        const gradient = ctx.createLinearGradient(0, 0, 0, 400);
        gradient.addColorStop(0, 'rgba(0, 176, 242, 0.2)');
        gradient.addColorStop(1, 'rgba(0, 176, 242, 0)');

        new Chart(ctx, {
            type: 'line',
            data: {
                labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
                datasets: [{
                    label: 'Konsumsi Energi (kWh)',
                    data: [200, 350, 380, 340, 470, 440, 580, 610, 570, 490, 550, 850],
                    borderColor: '#00B0F2',
                    backgroundColor: gradient,
                    fill: true,
                    borderWidth: 1,
                    tension: 0.4,
                    pointRadius: 3,
                    pointBackgroundColor: '#00B0F2',
                    pointBorderColor: '#FFFFFF',
                    pointBorderWidth: 1
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { display: false }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        max: 1000,
                        ticks: { 
                            stepSize: 100, 
                            color: '#A3AED0',
                            font: { size: 10, weight: '500' }
                        },
                        grid: { color: '#E0E4E8', drawBorder: false }
                    },
                    x: {
                        ticks: { 
                            color: '#A3AED0',
                            font: { size: 10, weight: '500' }
                        },
                        grid: { display: false }
                    }
                }
            }
        });
    }

    // --- 8. FUNGSI UPDATE DATA (REFRESH) ---
    window.updateEnergyData = function() {
        const energyValEl = document.getElementById('energyValue');
        const newValue = Math.floor(Math.random() * maxkWh); 
        
        if (energyValEl) {
            energyValEl.textContent = newValue;
        }
        
        if (window.energyChart) {
            window.energyChart.data.datasets[0].data = [newValue, maxkWh - newValue]; 
            window.energyChart.update();
        }

        updateCostPrediction(newValue);
    };

    // --- EKSEKUSI AWAL ---
    initEnergyDonutChart();
    initMainLineChart();
    updateDashboardTime();
    updateCostPrediction(currentkWh);
    updateManajemenPerangkat(); // Jalankan filter awal
    setInterval(updateDashboardTime, 1000); 

    // Render Banner Notifikasi
    const banner = document.getElementById('latestNotifBanner');
    if (banner && dataNotifikasi.length > 0) {
        banner.innerHTML = `
            <div class="dashboard-notif-banner ${dataNotifikasi[0].tipe}">
                <i class="fa-solid fa-triangle-exclamation"></i>
                <p><strong>[${dataNotifikasi[0].status}]</strong> ${dataNotifikasi[0].pesan}</p>
            </div>`;
    }
});

function handleExport(format) {
    alert("Data sedang diekspor ke format " + format);
}