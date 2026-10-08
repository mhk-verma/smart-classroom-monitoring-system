"""
Automation Engine for Smart Classroom
Implements intelligent automation logic with configurable thresholds and hysteresis
"""

import time
from datetime import datetime
from .simulation_config import SimulationConfig

class AutomationEngine:
    """Professional automation engine with configurable rules and hysteresis"""
    
    def __init__(self, sensor_simulator, device_controller):
        self.config = SimulationConfig()
        self.sensor_sim = sensor_simulator
        self.device_controller = device_controller
        
        # Automation state
        self.automation_enabled = True
        self.automation_mode = 'AUTO'  # AUTO or MANUAL
        
        # Automation timers
        self.empty_room_timer = 0
        self.last_occupancy_time = None
        
        # Automation events log
        self.automation_events = []
        
        # Current occupancy state
        self.occupied = False
    
    def update_automation(self):
        """Run automation logic based on current sensor states"""
        if not self.automation_enabled or self.automation_mode != 'AUTO':
            return
        
        sensor_states = self.sensor_sim.get_sensor_states()
        
        # Determine occupancy from sensor data
        self._determine_occupancy(sensor_states)
        
        # Apply hysteresis and timers
        self._apply_occupancy_hysteresis()
        
        # Execute automation rules
        self._execute_automation_rules(sensor_states)
    
    def _determine_occupancy(self, sensor_states):
        """Determine occupancy from combined sensor data"""
        if not sensor_states['camera_online']:
            # Camera offline - use PIR as fallback
            if sensor_states['pir_online'] and sensor_states['motion_detected']:
                if not self.occupied:
                    self.last_occupancy_time = datetime.now()
                self.occupied = True
            else:
                # No motion detected
                if self.occupied and self._is_occupancy_timeout():
                    self.occupied = False
        else:
            # Camera online - use people detection
            if sensor_states['people_count'] > 0:
                if not self.occupied:
                    self.last_occupancy_time = datetime.now()
                    self._log_automation_event('Occupancy detected', 
                                           f"{sensor_states['people_count']} people detected")
                self.occupied = True
                self.empty_room_timer = 0
            else:
                # No people detected
                if self.occupied and self._is_occupancy_timeout():
                    self._log_automation_event('Occupancy timeout', 
                                           'Room empty for configured duration')
                    self.occupied = False
    
    def _apply_occupancy_hysteresis(self):
        """Apply hysteresis to prevent rapid state changes"""
        if self.occupied:
            self.empty_room_timer = 0
        else:
            self.empty_room_timer += 1
    
    def _is_occupancy_timeout(self):
        """Check if empty room timer has exceeded threshold"""
        # Use simulation interval (3 seconds in demo mode)
        timeout_seconds = self.config.OCCUPANCY_TIMEOUT / 3
        return self.empty_room_timer > timeout_seconds
    
    def _execute_automation_rules(self, sensor_states):
        """Execute automation rules based on sensor data and configuration"""
        if not self.occupied:
            # Room is empty - turn off appliances after timeout
            self._turn_off_appliances('Occupancy timeout')
            return
        
        # Room is occupied - apply automation rules
        self._automate_lighting(sensor_states)
        self._automate_fan_control(sensor_states)
    
    def _automate_lighting(self, sensor_states):
        """Automate lighting based on occupancy and ambient light"""
        if not sensor_states['ldr_online']:
            return
        
        current_light = sensor_states['light_level']
        
        # Automatic lighting: turn on if light level is below threshold
        if current_light < self.config.LIGHT_THRESHOLD:
            result = self.device_controller.set_light(True, 100)
            if result['success']:
                self._log_automation_event('Light automation', 
                                       f"Light ON - Low ambient light ({current_light} < {self.config.LIGHT_THRESHOLD})")
        else:
            # Light level is sufficient - turn off
            result = self.device_controller.set_light(False)
            if result['success']:
                self._log_automation_event('Light automation', 
                                       f"Light OFF - Sufficient ambient light ({current_light} >= {self.config.LIGHT_THRESHOLD})")
    
    def _automate_fan_control(self, sensor_states):
        """Automate fan based on temperature with hysteresis"""
        if not sensor_states['dht22_online']:
            return
        
        current_temp = sensor_states['temperature']
        
        # Apply hysteresis
        threshold = self.config.TEMPERATURE_THRESHOLD
        hysteresis = self.config.HYSTERESIS_TEMPERATURE
        
        # Turn on if temperature exceeds threshold + hysteresis
        if current_temp > (threshold + hysteresis):
            # Adjust fan speed based on temperature
            fan_speed = min(100, int((current_temp - threshold) * 10))
            result = self.device_controller.set_fan(True, fan_speed)
            if result['success']:
                self._log_automation_event('Fan automation', 
                                       f"Fan ON at {fan_speed}% - Temperature {current_temp}°C > {threshold}°C")
        
        # Turn off if temperature drops below threshold - hysteresis
        elif current_temp < (threshold - hysteresis):
            result = self.device_controller.set_fan(False)
            if result['success']:
                self._log_automation_event('Fan automation', 
                                       f"Fan OFF - Temperature {current_temp}°C < {threshold}°C")
    
    def _turn_off_appliances(self, reason):
        """Turn off all appliances with safety logging"""
        light_result = self.device_controller.set_light(False)
        fan_result = self.device_controller.set_fan(False)
        
        if light_result['success']:
            self._log_automation_event('Safety shutdown', f"Light OFF - {reason}")
        
        if fan_result['success']:
            self._log_automation_event('Safety shutdown', f"Fan OFF - {reason}")
    
    def set_automation_mode(self, mode):
        """Set automation mode (AUTO or MANUAL)"""
        if mode in ['AUTO', 'MANUAL']:
            self.automation_mode = mode
            self._log_automation_event('Mode change', f"Automation mode set to {mode}")
    
    def set_automation_enabled(self, enabled):
        """Enable or disable automation"""
        self.automation_enabled = enabled
        self._log_automation_event('Automation state', 
                               f"Automation {'enabled' if enabled else 'disabled'}")
    
    def set_threshold(self, parameter, value):
        """Set automation threshold parameters"""
        if parameter == 'occupancy_timeout':
            self.config.OCCUPANCY_TIMEOUT = value
        elif parameter == 'temperature_threshold':
            self.config.TEMPERATURE_THRESHOLD = value
        elif parameter == 'light_threshold':
            self.config.LIGHT_THRESHOLD = value
        
        self._log_automation_event('Threshold update', 
                               f"{parameter} set to {value}")
    
    def get_automation_state(self):
        """Return current automation state"""
        return {
            'automation_enabled': self.automation_enabled,
            'automation_mode': self.automation_mode,
            'occupied': self.occupied,
            'empty_room_timer': self.empty_room_timer,
            'last_occupancy_time': self.last_occupancy_time.isoformat() if self.last_occupancy_time else None,
            'thresholds': {
                'occupancy_timeout': self.config.OCCUPANCY_TIMEOUT,
                'temperature_threshold': self.config.TEMPERATURE_THRESHOLD,
                'light_threshold': self.config.LIGHT_THRESHOLD
            },
            'timestamp': datetime.now().isoformat()
        }
    
    def get_automation_events(self):
        """Return automation event log"""
        return self.automation_events
    
    def _log_automation_event(self, event_type, message):
        """Log automation event with timestamp"""
        event = {
            'timestamp': datetime.now().isoformat(),
            'event_type': event_type,
            'message': message
        }
        self.automation_events.append(event)
        
        # Keep only last 100 events
        if len(self.automation_events) > 100:
            self.automation_events = self.automation_events[-100:]
    
    def manual_control(self, appliance, state, parameter=None):
        """Execute manual control override"""
        if appliance == 'light':
            brightness = parameter if parameter else 100
            result = self.device_controller.set_light(state, brightness)
        elif appliance == 'fan':
            speed = parameter if parameter else 100
            result = self.device_controller.set_fan(state, speed)
        else:
            return {'success': False, 'error': 'Unknown appliance'}
        
        if result['success']:
            self._log_automation_event('Manual control', 
                                   f"{appliance.capitalize()} {'ON' if state else 'OFF'} via manual override")
        
        return result