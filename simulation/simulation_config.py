"""
Configuration for the Software Simulation Engine
"""

class SimulationConfig:
    """Configuration for simulation parameters"""
    
    # Sensor Simulation Parameters
    TEMPERATURE_BASE = 24.0  # Base temperature in Celsius
    TEMPERATURE_VARIANCE = 3.0  # Maximum random variation
    TEMPERATURE_RESPONSE_RATE = 0.1  # How fast temperature changes
    
    HUMIDITY_BASE = 55.0  # Base humidity percentage
    HUMIDITY_VARIANCE = 15.0  # Maximum random variation
    HUMIDITY_RESPONSE_RATE = 0.05  # How fast humidity changes
    
    LIGHT_LEVEL_BASE = 500  # Base ambient light level (0-1000)
    LIGHT_VARIANCE = 300  # Maximum random variation
    
    # Motion Detection Parameters
    MOTION_PROBABILITY_BASE = 0.3  # Base probability of motion
    MOTION_PROBABILITY_PEAK = 0.7  # Peak probability during "active hours"
    ACTIVE_HOURS_START = 8  # When peak motion probability starts
    ACTIVE_HOURS_END = 18  # When peak motion probability ends
    
    # Occupancy Detection Parameters
    PERSON_DETECTION_MIN = 1  # Minimum people to detect
    PERSON_DETECTION_MAX = 8  # Maximum people to detect
    OCCUPANCY_CONFIDENCE_THRESHOLD = 0.7  # Minimum confidence for occupancy
    
    # Device Simulation Parameters
    DEVICE_CPU_BASE = 15  # Base CPU usage percentage
    DEVICE_CPU_VARIANCE = 10  # CPU usage variance
    DEVICE_MEMORY_BASE = 40  # Base memory usage percentage
    DEVICE_MEMORY_VARIANCE = 15  # Memory usage variance
    DEVICE_TEMPERATURE_BASE = 45  # Base device temperature in Celsius
    DEVICE_TEMPERATURE_VARIANCE = 5  # Device temperature variance
    
    # Network Simulation Parameters
    NETWORK_LATENCY_BASE = 50  # Base network latency in ms
    NETWORK_LATENCY_VARIANCE = 30  # Network latency variance
    NETWORK_BANDWIDTH_BASE = 100  # Base network bandwidth in Mbps
    NETWORK_BANDWIDTH_VARIANCE = 50  # Network bandwidth variance
    
    # Camera Simulation Parameters
    CAMERA_DETECTION_ACCURACY_BASE = 0.85  # Base detection accuracy
    CAMERA_DETECTION_ACCURACY_VARIANCE = 0.1  # Detection accuracy variance
    CAMERA_FRAME_RATE = 15  # Simulated camera frame rate
    CAMERA_RESOLUTION = "640x480"  # Simulated camera resolution
    
    # Appliance Simulation Parameters
    LIGHT_POWER_RATING = 40  # Light power rating in watts
    FAN_POWER_RATING = 70  # Fan power rating in watts
    LIGHT_WARMUP_TIME = 2  # Seconds for light to reach full brightness
    FAN_SPINUP_TIME = 3  # Seconds for fan to reach full speed
    LIGHT_COOLDOWN_TIME = 1  # Seconds for light to cool down
    FAN_SPINDOWN_TIME = 2  # Seconds for fan to spin down
    
    # Automation Parameters
    OCCUPANCY_TIMEOUT = 60  # Seconds before turning off appliances when empty
    TEMPERATURE_THRESHOLD = 28  # Temperature threshold for fan activation
    LIGHT_THRESHOLD = 300  # Light level threshold for automatic lighting
    HYSTERESIS_TEMPERATURE = 2.0  # Temperature hysteresis for fan control
    HYSTERESIS_LIGHT = 50  # Light level hysteresis for lighting control
    
    # Energy Calculation Parameters
    ELECTRICITY_TARIFF = 6.0  # Electricity tariff in currency units per kWh
    ENERGY_CALCULATION_INTERVAL = 60  # Calculate energy every 60 seconds
    
    # Simulation Time Scale
    SIMULATION_SPEED_MULTIPLIER = 1.0  # 1.0 = real-time, >1.0 = accelerated simulation
    SENSOR_UPDATE_INTERVAL = 5  # Seconds between sensor updates
    AUTOMATION_CHECK_INTERVAL = 2  # Seconds between automation checks
    
    # Device Health Simulation
    DEVICE_FAILURE_PROBABILITY = 0.001  # Probability of random device failure
    RECOVERY_TIME_BASE = 300  # Base recovery time in seconds
    RECOVERY_TIME_VARIANCE = 120  # Recovery time variance
    
    # State Persistence
    STATE_PERSISTENCE_ENABLED = True  # Whether to persist simulation state
    STATE_SAVE_INTERVAL = 60  # Save state every 60 seconds