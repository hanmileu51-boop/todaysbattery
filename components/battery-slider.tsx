'use client'

import { getStage } from '@/lib/battery'

type Props = {
  value: number
  onChange: (v: number) => void
}

export function BatterySlider({ value, onChange }: Props) {
  const stage = getStage(value)

  return (
    <div className="w-full">
      <div className="mb-3 flex items-end justify-between">
        <label
          htmlFor="battery-range"
          className="font-doodle text-lg text-muted-foreground"
        >
          지금 내 에너지는?
        </label>
        <output
          htmlFor="battery-range"
          className="font-doodle text-4xl font-bold leading-none tabular-nums transition-colors duration-200"
          style={{ color: stage.deep }}
        >
          {value}
          <span className="text-2xl">%</span>
        </output>
      </div>

      <div className="relative">
        <input
          id="battery-range"
          type="range"
          min={0}
          max={100}
          step={1}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          aria-valuetext={`${value}퍼센트, ${stage.label}`}
          className="bt-range w-full"
          style={
            {
              '--bt-pct': `${value}%`,
              '--bt-color': stage.color,
              '--bt-deep': stage.deep,
            } as React.CSSProperties
          }
        />
      </div>

      <div className="mt-2 flex justify-between px-0.5 font-doodle text-xs text-muted-foreground">
        <span>0 방전</span>
        <span>50</span>
        <span>100 만렙</span>
      </div>

      <style jsx>{`
        .bt-range {
          -webkit-appearance: none;
          appearance: none;
          height: 34px;
          background: transparent;
          cursor: grab;
        }
        .bt-range:active {
          cursor: grabbing;
        }
        .bt-range::-webkit-slider-runnable-track {
          height: 20px;
          border-radius: 999px;
          border: 3px solid ${'#5A4636'};
          background: linear-gradient(
            to right,
            var(--bt-color) 0 var(--bt-pct),
            #f3e7d5 var(--bt-pct) 100%
          );
          transition: background 120ms linear;
        }
        .bt-range::-moz-range-track {
          height: 20px;
          border-radius: 999px;
          border: 3px solid #5a4636;
          background: linear-gradient(
            to right,
            var(--bt-color) 0 var(--bt-pct),
            #f3e7d5 var(--bt-pct) 100%
          );
        }
        .bt-range::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          width: 34px;
          height: 34px;
          margin-top: -10px;
          border-radius: 999px;
          background: #fffdf8;
          border: 4px solid var(--bt-deep);
          box-shadow: 0 3px 0 0 rgba(90, 70, 54, 0.35);
          transition:
            border-color 150ms linear,
            transform 120ms ease;
        }
        .bt-range::-moz-range-thumb {
          width: 30px;
          height: 30px;
          border-radius: 999px;
          background: #fffdf8;
          border: 4px solid var(--bt-deep);
          box-shadow: 0 3px 0 0 rgba(90, 70, 54, 0.35);
        }
        .bt-range:active::-webkit-slider-thumb {
          transform: scale(1.12);
        }
        .bt-range:focus-visible {
          outline: none;
        }
        .bt-range:focus-visible::-webkit-slider-thumb {
          box-shadow:
            0 3px 0 0 rgba(90, 70, 54, 0.35),
            0 0 0 5px rgba(90, 70, 54, 0.18);
        }
      `}</style>
    </div>
  )
}
