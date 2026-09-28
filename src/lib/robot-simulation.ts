/**
 * Client-side simulation standing in for the real telemetry/command link.
 * This is the single module to swap out once the C# robot-control service
 * exposes a live WebSocket/REST API — every other component reads state
 * from and dispatches actions through `useRobotSimulation` only.
 */
import { useCallback, useEffect, useRef, useState } from 'react'

export type ConnectionStatus = 'online' | 'reconnecting' | 'offline'
export type RobotMode =
  | 'idle'
  | 'scanning'
  | 'driving'
  | 'retrieving'
  | 'depositing'
  | 'e-stopped'
export type ArmPosition = 'stowed' | 'lowered' | 'raised' | 'over-bin'
export type BinStatus = 'clear' | 'filling' | 'nearly-full' | 'full'
export type LogLevel = 'info' | 'success' | 'warning' | 'critical'
export type Direction = 'forward' | 'backward' | 'left' | 'right'

export interface LogEntry {
  id: string
  timestamp: number
  level: LogLevel
  message: string
}

export interface DetectionPing {
  id: string
  timestamp: number
  strength: number
  resolved: 'pending' | 'collected' | 'missed'
}

export interface RobotState {
  connection: ConnectionStatus
  mode: RobotMode
  battery: number
  charging: boolean
  magnetOn: boolean
  armPosition: ArmPosition
  armExtension: number
  heading: number
  speed: number
  metalDetected: boolean
  detectionStrength: number
  lastDetection: DetectionPing | null
  detectionHistory: DetectionPing[]
  objectsCollected: number
  binFillPercent: number
  binStatus: BinStatus
  lastCollectedAt: number | null
  emergencyStopped: boolean
  log: LogEntry[]
  sessionStart: number
}

const MAX_LOG = 60
const MAX_HISTORY = 12

function makeId() {
  return Math.random().toString(36).slice(2, 10)
}

function initialState(now: number): RobotState {
  return {
    connection: 'online',
    mode: 'idle',
    battery: 87,
    charging: false,
    magnetOn: false,
    armPosition: 'stowed',
    armExtension: 0,
    heading: 0,
    speed: 0,
    metalDetected: false,
    detectionStrength: 0,
    lastDetection: null,
    detectionHistory: [],
    objectsCollected: 0,
    binFillPercent: 8,
    binStatus: 'clear',
    lastCollectedAt: null,
    emergencyStopped: false,
    log: [
      {
        id: makeId(),
        timestamp: now,
        level: 'info',
        message: 'Telemetry link established. Magnetrieve ready for commands.',
      },
    ],
    sessionStart: now,
  }
}

function binStatusFor(fill: number): BinStatus {
  if (fill >= 96) return 'full'
  if (fill >= 75) return 'nearly-full'
  if (fill >= 15) return 'filling'
  return 'clear'
}

export function useRobotSimulation() {
  const [mounted, setMounted] = useState(false)
  const [state, setState] = useState<RobotState>(() => initialState(0))
  const collectTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    setState(initialState(Date.now()))
    setMounted(true)
  }, [])

  const pushLog = useCallback((level: LogLevel, message: string) => {
    setState((prev) => ({
      ...prev,
      log: [{ id: makeId(), timestamp: Date.now(), level, message }, ...prev.log].slice(
        0,
        MAX_LOG,
      ),
    }))
  }, [])

  // Ambient telemetry: battery drain, occasional detection pings while scanning.
  useEffect(() => {
    if (!mounted) return
    const tick = setInterval(() => {
      setState((prev) => {
        if (prev.emergencyStopped || prev.connection === 'offline') return prev

        let next = { ...prev }

        if (!prev.charging) {
          const drain = prev.mode === 'driving' ? 0.55 : 0.15
          next.battery = Math.max(0, +(prev.battery - drain).toFixed(1))
        }

        if (
          (prev.mode === 'scanning' || prev.mode === 'driving') &&
          !prev.metalDetected &&
          Math.random() < 0.22
        ) {
          const strength = Math.round(35 + Math.random() * 60)
          const ping: DetectionPing = {
            id: makeId(),
            timestamp: Date.now(),
            strength,
            resolved: 'pending',
          }
          next.metalDetected = true
          next.detectionStrength = strength
          next.lastDetection = ping
          next.detectionHistory = [ping, ...prev.detectionHistory].slice(0, MAX_HISTORY)
          next.mode = 'retrieving'
        }

        return next
      })

      if (Math.random() < 0.22) {
        pushLog(
          'info',
          [
            'Ultrasonic sweep complete, no obstacles within 0.8m.',
            'IMU drift within tolerance, no recalibration needed.',
            'Drive motor temperature nominal.',
            'Arm servo currents within expected range.',
          ][Math.floor(Math.random() * 4)],
        )
      }
    }, 4200)
    return () => clearInterval(tick)
  }, [mounted, pushLog])

  // React to a pending detection that's been signalled — narrate it once.
  useEffect(() => {
    if (state.lastDetection?.resolved === 'pending' && state.metalDetected) {
      pushLog(
        'warning',
        `Ferrous object detected, signal strength ${state.lastDetection.strength}%. Lower the arm to retrieve.`,
      )
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.lastDetection?.id])

  useEffect(() => {
    if (state.battery <= 15 && state.battery > 0 && mounted) {
      pushLog('critical', `Battery critical at ${Math.round(state.battery)}%. Return to dock recommended.`)
    }
  }, [state.battery <= 15])

  useEffect(() => {
    if (state.binStatus === 'full') {
      pushLog('critical', 'Collector bin full. Empty the bin before continuing retrieval.')
    }
  }, [state.binStatus])

  const drive = useCallback(
    (direction: Direction) => {
      setState((prev) => {
        if (prev.emergencyStopped || prev.connection === 'offline') return prev
        return {
          ...prev,
          mode: 'driving',
          speed: 0.6,
          heading:
            direction === 'left'
              ? (prev.heading - 15 + 360) % 360
              : direction === 'right'
                ? (prev.heading + 15) % 360
                : prev.heading,
        }
      })
      pushLog('info', `Drive command: ${direction}.`)
    },
    [pushLog],
  )

  const stopDriving = useCallback(() => {
    setState((prev) =>
      prev.emergencyStopped ? prev : { ...prev, mode: prev.metalDetected ? 'retrieving' : 'idle', speed: 0 },
    )
  }, [])

  const setArm = useCallback(
    (position: ArmPosition) => {
      setState((prev) => {
        if (prev.emergencyStopped || prev.connection === 'offline') return prev
        return {
          ...prev,
          armPosition: position,
          armExtension: position === 'lowered' ? 100 : position === 'raised' ? 60 : position === 'over-bin' ? 60 : 0,
        }
      })
      const labels: Record<ArmPosition, string> = {
        stowed: 'Arm stowed in travel position.',
        lowered: 'Arm lowered toward ground.',
        raised: 'Arm raised to transport height.',
        'over-bin': 'Arm swung over the collector bin.',
      }
      pushLog('info', labels[position])
    },
    [pushLog],
  )

  const toggleMagnet = useCallback(() => {
    setState((prev) => {
      if (prev.emergencyStopped || prev.connection === 'offline') return prev
      const turningOn = !prev.magnetOn
      let next: RobotState = { ...prev, magnetOn: turningOn }

      if (turningOn && prev.metalDetected && prev.armPosition === 'lowered') {
        if (collectTimer.current) clearTimeout(collectTimer.current)
        collectTimer.current = setTimeout(() => {
          setState((s) => ({
            ...s,
            armPosition: 'raised',
            armExtension: 60,
            mode: 'retrieving',
          }))
          pushLog('success', 'Object secured to electromagnet. Raising arm for transport.')
        }, 1400)
      }

      if (!turningOn && prev.armPosition === 'over-bin' && prev.metalDetected) {
        const gain = Math.round(4 + Math.random() * 9)
        const fill = Math.min(100, prev.binFillPercent + gain)
        next = {
          ...next,
          metalDetected: false,
          detectionStrength: 0,
          objectsCollected: prev.objectsCollected + 1,
          binFillPercent: fill,
          binStatus: binStatusFor(fill),
          lastCollectedAt: Date.now(),
          mode: 'idle',
          detectionHistory: prev.detectionHistory.map((d) =>
            d.id === prev.lastDetection?.id ? { ...d, resolved: 'collected' } : d,
          ),
        }
        pushLog('success', 'Object released into collector bin. Retrieval cycle complete.')
      }

      return next
    })
    if (!state.magnetOn) {
      pushLog('info', 'Electromagnet energized.')
    } else {
      pushLog('info', 'Electromagnet de-energized.')
    }
  }, [pushLog, state.magnetOn])

  const emergencyStop = useCallback(() => {
    setState((prev) => ({
      ...prev,
      emergencyStopped: true,
      mode: 'e-stopped',
      speed: 0,
      magnetOn: false,
    }))
    pushLog('critical', 'EMERGENCY STOP engaged. All motion and the electromagnet have been disabled.')
  }, [pushLog])

  const resetEmergencyStop = useCallback(() => {
    setState((prev) => ({ ...prev, emergencyStopped: false, mode: 'idle' }))
    pushLog('info', 'Emergency stop cleared. Systems nominal, awaiting commands.')
  }, [pushLog])

  const setScanning = useCallback(
    (on: boolean) => {
      setState((prev) => {
        if (prev.emergencyStopped) return prev
        return { ...prev, mode: on ? 'scanning' : 'idle' }
      })
      pushLog('info', on ? 'Metal detector sweep engaged.' : 'Metal detector sweep paused.')
    },
    [pushLog],
  )

  // Diagnostic helpers surfaced in Settings so the interface can be exercised
  // without a physical robot attached.
  const simulate = useCallback(
    (event: 'detect' | 'lowBattery' | 'connectionLoss' | 'fillBin' | 'reset') => {
      if (event === 'reset') {
        setState(initialState(Date.now()))
        return
      }
      if (event === 'detect') {
        setState((prev) => {
          const strength = Math.round(45 + Math.random() * 50)
          const ping: DetectionPing = { id: makeId(), timestamp: Date.now(), strength, resolved: 'pending' }
          return {
            ...prev,
            metalDetected: true,
            detectionStrength: strength,
            lastDetection: ping,
            detectionHistory: [ping, ...prev.detectionHistory].slice(0, MAX_HISTORY),
            mode: prev.emergencyStopped ? prev.mode : 'retrieving',
          }
        })
      }
      if (event === 'lowBattery') {
        setState((prev) => ({ ...prev, battery: 11 }))
      }
      if (event === 'connectionLoss') {
        setState((prev) => ({ ...prev, connection: 'reconnecting' }))
        pushLog('critical', 'Telemetry link lost. Attempting to reconnect...')
        setTimeout(() => {
          setState((prev) => ({ ...prev, connection: 'offline' }))
        }, 2200)
        setTimeout(() => {
          setState((prev) => ({ ...prev, connection: 'online' }))
          pushLog('success', 'Telemetry link restored.')
        }, 5200)
      }
      if (event === 'fillBin') {
        setState((prev) => ({ ...prev, binFillPercent: 97, binStatus: 'full' }))
      }
    },
    [pushLog],
  )

  return {
    state,
    mounted,
    actions: {
      drive,
      stopDriving,
      setArm,
      toggleMagnet,
      emergencyStop,
      resetEmergencyStop,
      setScanning,
      simulate,
    },
  }
}

export type RobotSimulation = ReturnType<typeof useRobotSimulation>
