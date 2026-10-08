"""
Virtual Device Controller
Simulates real device control behavior with realistic response times and state management
"""

import time
import random
from datetime import datetime
from .simulation_config import SimulationConfig

class VirtualDeviceController:
    """Virtual device controller that mimics real hardware behavior"""
    
    def __init__(self):
        self.config = SimulationConfig()
        
        # Device states
        self.light_state = False
        self.fan_state = False
        self.fan_speed = 0  # 0-100 percentage
        
        # Device states for realistic simulation
        self.light_brightness = 0  # 0-100 percentage
        self.fan_rpm = 0  # Actual RPM
        self.target_light_brightness = 0
        self.target_fan_speed = 0
        
        # Device health
        self.light_device_online = True
        self.fan_device_online = True
        
        # Timing simulation
        self.last_command_time = {}
        self.device_response_times = {
            'light': 0.1,  # Average response time in seconds
            'fan': 0.15
        }
        
        # Energy tracking
        self.light_runtime = 0  # Total runtime in seconds
        self.fan_runtime = 0
        self.light_energy_consumed = 0.0  # kWh
        self.fan_energy_consumed = 0.0
    
    def set_light(self, state, brightness=100):
        """
        Control virtual light with realistic behavior
        state: True (ON) or False (OFF)
        brightness: 0-100 percentage
        """
        if not self.light_device_online:
            return {'success': False, 'error': 'Light device offline', 'state': self.light_state}
        
        command_time = time.time()
        
        # Simulate realistic response time
        response_time = self.device_response_times['light'] + random.uniform(-0.02, 0.02)
        time.sleep(max(0, response_time))
        
        if state:
            self.light_state = True
            self.target_light_brightness = brightness
            
            # Simulate warm-up time
            warmup_time = self.config.LIGHT_WARMUP_TIME * (100 / brightness) * 0.5
            time.sleep(warmup_time * 0.1)  # Simulated warmup
            
            self.light_brightness = brightness
        else:
            self.light_state = False
            self.target_light_brightness = 0
            
            # Simulate cooldown time
            cooldown_time = self.config.LIGHT_COOLDOWN_TIME
            time.sleep(cooldown_time * 0.1)  # Simulated cooldown
            
            self.light_brightness = 0
        
        self.last_command_time['light'] = command_time
        
        # Update runtime tracking
        if state:
            self.light_runtime += 1
            # Calculate energy consumption: (power_watts * runtime_hours) / 1000
            power_kw = self.config.LIGHT_POWER_RATING / 1000
            hours = 1 / 3600  # 1 second
            self.light_energy_consumed += power_kw * hours
        
        return {
            'success': True,
            'state': self.light_state,
            'brightness': self.light_brightness,
            'response_time': round(response_time, 3),
            'timestamp': datetime.now().isoformat()
        }
    
    def set_fan(self, state, speed=100):
        """
        Control virtual fan with realistic behavior
        state: True (ON) or False (OFF)
        speed: 0-100 percentage
        """
        if not self.fan_device_online:
            return {'success': False, 'error': 'Fan device offline', 'state': self.fan_state}
        
        command_time = time.time()
        
        # Simulate realistic response time
        response_time = self.device_response_times['fan'] + random.uniform(-0.03, 0.03)
        time.sleep(max(0, response_time))
        
        if state:
            self.fan_state = True
            self.target_fan_speed = speed
            
            # Simulate spin-up time
            spinup_time = self.config.FAN_SPINUP_TIME * (100 / speed) * 0.5
            time.sleep(spinup_time * 0.1)  # Simulated spinup
            
            self.fan_speed = speed
            self.fan_rpm = speed * 30  # Simulated RPM (0-3000 RPM)
        else:
            self.fan_state = False
            self.target_fan_speed = 0
            
            # Simulate spindown time
            spindown_time = self.config.FAN_SPINDOWN_TIME
            time.sleep(spindown_time * 0.1)  # Simulated spindown
            
            self.fan_speed = 0
            self.fan_rpm = 0
        
        self.last_command_time['fan'] = command_time
        
        # Update runtime tracking
        if state:
            self.fan_runtime += 1
            # Calculate energy consumption
            power_kw = self.config.FAN_POWER_RATING / 1000
            hours = 1 / 3600
            self.fan_energy_consumed += power_kw * hours
        
        return {
            'success': True,
            'state': self.fan_state,
            'speed': self.fan_speed,
            'rpm': self.fan_rpm,
            'response_time': round(response_time, 3),
            'timestamp': datetime.now().isoformat()
        }
    
    def get_device_states(self):
        """Return current device states"""
        return {
            'light': {
                'state': self.light_state,
                'brightness': self.light_brightness,
                'online': self.light_device_online,
                'runtime_seconds': self.light_runtime,
                'energy_consumed_kwh': round(self.light_energy_consumed, 4)
            },
            'fan': {
                'state': self.fan_state,
                'speed': self.fan_speed,
                'rpm': self.fan_rpm,
                'online': self.fan_device_online,
                'runtime_seconds': self.fan_runtime,
                'energy_consumed_kwh': round(self.fan_energy_consumed, 4)
            },
            'timestamp': datetime.now().isoformat()
        }
    
    def simulate_device_behavior(self):
        """Simulate gradual device state changes (warm-up, cooldown, spin-up, spindown)"""
        # Simulate light brightness approaching target
        if self.light_state and self.light_brightness < self.target_light_brightness:
            self.light_brightness = min(self.target_light_brightness, 
                                         self.light_brightness + 5)
        elif not self.light_state and self.light_brightness > 0:
            self.light_brightness = max(0, self.light_brightness - 10)
        
        # Simulate fan speed approaching target
        if self.fan_state and self.fan_speed < self.target_fan_speed:
            self.fan_speed = min(self.target_fan_speed, self.fan_speed + 2)
            self.fan_rpm = self.fan_speed * 30
        elif not self.fan_state and self.fan_speed > 0:
            self.fan_speed = max(0, self.fan_speed - 5)
            self.fan_rpm = self.fan_speed * 30
    
    def force_device_state(self, device, state):
        """Force device to specific state for testing"""
        if device == 'light':
            self.light_device_online = state
        elif device == 'fan':
            self.fan_device_online = state
    
    def reset_energy_tracking(self):
        """Reset energy tracking for testing"""
        self.light_runtime = 0
        self.fan_runtime = 0
        self.light_energy_consumed = 0.0
        self.fan_energy_consumed = 0.0
