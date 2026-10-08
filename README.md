# Smart Classroom Monitoring and Energy Management System

**B.Tech CSE/IT Minor Project**

A Raspberry Pi-based smart classroom prototype that combines IoT sensors, computer vision, appliance automation, data storage and a web dashboard.

## Project Overview

This system monitors classroom occupancy, temperature and humidity, and automatically controls demonstration appliances (LED/light and DC fan) according to occupancy and configured rules. The system is designed as a realistic academic prototype rather than a commercial product.

## Current Status: STAGE 1 COMPLETED

✅ **STAGE 1: Project Structure and Professional Flask Dashboard with DEMO_MODE**

### What's Implemented in Stage 1:

- ✅ Complete project directory structure
- ✅ Professional Flask web application with modern UI/UX design
- ✅ DEMO_MODE for testing without physical hardware
- ✅ Real-time dashboard with simulated sensor data
- ✅ Professional color palette (Navy, Cyan, Green, Amber, Red)
- ✅ Occupancy detection simulation
- ✅ Temperature and humidity monitoring simulation
- ✅ Appliance control (AUTO/ON/OFF modes)
- ✅ Energy saving statistics
- ✅ Historical charts (temperature, humidity, occupancy)
- ✅ Settings page for configuration
- ✅ System logs with timestamps
- ✅ Professional icon library (Lucide Icons)
- ✅ Responsive design for mobile, tablet, and desktop
- ✅ Clean, technical, professional appearance suitable for academic demonstration

### Future Stages (Not Yet Implemented):

- ⏳ STAGE 2: SQLite database and APIs
- ⏳ STAGE 3: DHT22 and PIR hardware modules
- ⏳ STAGE 4: Camera and person detection
- ⏳ STAGE 5: Relay/appliance control
- ⏳ STAGE 6: Full system integration
- ⏳ STAGE 7: Testing, documentation and viva preparation

## Hardware Requirements (For Future Stages)

1. Raspberry Pi 4 or Raspberry Pi 5
2. Raspberry Pi Camera Module or USB webcam
3. DHT22 temperature and humidity sensor
4. PIR motion sensor
5. Relay module (suitable for low-voltage demonstration loads)
6. DC fan
7. LED/light
8. Breadboard
9. Jumper wires
10. Appropriate power supply
11. Optional: OLED/LCD display

## Software Requirements (Stage 1)

### For Windows/Linux Development:
- Python 3.8 or higher
- pip (Python package manager)
- Modern web browser (Chrome, Firefox, Edge, etc.)

### For Raspberry Pi (Future Stages):
- Raspberry Pi OS
- Python 3
- GPIO libraries
- Camera support

## Stage 1 Installation Instructions

### Step 1: Clone or Download the Project

If you have the project files, navigate to the project directory:
```bash
cd "C:\Users\Mahak\CascadeProjects\min pro"
```

### Step 2: Create Virtual Environment (Recommended)

**On Windows:**
```bash
python -m venv venv
venv\Scripts\activate
```

**On Linux/Mac:**
```bash
python3 -m venv venv
source venv/bin/activate
```

### Step 3: Install Dependencies

```bash
pip install -r requirements.txt
```

For Stage 1, this will install:
- Flask 3.0.0 (web framework)
- Werkzeug 3.0.1 (WSGI utility library)

### Step 4: Run the Application

```bash
python app.py
```

You should see output like:
```
Starting Smart Classroom Monitoring System
Demo Mode: True
Access dashboard at: http://127.0.0.1:5000
 * Running on all addresses (0.0.0.0)
 * Running on http://127.0.0.1:5000
```

### Step 5: Access the Dashboard

Open your web browser and navigate to:
```
http://127.0.0.1:5000
```

Or from other devices on your local network:
```
http://YOUR_IP_ADDRESS:5000
```

(Replace YOUR_IP_ADDRESS with your computer's local IP)

## Stage 1 Features

### 1. Professional Dashboard Design
- **Modern UI/UX**: Clean, technical design with professional color palette
- **Responsive Layout**: Works on desktop, tablet, and mobile devices
- **Professional Icons**: Lucide icon library for consistent visual language
- **Color System**: Navy (primary), Cyan (IoT/AI accent), Green (success), Amber (warning), Red (error)
- **Card-based Layout**: Organized information display with subtle shadows and borders

### 2. Main Dashboard
- **Hero Section**: System status overview with Raspberry Pi, camera, sensor, and automation status
- **Occupancy Status**: Shows if classroom is occupied or empty with visual indicators
- **People Detected**: Simulated count of people in the room
- **Temperature**: Current temperature reading with status indicator (Normal/High)
- **Humidity**: Current humidity reading
- **PIR Motion**: Motion sensor status with visual feedback
- **Light Status**: Current state with AUTO/MANUAL mode badge
- **Fan Status**: Current state with AUTO/MANUAL mode badge

### 3. Automation Control
- **Auto Mode Toggle**: Enable/disable automatic appliance control
- **Manual Controls**: Manually control light and fan when auto mode is off
- **Real-time Updates**: Dashboard updates every 3 seconds
- **Visual Feedback**: Disabled controls when in auto mode

### 4. Energy Statistics
- **Energy Saved**: Estimated energy savings in kWh with prominent display
- **Light Runtime**: Total time light has been on
- **Fan Runtime**: Total time fan has been on
- **Professional Card Design**: Dark gradient background for energy metrics

### 5. Real-time Charts
- **Temperature Chart**: Live temperature monitoring with professional styling
- **Humidity Chart**: Live humidity monitoring with professional styling
- **Chart.js Integration**: Responsive charts with clean design
- **Professional Colors**: Consistent with overall design system

### 6. System Logs
- **Real-time Logging**: System events with timestamps
- **Color-coded Messages**: Success (green), Error (red), Info (default)
- **Auto-scroll**: Latest entries appear at top
- **Log History**: Maintains last 20 entries

### 7. Analytics Page
Navigate to `/analytics` to see:
- Historical temperature data with professional charts
- Historical humidity data with professional charts
- Occupancy history with bar chart
- Combined sensor data visualization
- Statistics summary with professional card design

### 8. Settings Page
Navigate to `/settings` to configure:
- Occupancy timeout (seconds)
- Temperature threshold (°C)
- Sensor read interval
- Detection interval
- Confidence threshold
- Current configuration display
- System status overview

### 9. Demo Mode UI
- **Professional Badge**: Clear "DEMO DATA" indicator in header
- **Transparency**: All simulated data clearly labeled
- **System Status**: Shows simulation status in settings
- **Camera Status**: Indicates simulated vs. connected

## Project Structure

```
smart_classroom/
│
├── app.py                      # Main Flask application
├── config.py                   # Configuration settings
├── requirements.txt            # Python dependencies
│
├── hardware/                   # Hardware modules (Stage 3)
│   ├── __init__.py
│   ├── dht_sensor.py          # DHT22 sensor (to be implemented)
│   ├── pir_sensor.py          # PIR sensor (to be implemented)
│   └── relay_controller.py    # Relay control (to be implemented)
│
├── vision/                     # Computer vision modules (Stage 4)
│   ├── __init__.py
│   ├── camera.py              # Camera capture (to be implemented)
│   └── person_detection.py    # Person detection (to be implemented)
│
├── database/                   # Database modules (Stage 2)
│   ├── __init__.py
│   └── db.py                  # SQLite operations (to be implemented)
│
├── services/                   # Business logic (Stage 5-6)
│   ├── __init__.py
│   ├── occupancy_service.py   # Occupancy logic (to be implemented)
│   ├── automation_service.py  # Automation logic (to be implemented)
│   └── energy_service.py      # Energy calculations (to be implemented)
│
├── templates/                  # HTML templates
│   ├── index.html             # Main dashboard
│   ├── analytics.html         # Analytics page
│   └── settings.html          # Settings page
│
├── static/                     # Static files
│   ├── css/
│   │   └── style.css          # Main stylesheet
│   └── js/
│       ├── dashboard.js       # Dashboard JavaScript
│       ├── analytics.js       # Analytics JavaScript
│       └── settings.js        # Settings JavaScript
│
└── data/                       # Data directory (for future database)
```

## DEMO_MODE Explanation

The application runs in **DEMO_MODE** by default, which simulates hardware behavior:

- **Temperature**: Simulates realistic temperature fluctuations (22-27°C)
- **Humidity**: Simulates realistic humidity variations (45-70%)
- **PIR Motion**: Randomly simulates motion detection
- **People Detection**: Simulates 0-3 people based on motion
- **Occupancy Logic**: Full occupancy timeout simulation
- **Appliance Control**: Complete automation logic simulation
- **Energy Statistics**: Simulated energy savings calculation

This allows you to demonstrate the complete system functionality without physical hardware.

## Configuration

Edit `config.py` to change system settings:

```python
# Demo mode - set to False when hardware is connected
DEMO_MODE = True

# Automation settings
OCCUPANCY_TIMEOUT = 300  # Seconds before turning off appliances
TEMPERATURE_THRESHOLD = 28  # Temperature for fan control
AUTO_MODE_ENABLED = True  # Default automation mode
```

You can also set environment variables:
```bash
set DEMO_MODE=False  # Windows
export DEMO_MODE=False  # Linux/Mac
```

## Troubleshooting

### Port Already in Use
If port 5000 is already in use, you can change the port in `app.py`:
```python
app.run(host='0.0.0.0', port=5001, debug=True)
```

### Dashboard Not Updating
- Check browser console for JavaScript errors
- Ensure Flask server is running
- Try refreshing the page

### Charts Not Displaying
- Ensure internet connection (Chart.js loads from CDN)
- Check browser console for errors
- Try a different browser

## Next Steps

After completing Stage 1, you can proceed to:

**STAGE 2**: Implement SQLite database and APIs
- Create database schema
- Implement sensor reading storage
- Create historical data APIs

**STAGE 3**: Implement hardware modules
- DHT22 temperature/humidity sensor
- PIR motion sensor
- Relay controller

**STAGE 4**: Implement computer vision
- Camera capture
- Person detection using OpenCV

**STAGE 5**: Implement appliance control
- Relay control implementation
- Safety features

**STAGE 6**: System integration
- Connect all modules
- Full automation logic

**STAGE 7**: Testing and documentation
- System testing
- Complete documentation
- Viva preparation

## Safety Notice

⚠️ **IMPORTANT**: This is an academic prototype. When implementing hardware stages:

- Use only low-voltage DC demonstration appliances
- NEVER connect mains electricity directly to Raspberry Pi GPIO
- Use appropriate relay isolation
- Follow proper electrical safety procedures
- Consult with your project guide for hardware connections

## Academic Documentation

Future stages will include complete documentation for:
- Abstract
- Introduction
- Problem Statement
- Objectives
- System Architecture
- Hardware/Software Requirements
- Methodology
- Implementation Details
- Testing Results
- Conclusion
- Viva Preparation (25+ questions with answers)

## License

This is an academic project for educational purposes.

## Contact

For project support or questions, consult with your project guide.

---

**STAGE 1 STATUS**: ✅ COMPLETED AND READY FOR TESTING

**Current Version**: Stage 1 - Flask Dashboard with DEMO_MODE
**Last Updated**: 2026-09-15
