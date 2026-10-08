// Advanced Analytics JavaScript for Smart Classroom Monitoring System

let tempHistoryChart, humidityHistoryChart, occupancyHistoryChart, combinedChart;
let notificationCounter = 0;

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

// Initialize analytics charts with professional colors
function initAnalyticsCharts() {
    const tempCtx = document.getElementById('tempHistoryChart').getContext('2d');
    const humidityCtx = document.getElementById('humidityHistoryChart').getContext('2d');
    const occupancyCtx = document.getElementById('occupancyHistoryChart').getContext('2d');
    const combinedCtx = document.getElementById('combinedChart').getContext('2d');

    // Chart.js global defaults for professional appearance
    Chart.defaults.font.family = "'Inter', system-ui, sans-serif";
    Chart.defaults.color = '#64748B';

    // Temperature history chart
    tempHistoryChart = new Chart(tempCtx, {
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

    // Humidity history chart
    humidityHistoryChart = new Chart(humidityCtx, {
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

    // Occupancy history chart
    occupancyHistoryChart = new Chart(occupancyCtx, {
        type: 'bar',
        data: {
            labels: [],
            datasets: [{
                label: 'Occupancy',
                data: [],
                backgroundColor: 'rgba(34, 197, 94, 0.7)',
                borderColor: '#22C55E',
                borderWidth: 2,
                borderRadius: 4
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
                    borderColor: '#22C55E',
                    borderWidth: 1,
                    cornerRadius: 8,
                    padding: 12
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    max: 1,
                    ticks: {
                        callback: function(value) {
                            return value === 1 ? 'Occupied' : 'Empty';
                        },
                        stepSize: 1,
                        font: {
                            size: 11
                        }
                    },
                    grid: {
                        color: '#E2E8F0'
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

    // Combined chart
    combinedChart = new Chart(combinedCtx, {
        type: 'line',
        data: {
            labels: [],
            datasets: [
                {
                    label: 'Temperature (°C)',
                    data: [],
                    borderColor: '#06B6D4',
                    backgroundColor: 'rgba(6, 182, 212, 0.1)',
                    yAxisID: 'y',
                    tension: 0.4,
                    borderWidth: 2,
                    pointRadius: 2,
                    pointBackgroundColor: '#06B6D4',
                    pointBorderColor: '#FFFFFF',
                    pointBorderWidth: 2
                },
                {
                    label: 'Humidity (%)',
                    data: [],
                    borderColor: '#3B82F6',
                    backgroundColor: 'rgba(59, 130, 246, 0.1)',
                    yAxisID: 'y',
                    tension: 0.4,
                    borderWidth: 2,
                    pointRadius: 2,
                    pointBackgroundColor: '#3B82F6',
                    pointBorderColor: '#FFFFFF',
                    pointBorderWidth: 2
                },
                {
                    label: 'Occupancy',
                    data: [],
                    borderColor: '#22C55E',
                    backgroundColor: 'rgba(34, 197, 94, 0.3)',
                    yAxisID: 'y1',
                    tension: 0.4,
                    stepped: true,
                    borderWidth: 2,
                    pointRadius: 2,
                    pointBackgroundColor: '#22C55E',
                    pointBorderColor: '#FFFFFF',
                    pointBorderWidth: 2,
                    fill: true
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            interaction: {
                mode: 'index',
                intersect: false
            },
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
                    borderColor: '#22C55E',
                    borderWidth: 1,
                    cornerRadius: 8,
                    padding: 12
                }
            },
            scales: {
                y: {
                    type: 'linear',
                    display: true,
                    position: 'left',
                    beginAtZero: false,
                    grid: {
                        color: '#E2E8F0'
                    },
                    ticks: {
                        font: {
                            size: 11
                        }
                    }
                },
                y1: {
                    type: 'linear',
                    display: true,
                    position: 'right',
                    beginAtZero: true,
                    max: 1,
                    grid: {
                        drawOnChartArea: false
                    },
                    ticks: {
                        callback: function(value) {
                            return value === 1 ? 'Occupied' : 'Empty';
                        },
                        stepSize: 1,
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

// Calculate trend
function calculateTrend(data) {
    if (data.length < 2) return 'Insufficient Data';
    
    const firstHalf = data.slice(0, Math.floor(data.length / 2));
    const secondHalf = data.slice(Math.floor(data.length / 2));
    
    const firstAvg = firstHalf.reduce((a, b) => a + b, 0) / firstHalf.length;
    const secondAvg = secondHalf.reduce((a, b) => a + b, 0) / secondHalf.length;
    
    const change = ((secondAvg - firstAvg) / firstAvg) * 100;
    
    if (Math.abs(change) < 2) return 'Stable';
    if (change > 0) return 'Increasing';
    return 'Decreasing';
}

// Update analytics charts with data
function updateAnalyticsCharts(data) {
    const labels = data.timestamps;
    const tempData = data.temperature;
    const humidityData = data.humidity;
    const occupancyData = data.occupancy;

    // Update temperature chart
    tempHistoryChart.data.labels = labels;
    tempHistoryChart.data.datasets[0].data = tempData;
    tempHistoryChart.update('none');

    // Update humidity chart
    humidityHistoryChart.data.labels = labels;
    humidityHistoryChart.data.datasets[0].data = humidityData;
    humidityHistoryChart.update('none');

    // Update occupancy chart
    occupancyHistoryChart.data.labels = labels;
    occupancyHistoryChart.data.datasets[0].data = occupancyData;
    occupancyHistoryChart.update('none');

    // Update combined chart
    combinedChart.data.labels = labels;
    combinedChart.data.datasets[0].data = tempData;
    combinedChart.data.datasets[1].data = humidityData;
    combinedChart.data.datasets[2].data = occupancyData;
    combinedChart.update('none');

    // Update statistics
    updateStatistics(tempData, humidityData, occupancyData);
    
    // Update trend analysis
    updateTrendAnalysis(tempData, humidityData, occupancyData);
}

// Update statistics summary
function updateStatistics(tempData, humidityData, occupancyData) {
    // Calculate average temperature
    if (tempData.length > 0) {
        const avgTemp = tempData.reduce((a, b) => a + b, 0) / tempData.length;
        const tempElement = document.getElementById('avg-temp');
        animateCounter(tempElement, avgTemp, 500);
        tempElement.textContent = avgTemp.toFixed(1) + '°C';
        
        // Update progress bar
        const tempProgress = ((avgTemp - 15) / 25) * 100;
        document.getElementById('temp-stat-progress').style.width = `${Math.max(0, Math.min(100, tempProgress))}%`;
    }

    // Calculate average humidity
    if (humidityData.length > 0) {
        const avgHumidity = humidityData.reduce((a, b) => a + b, 0) / humidityData.length;
        const humidityElement = document.getElementById('avg-humidity');
        animateCounter(humidityElement, avgHumidity, 500);
        humidityElement.textContent = avgHumidity.toFixed(1) + '%';
        
        // Update progress bar
        document.getElementById('humidity-stat-progress').style.width = `${avgHumidity}%`;
    }

    // Calculate total occupancy time
    if (occupancyData.length > 0) {
        const occupiedCount = occupancyData.filter(x => x === 1).length;
        const totalPoints = occupancyData.length;
        const occupancyPercentage = (occupiedCount / totalPoints) * 100;
        document.getElementById('total-occupancy').textContent = occupancyPercentage.toFixed(1) + '%';
        
        // Update progress bar
        document.getElementById('occupancy-stat-progress').style.width = `${occupancyPercentage}%`;
    }

    // Fetch current energy saved
    fetch('/api/status')
        .then(response => response.json())
        .then(data => {
            const energyElement = document.getElementById('total-energy');
            energyElement.textContent = data.energy_saved_kwh.toFixed(3) + ' kWh';
            
            // Update progress bar (assuming 10 kWh as max for visualization)
            const energyProgress = (data.energy_saved_kwh / 10) * 100;
            document.getElementById('energy-stat-progress').style.width = `${Math.min(100, energyProgress)}%`;
        })
        .catch(error => console.error('Error fetching energy data:', error));
}

// Update trend analysis
function updateTrendAnalysis(tempData, humidityData, occupancyData) {
    const tempTrend = calculateTrend(tempData);
    const humidityTrend = calculateTrend(humidityData);
    
    document.getElementById('temp-trend').textContent = tempTrend;
    document.getElementById('humidity-trend').textContent = humidityTrend;
    
    // Analyze occupancy pattern
    if (occupancyData.length > 0) {
        const occupiedCount = occupancyData.filter(x => x === 1).length;
        const totalPoints = occupancyData.length;
        const occupancyRate = occupiedCount / totalPoints;
        
        let pattern = 'Irregular';
        if (occupancyRate > 0.7) pattern = 'High Usage';
        else if (occupancyRate > 0.4) pattern = 'Regular';
        else if (occupancyRate > 0.2) pattern = 'Low Usage';
        else pattern = 'Minimal';
        
        document.getElementById('occupancy-pattern').textContent = pattern;
    }
}

// Export analytics data
function exportAnalytics() {
    const analyticsData = {
        timestamp: new Date().toISOString(),
        statistics: {
            average_temperature: document.getElementById('avg-temp').textContent,
            average_humidity: document.getElementById('avg-humidity').textContent,
            total_occupancy: document.getElementById('total-occupancy').textContent,
            energy_saved: document.getElementById('total-energy').textContent
        },
        trends: {
            temperature_trend: document.getElementById('temp-trend').textContent,
            humidity_trend: document.getElementById('humidity-trend').textContent,
            occupancy_pattern: document.getElementById('occupancy-pattern').textContent,
            peak_usage: document.getElementById('peak-usage').textContent
        }
    };
    
    const dataStr = JSON.stringify(analyticsData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = `smart-classroom-analytics-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    
    URL.revokeObjectURL(url);
    
    showNotification('Export Successful', 'Analytics data has been exported', 'success');
}

// Refresh analytics data
function refreshAnalytics() {
    showNotification('Refreshing', 'Updating analytics data...', 'info');
    fetchAnalyticsData();
}

// Fetch historical data from API
async function fetchAnalyticsData() {
    try {
        const response = await fetch('/api/historical');
        const data = await response.json();
        updateAnalyticsCharts(data);
        showNotification('Data Updated', 'Analytics data refreshed successfully', 'success');
    } catch (error) {
        console.error('Error fetching analytics data:', error);
        showNotification('Error', 'Failed to fetch analytics data', 'error');
    }
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
    // Initialize theme
    initTheme();
    
    // Initialize charts
    initAnalyticsCharts();

    // Fetch initial data
    fetchAnalyticsData();

    // Set up periodic updates
    setInterval(fetchAnalyticsData, 10000); // Update every 10 seconds

    // Theme toggle
    document.getElementById('theme-toggle').addEventListener('click', toggleTheme);

    // Export button
    document.getElementById('export-analytics-btn').addEventListener('click', exportAnalytics);

    // Refresh button
    document.getElementById('refresh-analytics-btn').addEventListener('click', refreshAnalytics);
});
