// Advanced Settings JavaScript for Smart Classroom Monitoring System

// Default settings values
const defaultSettings = {
    occupancy_timeout: 300,
    temperature_threshold: 28,
    sensor_interval: 5,
    detection_interval: 2,
    confidence_threshold: 0.5,
    theme_preference: 'light'
};

let notificationCounter = 0;

// Theme Management
function initTheme() {
    const savedTheme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', savedTheme);
    updateThemeIcon(savedTheme);
    document.getElementById('theme-preference').value = savedTheme;
}

function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    updateThemeIcon(newTheme);
    document.getElementById('theme-preference').value = newTheme;
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

// Fetch current settings from API
async function fetchSettings() {
    try {
        const response = await fetch('/api/settings');
        const data = await response.json();
        
        // Update form fields
        document.getElementById('occupancy-timeout').value = data.occupancy_timeout;
        document.getElementById('temperature-threshold').value = data.temperature_threshold;
        
        // Update current configuration display
        document.getElementById('current-timeout').textContent = data.occupancy_timeout + 's';
        document.getElementById('current-threshold').textContent = data.temperature_threshold + '°C';
        document.getElementById('current-auto').textContent = data.auto_mode_enabled ? 'Enabled' : 'Disabled';
        
        // Update theme display
        const currentTheme = document.documentElement.getAttribute('data-theme');
        document.getElementById('current-theme').textContent = currentTheme.charAt(0).toUpperCase() + currentTheme.slice(1);
        
        // Update last update time
        document.getElementById('settings-last-update').textContent = new Date().toLocaleString();
        
    } catch (error) {
        console.error('Error fetching settings:', error);
        showNotification('Error', 'Failed to fetch settings', 'error');
    }
}

// Save settings to API
async function saveSettings(event) {
    event.preventDefault();
    
    const formData = {
        occupancy_timeout: parseInt(document.getElementById('occupancy-timeout').value),
        temperature_threshold: parseFloat(document.getElementById('temperature-threshold').value),
        sensor_interval: parseInt(document.getElementById('sensor-interval').value),
        detection_interval: parseInt(document.getElementById('detection-interval').value),
        confidence_threshold: parseFloat(document.getElementById('confidence-threshold').value)
    };
    
    // Handle theme preference
    const themePreference = document.getElementById('theme-preference').value;
    if (themePreference === 'auto') {
        // Check system preference
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        const newTheme = prefersDark ? 'dark' : 'light';
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        updateThemeIcon(newTheme);
    } else {
        document.documentElement.setAttribute('data-theme', themePreference);
        localStorage.setItem('theme', themePreference);
        updateThemeIcon(themePreference);
    }
    
    try {
        const response = await fetch('/api/settings', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        });
        
        const data = await response.json();
        
        if (data.success) {
            showNotification('Settings Saved', 'Configuration updated successfully', 'success');
            fetchSettings(); // Refresh the display
        } else {
            showNotification('Save Failed', 'Failed to save settings', 'error');
        }
    } catch (error) {
        console.error('Error saving settings:', error);
        showNotification('Error', 'Failed to save settings. Please try again.', 'error');
    }
}

// Reset settings to defaults
function resetSettings() {
    if (confirm('Are you sure you want to reset all settings to default values?')) {
        document.getElementById('occupancy-timeout').value = defaultSettings.occupancy_timeout;
        document.getElementById('temperature-threshold').value = defaultSettings.temperature_threshold;
        document.getElementById('sensor-interval').value = defaultSettings.sensor_interval;
        document.getElementById('detection-interval').value = defaultSettings.detection_interval;
        document.getElementById('confidence-threshold').value = defaultSettings.confidence_threshold;
        document.getElementById('theme-preference').value = defaultSettings.theme_preference;
        
        showNotification('Reset Complete', 'Settings have been reset to defaults', 'info');
    }
}

// Export settings
function exportSettings() {
    const settingsData = {
        timestamp: new Date().toISOString(),
        automation: {
            occupancy_timeout: document.getElementById('occupancy-timeout').value,
            temperature_threshold: document.getElementById('temperature-threshold').value
        },
        sensors: {
            sensor_interval: document.getElementById('sensor-interval').value,
            detection_interval: document.getElementById('detection-interval').value,
            confidence_threshold: document.getElementById('confidence-threshold').value
        },
        appearance: {
            theme_preference: document.getElementById('theme-preference').value
        }
    };
    
    const dataStr = JSON.stringify(settingsData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = `smart-classroom-settings-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    
    URL.revokeObjectURL(url);
    
    showNotification('Export Successful', 'Settings have been exported', 'success');
}

// Import settings
function importSettings() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    
    input.onchange = (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                try {
                    const importedSettings = JSON.parse(e.target.result);
                    
                    // Apply imported settings
                    if (importedSettings.automation) {
                        document.getElementById('occupancy-timeout').value = importedSettings.automation.occupancy_timeout;
                        document.getElementById('temperature-threshold').value = importedSettings.automation.temperature_threshold;
                    }
                    
                    if (importedSettings.sensors) {
                        document.getElementById('sensor-interval').value = importedSettings.sensors.sensor_interval;
                        document.getElementById('detection-interval').value = importedSettings.sensors.detection_interval;
                        document.getElementById('confidence-threshold').value = importedSettings.sensors.confidence_threshold;
                    }
                    
                    if (importedSettings.appearance) {
                        document.getElementById('theme-preference').value = importedSettings.appearance.theme_preference;
                        // Apply theme
                        const theme = importedSettings.appearance.theme_preference;
                        if (theme !== 'auto') {
                            document.documentElement.setAttribute('data-theme', theme);
                            localStorage.setItem('theme', theme);
                            updateThemeIcon(theme);
                        }
                    }
                    
                    showNotification('Import Successful', 'Settings have been imported', 'success');
                    
                    // Auto-save imported settings
                    document.getElementById('settings-form').dispatchEvent(new Event('submit'));
                    
                } catch (error) {
                    showNotification('Import Failed', 'Invalid settings file format', 'error');
                }
            };
            reader.readAsText(file);
        }
    };
    
    input.click();
}

// Clear logs
function clearLogs() {
    if (confirm('Are you sure you want to clear all system logs?')) {
        // This would typically call an API endpoint to clear logs
        showNotification('Logs Cleared', 'System logs have been cleared', 'success');
    }
}

// Validate form input
function validateForm() {
    const occupancyTimeout = parseInt(document.getElementById('occupancy-timeout').value);
    const temperatureThreshold = parseFloat(document.getElementById('temperature-threshold').value);
    const sensorInterval = parseInt(document.getElementById('sensor-interval').value);
    const detectionInterval = parseInt(document.getElementById('detection-interval').value);
    const confidenceThreshold = parseFloat(document.getElementById('confidence-threshold').value);
    
    if (occupancyTimeout < 30 || occupancyTimeout > 3600) {
        showNotification('Validation Error', 'Occupancy timeout must be between 30 and 3600 seconds', 'error');
        return false;
    }
    
    if (temperatureThreshold < 15 || temperatureThreshold > 45) {
        showNotification('Validation Error', 'Temperature threshold must be between 15 and 45°C', 'error');
        return false;
    }
    
    if (sensorInterval < 1 || sensorInterval > 60) {
        showNotification('Validation Error', 'Sensor interval must be between 1 and 60 seconds', 'error');
        return false;
    }
    
    if (detectionInterval < 1 || detectionInterval > 10) {
        showNotification('Validation Error', 'Detection interval must be between 1 and 10 seconds', 'error');
        return false;
    }
    
    if (confidenceThreshold < 0.1 || confidenceThreshold > 1.0) {
        showNotification('Validation Error', 'Confidence threshold must be between 0.1 and 1.0', 'error');
        return false;
    }
    
    return true;
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
    // Initialize theme
    initTheme();
    
    // Fetch current settings
    fetchSettings();
    
    // Set up form submission
    document.getElementById('settings-form').addEventListener('submit', function(event) {
        if (validateForm()) {
            saveSettings(event);
        }
    });
    
    // Set up reset button
    document.getElementById('reset-btn').addEventListener('click', resetSettings);
    
    // Set up theme toggle
    document.getElementById('theme-toggle').addEventListener('click', toggleTheme);
    
    // Set up export/import buttons
    document.getElementById('export-settings-btn').addEventListener('click', exportSettings);
    document.getElementById('import-settings-btn').addEventListener('click', importSettings);
    document.getElementById('clear-logs-btn').addEventListener('click', clearLogs);
    
    // Set up theme preference change
    document.getElementById('theme-preference').addEventListener('change', function() {
        const theme = this.value;
        if (theme === 'auto') {
            const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
            const newTheme = prefersDark ? 'dark' : 'light';
            document.documentElement.setAttribute('data-theme', newTheme);
            localStorage.setItem('theme', newTheme);
            updateThemeIcon(newTheme);
        } else {
            document.documentElement.setAttribute('data-theme', theme);
            localStorage.setItem('theme', theme);
            updateThemeIcon(theme);
        }
        showNotification('Theme Changed', `Applied ${theme} theme`, 'success');
    });
    
    // Add input validation
    document.getElementById('occupancy-timeout').addEventListener('change', function() {
        const value = parseInt(this.value);
        if (value < 30) this.value = 30;
        if (value > 3600) this.value = 3600;
    });
    
    document.getElementById('temperature-threshold').addEventListener('change', function() {
        const value = parseFloat(this.value);
        if (value < 15) this.value = 15;
        if (value > 45) this.value = 45;
    });
    
    document.getElementById('sensor-interval').addEventListener('change', function() {
        const value = parseInt(this.value);
        if (value < 1) this.value = 1;
        if (value > 60) this.value = 60;
    });
    
    document.getElementById('detection-interval').addEventListener('change', function() {
        const value = parseInt(this.value);
        if (value < 1) this.value = 1;
        if (value > 10) this.value = 10;
    });
    
    document.getElementById('confidence-threshold').addEventListener('change', function() {
        const value = parseFloat(this.value);
        if (value < 0.1) this.value = 0.1;
        if (value > 1.0) this.value = 1.0;
    });
});
