"""
Main Flask application for Smart Classroom Monitoring System
"""

from flask import Flask, render_template, jsonify, request
from datetime import datetime
import random
import json
import os
from config import Config

app = Flask(__name__)
app.config.from_object(Config)

# Demo mode state (simulated hardware state)
demo_state = {
    'temperature': 25.0,
    'humidity': 60.0,
    'pir_motion': False,
    'people_detected': 0,
    'occupied': False,
    'light_on': False,
    'fan_on': False,
    'auto_mode': True,
    'last_motion_time': None,
    'empty_room_timer': 0,
    'light_runtime_minutes': 0,
    'fan_runtime_minutes': 0,
    'energy_saved_kwh': 0.0
}

# Simulated historical data for charts
historical_data = {
    'temperature': [],
    'humidity': [],
    'occupancy': [],
    'timestamps': []
}

def generate_demo_data():
    """Generate simulated sensor data for demo mode"""
    # Simulate temperature fluctuations
    demo_state['temperature'] = round(24 + random.uniform(-2, 3), 1)
    
    # Simulate humidity fluctuations
    demo_state['humidity'] = round(55 + random.uniform(-10, 15), 1)
    
    # Simulate random motion detection
    demo_state['pir_motion'] = random.random() > 0.7
    
    # Simulate people detection (0-3 people)
    if demo_state['pir_motion']:
        demo_state['people_detected'] = random.randint(1, 3)
        demo_state['occupied'] = True
        demo_state['last_motion_time'] = datetime.now()
        demo_state['empty_room_timer'] = 0
    else:
        demo_state['people_detected'] = 0
        demo_state['empty_room_timer'] += 1
        
        # If empty for too long, mark as unoccupied
        # Using 3 seconds as the update interval for demo purposes
        if demo_state['empty_room_timer'] > (Config.OCCUPANCY_TIMEOUT / 3):
            demo_state['occupied'] = False
    
    # Simulate appliance control in auto mode
    if demo_state['auto_mode']:
        if demo_state['occupied']:
            demo_state['light_on'] = True
            # Turn on fan if temperature is high
            demo_state['fan_on'] = demo_state['temperature'] > Config.TEMPERATURE_THRESHOLD
        else:
            demo_state['light_on'] = False
            demo_state['fan_on'] = False
    
    # Update runtime counters and energy savings
    if demo_state['light_on']:
        demo_state['light_runtime_minutes'] += 1
    if demo_state['fan_on']:
        demo_state['fan_runtime_minutes'] += 1
    
    # Simulate energy savings (when appliances are off in auto mode)
    if demo_state['auto_mode'] and not demo_state['occupied']:
        demo_state['energy_saved_kwh'] += 0.001  # Small increment
    
    # Add to historical data (keep last 50 points)
    current_time = datetime.now().strftime('%H:%M:%S')
    historical_data['timestamps'].append(current_time)
    historical_data['temperature'].append(demo_state['temperature'])
    historical_data['humidity'].append(demo_state['humidity'])
    historical_data['occupancy'].append(1 if demo_state['occupied'] else 0)
    
    # Keep only last 50 data points
    for key in historical_data:
        if len(historical_data[key]) > 50:
            historical_data[key] = historical_data[key][-50:]

@app.route('/')
def index():
    """Main dashboard page"""
    return render_template('index.html', demo_mode=app.config['DEMO_MODE'], demo_state=demo_state)

@app.route('/api/status')
def get_status():
    """API endpoint to get current system status"""
    if app.config['DEMO_MODE']:
        generate_demo_data()
    
    return jsonify({
        'demo_mode': app.config['DEMO_MODE'],
        'occupied': demo_state['occupied'],
        'people_detected': demo_state['people_detected'],
        'temperature': demo_state['temperature'],
        'humidity': demo_state['humidity'],
        'pir_motion': demo_state['pir_motion'],
        'light_on': demo_state['light_on'],
        'fan_on': demo_state['fan_on'],
        'auto_mode': demo_state['auto_mode'],
        'last_update': datetime.now().strftime('%Y-%m-%d %H:%M:%S'),
        'empty_room_timer': demo_state['empty_room_timer'],
        'energy_saved_kwh': round(demo_state['energy_saved_kwh'], 3),
        'light_runtime_minutes': demo_state['light_runtime_minutes'],
        'fan_runtime_minutes': demo_state['fan_runtime_minutes']
    })

@app.route('/api/historical')
def get_historical():
    """API endpoint to get historical data for charts"""
    return jsonify(historical_data)

@app.route('/api/control', methods=['POST'])
def control_appliance():
    """API endpoint to control appliances manually"""
    data = request.json
    
    if 'auto_mode' in data:
        demo_state['auto_mode'] = data['auto_mode']
    
    if not demo_state['auto_mode']:
        # Manual control
        if 'light_on' in data:
            demo_state['light_on'] = data['light_on']
        if 'fan_on' in data:
            demo_state['fan_on'] = data['fan_on']
    
    return jsonify({
        'success': True,
        'auto_mode': demo_state['auto_mode'],
        'light_on': demo_state['light_on'],
        'fan_on': demo_state['fan_on']
    })

@app.route('/api/settings', methods=['GET', 'POST'])
def settings():
    """API endpoint for system settings"""
    if request.method == 'POST':
        data = request.json
        
        if 'occupancy_timeout' in data:
            Config.OCCUPANCY_TIMEOUT = int(data['occupancy_timeout'])
        if 'temperature_threshold' in data:
            Config.TEMPERATURE_THRESHOLD = float(data['temperature_threshold'])
        
        return jsonify({'success': True})
    
    # GET request - return current settings
    return jsonify({
        'occupancy_timeout': Config.OCCUPANCY_TIMEOUT,
        'temperature_threshold': Config.TEMPERATURE_THRESHOLD,
        'auto_mode_enabled': Config.AUTO_MODE_ENABLED
    })

@app.route('/analytics')
def analytics():
    """Analytics page with historical charts"""
    return render_template('analytics.html', demo_mode=app.config['DEMO_MODE'])

@app.route('/settings')
def settings_page():
    """Settings page"""
    return render_template('settings.html', demo_mode=app.config['DEMO_MODE'])

if __name__ == '__main__':
    # Check if running in production
    is_production = os.environ.get('PYTHONANYWHERE_DOMAIN') or os.environ.get('PRODUCTION')
    
    print(f"Starting Smart Classroom Monitoring System")
    print(f"Demo Mode: {app.config['DEMO_MODE']}")
    print(f"Environment: {'Production' if is_production else 'Development'}")
    
    if is_production:
        print(f"Access dashboard at: https://{os.environ.get('PYTHONANYWHERE_DOMAIN', 'your-domain.pythonanywhere.com')}")
        app.run(host='0.0.0.0', port=5000, debug=False)
    else:
        print(f"Access dashboard at: http://127.0.0.1:5000")
        app.run(host='0.0.0.0', port=5000, debug=True)
