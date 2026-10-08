// Premium AI + IoT Command Center JavaScript

let temperatureChart, humidityChart;
let autoMode = true;
let logEntries = [];
let notificationCounter = 0;
let performanceInterval;

// Theme Management (Dark mode only for premium feel)
function initTheme() {
    document.documentElement.setAttribute('data-theme', 'dark');
}

// Notification System with Premium Styling
function showNotification(title, message, type = 'info') {
    const container = document.getElementById('notification-container');
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.id = `notification-${notificationCounter++}`;
    
    notification.innerHTML = `
        <div style="font-weight: 600; margin-bottom: 4px;">${title}</div>
        <div style="font-size: 12px; opacity: 0.8;">${message}</div>
    `;
    
    container.appendChild(notification);
    
    // Auto-remove after 5 seconds
    setTimeout(() => {
        notification.style.animation = 'slideIn 0.3s ease reverse';
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 5000);
}

// Advanced Counter Animation
function animateCounter(element, target, duration = 1000) {
    const start = 0;
    const startTime = performance.now();
    
    function update(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        // Easing function
        const easeOutQuart = 1 - Math.pow(1 - progress, 4);
        const current = start + (target - start) * easeOutQuart;
        
        element.textContent = current.toFixed(1);
        
        if (progress < 1) {
            requestAnimationFrame(update);
        } else {
            element.textContent = target.toFixed(1);
        }
    }
    
    requestAnimationFrame(update);
}

// Enhanced Performance Metrics Simulation
function updatePerformanceMetrics() {
    // Simulate CPU usage with realistic fluctuations
    const cpuUsage = Math.floor(Math.random() * 20) + 8;
    const cpuElement = document.getElementById('cpu-usage');
    cpuElement.textContent = cpuUsage + '%';
    cpuElement.parentElement.nextElementSibling.nextElementSibling.querySelector('.progress-fill').style.width = cpuUsage + '%';
    
    // Simulate memory usage
    const memoryUsage = Math.floor(Math.random() * 15) + 40;
    const memoryElement = document.getElementById('memory-usage');
    memoryElement.textContent = memoryUsage + '%';
    memoryElement.parentElement.nextElementSibling.querySelector('.progress-fill').style.width = memoryUsage + '%';
    
    // Update detection accuracy
    const accuracy = (90 + Math.random() * 8).toFixed(1);
    document.getElementById('detection-accuracy').textContent = accuracy + '%';
    
    // Update sync time
    const now = new Date();
    const timeString = now.toLocaleTimeString();
    document.getElementById('sync-time').textContent = 'Last synchronized: ' + timeString;
}

// Initialize Premium Charts
function initCharts() {
    const tempCtx = document.getElementById('temperatureChart').getContext('2d');
    const humidityCtx = document.getElementById('humidityChart').getContext('2d');

    // Premium Chart.js Configuration
    Chart.defaults.font.family = "'Inter', system-ui, sans-serif";
    Chart.defaults.color = '#94a3b8';
    Chart.defaults.borderColor = 'rgba(255, 255, 255, 0.1)';

    temperatureChart = new Chart(tempCtx, {
        type: 'line',
        data: {
            labels: [],
            datasets: [{
                label: 'Temperature (°C)',
                data: [],
                borderColor: '#00d4ff',
                backgroundColor: 'rgba(0, 212, 255, 0.1)',
                fill: true,
                tension: 0.4,
                borderWidth: 2,
                pointRadius: 3,
                pointHoverRadius: 5,
                pointBackgroundColor: '#00d4ff',
                pointBorderColor: '#ffffff',
                pointBorderWidth: 2
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: true,
                    position: 'top',
                    labels: {
                        usePointStyle: true,
                        padding: 20,
                        font: { size: 12, weight: '500' }
                    }
                },
                tooltip: {
                    backgroundColor: 'rgba(10, 14, 23, 0.9)',
                    titleColor: '#f8fafc',
                    bodyColor: '#f8fafc',
                    borderColor: '#00d4ff',
                    borderWidth: 1,
                    cornerRadius: 8,
                    padding: 12
                }
            },
            scales: {
                y: {
                    beginAtZero: false,
                    min: 15,
                    max: 40,
                    grid: { color: 'rgba(255, 255, 255, 0.05)' },
                    ticks: { font: { size: 11 } }
                },
                x: {
                    grid: { display: false },
                    ticks: { font: { size: 11 } }
                }
            },
            animation: {
                duration: 750,
                easing: 'easeInOutQuart'
            }
        }
    });

    humidityChart = new Chart(humidityCtx, {
        type: 'line',
        data: {
            labels: [],
            datasets: [{
                label: 'Humidity (%)',
                data: [],
                borderColor: '#a855f7',
                backgroundColor: 'rgba(168, 85, 247, 0.1)',
                fill: true,
                tension: 0.4,
                borderWidth: 2,
                pointRadius: 3,
                pointHoverRadius: 5,
                pointBackgroundColor: '#a855f7',
                pointBorderColor: '#ffffff',
                pointBorderWidth: 2
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: true,
                    position: 'top',
                    labels: {
                        usePointStyle: true,
                        padding: 20,
                        font: { size: 12, weight: '500' }
                    }
                },
                tooltip: {
                    backgroundColor: 'rgba(10, 14, 23, 0.9)',
                    titleColor: '#f8fafc',
                    bodyColor: '#f8fafc',
                    borderColor: '#a855f7',
                    borderWidth: 1,
                    cornerRadius: 8,
                    padding: 12
                }
            },
            scales: {
                y: {
                    beginAtZero: false,
                    min: 30,
                    max: 90,
                    grid: { color: 'rgba(255, 255, 255, 0.05)' },
                    ticks: { font: { size: 11 } }
                },
                x: {
                    grid: { display: false },
                    ticks: { font: { size: 11 } }
                }
            },
            animation: {
                duration: 750,
                easing: 'easeInOutQuart'
            }
        }
    });
}

// Add Premium System Log Entry
function addLogEntry(message, type = 'info') {
    const timestamp = new Date().toLocaleTimeString();
    const logContainer = document.getElementById('system-logs');
    
    const logEntry = document.createElement('div');
    logEntry.className = `log-entry ${type}`;
    logEntry.innerHTML = `
        <span class="log-timestamp">${timestamp}</span>
        <span>${message}</span>
    `;
    
    logContainer.insertBefore(logEntry, logContainer.firstChild);
    
    // Keep only last 20 log entries
    while (logContainer.children.length > 20) {
        logContainer.removeChild(logContainer.lastChild);
    }
    
    logEntries.push({ timestamp, message, type });
}

// Update Dashboard with Premium Animations
function updateDashboard(data) {
    // Update occupancy status with premium transitions
    const occupancyCard = document.getElementById('occupancy-card');
    const occupancyStatus = document.getElementById('occupancy-status');
    const peopleCount = document.getElementById('people-count');
    const occupancyProgress = document.getElementById('occupancy-progress');

    const previousOccupied = occupancyCard.classList.contains('occupied');
    
    if (data.occupied) {
        occupancyCard.classList.add('occupied');
        occupancyCard.classList.remove('unoccupied');
        occupancyStatus.textContent = 'OCCUPIED';
        occupancyStatus.style.color = '#22c55e';
        peopleCount.textContent = data.people_detected;
        occupancyProgress.style.width = '100%';
        
        if (!previousOccupied) {
            addLogEntry(`AI Detection: ${data.people_detected} occupants identified`, 'success');
            showNotification('Occupancy Detected', `${data.people_detected} people detected in classroom`, 'success');
        }
    } else {
        occupancyCard.classList.add('unoccupied');
        occupancyCard.classList.remove('occupied');
        occupancyStatus.textContent = 'UNOCCUPIED';
        occupancyStatus.style.color = '#64748b';
        peopleCount.textContent = '0';
        occupancyProgress.style.width = '0%';
        
        if (previousOccupied) {
            addLogEntry('AI Detection: Classroom unoccupied', 'info');
            showNotification('Room Empty', 'Classroom is now unoccupied', 'info');
        }
    }

    // Update temperature with premium animation
    const tempValue = data.temperature.toFixed(1);
    const tempElement = document.getElementById('temperature');
    animateCounter(tempElement, Math.round(data.temperature), 500);
    
    const tempCard = document.getElementById('temperature-card');
    const tempStatus = document.getElementById('temp-status');
    const tempProgress = document.getElementById('temperature-progress');
    
    const tempProgressValue = ((data.temperature - 15) / 25) * 100;
    tempProgress.style.width = `${Math.max(0, Math.min(100, tempProgressValue))}%`;
    
    if (data.temperature > 28) {
        tempCard.style.borderColor = '#f59e0b';
        tempStatus.textContent = 'HIGH';
        tempStatus.style.color = '#f59e0b';
        tempProgress.style.background = 'linear-gradient(90deg, #f59e0b, #ef4444)';
    } else {
        tempCard.style.borderColor = 'rgba(255, 255, 255, 0.1)';
        tempStatus.textContent = 'NORMAL';
        tempStatus.style.color = '#94a3b8';
        tempProgress.style.background = 'linear-gradient(90deg, #00d4ff, #a855f7)';
    }

    // Update humidity with animation
    const humidityElement = document.getElementById('humidity');
    animateCounter(humidityElement, Math.round(data.humidity), 500);
    
    const humidityProgress = document.getElementById('humidity-progress');
    humidityProgress.style.width = `${data.humidity}%`;

    // Update PIR status
    const pirStatus = document.getElementById('pir-status');
    const pirCard = document.getElementById('pir-card');
    const pirProgress = document.getElementById('pir-progress');
    
    if (data.pir_motion) {
        pirStatus.textContent = 'DETECTED';
        pirStatus.style.color = '#22c55e';
        pirCard.style.borderColor = 'rgba(34, 197, 94, 0.3)';
        pirProgress.style.width = '100%';
    } else {
        pirStatus.textContent = 'NO MOTION';
        pirStatus.style.color = '#64748b';
        pirCard.style.borderColor = 'rgba(255, 255, 255, 0.1)';
        pirProgress.style.width = '0%';
    }

    // Update appliance status
    updateApplianceStatus('light', data.light_on, data.auto_mode);
    updateApplianceStatus('fan', data.fan_on, data.auto_mode);

    // Update auto mode toggle
    const autoModeToggle = document.getElementById('auto-mode-toggle');
    autoModeToggle.checked = data.auto_mode;
    autoMode = data.auto_mode;
    
    // Update automation display
    document.getElementById('automation-mode').textContent = data.auto_mode ? 'AUTO' : 'MANUAL';
    document.getElementById('automation-status').textContent = 'Running';

    // Update manual controls
    updateManualControls(data.auto_mode, data.light_on, data.fan_on);

    // Update energy statistics with animation
    const energySavedElement = document.getElementById('energy-saved');
    const lightRuntimeElement = document.getElementById('light-runtime');
    const fanRuntimeElement = document.getElementById('fan-runtime');
    
    energySavedElement.textContent = data.energy_saved_kwh.toFixed(3);
    lightRuntimeElement.textContent = Math.floor(data.light_runtime_minutes || 0);
    fanRuntimeElement.textContent = Math.floor(data.fan_runtime_minutes || 0);

    // Update system info
    document.getElementById('last-update').textContent = data.last_update;
    document.getElementById('empty-timer').textContent = data.empty_room_timer + 's';
    document.getElementById('mode-display').textContent = data.auto_mode ? 'Auto' : 'Manual';
}

// Update Appliance Status with Premium Styling
function updateApplianceStatus(appliance, isOn, isAuto) {
    const card = document.getElementById(`${appliance}-card`);
    const status = document.getElementById(`${appliance}-status`);
    const icon = card.querySelector('.card-icon');
    const modeBadge = document.getElementById(`${appliance}-mode`);
    const progress = document.getElementById(`${appliance}-progress`);
    
    status.textContent = isOn ? 'ON' : 'OFF';
    status.style.color = isOn ? '#22c55e' : '#64748b';
    progress.style.width = isOn ? '100%' : '0%';
    
    if (isOn) {
        card.style.borderColor = 'rgba(34, 197, 94, 0.3)';
        icon.style.color = '#22c55e';
        icon.style.background = 'rgba(34, 197, 94, 0.1)';
    } else {
        card.style.borderColor = 'rgba(255, 255, 255, 0.1)';
        icon.style.color = '#00d4ff';
        icon.style.background = 'rgba(255, 255, 255, 0.05)';
    }
    
    modeBadge.textContent = isAuto ? 'AUTO' : 'MANUAL';
    modeBadge.className = `mode-badge ${isAuto ? 'auto' : 'manual'}`;
}

// Update Manual Controls with Premium Styling
function updateManualControls(isAuto, lightOn, fanOn) {
    const lightToggle = document.getElementById('light-toggle');
    const fanToggle = document.getElementById('fan-toggle');
    const lightControl = document.getElementById('manual-light-control');
    const fanControl = document.getElementById('manual-fan-control');
    
    lightToggle.checked = lightOn;
    fanToggle.checked = fanOn;
    
    if (isAuto) {
        lightToggle.disabled = true;
        fanToggle.disabled = true;
        lightControl.style.opacity = '0.5';
        fanControl.style.opacity = '0.5';
    } else {
        lightToggle.disabled = false;
        fanToggle.disabled = false;
        lightControl.style.opacity = '1';
        fanControl.style.opacity = '1';
    }
}

// Update Charts with Premium Styling
function updateCharts(data) {
    temperatureChart.data.labels = data.timestamps;
    temperatureChart.data.datasets[0].data = data.temperature;
    temperatureChart.update('none');

    humidityChart.data.labels = data.timestamps;
    humidityChart.data.datasets[0].data = data.humidity;
    humidityChart.update('none');
}

// Export Functionality
function exportData() {
    const data = {
        timestamp: new Date().toISOString(),
        system_status: {
            occupied: document.getElementById('occupancy-status').textContent,
            people_detected: document.getElementById('people-count').textContent,
            temperature: document.getElementById('temperature').textContent + '°C',
            humidity: document.getElementById('humidity').textContent + '%',
            light_status: document.getElementById('light-status').textContent,
            fan_status: document.getElementById('fan-status').textContent,
            auto_mode: document.getElementById('mode-display').textContent
        },
        energy_statistics: {
            energy_saved: document.getElementById('energy-saved').textContent + ' kWh',
            light_runtime: document.getElementById('light-runtime').textContent + ' minutes',
            fan_runtime: document.getElementById('fan-runtime').textContent + ' minutes'
        },
        performance_metrics: {
            cpu_usage: document.getElementById('cpu-usage').textContent,
            memory_usage: document.getElementById('memory-usage').textContent,
            detection_accuracy: document.getElementById('detection-accuracy').textContent
        },
        logs: logEntries
    };
    
    const dataStr = JSON.stringify(data, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = `smart-classroom-ai-data-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    
    URL.revokeObjectURL(url);
    
    showNotification('Export Successful', 'System data has been exported', 'success');
    addLogEntry('System data exported successfully', 'success');
}

// Fetch Status API
async function fetchStatus() {
    try {
        const response = await fetch('/api/status');
        const data = await response.json();
        updateDashboard(data);
    } catch (error) {
        console.error('Error fetching status:', error);
        addLogEntry('Failed to fetch system status', 'error');
        showNotification('Connection Error', 'Failed to fetch system status', 'error');
    }
}

// Fetch Historical Data API
async function fetchHistorical() {
    try {
        const response = await fetch('/api/historical');
        const data = await response.json();
        updateCharts(data);
    } catch (error) {
        console.error('Error fetching historical data:', error);
        addLogEntry('Failed to fetch historical data', 'error');
    }
}

// Send Control API
async function sendControl() {
    try {
        const response = await fetch('/api/control', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                auto_mode: autoMode,
                light_on: document.getElementById('light-toggle').checked,
                fan_on: document.getElementById('fan-toggle').checked
            })
        });
        const data = await response.json();
        
        if (data.success) {
            addLogEntry('Control settings updated successfully', 'success');
            showNotification('Settings Updated', 'Control settings have been applied', 'success');
        }
    } catch (error) {
        console.error('Error sending control:', error);
        addLogEntry('Failed to update control settings', 'error');
        showNotification('Update Failed', 'Failed to update control settings', 'error');
    }
}

// Initialize Premium Dashboard
document.addEventListener('DOMContentLoaded', function() {
    // Initialize theme
    initTheme();
    
    // Initialize charts
    initCharts();
    
    // Add initial premium log entry
    addLogEntry('AI + IoT Command Center initialized successfully', 'success');
    showNotification('System Ready', 'Smart Classroom AI + IoT Command Center is online', 'success');

    // Start enhanced performance metrics
    performanceInterval = setInterval(updatePerformanceMetrics, 3000);

    // Fetch initial data
    fetchStatus();
    fetchHistorical();

    // Set up periodic updates
    setInterval(fetchStatus, 3000);
    setInterval(fetchHistorical, 5000);

    // Auto mode toggle
    document.getElementById('auto-mode-toggle').addEventListener('change', function() {
        autoMode = this.checked;
        const modeText = autoMode ? 'Auto' : 'Manual';
        addLogEntry(`AI Automation mode changed to ${modeText}`, 'info');
        showNotification('Mode Changed', `Switched to ${modeText} mode`, 'info');
        document.getElementById('automation-mode').textContent = modeText;
        sendControl();
    });

    // Manual control toggles
    document.getElementById('light-toggle').addEventListener('change', function() {
        if (!autoMode) {
            const state = this.checked ? 'ON' : 'OFF';
            addLogEntry(`Light manually turned ${state}`, 'info');
            showNotification('Light Control', `Light turned ${state}`, 'info');
            sendControl();
        }
    });

    document.getElementById('fan-toggle').addEventListener('change', function() {
        if (!autoMode) {
            const state = this.checked ? 'ON' : 'OFF';
            addLogEntry(`Fan manually turned ${state}`, 'info');
            showNotification('Fan Control', `Fan turned ${state}`, 'info');
            sendControl();
        }
    });

    // Export button
    document.getElementById('export-data-btn').addEventListener('click', exportData);
});
