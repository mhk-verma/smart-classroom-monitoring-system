"""
State Manager for Smart Classroom Simulation
Central state management with real-time updates and persistence
"""

import json
import time
import random
from datetime import datetime
from .sensor_simulator import SensorSimulator
from .device_controller import VirtualDeviceController
from .automation_engine import AutomationEngine
from .simulation_config import SimulationConfig

class StateManager:
    """Central state manager for the simulation system"""
    
    def __init__(self):
        self.config = SimulationConfig()
        
        # Initialize simulation components
        self.sensor_simulator = SensorSimulator()
        self.device_controller = VirtualDeviceController()
        self.automation_engine = AutomationEngine(self.sensor_simulator, self.device_controller)
        
        # System state
        self.system_online = True
        self.last_update = datetime.now()
        
        # Device simulation state
        self.device_status = {
            'cpu_usage': self.config.DEVICE_CPU_BASE,
            'memory_usage': self.config.DEVICE_MEMORY_BASE,
            'device_temperature': self.config.DEVICE_TEMPERATURE_BASE,
            'uptime': 0,
            'network_latency': self.config.NETWORK_LATENCY_BASE,
            'network_bandwidth': self.config.NETWORK_BANDWIDTH_BASE
        }
        
        # Simulation start time
        self.simulation_start_time = time.time()
        
        # Historical data storage
        self.historical_data = {
            'temperature': [],
            'humidity': [],
            'light_level': [],
            'people_count': [],
            'timestamp': []
        }
        
        # Update callbacks
        self.state_change_callbacks = []
    
    def update_simulation(self, external_factors=None):
        """Update all simulation components"""
        current_time = time.time()
        
        # Update sensor simulation
        self.sensor_simulator.update_simulation(external_factors)
        
        # Update device behavior (gradual changes)
        self.device_controller.simulate_device_behavior()
        
        # Run automation engine
        self.automation_engine.update_automation()
        
        # Update device status simulation
        self._update_device_status()
        
        # Update uptime
        self.device_status['uptime'] = int(current_time - self.simulation_start_time)
        
        # Update last update time
        self.last_update = datetime.now()
        
        # Store historical data
        self._store_historical_data()
        
        # Notify state change callbacks
        self._notify_state_change()
    
    def _update_device_status(self):
        """Simulate realistic device status changes"""
        # CPU usage fluctuation
        cpu_change = random.uniform(-2, 2)
        self.device_status['cpu_usage'] = max(5, min(95, 
            self.device_status['cpu_usage'] + cpu_change))
        
        # Memory usage fluctuation
        memory_change = random.uniform(-3, 3)
        self.device_status['memory_usage'] = max(20, min(80,
            self.device_status['memory_usage'] + memory_change))
        
        # Device temperature fluctuation
        temp_change = random.uniform(-1, 1)
        self.device_status['device_temperature'] = max(35, min(55,
            self.device_status['device_temperature'] + temp_change))
        
        # Network latency fluctuation
        latency_change = random.uniform(-10, 10)
        self.device_status['network_latency'] = max(10, min(100,
            self.device_status['network_latency'] + latency_change))
        
        # Network bandwidth fluctuation
        bandwidth_change = random.uniform(-20, 20)
        self.device_status['network_bandwidth'] = max(50, min(150,
            self.device_status['network_bandwidth'] + bandwidth_change))
    
    def _store_historical_data(self):
        """Store historical data for analytics"""
        current_time = datetime.now().strftime('%H:%M:%S')
        
        self.historical_data['timestamp'].append(current_time)
        self.historical_data['temperature'].append(self.sensor_simulator.temperature)
        self.historical_data['humidity'].append(self.sensor_simulator.humidity)
        self.historical_data['light_level'].append(self.sensor_simulator.light_level)
        self.historical_data['people_count'].append(self.sensor_simulator.people_count)
        
        # Keep only last 100 data points
        for key in self.historical_data:
            if len(self.historical_data[key]) > 100:
                self.historical_data[key] = self.historical_data[key][-100:]
    
    def _notify_state_change(self):
        """Notify registered callbacks of state changes"""
        state = self.get_complete_state()
        for callback in self.state_change_callbacks:
            callback(state)
    
    def register_state_callback(self, callback):
        """Register a callback to be called on state changes"""
        self.state_change_callbacks.append(callback)
    
    def get_complete_state(self):
        """Return complete system state for dashboard"""
        sensor_states = self.sensor_simulator.get_sensor_states()
        device_states = self.device_controller.get_device_states()
        automation_state = self.automation_engine.get_automation_state()
        
        return {
            'system': {
                'online': self.system_online,
                'last_update': self.last_update.isoformat(),
                'uptime_seconds': self.device_status['uptime'],
                'simulation_active': True
            },
            'sensors': sensor_states,
            'devices': device_states,
            'automation': automation_state,
            'device_status': self.device_status
        }
    
    def get_historical_data(self):
        """Return historical data for charts"""
        return self.historical_data
    
    def manual_control(self, appliance, state, parameter=None):
        """Execute manual control through automation engine"""
        return self.automation_engine.manual_control(appliance, state, parameter)
    
    def set_automation_mode(self, mode):
        """Set automation mode"""
        self.automation_engine.set_automation_mode(mode)
    
    def set_automation_enabled(self, enabled):
        """Enable or disable automation"""
        self.automation_engine.set_automation_enabled(enabled)
    
    def set_threshold(self, parameter, value):
        """Set automation threshold"""
        self.automation_engine.set_threshold(parameter, value)
    
    def set_manual_sensor_value(self, sensor, value):
        """Manually set sensor value for testing"""
        if sensor == 'temperature':
            self.sensor_simulator.set_manual_temperature(value)
        elif sensor == 'humidity':
            self.sensor_simulator.set_manual_humidity(value)
        elif sensor == 'light_level':
            self.sensor_simulator.set_manual_light_level(value)
    
    def force_sensor_state(self, sensor, state):
        """Force sensor to specific state for testing"""
        self.sensor_simulator.force_sensor_state(sensor, state)
    
    def force_device_state(self, device, state):
        """Force device to specific state for testing"""
        self.device_controller.force_device_state(device, state)
    
    def get_automation_events(self):
        """Return automation event log"""
        return self.automation_engine.get_automation_events()
    
    def reset_energy_tracking(self):
        """Reset energy tracking"""
        self.device_controller.reset_energy_tracking()
    
    def simulate_external_influence(self, influence_type, value):
        """Simulate external influence on sensors for testing"""
        factors = {}
        if influence_type == 'occupancy_change':
            factors['occupancy_change'] = value
        elif influence_type == 'light_change':
            factors['light_change'] = value
        
        self.sensor_simulator.update_simulation(factors)
    
    def get_energy_statistics(self):
        """Calculate energy statistics"""
        device_states = self.device_controller.get_device_states()
        
        # Calculate estimated energy consumption
        light_energy = device_states['light']['energy_consumed_kwh']
        fan_energy = device_states['fan']['energy_consumed_kwh']
        total_energy = light_energy + fan_energy
        
        # Calculate cost based on tariff
        total_cost = total_energy * self.config.ELECTRICITY_TARIFF
        
        return {
            'light_energy_kwh': round(light_energy, 4),
            'fan_energy_kwh': round(fan_energy, 4),
            'total_energy_kwh': round(total_energy, 4),
            'estimated_cost': round(total_cost, 2),
            'light_runtime_minutes': device_states['light']['runtime_seconds'] // 60,
            'fan_runtime_minutes': device_states['fan']['runtime_seconds'] // 60
        }