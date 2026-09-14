import { useCallback, useRef } from 'react'

type RangeSliderProps = {
  min: number
  max: number
  step: number
  value: [number, number]
  onChange: (value: [number, number]) => void
}

export default function RangeSlider({ min, max, step, value, onChange }: RangeSliderProps) {
  const trackRef = useRef<HTMLDivElement>(null)
  const [low, high] = value

  const percent = (v: number) => ((v - min) / (max - min)) * 100

  const valueFromClientX = useCallback(
    (clientX: number) => {
      const track = trackRef.current
      if (!track) return min
      const rect = track.getBoundingClientRect()
      const ratio = Math.min(1, Math.max(0, (clientX - rect.left) / rect.width))
      const raw = min + ratio * (max - min)
      return Math.round(raw / step) * step
    },
    [min, max, step],
  )

  function startDrag(which: 'low' | 'high') {
    return (e: React.PointerEvent) => {
      e.preventDefault()
      const move = (moveEvent: PointerEvent) => {
        const next = valueFromClientX(moveEvent.clientX)
        if (which === 'low') {
          onChange([Math.min(next, high), high])
        } else {
          onChange([low, Math.max(next, low)])
        }
      }
      const up = () => {
        window.removeEventListener('pointermove', move)
        window.removeEventListener('pointerup', up)
      }
      window.addEventListener('pointermove', move)
      window.addEventListener('pointerup', up)
    }
  }

  function handleKeyDown(which: 'low' | 'high') {
    return (e: React.KeyboardEvent) => {
      const delta = e.key === 'ArrowLeft' || e.key === 'ArrowDown' ? -step : e.key === 'ArrowRight' || e.key === 'ArrowUp' ? step : 0
      if (!delta) return
      e.preventDefault()
      if (which === 'low') {
        onChange([Math.min(max, Math.max(min, low + delta)), high])
      } else {
        onChange([low, Math.min(max, Math.max(min, high + delta))])
      }
    }
  }

  return (
    <div ref={trackRef} className="relative h-1.5 w-full touch-none rounded-full bg-[#e5e7eb]">
      <div
        className="absolute inset-y-0 rounded-full bg-navy-dark"
        style={{ left: `${percent(low)}%`, right: `${100 - percent(high)}%` }}
      />
      <div
        role="slider"
        tabIndex={0}
        aria-label="Minimum"
        aria-valuemin={min}
        aria-valuemax={max}
        aria-valuenow={low}
        onPointerDown={startDrag('low')}
        onKeyDown={handleKeyDown('low')}
        className="absolute top-1/2 size-4 -translate-x-1/2 -translate-y-1/2 cursor-pointer rounded-full border-2 border-navy-dark bg-white shadow"
        style={{ left: `${percent(low)}%` }}
      />
      <div
        role="slider"
        tabIndex={0}
        aria-label="Maximum"
        aria-valuemin={min}
        aria-valuemax={max}
        aria-valuenow={high}
        onPointerDown={startDrag('high')}
        onKeyDown={handleKeyDown('high')}
        className="absolute top-1/2 size-4 -translate-x-1/2 -translate-y-1/2 cursor-pointer rounded-full border-2 border-navy-dark bg-white shadow"
        style={{ left: `${percent(high)}%` }}
      />
    </div>
  )
}
