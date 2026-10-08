# Viva Cheat Sheet - Quick Reference

## Project Basics
**Title:** Smart Classroom Monitoring and Energy Management System Using Raspberry Pi, IoT and Computer Vision

**Problem:** Energy wastage in classrooms - lights/fans ON when empty

**Solution:** IoT-based automated monitoring and control system

---

## Architecture (3-Layer)
```
Frontend (HTML/CSS/JS) → Backend (Flask API) → Simulation Engine
```

## 4 Main Components
1. **Sensor Simulator** - Simulates DHT22, PIR, LDR, Camera
2. **Device Controller** - Simulates light, fan control
3. **Automation Engine** - Implements automation rules
4. **State Manager** - Coordinates all components

---

## Key Numbers
- Temperature: 15-40°C
- Humidity: 30-90%
- Light Level: 0-1000 lux
- People: 1-8
- Occupancy Timeout: 60 seconds
- Temperature Threshold: 28°C
- Light Threshold: 300 lux
- Light Power: 40W
- Fan Power: 70W

---

## Automation Rules
**Light:** IF light_level < 300 AND occupied THEN light = ON
**Fan:** IF temperature > 28°C AND occupied THEN fan = ON
**Hysteresis:** Fan ON at 30°C, OFF at 26°C (prevents flickering)

---

## API Endpoints
- `GET /api/status` - Current state
- `GET /api/historical` - Chart data
- `POST /api/control` - Manual control
- `POST /api/settings` - Update settings
- `POST /api/simulation/control` - Test simulation

---

## Why Simulation?
- Software-focused academic project
- Demonstrates IoT concepts without hardware
- Safer for demonstration
- Easier to test and debug
- Can be replaced with real hardware later

---

## Realistic vs Fake
**Fake:** Random numbers, no logic
**Realistic:** Mathematical models, gradual changes, component-based, state management

---

## Energy Calculation
Energy (kWh) = Power (kW) × Time (hours)
Example: 40W light × 1 hour = 0.04 kWh
Cost = Energy × ₹6/kWh

---

## Hysteresis
Purpose: Prevents rapid state changes
Example: Fan ON at 30°C, OFF at 26°C (not 28°C for both)

---

## Sensor Failure Handling
- Each sensor has online/offline state
- Dashboard shows health (green/red)
- Camera offline → Use PIR fallback
- DHT22 offline → Disable temp automation
- Events logged

---

## State Management
- Centralized State Manager
- Single source of truth
- Component isolation
- Event logging

---

## Testing
- Simulation Control Panel
- Manual sensor value setting
- Force sensor states
- Simulate external influences
- Automation events log

---

## Limitations
- No persistent storage
- No authentication
- Single classroom
- Simulation only
- Polling (not WebSocket)

---

## Future Scope
- Real hardware integration
- Database (SQLite)
- User authentication
- Multi-classroom
- WebSocket real-time
- Mobile app

---

## Key Files
- `app.py` - Flask application
- `simulation/sensor_simulator.py` - Sensors
- `simulation/device_controller.py` - Devices
- `simulation/automation_engine.py` - Automation
- `simulation/state_manager.py` - State management
- `templates/index.html` - Dashboard
- `static/js/dashboard.js` - Dashboard logic

---

## Live Demo URL
https://smart-classroom-monitoring-system-drrn.onrender.com

---

## GitHub
https://github.com/mhk-verma/smart-classroom-monitoring-system

---

**Remember: Be confident, show the live system, explain the architecture, focus on logic!**
