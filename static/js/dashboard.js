// Advanced Dashboard JavaScript for Smart Classroom Monitoring System

let temperatureChart, humidityChart;
let autoMode = true;
let logEntries = [];
let notificationCounter = 0;
let performanceInterval;

// Theme Management
function initTheme() {
    const savedTheme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', savedTheme);
    updateThemeIcon(savedTheme);
}

function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    updateThemeIcon(newTheme);
    showNotification('Theme Changed', `Switched to ${newTheme} mode`, 'success');
}

function updateThemeIcon(theme) {
    const themeToggle = document.getElementById('theme-toggle');
    const icon = themeToggle.querySelector('i');
    if (theme === 'dark') {
        icon.setAttribute('data-lucide', 'sun');
    } else {
        icon.setAttribute('data-lucide', 'moon');
    }
    lucide.createIcons();
}

// Notification System
function showNotification(title, message, type = 'info') {
    const container = document.getElementById('notification-container');
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.id = `notification-${notificationCounter++}`;
    
    notification.innerHTML = `
        <div class="notification-content">
            <div class="notification-title">${title}</div>
            <div class="notification-message">${message}</div>
        </div>
        <button class="notification-close" onclick="closeNotification('${notification.id}')">×</button>
    `;
    
    container.appendChild(notification);
    
    // Auto-remove after 5 seconds
    setTimeout(() => {
        closeNotification(notification.id);
    }, 5000);
}

function closeNotification(notificationId) {
    const notification = document.getElementById(notificationId);
    if (notification) {
        notification.style.animation = 'slideInRight 0.3s ease reverse';
        setTimeout(() => {
            notification.remove();
        }, 300);
    }
}

// Animated Counter
function animateCounter(element, target, duration = 1000) {
    const start = 0;
    const startTime = performance.now();
    
    function update(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        // Easing function
        const easeOutQuart = 1 - Math.pow(1 - progress, 4);
        const current = Math.floor(start + (target - start) * easeOutQuart);
        
        element.textContent = current;
        
        if (progress < 1) {
            requestAnimationFrame(update);
        } else {
            element.textContent = target;
        }
    }
    
    requestAnimationFrame(update);
}

// Performance Metrics Simulation
function updatePerformanceMetrics() {
    // Simulate CPU usage
    const cpuUsage = Math.floor(Math.random() * 30) + 10;
    document.getElementById('cpu-usage').textContent = cpuUsage + '%';
    document.querySelector('#cpu-usage').nextElementSibling.querySelector('.performance-fill').style.width = cpuUsage + '%';
    
    // Simulate memory usage
    const memoryUsage = Math.floor(Math.random() * 20) + 40;
    document.getElementById('memory-usage').textContent = memoryUsage + '%';
    document.querySelector('#memory-usage').nextElementSibling.querySelector('.performance-fill').style.width = memoryUsage + '%';
    
    // Simulate network speed
    const networkSpeed = (Math.random() * 2 + 0.5).toFixed(1);
    document.getElementById('network-speed').textContent = networkSpeed + ' Mbps';
    document.querySelector('#network-speed').nextElementSibling.querySelector('.performance-fill').style.width = (networkSpeed / 5 * 100) + '%';
    
    // Update uptime
    const uptimeElement = document.getElementById('uptime');
    const currentUptime = uptimeElement.textContent;
    // Simple uptime increment simulation
    const uptimeMatch = currentUptime.match(/(\d+)h (\d+)m/);
    if (uptimeMatch) {
        let hours = parseInt(uptimeMatch[1]);
        let minutes = parseInt(uptimeMatch[2]);
        minutes += 1;
        if (minutes >= 60) {
            minutes = 0;
            hours += 1;
        }
        uptimeElement.textContent = `${hours}h ${minutes}m`;
    }
}

// Initialize charts with professional colors
function initCharts() {
    const tempCtx = document.getElementById('temperatureChart').getContext('2d');
    const humidityCtx = document.getElementById('humidityChart').getContext('2d');

    // Chart.js global defaults for professional appearance
    Chart.defaults.font.family = "'Inter', system-ui, sans-serif";
    Chart.defaults.color = '#64748B';

    temperatureChart = new Chart(tempCtx, {
        type: 'line',
        data: {
            labels: [],
            datasets: [{
                label: 'Temperature (°C)',
                data: [],
                borderColor: '#06B6D4',
                backgroundColor: 'rgba(6, 182, 212, 0.1)',
                fill: true,
                tension: 0.4,
                borderWidth: 2,
                pointRadius: 3,
                pointHoverRadius: 5,
                pointBackgroundColor: '#06B6D4',
                pointBorderColor: '#FFFFFF',
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
                        font: {
                            size: 12,
                            weight: '500'
                        }
                    }
                },
                tooltip: {
                    backgroundColor: 'rgba(15, 23, 42, 0.9)',
                    titleColor: '#FFFFFF',
                    bodyColor: '#FFFFFF',
                    borderColor: '#06B6D4',
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
                    grid: {
                        color: '#E2E8F0'
                    },
                    ticks: {
                        font: {
                            size: 11
                        }
                    }
                },
                x: {
                    grid: {
                        display: false
                    },
                    ticks: {
                        font: {
                            size: 11
                        }
                    }
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
                borderColor: '#3B82F6',
                backgroundColor: 'rgba(59, 130, 246, 0.1)',
                fill: true,
                tension: 0.4,
                borderWidth: 2,
                pointRadius: 3,
                pointHoverRadius: 5,
                pointBackgroundColor: '#3B82F6',
                pointBorderColor: '#FFFFFF',
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
                        font: {
                            size: 12,
                            weight: '500'
                        }
                    }
                },
                tooltip: {
                    backgroundColor: 'rgba(15, 23, 42, 0.9)',
                    titleColor: '#FFFFFF',
                    bodyColor: '#FFFFFF',
                    borderColor: '#3B82F6',
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
                    grid: {
                        color: '#E2E8F0'
                    },
                    ticks: {
                        font: {
                            size: 11
                        }
                    }
                },
                x: {
                    grid: {
                        display: false
                    },
                    ticks: {
                        font: {
                            size: 11
                        }
                    }
                }
            },
            animation: {
                duration: 750,
                easing: 'easeInOutQuart'
            }
        }
    });
}

// Add system log entry
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

// Update dashboard with current status
function updateDashboard(data) {
    // Update occupancy status
    const occupancyCard = document.getElementById('occupancy-card');
    const occupancyStatus = document.getElementById('occupancy-status');
    const peopleCount = document.getElementById('people-count');
    const occupancyProgress = document.getElementById('occupancy-progress');

    const previousOccupied = occupancyCard.classList.contains('occupied');
    
    if (data.occupied) {
        occupancyCard.classList.add('occupied');
        occupancyCard.classList.remove('unoccupied');
        occupancyStatus.textContent = 'OCCUPIED';
        peopleCount.textContent = data.people_detected;
        occupancyProgress.style.width = '100%';
        
        if (!previousOccupied) {
            addLogEntry(`Classroom marked OCCUPIED - ${data.people_detected} people detected`, 'success');
            showNotification('Occupancy Detected', `${data.people_detected} people detected in classroom`, 'success');
        }
    } else {
        occupancyCard.classList.add('unoccupied');
        occupancyCard.classList.remove('occupied');
        occupancyStatus.textContent = 'UNOCCUPIED';
        peopleCount.textContent = '0';
        occupancyProgress.style.width = '0%';
        
        if (previousOccupied) {
            addLogEntry('Classroom marked UNOCCUPIED', 'info');
            showNotification('Room Empty', 'Classroom is now unoccupied', 'info');
        }
    }

    // Update temperature with animation
    const tempValue = data.temperature.toFixed(1);
    const tempElement = document.getElementById('temperature');
    animateCounter(tempElement, Math.round(data.temperature), 500);
    
    const tempCard = document.getElementById('temperature-card');
    const tempStatus = document.getElementById('temp-status');
    const tempProgress = document.getElementById('temperature-progress');
    
    // Calculate temperature progress (15-40 range)
    const tempProgressValue = ((data.temperature - 15) / 25) * 100;
    tempProgress.style.width = `${Math.max(0, Math.min(100, tempProgressValue))}%`;
    
    if (data.temperature > 28) {
        tempCard.classList.add('warning');
        tempCard.classList.remove('cyan');
        tempStatus.textContent = 'High';
        tempStatus.classList.add('text-amber');
        tempProgress.style.background = 'linear-gradient(90deg, #F59E0B, #EF4444)';
    } else {
        tempCard.classList.remove('warning');
        tempCard.classList.add('cyan');
        tempStatus.textContent = 'Normal';
        tempStatus.classList.remove('text-amber');
        tempProgress.style.background = 'linear-gradient(90deg, #06B6D4, #22C55E)';
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
        pirCard.classList.add('green');
        pirCard.classList.remove('unoccupied');
        pirProgress.style.width = '100%';
    } else {
        pirStatus.textContent = 'NO MOTION';
        pirCard.classList.remove('green');
        pirCard.classList.add('unoccupied');
        pirProgress.style.width = '0%';
    }

    // Update appliance status
    updateApplianceStatus('light', data.light_on, data.auto_mode);
    updateApplianceStatus('fan', data.fan_on, data.auto_mode);

    // Update auto mode toggle
    const autoModeToggle = document.getElementById('auto-mode-toggle');
    autoModeToggle.checked = data.auto_mode;
    autoMode = data.auto_mode;

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
    
    // Update advanced metrics
    document.getElementById('detection-accuracy').textContent = (90 + Math.random() * 9).toFixed(1) + '%';
    document.getElementById('response-time').textContent = Math.floor(30 + Math.random() * 40) + 'ms';
}

// Update appliance status display
function updateApplianceStatus(appliance, isOn, isAuto) {
    const card = document.getElementById(`${appliance}-card`);
    const status = document.getElementById(`${appliance}-status`);
    const icon = card.querySelector('.card-icon');
    const modeBadge = document.getElementById(`${appliance}-mode`);
    const progress = document.getElementById(`${appliance}-progress`);
    
    status.textContent = isOn ? 'ON' : 'OFF';
    progress.style.width = isOn ? '100%' : '0%';
    
    if (isOn) {
        card.classList.add('green');
        card.classList.remove('unoccupied');
        icon.classList.add('green');
    } else {
        card.classList.remove('green');
        card.classList.add('unoccupied');
        icon.classList.remove('green');
    }
    
    modeBadge.textContent = isAuto ? 'AUTO' : 'MANUAL';
    modeBadge.className = `mode-badge ${isAuto ? 'auto' : 'manual'}`;
}

// Update manual controls state
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

// Update charts with historical data
function updateCharts(data) {
    // Update temperature chart
    temperatureChart.data.labels = data.timestamps;
    temperatureChart.data.datasets[0].data = data.temperature;
    temperatureChart.update('none');

    // Update humidity chart
    humidityChart.data.labels = data.timestamps;
    humidityChart.data.datasets[0].data = data.humidity;
    humidityChart.update('none');
}

// Export functionality
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
            network_speed: document.getElementById('network-speed').textContent,
            uptime: document.getElementById('uptime').textContent
        },
        logs: logEntries
    };
    
    const dataStr = JSON.stringify(data, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = `smart-classroom-data-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    
    URL.revokeObjectURL(url);
    
    showNotification('Export Successful', 'System data has been exported', 'success');
    addLogEntry('System data exported successfully', 'success');
}

// Fetch current status from API
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

// Fetch historical data from API
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

// Send control command to API
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

// Event listeners
document.addEventListener('DOMContentLoaded', function() {
    // Initialize theme
    initTheme();
    
    // Initialize charts
    initCharts();
    
    // Add initial log entry
    addLogEntry('Dashboard initialized successfully', 'success');
    showNotification('System Ready', 'Smart Classroom Monitoring System is online', 'success');

    // Start performance metrics simulation
    performanceInterval = setInterval(updatePerformanceMetrics, 3000);

    // Fetch initial data
    fetchStatus();
    fetchHistorical();

    // Set up periodic updates
    setInterval(fetchStatus, 3000); // Update every 3 seconds
    setInterval(fetchHistorical, 5000); // Update charts every 5 seconds

    // Theme toggle
    document.getElementById('theme-toggle').addEventListener('click', toggleTheme);

    // Auto mode toggle
    document.getElementById('auto-mode-toggle').addEventListener('change', function() {
        autoMode = this.checked;
        const modeText = autoMode ? 'Auto' : 'Manual';
        addLogEntry(`Automation mode changed to ${modeText}`, 'info');
        showNotification('Mode Changed', `Switched to ${modeText} mode`, 'info');
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
