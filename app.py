"""
Main Flask application for Smart Classroom Monitoring System
Professional software simulation of IoT classroom monitoring system
"""

from flask import Flask, render_template, jsonify, request
from datetime import datetime
import os
from config import Config
from simulation.state_manager import StateManager

app = Flask(__name__)
app.config.from_object(Config)

# Initialize professional simulation engine
state_manager = StateManager()

@app.route('/')
def index():
    """Main dashboard page"""
    # Update simulation before rendering
    state_manager.update_simulation()
    return render_template('index.html', simulation_mode=True)

@app.route('/api/status')
def get_status():
    """API endpoint to get current system status from simulation engine"""
    # Update simulation
    state_manager.update_simulation()
    
    # Get complete state
    complete_state = state_manager.get_complete_state()
    energy_stats = state_manager.get_energy_statistics()
    
    # Format response for dashboard compatibility
    return jsonify({
        'simulation_mode': True,
        'occupied': complete_state['automation']['occupied'],
        'people_detected': complete_state['sensors']['people_count'],
        'temperature': complete_state['sensors']['temperature'],
        'humidity': complete_state['sensors']['humidity'],
        'light_level': complete_state['sensors']['light_level'],
        'motion_detected': complete_state['sensors']['motion_detected'],
        'light_on': complete_state['devices']['light']['state'],
        'fan_on': complete_state['devices']['fan']['state'],
        'fan_speed': complete_state['devices']['fan']['speed'],
        'auto_mode': complete_state['automation']['automation_mode'] == 'AUTO',
        'last_update': complete_state['system']['last_update'],
        'empty_room_timer': complete_state['automation']['empty_room_timer'],
        'energy_consumed_kwh': energy_stats['total_energy_kwh'],
        'estimated_cost': energy_stats['estimated_cost'],
        'light_runtime_minutes': energy_stats['light_runtime_minutes'],
        'fan_runtime_minutes': energy_stats['fan_runtime_minutes'],
        'device_status': complete_state['device_status'],
        'sensor_health': {
            'dht22_online': complete_state['sensors']['dht22_online'],
            'pir_online': complete_state['sensors']['pir_online'],
            'ldr_online': complete_state['sensors']['ldr_online'],
            'camera_online': complete_state['sensors']['camera_online']
        }
    })

@app.route('/api/historical')
def get_historical():
    """API endpoint to get historical data for charts"""
    historical = state_manager.get_historical_data()
    return jsonify({
        'temperature': historical['temperature'],
        'humidity': historical['humidity'],
        'light_level': historical['light_level'],
        'occupancy': [1 if count > 0 else 0 for count in historical['people_count']],
        'people_count': historical['people_count'],
        'timestamps': historical['timestamp']
    })

@app.route('/api/control', methods=['POST'])
def control_appliance():
    """API endpoint to control appliances manually through simulation"""
    data = request.json
    
    result = {'success': True}
    
    # Handle automation mode change
    if 'auto_mode' in data:
        mode = 'AUTO' if data['auto_mode'] else 'MANUAL'
        state_manager.set_automation_mode(mode)
        result['auto_mode'] = data['auto_mode']
    
    # Handle manual appliance control
    if data.get('auto_mode') == False:
        if 'light_on' in data:
            control_result = state_manager.manual_control('light', data['light_on'])
            result['light_on'] = control_result['success'] and data['light_on']
            if not control_result['success']:
                result['error'] = control_result.get('error')
        
        if 'fan_on' in data:
            control_result = state_manager.manual_control('fan', data['fan_on'])
            result['fan_on'] = control_result['success'] and data['fan_on']
            if not control_result['success']:
                result['error'] = control_result.get('error')
    
    return jsonify(result)

@app.route('/api/settings', methods=['GET', 'POST'])
def settings():
    """API endpoint for system settings"""
    if request.method == 'POST':
        data = request.json
        
        if 'occupancy_timeout' in data:
            state_manager.set_threshold('occupancy_timeout', int(data['occupancy_timeout']))
        if 'temperature_threshold' in data:
            state_manager.set_threshold('temperature_threshold', float(data['temperature_threshold']))
        if 'light_threshold' in data:
            state_manager.set_threshold('light_threshold', int(data['light_threshold']))
        
        return jsonify({'success': True})
    
    # GET request - return current settings
    automation_state = state_manager.get_automation_state()
    return jsonify({
        'occupancy_timeout': automation_state['thresholds']['occupancy_timeout'],
        'temperature_threshold': automation_state['thresholds']['temperature_threshold'],
        'light_threshold': automation_state['thresholds']['light_threshold'],
        'auto_mode_enabled': automation_state['automation_enabled'],
        'automation_mode': automation_state['automation_mode']
    })

@app.route('/analytics')
def analytics():
    """Analytics page with historical charts"""
    return render_template('analytics.html', simulation_mode=True)

@app.route('/simulation')
def simulation_panel():
    """Simulation control panel for testing"""
    return render_template('simulation.html')

@app.route('/settings')
def settings_page():
    """Settings page"""
    return render_template('settings.html', simulation_mode=True)

@app.route('/api/simulation/control', methods=['POST'])
def simulation_control():
    """API endpoint to control simulation parameters for testing"""
    data = request.json
    
    if 'manual_sensor' in data:
        sensor = data['manual_sensor']
        value = data['value']
        state_manager.set_manual_sensor_value(sensor, value)
    
    if 'force_sensor_state' in data:
        sensor = data['force_sensor_state']
        state = data['state']
        state_manager.force_sensor_state(sensor, state)
    
    if 'force_device_state' in data:
        device = data['force_device_state']
        state = data['state']
        state_manager.force_device_state(device, state)
    
    if 'external_influence' in data:
        influence_type = data['external_influence']
        value = data['value']
        state_manager.simulate_external_influence(influence_type, value)
    
    if 'reset_energy' in data and data['reset_energy']:
        state_manager.reset_energy_tracking()
    
    return jsonify({'success': True})

@app.route('/api/automation/events')
def automation_events():
    """API endpoint to get automation event log"""
    events = state_manager.get_automation_events()
    return jsonify({'events': events})

@app.route('/api/simulation/energy')
def simulation_energy():
    """API endpoint to get energy statistics"""
    energy_stats = state_manager.get_energy_statistics()
    return jsonify(energy_stats)

if __name__ == '__main__':
    # Check if running in production
    is_production = os.environ.get('PYTHONANYWHERE_DOMAIN') or os.environ.get('PRODUCTION')
    
    print(f"Starting Smart Classroom Monitoring System")
    print(f"Mode: Professional Software Simulation")
    print(f"Environment: {'Production' if is_production else 'Development'}")
    print(f"Simulation Engine: Active")
    print(f"Components: Sensor Simulator, Device Controller, Automation Engine")
    
    if is_production:
        print(f"Access dashboard at: https://{os.environ.get('PYTHONANYWHERE_DOMAIN', 'your-domain.pythonanywhere.com')}")
        app.run(host='0.0.0.0', port=5000, debug=False)
    else:
        print(f"Access dashboard at: http://127.0.0.1:5000")
        app.run(host='0.0.0.0', port=5000, debug=True)
