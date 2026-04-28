# Bachelor-Aerospace-Gui

![Logo](Frontend/src/assets/Aerospace_logo.png)

## Project Description

A ground control GUI for the **Phoenix 2** rocket launch for UiS Aerospace.

The project focuses on building a clean and responsive user interface with fast telemetry handling. Its primary goal is to provide backend infrastructure that receives telemetry data from the rocket’s flight computer, stores it in a database, and presents it through a graphical interface so launch control can monitor the mission in real time.

The system is designed to support both live launch operations and post-flight analysis. It includes an operator interface for internal use and a sponsor/public interface for external viewers. The system supports live telemetry monitoring, replay of recorded sessions, command handling, and persistent telemetry storage using technologies such as React, .NET, SignalR, Redux, Docker, and InfluxDB.  [oai_citation:0‡Bachelor_aerospace_gui.pdf](sediment://file_00000000eb54720a88a77a486faf4cf3)

## Preview

![Project Image](images/GUI.png)

## Features

- Real-time telemetry monitoring
- Operator dashboard for launch control
- Public sponsor dashboard for external viewers
- Telemetry storage using InfluxDB
- Replay of recorded telemetry sessions
- Command handling for mission operations
- Modular frontend components
- Docker-based deployment

## Tech Stack

### Frontend

- React
- Redux
- Tailwind CSS
- Recharts

### Backend

- .NET 9
- C#
- SignalR
- REST API

### Database and Deployment

- InfluxDB
- Docker
- Docker Compose

## Project Structure

```text
bachelor-aerospace-gui/
├── Backend/
│   └── API/
├── Frontend/
│   └── src/
├── images/
├── compose.operator.yaml
├── compose.sponsor.yaml
└── README.md
