# Smart Classroom Monitoring System - Professional Software Simulation

## Overview

This Smart Classroom Monitoring System is a **professional software simulation** of an IoT classroom monitoring and energy management system. It demonstrates complete IoT concepts through a sophisticated simulation engine that mimics real hardware behavior without requiring physical devices.

## Architecture

The system uses a **layered simulation architecture**:

```
┌─────────────────────────────────────┐
│     Web Dashboard (Premium UI)      │
└──────────────┬──────────────────────┘
               │
┌──────────────▼──────────────────────┐
│     Flask Backend (API Layer)       │
└──────────────┬──────────────────────┘
               │
┌──────────────▼──────────────────────┐
│   State Manager (Central Control)  │
└──────┬──────────────┬───────────────┘
       │              │
┌──────▼──────┐  ┌────▼──────────────┐
│ Sensor      │  │ Device            │
│ Simulator  │  │ Controller        │
└──────┬──────┘  └────┬──────────────┘
       │              │
┌──────▼──────────────▼──────────────┐
│   Automation Engine (Logic)        │
└─────────────────────────────────────┘
```

## Simulation Components

### 1. Sensor Simulator (`simulation/sensor_simulator.py`)

Simulates realistic sensor behavior using mathematical models:

- **DHT22 Temperature/Humidity Sensor**
  - Base temperature with time-based daily cycle
  - Temperature response rate for gradual changes
  - Humidity with natural fluctuations
  - Realistic bounds (15-40°C, 30-90% humidity)

- **PIR Motion Sensor**
  - Motion probability varies by time of day
  - Higher probability during "active hours" (8 AM - 6 PM)
  - Occupancy influence on motion detection

- **LDR Light Sensor**
  - Day/night cycle simulation
  - Natural light fluctuation
  - Range: 0-1000 lux

- **Camera/Person Detection**
  - People count simulation (1-8 people)
  - Confidence-based detection
  - Motion correlation

- **Sensor Health Simulation**
  - Random sensor failures (very low probability)
  - Online/offline state tracking

### 2. Virtual Device Controller (`simulation/device_controller.py`)

Simulates real device control behavior:

- **Light Control**
  - Realistic warm-up time (2 seconds)
  - Brightness percentage (0-100%)
  - Energy consumption tracking
  - Response time simulation

- **Fan Control**
  - Spin-up time (3 seconds)
  - Speed control (0-100%)
  - RPM simulation
  - Energy consumption tracking

- **Device Health**
  - Online/offline state
  - Failure simulation
  - Response time tracking

### 3. Automation Engine (`simulation/automation_engine.py`)

Implements intelligent automation logic:

- **Occupancy Detection**
  - Camera-based primary detection
  - PIR fallback when camera offline
  - Configurable occupancy timeout
  - Hysteresis to prevent rapid changes

- **Light Automation**
  - Automatic lighting based on ambient light
  - Configurable light threshold
  - Hysteresis for stability

- **Fan Automation**
  - Temperature-based control
  - Configurable temperature threshold
  - Speed adjustment based on temperature
  - Hysteresis for stability

- **Event Logging**
  - All automation events logged
  - Timestamp and event type
  - Last 100 events retained

### 4. State Manager (`simulation/state_manager.py`)

Central state management system:

- **Real-time Updates**
  - Periodic simulation updates
  - State change notifications
  - Historical data storage

- **Device Status Simulation**
  - CPU usage fluctuation
  - Memory usage fluctuation
  - Device temperature
  - Network latency
  - Network bandwidth

- **Energy Statistics**
  - Light energy consumption
  - Fan energy consumption
  - Total energy (kWh)
  - Estimated cost calculation
  - Runtime tracking

## Interactive Testing

### Simulation Control Panel

Access the simulation control panel at: `http://127.0.0.1:5000/simulation`

The control panel allows you to:

1. **Manually Set Sensor Values**
   - Temperature (15-40°C)
   - Humidity (30-90%)
   - Light Level (0-1000)

2. **Force Sensor States**
   - Enable/Disable DHT22
   - Enable/Disable PIR
   - Enable/Disable LDR
   - Enable/Disable Camera

3. **Force Device States**
   - Enable/Disable Light
   - Enable/Disable Fan

4. **Simulate External Influences**
   - Add/remove people (occupancy change)
   - Increase/decrease light

5. **Reset Energy Tracking**
   - Clear energy consumption data

6. **View Automation Events**
   - Real-time event log
   - Automation decisions
   - Device state changes

## API Endpoints

### System Status
- `GET /api/status` - Current system state from simulation engine
- Returns: sensors, devices, automation, device status, energy statistics

### Historical Data
- `GET /api/historical` - Historical data for charts
- Returns: temperature, humidity, light level, occupancy, people count, timestamps

### Manual Control
- `POST /api/control` - Manual appliance control
- Parameters: `auto_mode`, `light_on`, `fan_on`

### Settings
- `GET /api/settings` - Current automation settings
- `POST /api/settings` - Update automation settings
- Parameters: `occupancy_timeout`, `temperature_threshold`, `light_threshold`

### Simulation Control
- `POST /api/simulation/control` - Control simulation parameters
- Parameters: `manual_sensor`, `force_sensor_state`, `force_device_state`, `external_influence`, `reset_energy`

### Automation Events
- `GET /api/automation/events` - Automation event log
- Returns: array of events with timestamp, type, and message

### Energy Statistics
- `GET /api/simulation/energy` - Energy consumption statistics
- Returns: light/fan energy, total energy, estimated cost, runtime

## Configuration

Simulation parameters are configured in `simulation/simulation_config.py`:

- Temperature/humidity base values and variance
- Motion detection probability
- Occupancy detection parameters
- Device simulation parameters
- Network simulation parameters
- Automation thresholds
- Energy calculation parameters
- Simulation time scale

## How to Use

### 1. Start the System
```bash
python app.py
```

### 2. Access Dashboard
Open: `http://127.0.0.1:5000`

### 3. Monitor Real-Time Data
- Temperature and humidity updates
- Motion detection
- People count
- Light level
- Device states
- Energy consumption

### 4. Test Automation
- Watch automation activate/deactivate devices
- Adjust thresholds in Settings
- Toggle AUTO/MANUAL mode
- Observe automation events

### 5. Interactive Testing
- Go to Simulation Control Panel
- Manually set sensor values
- Force sensor/device states
- Simulate external influences
- Observe system response

## Academic Project Use

This simulation system is perfect for B.Tech projects because:

1. **No Hardware Required** - Pure software implementation
2. **Professional Architecture** - Demonstrates IoT concepts
3. **Realistic Behavior** - Mathematical models, not random values
4. **Interactive Testing** - Full control over simulation
5. **Documentation** - Clear code structure and comments
6. **Scalable** - Easy to extend with more sensors/devices
7. **Production-Ready Code** - Clean, modular, well-structured

## Key Features

### Realistic Simulation
- Time-based environmental cycles
- Gradual state changes (warm-up, cooldown)
- Hysteresis for stability
- Sensor health simulation
- Device response times

### Intelligent Automation
- Configurable thresholds
- Multi-sensor occupancy detection
- Temperature-based fan control
- Light-level-based lighting
- Event logging

### Energy Management
- Real-time energy calculation
- Runtime tracking
- Cost estimation
- Configurable power ratings
- Configurable electricity tariff

### Device Health
- Online/offline tracking
- Failure simulation
- Recovery simulation
- Status reporting

## Testing Scenarios

### Scenario 1: High Temperature
1. Set temperature to 35°C in simulation panel
2. Observe fan activation in AUTO mode
3. Check automation events log
4. Verify fan speed increases with temperature

### Scenario 2: Low Light
1. Set light level to 200 in simulation panel
2. Observe light activation in AUTO mode
3. Check automation events log
4. Verify light turns on

### Scenario 3: Occupancy Detection
1. Simulate "+5 people enter"
2. Observe occupancy change
3. Watch automation activate devices
4. Simulate "-5 people leave"
5. Observe timeout and device deactivation

### Scenario 4: Sensor Failure
1. Force DHT22 sensor offline
2. Observe dashboard shows sensor offline
3. Test automation behavior with missing sensor
4. Re-enable sensor and observe recovery

### Scenario 5: Manual Override
1. Switch to MANUAL mode
2. Manually control light/fan
3. Observe automation is disabled
4. Switch back to AUTO mode
5. Observe automation resumes

## Deployment

The system can be deployed to Render, PythonAnywhere, or any Flask-compatible hosting platform.

### Render Deployment
1. Push to GitHub
2. Connect Render to repository
3. Deploy with Gunicorn
4. Access at provided URL

### Local Development
```bash
python app.py
```

## Future Enhancements

Potential additions for project extension:

1. **More Sensors**
   - CO2 sensor simulation
   - Noise level sensor
   - Air quality sensor

2. **More Devices**
   - Air conditioner
   - Smart blinds
   - Projector control

3. **Advanced Features**
   - Multi-classroom support
   - User authentication
   - Role-based access
   - Advanced analytics
   - Predictive maintenance

4. **Real Hardware Integration**
   - Replace simulation with real sensors
   - MQTT communication
   - Raspberry Pi edge agent
   - Real computer vision

## Conclusion

This Smart Classroom Monitoring System demonstrates professional IoT software development through a sophisticated simulation engine. It provides all the functionality of a real IoT system without requiring physical hardware, making it ideal for academic projects and demonstrations.

The modular architecture allows easy extension and potential future integration with real hardware when available.
