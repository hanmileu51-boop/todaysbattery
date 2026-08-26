'use client'

import { useEffect, useState } from 'react'
import { Check, Music4, RotateCcw, ThumbsDown, ThumbsUp, Timer } from 'lucide-react'
import { getStage, type Prescription } from '@/lib/battery'
import { cn } from '@/lib/utils'

type Props = {
  level: number
  prescription: Prescription
  onFeedback: (kind: 'up' | 'down') => void
  onReset: () => void
}

export function ResultCard({ level, prescription, onFeedback, onReset }: Props) {
  const [done, setDone] = useState<boolean[]>([false, false, false])
  const [missionDone, setMissionDone] = useState(false)
  const [gaugeFilled, setGaugeFilled] = useState(false)
  const [voted, setVoted] = useState<'up' | 'down' | null>(null)

  const target = Math.min(100, level + prescription.gain)
  const stage = getStage(level)
  const targetStage = getStage(target)

  useEffect(() => {
    const t = setTimeout(() => setGaugeFilled(true), 420)
    return () => clearTimeout(t)
  }, [])

  const toggle = (i: number) =>
    setDone((prev) => prev.map((v, idx) => (idx === i ? !v : v)))

  const completed = done.filter(Boolean).length
  // 루틴 3개 + 10초 미션 = 4단계. 실제 실천량만큼 게이지가 찬다.
  const steps = completed + (missionDone ? 1 : 0)
  const earned = Math.round((prescription.gain * steps) / 4)
  const current = Math.min(100, level + earned)
  const currentStage = getStage(current)
  const allDone = steps === 4

  return (
    <section
      aria-label="처방 결과"
      className="bt-pop-in border-foreground/85 bg-card mt-8 overflow-hidden rounded-[2rem] border-[3px] shadow-[0_6px_0_0_var(--foreground)]"
    >
      {/* 진단 배너 */}
      <div
        className="border-foreground/85 border-b-[3px] px-5 py-4 text-center"
        style={{ background: stage.tint }}
      >
        <p className="font-doodle text-xl leading-snug text-balance sm:text-2xl">
          {prescription.banner}
        </p>
      </div>

      <div className="flex flex-col gap-6 p-5 sm:p-6">
        {/* 루틴 체크리스트 */}
        <div>
          <div className="mb-3 flex items-baseline justify-between gap-3">
            <h3 className="font-doodle text-xl">1분 힐링 루틴</h3>
            <span className="font-doodle text-muted-foreground text-sm tabular-nums">
              {completed} / 3 완료
            </span>
          </div>
          <ul className="flex flex-col gap-2">
            {prescription.routines.map((r, i) => (
              <li key={r}>
                <button
                  type="button"
                  aria-pressed={done[i]}
                  onClick={() => toggle(i)}
                  className={cn(
                    'group flex w-full items-center gap-3 rounded-2xl border-2 px-3.5 py-3 text-left transition-all duration-150',
                    'focus-visible:ring-foreground/25 focus-visible:outline-none focus-visible:ring-4',
                    done[i]
                      ? 'border-foreground/85 bg-secondary'
                      : 'border-border bg-background hover:border-foreground/45',
                  )}
                >
                  <span
                    aria-hidden="true"
                    className={cn(
                      'grid size-7 shrink-0 place-items-center rounded-[9px] border-2 transition-all duration-150',
                      done[i]
                        ? 'border-foreground text-primary-foreground scale-100'
                        : 'border-foreground/35 bg-card',
                    )}
                    style={
                      done[i] ? { background: stage.color } : undefined
                    }
                  >
                    <Check
                      className={cn(
                        'size-4 transition-all duration-150',
                        done[i] ? 'scale-100 opacity-100' : 'scale-50 opacity-0',
                      )}
                      strokeWidth={3.5}
                    />
                  </span>
                  <span
                    className={cn(
                      'text-[15px] leading-relaxed transition-all duration-200',
                      done[i] && 'text-muted-foreground line-through',
                    )}
                  >
                    {r}
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* 고양이 코치 말풍선 */}
        <div className="flex items-start gap-3">
          <span
            aria-hidden="true"
            className="border-foreground/85 bg-secondary grid size-11 shrink-0 place-items-center rounded-full border-[3px] text-xl"
          >
            🐱
          </span>
          <div className="border-foreground/85 bg-accent relative rounded-2xl rounded-tl-sm border-[3px] px-4 py-3">
            <span
              aria-hidden="true"
              className="border-foreground/85 bg-accent absolute -left-[9px] top-3 size-3.5 rotate-45 border-b-[3px] border-l-[3px]"
            />
            <p className="text-accent-foreground text-[15px] leading-relaxed text-pretty">
              {prescription.coach}
            </p>
          </div>
        </div>

        {/* BGM + 10초 미션 */}
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="border-border bg-background rounded-2xl border-2 p-4">
            <div className="text-muted-foreground mb-2 flex items-center gap-1.5">
              <Music4 className="size-4" aria-hidden="true" />
              <span className="font-doodle text-sm">추천 BGM</span>
            </div>
            <p className="font-doodle text-lg leading-tight">
              {prescription.bgm.title}
            </p>
            <span className="text-muted-foreground mt-1 inline-block text-xs">
              {prescription.bgm.tag}
            </span>
          </div>

          <button
            type="button"
            aria-pressed={missionDone}
            onClick={() => setMissionDone((v) => !v)}
            className={cn(
              'rounded-2xl border-2 p-4 text-left transition-all duration-150',
              'focus-visible:ring-foreground/25 focus-visible:outline-none focus-visible:ring-4',
              missionDone
                ? 'border-foreground/85 bg-secondary'
                : 'border-border bg-background hover:border-foreground/45',
            )}
          >
            <div className="text-muted-foreground mb-2 flex items-center gap-1.5">
              <Timer className="size-4" aria-hidden="true" />
              <span className="font-doodle text-sm">10초 미션</span>
            </div>
            <p
              className={cn(
                'text-[15px] leading-snug',
                missionDone && 'text-muted-foreground line-through',
              )}
            >
              {prescription.mission}
            </p>
            <span className="font-doodle text-muted-foreground mt-1.5 inline-block text-xs">
              {missionDone ? '해냈다! 🎉' : '탭해서 완료 표시'}
            </span>
          </button>
        </div>

        {/* 충전 예상치 */}
        <div className="border-foreground/85 bg-background rounded-2xl border-[3px] p-4">
          <div className="mb-2.5 flex items-center justify-between">
            <span className="font-doodle text-base">
              {allDone ? '충전 완료' : '충전 중'}
            </span>
            <span className="font-doodle text-lg tabular-nums">
              <span style={{ color: currentStage.deep }}>{current}%</span>
              <span className="text-muted-foreground mx-1.5" aria-label="에서">
                &rarr;
              </span>
              <span
                className={cn(!allDone && 'opacity-45')}
                style={{ color: targetStage.deep }}
              >
                {target}%
              </span>
            </span>
          </div>
          <div
            className="border-foreground/85 relative h-6 overflow-hidden rounded-full border-[3px]"
            style={{ background: '#F3E7D5' }}
            role="progressbar"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={current}
            aria-label="루틴 실천으로 회복한 배터리"
          >
            {/* 목표치 미리보기 (연하게) */}
            <div
              className="absolute inset-y-0 left-0 opacity-30 transition-[width] duration-[1100ms] ease-out"
              style={{
                width: gaugeFilled ? `${target}%` : '0%',
                background: targetStage.color,
              }}
            />
            {/* 시작 배터리 */}
            <div
              className="absolute inset-y-0 left-0"
              style={{ width: `${level}%`, background: stage.color }}
            />
            {/* 실제로 회복한 만큼 */}
            <div
              className="absolute inset-y-0 transition-[width] duration-500 ease-out"
              style={{
                left: `${level}%`,
                width: `${current - level}%`,
                background: `repeating-linear-gradient(115deg, ${targetStage.color} 0 9px, ${targetStage.deep} 9px 18px)`,
              }}
            />
          </div>
          <p className="text-muted-foreground mt-2 text-xs leading-relaxed">
            {allDone
              ? `4단계 모두 완료! +${earned}% 충전했어요. 잘했어요.`
              : `${steps}/4 단계 완료 · 하나씩 체크할수록 배터리가 차올라요 (최대 +${prescription.gain}%)`}
          </p>
        </div>

        {/* 인터랙션 버튼군 */}
        <div className="border-border flex flex-wrap items-center gap-2.5 border-t-2 pt-5">
          <button
            type="button"
            onClick={() => {
              setVoted('up')
              onFeedback('up')
            }}
            className={cn(
              'font-doodle inline-flex items-center gap-1.5 rounded-full border-2 px-4 py-2 text-base transition-all duration-150',
              'focus-visible:ring-foreground/25 focus-visible:outline-none focus-visible:ring-4',
              voted === 'up'
                ? 'border-foreground bg-primary text-primary-foreground'
                : 'border-border bg-card hover:border-foreground/45 hover:-translate-y-0.5',
            )}
          >
            <ThumbsUp className="size-4" aria-hidden="true" />
            도움이 됐어요
          </button>
          <button
            type="button"
            onClick={() => {
              setVoted('down')
              onFeedback('down')
            }}
            className={cn(
              'font-doodle inline-flex items-center gap-1.5 rounded-full border-2 px-4 py-2 text-base transition-all duration-150',
              'focus-visible:ring-foreground/25 focus-visible:outline-none focus-visible:ring-4',
              voted === 'down'
                ? 'border-foreground bg-secondary text-secondary-foreground'
                : 'border-border bg-card hover:border-foreground/45 hover:-translate-y-0.5',
            )}
          >
            <ThumbsDown className="size-4" aria-hidden="true" />
            별로예요
          </button>
          <button
            type="button"
            onClick={onReset}
            className="font-doodle text-muted-foreground hover:text-foreground ml-auto inline-flex items-center gap-1.5 rounded-full px-3 py-2 text-base underline decoration-dotted underline-offset-4 transition-colors focus-visible:ring-4 focus-visible:ring-foreground/25 focus-visible:outline-none"
          >
            <RotateCcw className="size-4" aria-hidden="true" />
            다시하기
          </button>
        </div>
      </div>
    </section>
  )
}
