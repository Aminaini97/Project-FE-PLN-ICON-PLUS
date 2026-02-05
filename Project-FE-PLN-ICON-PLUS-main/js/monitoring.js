/* =========================================
   MONITORING LOGIC - FULL INTEGRATED
   ========================================= */

document.addEventListener("DOMContentLoaded", function() {
    
    // --- 1. INISIALISASI ELEMEN ---
    const dropdowns = document.querySelectorAll('.custom-dropdown');
    const timestampEl = document.querySelector('.timestamp');
    const paramValues = document.querySelectorAll('.param-value');
    const tableBody = document.getElementById('logTableBody');

    // --- 2. LOGIKA DROPDOWN INTERAKTIF (FILTER & EKSPOR) ---
    dropdowns.forEach(dropdown => {
        const trigger = dropdown.querySelector('button');
        
        if (trigger) {
            trigger.addEventListener('click', (e) => {
                e.stopPropagation();
                dropdowns.forEach(d => {
                    if (d !== dropdown) d.classList.remove('active');
                });
                dropdown.classList.toggle('active');
            });
        }

        const menuItems = dropdown.querySelectorAll('.dropdown-menu li');
        menuItems.forEach(item => {
            item.addEventListener('click', () => {
                if (!dropdown.id.includes('exportMenu') && trigger) {
                    trigger.innerHTML = `${item.innerText} <i class="fa-solid fa-caret-down"></i>`;
                }
                dropdown.classList.remove('active');
            });
        });
    });

    window.addEventListener('click', () => {
        dropdowns.forEach(d => d.classList.remove('active'));
    });

    // --- 3. FUNGSI UPDATE WAKTU REAL-TIME ---
    function updateRealTimeClock() {
        if (timestampEl) {
            const now = new Date();
            const d = String(now.getDate()).padStart(2, '0');
            const m = String(now.getMonth() + 1).padStart(2, '0');
            const y = now.getFullYear();
            const hrs = String(now.getHours()).padStart(2, '0');
            const min = String(now.getMinutes()).padStart(2, '0');
            const sec = String(now.getSeconds()).padStart(2, '0');
            
            timestampEl.textContent = `${d}/${m}/${y} ${hrs}:${min}:${sec}`;
        }
    }

    // --- 4. SIMULASI UPDATE DATA PARAMETER ---
    function simulateParameterUpdate() {
        const units = ['A', 'V', 'kWh', 'φ', 'kWh'];
        paramValues.forEach((el, index) => {
            let newVal;
            if (index === 0) newVal = (230 + Math.random() * 10).toFixed(0); 
            else if (index === 1) newVal = (445 + Math.random() * 10).toFixed(0); 
            else if (index === 2) newVal = (940 + Math.random() * 20).toFixed(0); 
            else if (index === 3) newVal = (0.94 + Math.random() * 0.02).toFixed(2); 
            else newVal = "4.200"; 

            el.innerHTML = `${newVal}<span>${units[index]}</span>`;
        });
    }

    // --- 5. INISIALISASI GRAFIK 5 GARIS ---
    function initMonitoringChart() {
        const chartCtx = document.getElementById('multiLineChart');
        if (!chartCtx) return;

        const ctx = chartCtx.getContext('2d');
        
        const dataKelistrikan = {
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
            datasets: [
                {
                    label: 'Arus',
                    data: Array(12).fill(900),
                    borderColor: '#192434',
                    borderWidth: 1,
                    tension: 0.5,
                    pointRadius: 3,
                    pointBackgroundColor: '#192434',
                    pointBorderColor: '#FFFFFF',
                    pointBorderWidth: 1,
                    fill: false
                },
                {
                    label: 'Tegangan',
                    data: Array(12).fill(800),
                    borderColor: '#00B0F2', 
                    borderWidth: 1,
                    tension: 0.5,
                    pointRadius: 3,
                    pointBackgroundColor: '#00B0F2',
                    pointBorderColor: '#FFFFFF',
                    pointBorderWidth: 1,
                    fill: false
                },
                {
                    label: 'Daya',
                    data: Array(12).fill(700),
                    borderColor: '#616D7C', 
                    borderWidth: 1,
                    tension: 0.5,
                    pointRadius: 3,
                    pointBackgroundColor: '#616D7C',
                    pointBorderColor: '#FFFFFF',
                    pointBorderWidth: 1,
                    fill: false
                },
                {
                    label: 'Faktor Daya',
                    data: Array(12).fill(600),
                    borderColor: '#616D7C', 
                    borderWidth: 1,
                    borderDash: [5, 5],
                    tension: 0.5,
                    pointRadius: 3,
                    pointBackgroundColor: '#616D7C',
                    pointBorderColor: '#FFFFFF',
                    pointBorderWidth: 1,
                    fill: false
                },
                {
                    label: 'Load Peak',
                    data: Array(12).fill(500),
                    borderColor: '#00B0F2',
                    borderWidth: 1,
                    borderDash: [5, 5], 
                    tension: 0.5,
                    pointRadius: 3,
                    pointBackgroundColor: '#00B0F2',
                    pointBorderColor: '#FFFFFF',
                    pointBorderWidth: 1,
                    fill: false
                }
            ]
        };

        new Chart(ctx, {
            type: 'line',
            data: dataKelistrikan,
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
                        ticks: { stepSize: 100, color: '#A3AED0', font: { size: 10 } },
                        grid: { color: '#E0E4E8', drawBorder: false }
                    },
                    x: {
                        ticks: { color: '#A3AED0', font: { size: 10 } },
                        grid: { display: false }
                    }
                }
            }
        });
    }

    // --- 6. FUNGSI RIWAYAT LOG KELISTRIKAN ---
    function renderLogTable() {
        if (!tableBody) return;

        const logData = [
            { no: 1, waktu: "11/06/2025", area: "Semua", kategori: "Semua", arus: 235, tegangan: 450, daya: 950, faktor: 0.95, puncak: "420.000" },
            { no: 2, waktu: "11/06/2025", area: "Semua", kategori: "Semua", arus: 235, tegangan: 450, daya: 950, faktor: 0.95, puncak: "420.000" },
            { no: 3, waktu: "11/06/2025", area: "Semua", kategori: "Semua", arus: 235, tegangan: 450, daya: 950, faktor: 0.95, puncak: "420.000" },
            { no: 4, waktu: "11/06/2025", area: "Semua", kategori: "Semua", arus: 235, tegangan: 450, daya: 950, faktor: 0.95, puncak: "420.000" },
            { no: 5 , waktu: "11/06/2025", area: "Semua", kategori: "Semua", arus: 235, tegangan: 450, daya: 950, faktor: 0.95, puncak: "420.000" }
        ];

        tableBody.innerHTML = logData.map(data => `
            <tr>
                <td>${data.no}</td>
                <td>${data.waktu}</td>
                <td>${data.area}</td>
                <td>${data.kategori}</td>
                <td>${data.arus}</td>
                <td>${data.tegangan}</td>
                <td>${data.daya}</td>
                <td>${data.faktor}</td>
                <td>${data.puncak}</td>
            </tr>
        `).join('');
    }

    // --- 7. EKSEKUSI AWAL & INTERVAL ---
    updateRealTimeClock();
    simulateParameterUpdate();
    initMonitoringChart();
    renderLogTable();

    setInterval(updateRealTimeClock, 1000);    
    setInterval(simulateParameterUpdate, 5000); 
});

// FUNGSI EKSPOR GLOBAL (DI LUAR DOMContentLoaded)
function handleExport(format) {
    alert("Menyiapkan dokumen Monitoring Kelistrikan dalam format: " + format);
}