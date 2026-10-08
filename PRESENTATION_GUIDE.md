# Smart Classroom Monitoring and Energy Management System
## Complete Presentation Guide for B.Tech Project Viva

---

## Table of Contents
1. [Project Overview](#project-overview)
2. [Technical Architecture](#technical-architecture)
3. [System Components](#system-components)
4. [How It Works - Technical Deep Dive](#how-it-works-technical-deep-dive)
5. [Code Structure & Implementation](#code-structure--implementation)
6. [Simulation Engine Explained](#simulation-engine-explained)
7. [Frontend & Backend Details](#frontend--backend-details)
8. [API Endpoints](#api-endpoints)
9. [Database & Data Flow](#database--data-flow)
10. [Challenges & Solutions](#challenges--solutions)
11. [Future Scope](#future-scope)
12. [Common Viva Questions & Answers](#common-viva-questions--answers)

---

## Project Overview

### Project Title
**"Smart Classroom Monitoring and Energy Management System Using Raspberry Pi, IoT and Computer Vision"**

### Problem Statement
Traditional classroom energy management is inefficient - lights and fans often remain ON even when classrooms are empty, leading to unnecessary energy wastage. Manual monitoring is impractical and time-consuming.

### Solution
An intelligent IoT-based system that:
- Automatically monitors classroom occupancy using computer vision
- Controls lights and fans based on real-time occupancy and environmental conditions
- Provides a web-based dashboard for monitoring and control
- Reduces energy consumption through intelligent automation

### Key Features
1. **Real-time Sensor Monitoring** - Temperature, humidity, motion, light level
2. **Computer Vision** - Person detection and occupancy counting
3. **Intelligent Automation** - Automatic light/fan control based on rules
4. **Web Dashboard** - Real-time monitoring and control interface
5. **Energy Tracking** - Consumption calculation and cost estimation
6. **Alert System** - Device health monitoring and notifications

### Technologies Used
- **Backend:** Python, Flask
- **Frontend:** HTML, CSS, JavaScript, Chart.js
- **Simulation:** Python-based sensor/device simulation
- **Icons:** Lucide Icons
- **Charts:** Chart.js
- **Deployment:** Render (cloud hosting)

---

## Technical Architecture

### System Architecture Diagram
```
┌─────────────────────────────────────────────────────────────┐
│                    Web Dashboard                             │
│              (Premium UI - React-like Interface)            │
└──────────────────────┬──────────────────────────────────────┘
                       │ HTTPS/WebSocket
┌──────────────────────▼──────────────────────────────────────┐
│                  Flask Backend                              │
│         (API Layer - REST Endpoints)                        │
└──────────────────────┬──────────────────────────────────────┘
                       │
┌──────────────────────▼──────────────────────────────────────┐
│              State Manager (Central Control)               │
│         - Coordinates all simulation components              │
│         - Manages system state                              │
│         - Provides unified interface                       │
└──────┬──────────────┬──────────────┬───────────────────────┘
       │              │              │
┌──────▼──────┐  ┌───▼──────────────▼─────────┐
│ Sensor      │  │   Automation Engine          │
│ Simulator  │  │   - Occupancy Detection      │
│             │  │   - Rule-based Control       │
│ - DHT22     │  │   - Event Logging            │
│ - PIR       │  │                              │
│ - LDR       │  └──────────────────────────────┘
│ - Camera    │              │
└─────────────┘              │
                               │
                     ┌────────▼──────────┐
                     │ Device Controller │
                     │                   │
                     │ - Light Control   │
                     │ - Fan Control     │
                     │ - State Tracking  │
                     └───────────────────┘
```

### Why This Architecture?

**Modular Design:**
- Each component has a single responsibility
- Easy to test and maintain
- Can replace individual components without affecting others

**Simulation Layer:**
- Abstracts hardware complexity
- Allows software-only implementation
- Demonstrates IoT concepts without physical hardware
- Can be easily replaced with real hardware later

**State Management:**
- Centralized state control
- Consistent data flow
- Easy to extend with new features

---

## System Components

### 1. Sensor Simulator (`simulation/sensor_simulator.py`)

**Purpose:** Simulates realistic sensor behavior using mathematical models

**Components:**

#### DHT22 Temperature/Humidity Sensor
```python
- Base temperature: 24°C with daily cycle variation
- Temperature range: 15-40°C (realistic bounds)
- Response rate: 0.1 (gradual changes, not instant)
- Mathematical model: Uses sine waves for natural daily cycles
- Humidity: 55% base with 30-90% range
```

**How it works:**
- Uses `math.sin(time)` to create natural daily temperature cycles
- Temperature peaks at noon, lowest at night
- Gradual changes using response rate (prevents unrealistic jumps)
- Random fluctuation added for realism

#### PIR Motion Sensor
```python
- Motion probability: 30% (base), 70% (during active hours 8AM-6PM)
- Higher probability when people are present
- Boolean output: True/False
```

**How it works:**
- Checks current hour to determine active/inactive period
- Adjusts probability based on time of day
- People count influences motion detection (more people = more motion)

#### LDR Light Sensor
```python
- Light level: 0-1000 lux
- Daytime: 700-900 lux (natural sunlight)
- Nighttime: 100-300 lux (artificial lighting)
- Gradual changes over time
```

**How it works:**
- Day/night cycle based on current hour
- Uses sine function for smooth transitions
- Random fluctuation for realism

#### Camera/Person Detection
```python
- People count: 1-8 people
- Detection based on motion correlation
- Camera can go offline (simulated failure)
```

**How it works:**
- People detected when motion is present
- Count varies randomly when occupied
- Gradual decrease when no motion
- Can be forced offline for testing

**Code Example:**
```python
def _simulate_temperature(self, time_delta):
    # Base temperature with time-based variation
    target_temp = self.config.TEMPERATURE_BASE + (self.time_factor * 2)
    
    # Add trend influence
    target_temp += self.temperature_trend * 0.5
    
    # Add random fluctuation
    fluctuation = random.uniform(-0.5, 0.5)
    
    # Apply response rate (gradual change toward target)
    temp_diff = (target_temp + fluctuation) - self.temperature
    self.temperature += temp_diff * self.config.TEMPERATURE_RESPONSE_RATE
```

### 2. Device Controller (`simulation/device_controller.py`)

**Purpose:** Simulates real device control with realistic behavior

#### Light Control
```python
- Power rating: 40W
- Warm-up time: 2 seconds
- Brightness: 0-100%
- Energy consumption tracking
- Response time simulation
```

**How it works:**
- When turned ON: Simulates warm-up delay (2 seconds)
- Brightness gradually increases to target
- Energy calculated: (Power in kW × Runtime in hours)
- Can fail/go offline

#### Fan Control
```python
- Power rating: 70W
- Spin-up time: 3 seconds
- Speed: 0-100%
- RPM calculation: Speed × 30
- Energy consumption tracking
```

**How it works:**
- When turned ON: Simulates spin-up delay (3 seconds)
- Speed gradually increases to target
- RPM calculated from speed percentage
- Energy calculated similar to light

**Code Example:**
```python
def set_light(self, state, brightness=100):
    if state:
        self.light_state = True
        self.target_light_brightness = brightness
        
        # Simulate warm-up time
        warmup_time = self.config.LIGHT_WARMUP_TIME * (100 / brightness) * 0.5
        time.sleep(warmup_time * 0.1)  # Simulated warmup
        
        self.light_brightness = brightness
```

### 3. Automation Engine (`simulation/automation_engine.py`)

**Purpose:** Implements intelligent automation logic with configurable rules

#### Occupancy Detection
```python
Primary: Camera-based people detection
Fallback: PIR motion sensor (when camera offline)
Timeout: 60 seconds (configurable)
Hysteresis: Prevents rapid state changes
```

**How it works:**
1. Check if camera is online
2. If online: Use people count from camera
3. If offline: Use PIR motion as fallback
4. If room empty for timeout: Mark as unoccupied
5. Prevent rapid toggling with hysteresis

#### Light Automation
```python
Rule: IF light_level < threshold AND occupied THEN light = ON
Threshold: 300 lux (configurable)
Hysteresis: 50 lux (prevents rapid on/off)
```

**How it works:**
- Continuously monitors ambient light level
- If light is below threshold and room occupied: Turn ON
- If light is above threshold + hysteresis: Turn OFF
- Hysteresis prevents flickering

#### Fan Automation
```python
Rule: IF temperature > threshold AND occupied THEN fan = ON
Threshold: 28°C (configurable)
Hysteresis: 2°C
Speed: Based on temperature excess
```

**How it works:**
- Monitors temperature continuously
- If temperature > threshold + hysteresis: Turn ON
- Fan speed increases with temperature excess
- If temperature < threshold - hysteresis: Turn OFF

**Code Example:**
```python
def _automate_fan_control(self, sensor_states):
    current_temp = sensor_states['temperature']
    threshold = self.config.TEMPERATURE_THRESHOLD
    hysteresis = self.config.HYSTERESIS_TEMPERATURE
    
    # Turn on if temperature exceeds threshold + hysteresis
    if current_temp > (threshold + hysteresis):
        fan_speed = min(100, int((current_temp - threshold) * 10))
        self.device_controller.set_fan(True, fan_speed)
```

### 4. State Manager (`simulation/state_manager.py`)

**Purpose:** Central state management and coordination

**Responsibilities:**
- Initialize all simulation components
- Coordinate updates between components
- Provide unified state interface
- Store historical data
- Calculate energy statistics
- Update device status simulation

**How it works:**
1. Creates instances of Sensor Simulator, Device Controller, Automation Engine
2. Runs periodic updates (every API call)
3. Calls each component's update method
4. Aggregates all state into unified response
5. Stores historical data for charts

**Code Example:**
```python
def update_simulation(self, external_factors=None):
    # Update sensor simulation
    self.sensor_simulator.update_simulation(external_factors)
    
    # Update device behavior
    self.device_controller.simulate_device_behavior()
    
    # Run automation engine
    self.automation_engine.update_automation()
    
    # Update device status simulation
    self._update_device_status()
    
    # Store historical data
    self._store_historical_data()
```

---

## How It Works - Technical Deep Dive

### Data Flow Diagram

```
User Action (Dashboard)
    ↓
API Request (HTTP POST)
    ↓
Flask Route Handler
    ↓
State Manager
    ↓
  ├─→ Sensor Simulator (Updates sensor values)
  ├─→ Device Controller (Updates device states)
  └─→ Automation Engine (Applies rules)
    ↓
Response JSON
    ↓
Dashboard Update (JavaScript)
```

### Example: User Toggles Light ON

1. **User Action:** Clicks light toggle on dashboard
2. **JavaScript:** Sends POST request to `/api/control`
   ```json
   {
     "auto_mode": false,
     "light_on": true
   }
   ```
3. **Flask Route:** Receives request in `control_appliance()`
4. **State Manager:** Calls `manual_control('light', True)`
5. **Device Controller:** 
   - Checks if light device is online
   - Simulates response time (0.1s)
   - Simulates warm-up time (2s)
   - Updates light state to ON
   - Calculates energy consumption
6. **Automation Engine:** Logs manual override event
7. **Response:** Returns success with new state
8. **Dashboard:** Updates UI to show light ON

### Example: Automation Activates Fan

1. **Periodic Update:** Dashboard polls `/api/status` every 3 seconds
2. **State Manager:** Runs `update_simulation()`
3. **Sensor Simulator:** 
   - Updates temperature to 30°C (above threshold)
   - Updates occupancy to True (people present)
4. **Automation Engine:** 
   - Checks rules: temp > 28°C AND occupied = True
   - Rule matches → activates fan
   - Calls `device_controller.set_fan(True, speed)`
5. **Device Controller:** 
   - Simulates spin-up (3s)
   - Sets fan to 60% speed
   - Logs energy consumption
6. **Response:** Returns new state with fan_on = True
7. **Dashboard:** Updates UI to show fan ON at 60%

### Example: Sensor Failure

1. **User Action:** Forces DHT22 offline via simulation panel
2. **Simulation Control:** POST to `/api/simulation/control`
   ```json
   {
     "force_sensor_state": "dht22",
     "state": false
   }
   ```
3. **State Manager:** Calls `force_sensor_state('dht22', False)`
4. **Sensor Simulator:** Sets `dht22_online = False`
5. **Automation Engine:** 
   - Detects DHT22 offline
   - Cannot use temperature data
   - Logs sensor failure event
6. **Response:** Sensor health shows DHT22 offline
7. **Dashboard:** Shows "DHT22: OFFLINE" in red

---

## Code Structure & Implementation

### Project Structure
```
smart-classroom-monitoring-system/
├── app.py                          # Main Flask application
├── config.py                       # Configuration settings
├── requirements.txt                # Python dependencies
├── Procfile                        # Render deployment config
├── wsgi.py                         # WSGI entry point
├── SIMULATION_GUIDE.md            # Simulation documentation
├── PRESENTATION_GUIDE.md          # This file
│
├── simulation/                     # Simulation engine
│   ├── __init__.py               # Package initialization
│   ├── simulation_config.py      # Configuration parameters
│   ├── sensor_simulator.py       # Sensor simulation
│   ├── device_controller.py      # Device control
│   ├── automation_engine.py      # Automation logic
│   └── state_manager.py          # State management
│
├── templates/                     # HTML templates
│   ├── index.html                # Main dashboard
│   ├── analytics.html            # Analytics page
│   ├── settings.html             # Settings page
│   └── simulation.html           # Simulation control panel
│
├── static/                        # Static files
│   ├── css/
│   │   └── style.css            # Premium styling
│   └── js/
│       ├── dashboard.js         # Dashboard logic
│       ├── analytics.js          # Analytics logic
│       └── settings.js           # Settings logic
│
├── database/                      # Database (for future use)
│   └── __init__.py
│
├── hardware/                      # Hardware (for future use)
│   └── __init__.py
│
├── vision/                        # Computer vision (for future use)
│   └── __init__.py
│
└── services/                      # Services (for future use)
    └── __init__.py
```

### Main Application (`app.py`)

**Purpose:** Flask application with API endpoints

**Key Functions:**

1. **`index()`** - Renders main dashboard
   - Updates simulation before rendering
   - Passes simulation_mode flag to template

2. **`get_status()`** - Returns current system state
   - Calls `state_manager.update_simulation()`
   - Gets complete state from simulation
   - Formats response for dashboard
   - Returns JSON with sensors, devices, automation, device_status

3. **`control_appliance()`** - Handles manual control
   - Receives POST with control commands
   - Updates automation mode (AUTO/MANUAL)
   - Calls manual control for appliances
   - Returns success/failure response

4. **`settings()`** - Handles system settings
   - GET: Returns current settings
   - POST: Updates thresholds and parameters

5. **`simulation_control()`** - Controls simulation parameters
   - Allows manual sensor value setting
   - Forces sensor/device states
   - Simulates external influences
   - Resets energy tracking

**Code Example:**
```python
@app.route('/api/status')
def get_status():
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
        'light_on': complete_state['devices']['light']['state'],
        'fan_on': complete_state['devices']['fan']['state'],
        'device_status': complete_state['device_status'],
        'sensor_health': {
            'dht22_online': complete_state['sensors']['dht22_online'],
            'pir_online': complete_state['sensors']['pir_online'],
            'ldr_online': complete_state['sensors']['ldr_online'],
            'camera_online': complete_state['sensors']['camera_online']
        }
    })
```

---

## Simulation Engine Explained

### Why Use Simulation?

**Academic Context:**
- Demonstrates IoT concepts without requiring physical hardware
- Focus on software architecture and logic
- Safe for demonstration (no electrical risks)
- Easy to test and debug
- Can be replaced with real hardware later

**Professional Simulation vs. Fake Demo:**

| Aspect | Fake Demo | Professional Simulation |
|--------|-----------|------------------------|
| Data Source | Random numbers | Mathematical models |
| Behavior | Unpredictable | Realistic patterns |
| State Management | Global variables | Centralized state manager |
| Component Design | Monolithic | Modular, testable |
| Testing | Limited | Full interactive control |
| Documentation | Minimal | Complete architecture docs |

### Simulation Configuration (`simulation_config.py`)

**Key Parameters:**

```python
# Sensor Parameters
TEMPERATURE_BASE = 24.0          # Base temperature in °C
TEMPERATURE_VARIANCE = 3.0       # Maximum variation
TEMPERATURE_RESPONSE_RATE = 0.1  # How fast temperature changes

# Automation Parameters
OCCUPANCY_TIMEOUT = 60           # Seconds before turning off
TEMPERATURE_THRESHOLD = 28        # Temperature threshold for fan
LIGHT_THRESHOLD = 300            # Light level threshold for lighting
HYSTERESIS_TEMPERATURE = 2.0     # Temperature hysteresis

# Device Parameters
LIGHT_POWER_RATING = 40           # Light power in watts
FAN_POWER_RATING = 70            # Fan power in watts
LIGHT_WARMUP_TIME = 2            # Seconds for warm-up
FAN_SPINUP_TIME = 3              # Seconds for spin-up

# Energy Parameters
ELECTRICITY_TARIFF = 6.0          # Currency per kWh
```

### Mathematical Models Used

**Temperature Model:**
```python
# Daily cycle using sine wave
hour_factor = sin((current_hour - 6) * π / 12)
target_temp = base_temp + (hour_factor * 2)

# Gradual change
temp_diff = (target_temp + fluctuation) - current_temp
new_temp = current_temp + (temp_diff * response_rate)
```

**Humidity Model:**
```python
# Cosine wave for humidity cycle
humidity = base_humidity + (cos(time_factor * 2) * 5)
```

**Light Level Model:**
```python
# Day/night cycle
if 6 <= hour < 18:
    base_light = 700 + sin((hour - 6) * π / 12) * 200
else:
    base_light = 200 + sin((hour - 18) * π / 12) * 100
```

### Hysteresis Implementation

**Purpose:** Prevent rapid state changes (flickering)

**Example:**
```python
# Without hysteresis:
if temp > 28: fan_on = True
if temp < 28: fan_on = False
# Problem: Fan turns on/off rapidly around 28°C

# With hysteresis:
if temp > 30: fan_on = True    # Only turn on above 30°C
if temp < 26: fan_on = False   # Only turn off below 26°C
# Solution: Fan stays ON between 26-30°C
```

---

## Frontend & Backend Details

### Frontend Technology Stack

**HTML Templates:**
- Jinja2 templating engine
- Dynamic content rendering
- Component-based structure

**CSS Styling:**
- Custom CSS (no framework)
- Glassmorphism design
- Dark theme
- Responsive layout
- CSS Grid and Flexbox
- CSS animations and transitions

**JavaScript:**
- Vanilla JavaScript (no framework)
- Chart.js for data visualization
- Lucide Icons for iconography
- Fetch API for HTTP requests
- Async/await for asynchronous operations

### Dashboard JavaScript (`static/js/dashboard.js`)

**Key Functions:**

1. **`fetchStatus()`** - Polls API for current state
   ```javascript
   async function fetchStatus() {
       const response = await fetch('/api/status');
       const data = await response.json();
       updateDashboard(data);
   }
   ```

2. **`updateDashboard(data)`** - Updates UI with new data
   - Updates occupancy status
   - Updates temperature/humidity displays
   - Updates appliance states
   - Updates device status (CPU, memory, etc.)
   - Updates sensor health indicators

3. **`initCharts()`** - Initializes Chart.js charts
   - Temperature chart
   - Humidity chart
   - Configures styling and options

4. **`sendControl()`** - Sends control commands
   ```javascript
   await fetch('/api/control', {
       method: 'POST',
       headers: { 'Content-Type': 'application/json' },
       body: JSON.stringify({
           auto_mode: autoMode,
           light_on: lightOn,
           fan_on: fanOn
       })
   });
   ```

5. **`updatePerformanceMetrics()`** - Updates device status
   - CPU usage from simulation
   - Memory usage from simulation
   - Device temperature
   - Network latency

### Backend Technology Stack

**Flask Framework:**
- Lightweight Python web framework
- RESTful API design
- Jinja2 templating
- Built-in development server

**State Management:**
- Centralized state manager
- Component-based architecture
- Real-time updates

**API Design:**
- RESTful endpoints
- JSON request/response
- HTTP methods (GET, POST)
- Error handling

### Real-Time Updates

**Polling Approach:**
- Dashboard polls `/api/status` every 3 seconds
- Dashboard polls `/api/historical` every 5 seconds
- No WebSocket needed (simpler for this scope)

**Alternative (Future):**
- WebSocket for true real-time
- Server-Sent Events (SSE)
- Push notifications

---

## API Endpoints

### Complete API Documentation

#### 1. GET `/api/status`
**Purpose:** Get current system state

**Response:**
```json
{
  "simulation_mode": true,
  "occupied": true,
  "people_detected": 2,
  "temperature": 25.2,
  "humidity": 55.5,
  "light_level": 794,
  "motion_detected": true,
  "light_on": false,
  "fan_on": false,
  "fan_speed": 0,
  "auto_mode": true,
  "last_update": "2026-10-08T15:38:40.034918",
  "empty_room_timer": 0,
  "energy_consumed_kwh": 0.0,
  "estimated_cost": 0.0,
  "light_runtime_minutes": 0,
  "fan_runtime_minutes": 0,
  "device_status": {
    "cpu_usage": 12.25,
    "memory_usage": 32.54,
    "device_temperature": 47.69,
    "network_latency": 44.71,
    "network_bandwidth": 150.0,
    "uptime": 78
  },
  "sensor_health": {
    "dht22_online": true,
    "pir_online": true,
    "ldr_online": true,
    "camera_online": true
  }
}
```

#### 2. GET `/api/historical`
**Purpose:** Get historical data for charts

**Response:**
```json
{
  "temperature": [25.2, 25.5, 25.8],
  "humidity": [55.5, 56.0, 55.8],
  "light_level": [794, 800, 795],
  "occupancy": [1, 1, 1],
  "people_count": [2, 2, 2],
  "timestamps": ["15:38:40", "15:38:43", "15:38:46"]
}
```

#### 3. POST `/api/control`
**Purpose:** Control appliances manually

**Request:**
```json
{
  "auto_mode": false,
  "light_on": true,
  "fan_on": false
}
```

**Response:**
```json
{
  "success": true,
  "auto_mode": false,
  "light_on": true,
  "fan_on": false
}
```

#### 4. GET/POST `/api/settings`
**Purpose:** Get or update system settings

**GET Response:**
```json
{
  "occupancy_timeout": 60,
  "temperature_threshold": 28,
  "light_threshold": 300,
  "auto_mode_enabled": true,
  "automation_mode": "AUTO"
}
```

**POST Request:**
```json
{
  "occupancy_timeout": 90,
  "temperature_threshold": 30
}
```

#### 5. POST `/api/simulation/control`
**Purpose:** Control simulation parameters for testing

**Request (Set Temperature):**
```json
{
  "manual_sensor": "temperature",
  "value": 30
}
```

**Request (Force Sensor Offline):**
```json
{
  "force_sensor_state": "dht22",
  "state": false
}
```

**Request (Simulate Occupancy Change):**
```json
{
  "external_influence": "occupancy_change",
  "value": 5
}
```

#### 6. GET `/api/automation/events`
**Purpose:** Get automation event log

**Response:**
```json
{
  "events": [
    {
      "timestamp": "2026-10-08T15:38:40.388942",
      "event_type": "Mode change",
      "message": "Automation mode set to MANUAL"
    },
    {
      "timestamp": "2026-10-08T15:38:41.777609",
      "event_type": "Manual control",
      "message": "Light ON via manual override"
    }
  ]
}
```

#### 7. GET `/api/simulation/energy`
**Purpose:** Get energy statistics

**Response:**
```json
{
  "light_energy_kwh": 0.0125,
  "fan_energy_kwh": 0.0087,
  "total_energy_kwh": 0.0212,
  "estimated_cost": 0.13,
  "light_runtime_minutes": 15,
  "fan_runtime_minutes": 10
}
```

---

## Database & Data Flow

### Current Implementation

**No Database Used (In-Memory Storage)**
- Historical data stored in memory (Python list)
- Limited to last 100 data points
- Lost on server restart
- Sufficient for demonstration

**Data Storage:**
```python
historical_data = {
    'temperature': [],
    'humidity': [],
    'light_level': [],
    'people_count': [],
    'timestamp': []
}
```

### Future Database Implementation

**Recommended: SQLite**
- Built into Python
- No separate server needed
- Suitable for single-instance deployment
- Easy to backup

**Schema Design:**
```sql
CREATE TABLE sensor_readings (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
    sensor_type TEXT,
    value REAL,
    unit TEXT
);

CREATE TABLE device_states (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
    device_type TEXT,
    state TEXT,
    parameters TEXT
);

CREATE TABLE automation_events (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
    event_type TEXT,
    message TEXT
);

CREATE TABLE energy_records (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
    device_type TEXT,
    energy_kwh REAL,
    runtime_minutes INTEGER
);
```

### Data Flow

```
Sensor Simulator
    ↓
Generate Sensor Value
    ↓
State Manager
    ↓
Store in Historical Data (Memory)
    ↓
API Response
    ↓
Dashboard (Chart.js)
```

---

## Challenges & Solutions

### Challenge 1: Making Simulation Realistic

**Problem:** Random numbers don't behave like real sensors

**Solution:**
- Use mathematical models (sine waves, cosine waves)
- Implement response rates (gradual changes)
- Add time-based patterns (day/night cycles)
- Use hysteresis to prevent rapid changes

**Example:**
```python
# Instead of:
temperature = random.uniform(20, 30)

# Use:
temperature = base_temp + sin(time) * 2 + random.uniform(-0.5, 0.5)
```

### Challenge 2: State Management

**Problem:** Multiple components need to share state

**Solution:**
- Centralized State Manager
- Single source of truth
- Component-based architecture
- Clear interfaces between components

### Challenge 3: Automation Logic

**Problem:** Complex rules with multiple conditions

**Solution:**
- Separate Automation Engine
- Configurable thresholds
- Rule-based approach
- Event logging for debugging

### Challenge 4: Real-Time Updates

**Problem:** Dashboard needs to show live data

**Solution:**
- Polling approach (simpler)
- 3-second interval for status
- 5-second interval for historical data
- Smooth animations in UI

### Challenge 5: Testing Scenarios

**Problem:** Need to test edge cases (sensor failure, etc.)

**Solution:**
- Simulation Control Panel
- Manual sensor value setting
- Force sensor/device states
- Simulate external influences

### Challenge 6: Energy Calculation

**Problem:** Accurate energy consumption tracking

**Solution:**
- Track runtime in seconds
- Calculate: Power (kW) × Time (hours)
- Configurable power ratings
- Configurable electricity tariff

---

## Future Scope

### Short-term Enhancements

1. **Database Integration**
   - SQLite for persistent storage
   - Historical data retention
   - Query capabilities

2. **User Authentication**
   - Login system
   - Role-based access (Admin, Teacher, Viewer)
   - Session management

3. **Multi-Classroom Support**
   - Multiple classroom management
   - Classroom selection
   - Comparative analytics

4. **Advanced Analytics**
   - Trend analysis
   - Predictive insights
   - Energy optimization recommendations

### Long-term Enhancements

1. **Real Hardware Integration**
   - Replace simulation with real sensors
   - Raspberry Pi edge agent
   - MQTT communication
   - Real computer vision with OpenCV

2. **Mobile App**
   - React Native or Flutter
   - Push notifications
   - Remote control

3. **Machine Learning**
   - Predictive maintenance
   - Occupancy prediction
   - Energy optimization algorithms

4. **Integration with Building Management**
   - SCADA integration
   - BMS (Building Management System)
   - Centralized control

---

## Common Viva Questions & Answers

### Q1: Why did you use simulation instead of real hardware?

**Answer:** 
- This is a software-focused academic project
- Simulation allows demonstrating IoT concepts without hardware requirements
- Focus is on software architecture, automation logic, and system design
- Simulation can be easily replaced with real hardware when available
- Safer for demonstration (no electrical risks)
- Easier to test and debug

### Q2: How does your simulation differ from a fake demo?

**Answer:**
- **Fake Demo:** Random numbers, no logic, unpredictable
- **Professional Simulation:** 
  - Mathematical models (sine waves for daily cycles)
  - Realistic behavior (gradual changes, response rates)
  - Component-based architecture (Sensor Simulator, Device Controller, Automation Engine)
  - Configurable parameters
  - State management
  - Event logging
  - Interactive testing control

### Q3: Explain the architecture of your system.

**Answer:**
- **Frontend:** HTML/CSS/JavaScript with Chart.js for visualization
- **Backend:** Flask with RESTful API endpoints
- **Simulation Layer:** 
  - Sensor Simulator (simulates DHT22, PIR, LDR, Camera)
  - Device Controller (simulates light, fan control)
  - Automation Engine (implements automation rules)
  - State Manager (coordinates all components)
- **Data Flow:** Dashboard → API → State Manager → Components → Response

### Q4: How does your automation engine work?

**Answer:**
- **Occupancy Detection:** Camera-based with PIR fallback
- **Light Automation:** IF light_level < threshold AND occupied THEN light = ON
- **Fan Automation:** IF temperature > threshold AND occupied THEN fan = ON
- **Hysteresis:** Prevents rapid state changes (e.g., fan turns ON at 30°C, OFF at 26°C)
- **Timeout:** Room must be empty for 60 seconds before turning off appliances
- **Event Logging:** All automation decisions logged for debugging

### Q5: How do you calculate energy consumption?

**Answer:**
- Track runtime in seconds for each device
- Calculate: Energy (kWh) = Power (kW) × Time (hours)
- Light: 40W rating, Fan: 70W rating
- Example: Light ON for 60 minutes = 0.04 kW × 1 hour = 0.04 kWh
- Cost = Energy × Electricity Tariff (₹6/kWh)

### Q6: What is hysteresis and why is it important?

**Answer:**
- **Hysteresis:** A delay between input change and output change
- **Purpose:** Prevents rapid state changes (flickering)
- **Example:** Fan turns ON at 30°C, OFF at 26°C (not 28°C for both)
- **Benefit:** Stable system operation, reduced wear on devices

### Q7: How do you handle sensor failures?

**Answer:**
- Each sensor has online/offline state
- Dashboard shows sensor health (green = online, red = offline)
- Automation engine has fallback logic:
  - Camera offline → Use PIR motion sensor
  - DHT22 offline → Disable temperature-based automation
- Events logged when sensors go offline/online
- Simulation Control Panel allows testing failure scenarios

### Q8: Explain your API design.

**Answer:**
- **RESTful design:** Use HTTP methods appropriately (GET for data, POST for control)
- **JSON format:** Standardized request/response
- **Endpoints:**
  - `/api/status` - Current system state
  - `/api/historical` - Historical data for charts
  - `/api/control` - Manual appliance control
  - `/api/settings` - System settings
  - `/api/simulation/control` - Simulation parameters
- **Error handling:** Try-catch blocks, meaningful error messages

### Q9: How do you ensure data consistency?

**Answer:**
- **Centralized State Manager:** Single source of truth
- **Immutable state updates:** State changes through methods, not direct assignment
- **Periodic updates:** Simulation updates on each API call
- **Component isolation:** Each component manages its own state
- **Event logging:** All state changes logged

### Q10: What would you change if you had real hardware?

**Answer:**
- Replace Sensor Simulator with real sensor libraries (RPi.GPIO, adafruit-circuitpython-dht)
- Replace Device Controller with actual GPIO control
- Add MQTT communication between Raspberry Pi and backend
- Implement real computer vision with OpenCV and YOLO
- Add edge computing on Raspberry Pi for local automation
- Use SQLite for persistent data storage
- Add security (authentication, encryption)

### Q11: How do you test your system?

**Answer:**
- **Simulation Control Panel:** Interactive testing interface
- **Manual sensor value setting:** Set temperature to 35°C, watch fan activate
- **Force sensor states:** Disable DHT22, test fallback logic
- **Simulate external influences:** Add 5 people, test occupancy detection
- **Automation events log:** Verify automation decisions
- **API testing:** Use curl to test endpoints
- **Browser testing:** Manual UI testing

### Q12: What are the limitations of your current implementation?

**Answer:**
- **No persistent storage:** Data lost on server restart
- **No authentication:** Anyone can access and control
- **Single classroom:** No multi-classroom support
- **Simulation only:** Not connected to real hardware
- **No WebSocket:** Polling instead of true real-time
- **Limited analytics:** Basic charts, no advanced analysis

### Q13: How would you scale this system for multiple classrooms?

**Answer:**
- Add classroom ID to all data structures
- Implement classroom selection in UI
- Create classroom management interface
- Support multiple device instances
- Comparative analytics across classrooms
- Centralized dashboard with classroom filters

### Q14: What was the most challenging part of this project?

**Answer:**
- **Designing realistic simulation:** Making sensors behave naturally
- **State management:** Coordinating multiple components
- **Automation logic:** Implementing rules with hysteresis and timeouts
- **API design:** Creating clean, consistent endpoints
- **UI/UX:** Professional dashboard design with real-time updates

### Q15: How does your system save energy?

**Answer:**
- **Automatic shut-off:** Lights/fan turn off when room empty (after timeout)
- **Smart lighting:** Only turn on when ambient light is insufficient
- **Temperature-based fan:** Only run when temperature is high
- **Energy tracking:** Monitor consumption to identify wastage
- **Optimization:** Configurable thresholds for optimal operation

### Q16: Explain the difference between AUTO and MANUAL mode.

**Answer:**
- **AUTO Mode:** System controls appliances automatically based on sensor data and rules
- **MANUAL Mode:** User controls appliances manually (override automation)
- **Switching:** Can toggle between modes at any time
- **Event logging:** Mode changes logged for audit trail

### Q17: How do you handle concurrent requests?

**Answer:**
- Flask development server handles requests sequentially
- Production would use Gunicorn (multi-worker)
- State updates are thread-safe (Python GIL for this scope)
- No database conflicts (in-memory storage)
- Would need proper locking with real database

### Q18: What security measures would you add for production?

**Answer:**
- **Authentication:** Login system with JWT tokens
- **Authorization:** Role-based access (Admin, Teacher, Viewer)
- **HTTPS:** SSL/TLS encryption
- **Input validation:** Sanitize all user inputs
- **Rate limiting:** Prevent API abuse
- **Audit logging:** Track all control actions
- **Secure MQTT:** Authentication and TLS for device communication

### Q19: How did you approach the UI design?

**Answer:**
- **Glassmorphism:** Modern, premium aesthetic
- **Dark theme:** Professional, easy on eyes
- **Responsive:** Works on desktop, tablet, mobile
- **Real-time updates:** Polling every 3 seconds
- **Visual feedback:** Progress bars, status indicators, animations
- **Accessibility:** Clear labels, high contrast
- **Iconography:** Lucide Icons for consistency

### Q20: What did you learn from this project?

**Answer:**
- **IoT concepts:** Sensors, automation, edge computing
- **Software architecture:** Component-based design, state management
- **API design:** RESTful principles, JSON, HTTP methods
- **Frontend development:** JavaScript, Chart.js, responsive design
- **Backend development:** Flask, Python, API endpoints
- **Simulation techniques:** Mathematical modeling, realistic behavior
- **Project management:** Planning, implementation, testing, documentation

---

## Quick Reference for Viva

### Key Numbers to Remember
- **Temperature Range:** 15-40°C
- **Humidity Range:** 30-90%
- **Light Level:** 0-1000 lux
- **People Count:** 1-8 people
- **Occupancy Timeout:** 60 seconds
- **Temperature Threshold:** 28°C
- **Light Threshold:** 300 lux
- **Light Power:** 40W
- **Fan Power:** 70W
- **Polling Interval:** 3 seconds
- **Historical Data Points:** 100

### Key Components
1. **Sensor Simulator** - Simulates DHT22, PIR, LDR, Camera
2. **Device Controller** - Simulates light, fan control
3. **Automation Engine** - Implements automation rules
4. **State Manager** - Coordinates all components
5. **Flask Backend** - API endpoints
6. **JavaScript Frontend** - Dashboard UI

### Key Files
- `app.py` - Main Flask application
- `simulation/sensor_simulator.py` - Sensor simulation
- `simulation/device_controller.py` - Device control
- `simulation/automation_engine.py` - Automation logic
- `simulation/state_manager.py` - State management
- `templates/index.html` - Dashboard UI
- `static/js/dashboard.js` - Dashboard logic

### Key API Endpoints
- `GET /api/status` - Current system state
- `GET /api/historical` - Historical data
- `POST /api/control` - Manual control
- `POST /api/settings` - System settings
- `POST /api/simulation/control` - Simulation control

---

## Final Tips for Presentation

1. **Be Confident:** You built a complete, working system
2. **Show, Don't Just Tell:** Demonstrate the live system
3. **Use the Simulation Panel:** Show interactive testing
4. **Explain the Architecture:** Draw the diagram if needed
5. **Focus on Logic:** Explain how automation works
6. **Mention Future Scope:** Show you've thought ahead
7. **Be Honest:** Acknowledge limitations, explain why
8. **Highlight Your Learning:** What you gained from this project

---

## Live Demo Script

### Introduction (2 minutes)
- "Good morning/afternoon, I'm [Your Name]"
- "Today I present my B.Tech minor project"
- "Title: Smart Classroom Monitoring and Energy Management System"
- "Using Raspberry Pi, IoT and Computer Vision"

### Problem Statement (1 minute)
- "Energy wastage in classrooms is a significant issue"
- "Lights and fans often remain ON even when empty"
- "Manual monitoring is impractical"
- "Need intelligent, automated solution"

### Solution Overview (2 minutes)
- "IoT-based monitoring and control system"
- "Computer vision for occupancy detection"
- "Intelligent automation for energy savings"
- "Web-based dashboard for monitoring"

### System Architecture (3 minutes)
- [Draw or show architecture diagram]
- "Frontend: HTML/CSS/JavaScript with Chart.js"
- "Backend: Flask with RESTful API"
- "Simulation Layer: Sensor Simulator, Device Controller, Automation Engine"
- "State Manager: Central coordination"

### Live Demonstration (5 minutes)
1. **Show Dashboard**
   - "This is the main dashboard"
   - "Shows real-time sensor data"
   - "Device status, automation state"

2. **Show Automation**
   - "Currently in AUTO mode"
   - "Watch automation respond to changes"
   - "Switch to MANUAL mode"
   - "Manually control light/fan"

3. **Show Simulation Panel**
   - "This is the simulation control panel"
   - "Set temperature to 35°C"
   - "Watch fan activate automatically"
   - "Force DHT22 offline"
   - "Show sensor health update"

4. **Show Analytics**
   - "Historical data visualization"
   - "Temperature and humidity trends"
   - "Occupancy patterns"

### Technical Deep Dive (3 minutes)
- "Simulation uses mathematical models"
- "Sine waves for daily temperature cycles"
- "Hysteresis prevents rapid state changes"
- "Component-based architecture"
- "Centralized state management"

### Challenges & Solutions (2 minutes)
- "Making simulation realistic"
- "State management"
- "Automation logic"
- "Real-time updates"

### Future Scope (1 minute)
- "Real hardware integration"
- "Database implementation"
- "User authentication"
- "Multi-classroom support"
- "Mobile app"

### Conclusion (1 minute)
- "Successfully implemented professional IoT simulation"
- "Demonstrates complete system architecture"
- "Ready for hardware integration"
- "Significant energy savings potential"
- "Thank you for your attention"

---

## Additional Resources

### Live URL
- **Dashboard:** https://smart-classroom-monitoring-system-drrn.onrender.com
- **Simulation Panel:** https://smart-classroom-monitoring-system-drrn.onrender.com/simulation

### GitHub Repository
- **URL:** https://github.com/mhk-verma/smart-classroom-monitoring-system

### Documentation
- **SIMULATION_GUIDE.md** - Complete simulation documentation
- **README.md** - Project overview
- **DEPLOYMENT_GUIDE.md** - Deployment instructions

---

**Good luck with your presentation! You have a complete, working system with professional architecture. Be confident and demonstrate your knowledge.** 🎓
