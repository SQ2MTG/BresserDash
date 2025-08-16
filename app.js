const DATA_URL = './wx.json';
const FETCH_INTERVAL = 5000;
const STORAGE_KEY = 'weatherStationHistory';
const DATA_RETENTION_MS = 25 * 60 * 60 * 1000; // 25 hours

let charts = {};

const elements = {
    loadingOverlay: document.getElementById('loading-overlay'),
    appContent: document.getElementById('app-content'),
    mainContent: document.getElementById('main-content'),
    errorDisplay: document.getElementById('error-display'),
    errorMessage: document.getElementById('error-message'),
    statusIndicator: document.getElementById('status-indicator'),
    // Metric values
    tempVal: document.getElementById('temp-val'),
    feelsLikeVal: document.getElementById('feels-like-val'),
    humVal: document.getElementById('hum-val'),
    dewPointVal: document.getElementById('dew-point-val'),
    rainVal: document.getElementById('rain-val'),
    windAvgVal: document.getElementById('wind-avg-val'),
    windMaxVal: document.getElementById('wind-max-val'),
    uvVal: document.getElementById('uv-val'),
    // Wind Rose
    windArrowContainer: document.getElementById('wind-arrow-container'),
    windRoseSpeed: document.getElementById('wind-rose-speed'),
    windRoseDir: document.getElementById('wind-rose-dir'),
    // Signal
    signalInfoContainer: document.getElementById('signal-info-container'),
};

const chartDefaultOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
        x: {
            type: 'time',
            time: {
                unit: 'hour',
                tooltipFormat: 'HH:mm:ss',
                displayFormats: {
                   hour: 'HH:mm'
                }
            },
            ticks: { color: '#94a3b8' },
            grid: { color: '#475569' }
        },
        y: {
            ticks: { color: '#94a3b8' },
            grid: { color: '#475569' }
        }
    },
    plugins: {
        legend: {
            labels: { color: '#e2e8f0' }
        },
        tooltip: {
            backgroundColor: '#1e293b',
            titleColor: '#94a3b8',
            bodyColor: '#e2e8f0',
            borderColor: '#334155',
            borderWidth: 1,
        }
    }
};

function createChart(ctx, label, color) {
    return new Chart(ctx, {
        type: 'line',
        data: {
            datasets: [{
                label: label,
                data: [],
                borderColor: color,
                backgroundColor: `${color}33`, // a bit of transparent fill
                tension: 0.4,
                pointRadius: 0,
                fill: true,
            }]
        },
        options: chartDefaultOptions
    });
}

function initializeCharts() {
    charts.temperature = createChart(document.getElementById('temp-chart').getContext('2d'), 'Temperature (°C)', '#f87171');
    charts.humidity = createChart(document.getElementById('hum-chart').getContext('2d'), 'Humidity (%)', '#38bdf8');
    charts.wind = createChart(document.getElementById('wind-chart').getContext('2d'), 'Avg Wind (m/s)', '#94a3b8');
    charts.rain = createChart(document.getElementById('rain-chart').getContext('2d'), 'Rainfall (mm)', '#60a5fa');
    charts.dewPoint = createChart(document.getElementById('dew-point-chart').getContext('2d'), 'Dew Point (°C)', '#22d3ee');

    // Special multi-line chart for signal
    const signalCtx = document.getElementById('signal-chart').getContext('2d');
    charts.signal = new Chart(signalCtx, {
        type: 'line',
        data: {
            datasets: [{
                label: 'SNR (dB)',
                data: [],
                borderColor: '#38bdf8',
                backgroundColor: '#38bdf833',
                tension: 0.4,
                pointRadius: 0,
                fill: true,
            }, {
                label: 'Noise (dB)',
                data: [],
                borderColor: '#94a3b8',
                backgroundColor: '#94a3b833',
                tension: 0.4,
                pointRadius: 0,
                fill: true,
            }]
        },
        options: chartDefaultOptions
    });
}

function getDirectionAbbreviation(deg) {
    const directions = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
    const index = Math.round(deg / 22.5) % 16;
    return directions[index];
}

function calculateDewPoint(temperature, humidity) {
    if (temperature === null || humidity === null) return null;
    // Simple approximation: Td = T - ((100 - RH) / 5)
    return temperature - ((100 - humidity) / 5);
}

function calculateFeelsLike(temperature, humidity, windSpeed) {
    if (temperature === null || humidity === null || windSpeed === null) return null;
    // Calculate water vapour pressure (e) in hPa
    const e = (humidity / 100) * 6.105 * Math.exp((17.27 * temperature) / (237.7 + temperature));
    // Calculate Apparent Temperature (AT) using Australian Bureau of Meteorology formula
    const apparentTemp = temperature + (0.33 * e) - (0.7 * windSpeed) - 4.00;
    return apparentTemp;
}

function updateUI(data) {
    const feelsLike = calculateFeelsLike(data.temperature_C, data.humidity, data.wind_avg_m_s);
    const dewPoint = calculateDewPoint(data.temperature_C, data.humidity);

    // Update metric cards
    elements.tempVal.textContent = data.temperature_C.toFixed(1);
    elements.feelsLikeVal.textContent = feelsLike !== null ? feelsLike.toFixed(1) : '-';
    elements.humVal.textContent = data.humidity;
    elements.dewPointVal.textContent = dewPoint !== null ? dewPoint.toFixed(1) : '-';
    elements.rainVal.textContent = data.rain_mm.toFixed(1);
    elements.windAvgVal.textContent = data.wind_avg_m_s.toFixed(1);
    elements.windMaxVal.textContent = data.wind_max_m_s.toFixed(1);
    elements.uvVal.textContent = data.uv.toFixed(1);

    // Update Wind Rose
    elements.windArrowContainer.style.transform = `rotate(${data.wind_dir_deg}deg)`;
    elements.windRoseSpeed.textContent = data.wind_avg_m_s.toFixed(1);
    elements.windRoseDir.textContent = getDirectionAbbreviation(data.wind_dir_deg);
    
    // Update Status
    elements.statusIndicator.innerHTML = `
        <div class="relative">
            <i data-lucide="wifi" class="h-6 w-6 text-green-500"></i>
            <span class="absolute top-0 right-0 block h-2 w-2 rounded-full bg-green-500 ring-2 ring-slate-800 animate-pulse"></span>
        </div>
        <div>
            <p class="text-sm font-medium text-slate-300">Live</p>
            <p class="text-xs text-slate-400">Last updated: ${data.time.split(' ')[1]}</p>
        </div>
    `;

    // Update Signal Info
    const batteryIcon = data.battery_ok === 1 
        ? `<i data-lucide="battery-full" class="h-4 w-4 text-green-500"></i>`
        : `<i data-lucide="battery-warning" class="h-4 w-4 text-red-500"></i>`;
    const batteryStatus = data.battery_ok === 1 
        ? `<span class="font-semibold text-green-500">OK</span>`
        : `<span class="font-semibold text-red-500">Low</span>`;
    
    elements.signalInfoContainer.innerHTML = `
        <div class="flex justify-between items-center text-sm">
            <div class="flex items-center space-x-2 text-slate-400"><i data-lucide="signal" class="h-4 w-4 text-sky-400"></i><span>SNR</span></div>
            <span class="font-mono text-slate-200">${data.snr.toFixed(2)} dB</span>
        </div>
        <div class="flex justify-between items-center text-sm">
            <div class="flex items-center space-x-2 text-slate-400"><i data-lucide="rss" class="h-4 w-4 text-sky-400"></i><span>RSSI</span></div>
            <span class="font-mono text-slate-200">${data.rssi.toFixed(2)} dBm</span>
        </div>
        <div class="flex justify-between items-center text-sm">
            <div class="flex items-center space-x-2 text-slate-400"><i data-lucide="waves" class="h-4 w-4 text-slate-500"></i><span>Noise</span></div>
            <span class="font-mono text-slate-200">${data.noise.toFixed(2)} dB</span>
        </div>
        <div class="flex justify-between items-center text-sm">
            <div class="flex items-center space-x-2 text-slate-400">${batteryIcon}<span>Battery</span></div>
            ${batteryStatus}
        </div>
    `;
    
    lucide.createIcons();
}

function saveHistory() {
    const historyToSave = {};
    Object.keys(charts).forEach(key => {
        historyToSave[key] = charts[key].data.datasets.map(dataset => dataset.data);
    });
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(historyToSave));
    } catch (e) {
        console.error("Failed to save history to localStorage. Storage might be full.", e);
    }
}

function loadHistory() {
    const storedHistoryJSON = localStorage.getItem(STORAGE_KEY);
    if (!storedHistoryJSON) {
        return;
    }

    try {
        const storedHistory = JSON.parse(storedHistoryJSON);
        const cutoffTime = Date.now() - DATA_RETENTION_MS;

        Object.keys(storedHistory).forEach(key => {
            if (charts[key]) {
                const chart = charts[key];
                const datasetsHistory = storedHistory[key]; 

                if (!Array.isArray(datasetsHistory)) return;

                datasetsHistory.forEach((datasetHistory, index) => {
                    if (chart.data.datasets[index] && Array.isArray(datasetHistory)) {
                        const filteredData = datasetHistory.filter(point => point && typeof point.x === 'number' && point.x >= cutoffTime);
                        chart.data.datasets[index].data = filteredData;
                    }
                });
                chart.update('quiet');
            }
        });
    } catch (e) {
        console.error("Failed to load or parse history from localStorage. Clearing corrupted data.", e);
        localStorage.removeItem(STORAGE_KEY);
    }
}

function updateCharts(data) {
    const timestamp = new Date(data.time.replace(' ', 'T')).getTime();

    if (isNaN(timestamp)) {
        console.warn(`Invalid timestamp found in data: "${data.time}". Skipping chart update.`);
        return;
    }

    const dewPoint = calculateDewPoint(data.temperature_C, data.humidity);

    const chartDataPoints = {
        temperature: { x: timestamp, y: data.temperature_C },
        humidity: { x: timestamp, y: data.humidity },
        wind: { x: timestamp, y: data.wind_avg_m_s },
        rain: { x: timestamp, y: data.rain_mm },
        dewPoint: { x: timestamp, y: dewPoint },
        signal: [
            { x: timestamp, y: data.snr },
            { x: timestamp, y: data.noise }
        ]
    };

    const cutoffTime = Date.now() - DATA_RETENTION_MS;

    Object.keys(charts).forEach(key => {
        const chart = charts[key];
        const newData = chartDataPoints[key];
        
        const firstDataset = chart.data.datasets[0];
        const lastDataPoint = firstDataset.data[firstDataset.data.length - 1];
        if (lastDataPoint && lastDataPoint.x === timestamp) {
            return;
        }

        if (key === 'signal') {
            const [snrPoint, noisePoint] = newData;
            chart.data.datasets[0].data.push(snrPoint);
            chart.data.datasets[1].data.push(noisePoint);
        } else {
            if (newData.y !== null) {
                firstDataset.data.push(newData);
            }
        }
        
        chart.data.datasets.forEach(dataset => {
            while (dataset.data.length > 0 && dataset.data[0].x < cutoffTime) {
                dataset.data.shift();
            }
        });

        chart.update('quiet');
    });

    saveHistory();
}

function showError(message) {
    elements.mainContent.classList.add('hidden');
    elements.errorDisplay.classList.remove('hidden');
    elements.errorDisplay.classList.add('flex');
    elements.errorMessage.textContent = message;

    elements.statusIndicator.innerHTML = `
        <div class="relative"><i data-lucide="wifi-off" class="h-6 w-6 text-red-500"></i></div>
        <div>
            <p class="text-sm font-medium text-slate-300">Connection Issue</p>
            <p class="text-xs text-slate-400">Awaiting data...</p>
        </div>
    `;
    lucide.createIcons();
}

function hideError() {
    elements.mainContent.classList.remove('hidden');
    elements.errorDisplay.classList.add('hidden');
    elements.errorDisplay.classList.remove('flex');
}

async function fetchData() {
    try {
        const response = await fetch(DATA_URL, { cache: 'no-cache' });
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        
        hideError();
        updateUI(data);
        updateCharts(data);

    } catch (err) {
        console.error(`Failed to fetch weather data from '${DATA_URL}':`, err);
        const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred';
        showError(`Failed to load data from ${DATA_URL}. Make sure the file is available locally. Error: ${errorMessage}`);
    } finally {
        if (!elements.appContent.classList.contains('hidden')) return;

        elements.loadingOverlay.classList.add('hidden');
        elements.appContent.classList.remove('hidden');
        lucide.createIcons();
    }
}

document.addEventListener('DOMContentLoaded', () => {
    initializeCharts();
    loadHistory();
    fetchData();
    setInterval(fetchData, FETCH_INTERVAL);
});
