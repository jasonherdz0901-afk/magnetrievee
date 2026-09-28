# Magnetrieve — Product Roadmap

Magnetrieve's website is being built in stages: get the full control experience right on the frontend first, using realistic simulated robot behavior, then wire it to the real robot underneath. This keeps the interface, safety flows, and layout stable while the C# control service and hardware integration are developed in parallel.

## Milestone 1 — Control surface (shipped)

The homepage and the six-tab live control dashboard (Overview, Control, Metal Detection, Collector Bin, Activity Log, Settings) are built and fully interactive, backed by an in-browser simulation (`src/lib/robot-simulation.ts`) that stands in for the real robot: driving, arm positioning, magnet toggling, emergency stop, detection events, battery drain, and notifications all behave the way they will once a real robot is connected. This lets the full UX — including edge cases like low battery, lost connection, and a full collector bin — be exercised and refined before any hardware is involved.

## Milestone 2 — C# control service integration

- Stand up the C# service that runs on the robot's onboard computer, exposing a WebSocket (for live telemetry + commands) and/or REST API.
- Define the wire protocol: command messages (drive, arm position, magnet on/off, emergency stop) and telemetry messages (battery, connection quality, detection events, arm position, bin fill).
- Replace `useRobotSimulation` with a hook of the same shape that opens a connection to the C# service and dispatches real commands — every dashboard component already reads through this single interface, so no component changes should be needed.
- Handle real-world connection concerns the simulation doesn't need to: reconnect/backoff, command acknowledgement and timeouts, and out-of-order or dropped telemetry.

## Milestone 3 — Sensor and actuator integration (robot side)

- Wire the inductive metal-detection sensor into the C# service's telemetry stream.
- Wire arm servo control and solenoid electromagnet driver into the C# service's command handling.
- Implement the emergency-stop path at the hardware/firmware level so it cuts motor and magnet power directly, independent of the network link to the dashboard.
- Add bin-fill sensing (or object-count-based estimation) to drive the Collector Bin panel from real data.

## Milestone 4 — Persistence

Move activity logs, detection/collection history, and saved settings from in-memory simulation state to durable storage using Netlify's database primitives, so history survives refreshes and reconnects:

- Activity log entries (level, message, timestamp).
- Detection/collection history (per-object: detected time, resolution, collected time).
- User-configured settings (robot host/port, telemetry refresh rate, calibration values, units).

## Milestone 5 — Accounts and multi-robot support

- Authentication, if Magnetrieve is to be controlled by more than one trusted operator or exposed beyond a local network.
- Support for registering and switching between multiple robots from one dashboard, if more than one unit is built.

## Milestone 6 — Operational hardening

- Telemetry history and charts (battery over time, detection rate, uptime) once real historical data exists.
- Alerting beyond in-app notifications (e.g. push/email) for critical events like emergency stop or lost connection while unattended.
- Automated tests around the C# service's command/telemetry contract and the emergency-stop path specifically, given its safety role.
