"""
Configuration file for Smart Classroom Monitoring System
"""

import os

class Config:
    """Base configuration"""
    
    # Flask configuration
    SECRET_KEY = os.environ.get('SECRET_KEY') or 'dev-secret-key-change-in-production'
    
    # Demo mode - set to True to simulate hardware without physical sensors
    DEMO_MODE = os.environ.get('DEMO_MODE', 'True').lower() == 'true'
    
    # Database
    DATABASE_PATH = os.path.join(os.path.dirname(__file__), 'data', 'smart_classroom.db')
    
    # Hardware settings
    DHT22_PIN = 4  # GPIO pin for DHT22
    PIR_PIN = 17  # GPIO pin for PIR sensor
    RELAY_LIGHT_PIN = 18  # GPIO pin for light relay
    RELAY_FAN_PIN = 23  # GPIO pin for fan relay
    
    # Camera settings
    CAMERA_INDEX = 0  # Usually 0 for /dev/video0
    CAMERA_WIDTH = 640
    CAMERA_HEIGHT = 480
    CAMERA_FPS = 15
    
    # Computer vision settings
    DETECTION_INTERVAL = 2  # Seconds between person detection checks
    CONFIDENCE_THRESHOLD = 0.5  # Minimum confidence for person detection
    
    # Automation settings
    OCCUPANCY_TIMEOUT = 300  # Seconds to wait before turning off appliances when room is empty
    TEMPERATURE_THRESHOLD = 28  # Temperature above which fan should be on in auto mode
    AUTO_MODE_ENABLED = True  # Default automation mode
    
    # Data retention
    DATA_RETENTION_DAYS = 30  # How many days to keep sensor data
    
    # Update intervals
    SENSOR_READ_INTERVAL = 5  # Seconds between sensor readings
    DASHBOARD_UPDATE_INTERVAL = 3  # Seconds between dashboard updates
