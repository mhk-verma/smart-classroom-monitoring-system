"""
Professional Sensor Simulation Module
Simulates realistic sensor behavior using mathematical models and environmental factors
"""

import time
import random
import math
from datetime import datetime
from .simulation_config import SimulationConfig

class SensorSimulator:
    """Professional sensor simulation using environmental models"""
    
    def __init__(self):
        self.config = SimulationConfig()
        
        # Current sensor states
        self.temperature = self.config.TEMPERATURE_BASE
        self.humidity = self.config.HUMIDITY_BASE
        self.light_level = self.config.LIGHT_LEVEL_BASE
        self.motion_detected = False
        self.people_count = 0
        
        # Environmental factors
        self.time_factor = 0  # For time-based variations
        self.last_update = time.time()
        
        # Sensor health states
        self.dht22_online = True
        self.pir_online = True
        self.ldr_online = True
        self.camera_online = True
        
        # Environmental trends
        self.temperature_trend = 0  # -1 = cooling, 0 = stable, 1 = heating
        self.humidity_trend = 0
        
    def update_simulation(self, external_factors=None):
        """
        Update all sensor simulations with realistic environmental modeling
        external_factors: dict with optional external influences like 'light_change', 'occupancy_change'
        """
        current_time = time.time()
        time_delta = current_time - self.last_update
        self.last_update = current_time
        
        # Update time-based environmental factors
        self._update_time_factors()
        
        # Apply external influences if provided
        if external_factors:
            self._apply_external_factors(external_factors)
        
        # Simulate each sensor with realistic behavior
        self._simulate_temperature(time_delta)
        self._simulate_humidity(time_delta)
        self._simulate_light_level(time_delta)
        self._simulate_motion_detection()
        self._simulate_people_detection()
        
        # Simulate sensor health (random failures)
        self._simulate_sensor_health()
    
    def _update_time_factors(self):
        """Update time-based environmental factors"""
        current_hour = datetime.now().hour
        
        # Simulate daily temperature cycle
        hour_factor = math.sin((current_hour - 6) * math.pi / 12)  # Peak at noon
        self.time_factor = hour_factor
        
        # Set trends based on time of day
        if 6 <= current_hour < 12:
            self.temperature_trend = 1  # Morning warming
        elif 12 <= current_hour < 18:
            self.temperature_trend = 0  # Midday stable
        else:
            self.temperature_trend = -1  # Evening cooling
    
    def _apply_external_factors(self, factors):
        """Apply external influences to sensor readings"""
        if 'light_change' in factors:
            # Light changes affect temperature
            light_change = factors['light_change']
            self.temperature += light_change * 0.1
        
        if 'occupancy_change' in factors:
            # Occupancy affects temperature and humidity
            occupancy_change = factors['occupancy_change']
            if occupancy_change > 0:  # People entered
                self.temperature += 0.5
                self.humidity += 2.0
            else:  # People left
                self.temperature -= 0.3
                self.humidity -= 1.0
    
    def _simulate_temperature(self, time_delta):
        """Simulate realistic temperature behavior"""
        if not self.dht22_online:
            return
        
        # Base temperature with time-based variation
        target_temp = self.config.TEMPERATURE_BASE + (self.time_factor * 2)
        
        # Add trend influence
        target_temp += self.temperature_trend * 0.5
        
        # Add random fluctuation
        fluctuation = random.uniform(-0.5, 0.5)
        
        # Apply response rate (gradual change toward target)
        temp_diff = (target_temp + fluctuation) - self.temperature
        self.temperature += temp_diff * self.config.TEMPERATURE_RESPONSE_RATE
        
        # Ensure temperature stays within realistic bounds
        self.temperature = max(15, min(40, self.temperature))
    
    def _simulate_humidity(self, time_delta):
        """Simulate realistic humidity behavior"""
        if not self.dht22_online:
            return
        
        # Base humidity with time-based variation
        target_humidity = self.config.HUMIDITY_BASE + (math.cos(self.time_factor * 2) * 5)
        
        # Add trend influence
        target_humidity += self.humidity_trend * 2.0
        
        # Add random fluctuation
        fluctuation = random.uniform(-2, 2)
        
        # Apply response rate
        humidity_diff = (target_humidity + fluctuation) - self.humidity
        self.humidity += humidity_diff * self.config.HUMIDITY_RESPONSE_RATE
        
        # Ensure humidity stays within realistic bounds
        self.humidity = max(30, min(90, self.humidity))
    
    def _simulate_light_level(self, time_delta):
        """Simulate realistic ambient light level"""
        if not self.ldr_online:
            return
        
        current_hour = datetime.now().hour
        
        # Day/night cycle for light
        if 6 <= current_hour < 18:
            # Daytime - higher base light
            base_light = 700 + math.sin((current_hour - 6) * math.pi / 12) * 200
        else:
            # Nighttime - lower base light
            base_light = 200 + math.sin((current_hour - 18) * math.pi / 12) * 100
        
        # Add random fluctuation
        fluctuation = random.uniform(-50, 50)
        
        # Gradual change toward target
        light_diff = (base_light + fluctuation) - self.light_level
        self.light_level += light_diff * 0.1
        
        # Ensure light level stays within bounds
        self.light_level = max(0, min(1000, self.light_level))
    
    def _simulate_motion_detection(self):
        """Simulate realistic PIR motion detection"""
        if not self.pir_online:
            self.motion_detected = False
            return
        
        current_hour = datetime.now().hour
        
        # Different motion probability based on time of day
        if self.config.ACTIVE_HOURS_START <= current_hour < self.config.ACTIVE_HOURS_END:
            motion_prob = self.config.MOTION_PROBABILITY_PEAK
        else:
            motion_prob = self.config.MOTION_PROBABILITY_BASE
        
        # Add occupancy influence
        if self.people_count > 0:
            motion_prob += 0.3  # Higher probability when people present
        
        # Detect motion based on probability
        self.motion_detected = random.random() < motion_prob
    
    def _simulate_people_detection(self):
        """Simulate realistic people detection from camera"""
        if not self.camera_online:
            self.people_count = 0
            return
        
        if self.motion_detected:
            # People are more likely to be detected when motion is detected
            if self.people_count == 0:
                # First detection - add 1-2 people
                self.people_count = random.randint(self.config.PERSON_DETECTION_MIN, 
                                                    min(self.config.PERSON_DETECTION_MAX, 2))
            else:
                # Vary people count slightly
                change = random.choice([-1, 0, 0, 1])
                self.people_count = max(0, min(self.config.PERSON_DETECTION_MAX, 
                                             self.people_count + change))
        else:
            # No motion detected - gradually reduce people count
            if self.people_count > 0:
                self.people_count = max(0, self.people_count - 1)
    
    def _simulate_sensor_health(self):
        """Simulate realistic sensor health and potential failures"""
        # Random sensor failures (very low probability)
        if random.random() < self.config.DEVICE_FAILURE_PROBABILITY:
            # Choose a random sensor to fail
            sensor = random.choice(['dht22', 'pir', 'ldr', 'camera'])
            if sensor == 'dht22':
                self.dht22_online = False
            elif sensor == 'pir':
                self.pir_online = False
            elif sensor == 'ldr':
                self.ldr_online = False
            elif sensor == 'camera':
                self.camera_online = False
    
    def force_sensor_state(self, sensor_name, state):
        """Force a sensor to specific state for testing"""
        if sensor_name == 'dht22':
            self.dht22_online = state
        elif sensor_name == 'pir':
            self.pir_online = state
        elif sensor_name == 'ldr':
            self.ldr_online = state
        elif sensor_name == 'camera':
            self.camera_online = state
    
    def set_manual_temperature(self, temperature):
        """Manually set temperature for testing"""
        self.temperature = max(15, min(40, temperature))
    
    def set_manual_humidity(self, humidity):
        """Manually set humidity for testing"""
        self.humidity = max(30, min(90, humidity))
    
    def set_manual_light_level(self, light_level):
        """Manually set light level for testing"""
        self.light_level = max(0, min(1000, light_level))
    
    def get_sensor_states(self):
        """Return current sensor states"""
        return {
            'temperature': round(self.temperature, 1),
            'humidity': round(self.humidity, 1),
            'light_level': round(self.light_level),
            'motion_detected': self.motion_detected,
            'people_count': self.people_count,
            'dht22_online': self.dht22_online,
            'pir_online': self.pir_online,
            'ldr_online': self.ldr_online,
            'camera_online': self.camera_online,
            'timestamp': datetime.now().isoformat()
        }
