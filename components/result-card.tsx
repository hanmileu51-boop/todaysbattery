'use client'

import { useEffect, useState } from 'react'
import { Check, MessageSquareHeart, Music4, RotateCcw, Sparkles, ThumbsDown, ThumbsUp, Timer, Volume2, VolumeX } from 'lucide-react'
import { getStage, type Prescription } from '@/lib/battery'
import { cn } from '@/lib/utils'

type Props = {
  level: number
  prescription: Prescription
  onFeedback: (kind: 'up' | 'down') => void
  onReset: () => void
}

const QUICK_QUESTIONS = [
  '1분 루틴 더 쉽게 하는 법?',
  '지금 잠이 안 와냥',
  '응원 한 번 더 해줘!',
]

export function ResultCard({ level, prescription, onFeedback, onReset }: Props) {
  const [done, setDone] = useState<boolean[]>([false, false, false])
  const [missionDone, setMissionDone] = useState(false)
  const [gaugeFilled, setGaugeFilled] = useState(false)
  const [voted, setVoted] = useState<'up' | 'down' | null>(null)

  // AI 스트리밍 & 타자기 이펙트 상태 (Phase 3)
  const [typedCoach, setTypedCoach] = useState('')
  
  // 대화형 꼬리질문 상태 (Phase 2)
  const [chatLoading, setChatLoading] = useState(false)
  const [chatReply, setChatReply] = useState<string | null>(null)
  const [activeQuestion, setActiveQuestion] = useState<string | null>(null)

  // 앰비언트 AI 사운드 플레이어 상태 (Phase 4)
  const [isPlayingAudio, setIsPlayingAudio] = useState(false)

  const target = Math.min(100, level + prescription.gain)
  const stage = getStage(level)
  const targetStage = getStage(target)

  useEffect(() => {
    const t = setTimeout(() => setGaugeFilled(true), 420)
    return () => clearTimeout(t)
  }, [])

  // 타자기 애니메이션 이펙트
  useEffect(() => {
    setTypedCoach('')
    let i = 0
    const fullText = prescription.coach
    const interval = setInterval(() => {
      if (i < fullText.length) {
        setTypedCoach(fullText.slice(0, i + 1))
        i++
      } else {
        clearInterval(interval)
      }
    }, 25)
    return () => clearInterval(interval)
  }, [prescription.coach])

  // 꼬리질문 API 호출
  const handleQuickQuestion = async (q: string) => {
    if (chatLoading) return
    setActiveQuestion(q)
    setChatLoading(true)
    setChatReply(null)

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          battery_level: level,
          fatigue_reason: prescription.banner,
          question: q,
        }),
      })

      if (res.ok) {
        const data = await res.json()
        setChatReply(data.reply || '집사야, 언제나 응원한다냥! 🐾')
      } else {
        setChatReply('힘내라냥! 고양이가 곁에서 골골송을 불러줄게냥 🐾')
      }
    } catch {
      setChatReply('힘내라냥! 고양이가 곁에서 골골송을 불러줄게냥 🐾')
    } finally {
      setChatLoading(false)
    }
  }

  const toggle = (i: number) =>
    setDone((prev) => prev.map((v, idx) => (idx === i ? !v : v)))

  const completed = done.filter(Boolean).length
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
        {prescription.isEmergency && (
          <span className="font-doodle mb-1 inline-block rounded-full bg-red-600 px-3 py-0.5 text-sm font-bold text-white shadow-sm">
            🚨 긴급 응급 충전 모드
          </span>
        )}
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

        {/* 고양이 코치 말풍선 & 타자기 애니메이션 */}
        <div className="flex items-start gap-3">
          <span
            aria-hidden="true"
            className="border-foreground/85 bg-secondary grid size-11 shrink-0 place-items-center rounded-full border-[3px] text-xl"
          >
            🐱
          </span>
          <div className="border-foreground/85 bg-accent relative rounded-2xl rounded-tl-sm border-[3px] px-4 py-3 min-h-[60px] w-full">
            <span
              aria-hidden="true"
              className="border-foreground/85 bg-accent absolute -left-[9px] top-3 size-3.5 rotate-45 border-b-[3px] border-l-[3px]"
            />
            <p className="text-accent-foreground text-[15px] leading-relaxed text-pretty font-medium">
              {typedCoach}
              {typedCoach.length < prescription.coach.length && (
                <span className="inline-block w-1.5 h-4 bg-foreground ml-1 animate-pulse" />
              )}
            </p>
          </div>
        </div>

        {/* [Phase 2] 고양이 코치 1초 대화형 꼬리질문 영역 */}
        <div className="rounded-2xl border-2 border-border/80 bg-background/50 p-3.5">
          <div className="mb-2.5 flex items-center gap-1.5 text-xs text-muted-foreground">
            <MessageSquareHeart className="size-4 text-primary" aria-hidden="true" />
            <span className="font-doodle text-sm font-semibold">고양이 코치에게 더 물어보기</span>
          </div>

          <div className="flex flex-wrap gap-2">
            {QUICK_QUESTIONS.map((q) => (
              <button
                key={q}
                type="button"
                onClick={() => handleQuickQuestion(q)}
                disabled={chatLoading}
                className={cn(
                  'font-doodle rounded-full border-2 px-3 py-1.5 text-xs transition-all duration-150',
                  activeQuestion === q
                    ? 'border-foreground bg-primary text-primary-foreground font-bold'
                    : 'border-border bg-card hover:border-foreground/60 text-foreground',
                )}
              >
                {q}
              </button>
            ))}
          </div>

          {/* 질문 답변 표시 */}
          {chatLoading && (
            <div className="mt-3 flex items-center gap-2 text-xs text-muted-foreground font-doodle animate-pulse">
              <Sparkles className="size-3.5 text-primary" />
              고양이가 다정하게 답장 생각 중... 🐾
            </div>
          )}

          {chatReply && !chatLoading && (
            <div className="mt-3 rounded-xl border-2 border-primary/40 bg-primary/10 p-3 text-xs text-foreground font-doodle leading-relaxed">
              <span className="font-bold text-primary mr-1">💬 고양이 코치:</span> {chatReply}
            </div>
          )}
        </div>

        {/* BGM + 10초 미션 (Phase 4 앰비언트 오디오 연동) */}
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="border-border bg-background rounded-2xl border-2 p-4">
            <div className="text-muted-foreground mb-2 flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <Music4 className="size-4" aria-hidden="true" />
                <span className="font-doodle text-sm">추천 BGM</span>
              </div>
              <button
                type="button"
                onClick={() => setIsPlayingAudio(!isPlayingAudio)}
                className="inline-flex items-center gap-1 text-xs font-doodle text-primary hover:underline"
              >
                {isPlayingAudio ? (
                  <>
                    <Volume2 className="size-3.5 text-primary animate-bounce" />
                    재생 중
                  </>
                ) : (
                  <>
                    <VolumeX className="size-3.5" />
                    듣기
                  </>
                )}
              </button>
            </div>
            <p className="font-doodle text-lg leading-tight">
              {prescription.bgm.title}
            </p>
            <span className="text-muted-foreground mt-1 inline-block text-xs">
              {prescription.bgm.tag} {isPlayingAudio ? '🎵 (앰비언트 모드 활성)' : ''}
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

        {prescription.isOffline && (
          <p className="font-doodle text-muted-foreground border-border border-t pt-2 text-center text-xs">
            🍃 바람이 전해주는 고양이의 포근한 로컬 처방전입니다 🐾
          </p>
        )}
      </div>
    </section>
  )
}

