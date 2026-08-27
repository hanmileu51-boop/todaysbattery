'use client'

import { useEffect, useRef, useState } from 'react'
import { Zap } from 'lucide-react'
import { BatteryCat } from '@/components/battery-cat'
import { BatterySlider } from '@/components/battery-slider'
import { ResultCard } from '@/components/result-card'
import { TagChips } from '@/components/tag-chips'
import { ResponsiveScaler } from '@/components/responsive-scaler'
import {
  buildPrescription,
  getStage,
  parseLLMResponse,
  STATIC_FALLBACK_JSON,
  TAGS,
  type Prescription,
  type TagId,
} from '@/lib/battery'
import { cn } from '@/lib/utils'

export default function Page() {
  const [level, setLevel] = useState(50)
  const [tag, setTag] = useState<TagId | null>(null)
  const [poppingId, setPoppingId] = useState<TagId | null>(null)
  const [loading, setLoading] = useState(false)
  const [charging, setCharging] = useState(false)
  const [result, setResult] = useState<{
    level: number
    prescription: Prescription
  } | null>(null)
  const [shake, setShake] = useState(false)
  const [tooltip, setTooltip] = useState(false)
  const [toast, setToast] = useState<string | null>(null)

  const topRef = useRef<HTMLDivElement>(null)
  const tagRef = useRef<HTMLDivElement>(null)
  const resultRef = useRef<HTMLDivElement>(null)
  const timers = useRef<ReturnType<typeof setTimeout>[]>([])

  useEffect(() => {
    const t = timers.current
    return () => t.forEach(clearTimeout)
  }, [])

  const track = (fn: () => void, ms: number) => {
    const id = setTimeout(fn, ms)
    timers.current.push(id)
  }

  const stage = getStage(level)

  const selectTag = (id: TagId) => {
    setTag(id)
    setPoppingId(id)
    setShake(false)
    setTooltip(false)
    track(() => setPoppingId(null), 420)
  }

  const showToast = (msg: string) => {
    setToast(msg)
    track(() => setToast(null), 2200)
  }

  const [loadingText, setLoadingText] = useState('따뜻한 처방전을 데우고 있어요…')

  const handleSubmit = async () => {
    if (loading) return

    // 엣지 케이스 1: 태그 미선택
    if (!tag) {
      tagRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' })
      setShake(false)
      setTooltip(true)
      requestAnimationFrame(() => setShake(true))
      track(() => setShake(false), 620)
      track(() => setTooltip(false), 2600)
      return
    }

    setLoading(true)
    setCharging(false)
    setResult(null)
    setLoadingText('따뜻한 처방전을 데우고 있어요…')

    // 3초 지연 시 문구 유연 변경 (Policy 3)
    const delayTimer = setTimeout(() => {
      setLoadingText('조금만 기다려주세요, 충전 완료 직전이에요!')
    }, 3000)
    timers.current.push(delayTimer)

    track(() => setCharging(true), 60)

    // 엣지 케이스 6: 오프라인 상태 감지 (Policy 6)
    const isOffline = typeof navigator !== 'undefined' && !navigator.onLine
    if (isOffline) {
      clearTimeout(delayTimer)
      setResult({
        level,
        prescription: parseLLMResponse(STATIC_FALLBACK_JSON, level, tag, true),
      })
      setLoading(false)
      setCharging(false)
      track(
        () =>
          resultRef.current?.scrollIntoView({
            behavior: 'smooth',
            block: 'start',
          }),
        120,
      )
      return
    }

    // 엣지 케이스 4: 5초 타임아웃 AbortController (Policy 4)
    const controller = new AbortController()
    const clientTimeout = setTimeout(() => controller.abort(), 5000)

    try {
      const selectedTagObj = TAGS.find((t) => t.id === tag)
      const fatigueReasonLabel = selectedTagObj ? selectedTagObj.label : tag

      const res = await fetch('/api/prescribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        signal: controller.signal,
        body: JSON.stringify({
          battery_level: level,
          fatigue_reason: fatigueReasonLabel,
        }),
      })

      clearTimeout(clientTimeout)
      clearTimeout(delayTimer)

      if (!res.ok) {
        throw new Error(`HTTP Error status: ${res.status}`)
      }

      const rawData = await res.json()
      const prescription = parseLLMResponse(rawData, level, tag)

      setResult({ level, prescription })
    } catch (err) {
      clearTimeout(clientTimeout)
      clearTimeout(delayTimer)
      console.warn('[Page] API Error or Timeout, using static fallback:', err)
      setResult({
        level,
        prescription: parseLLMResponse(STATIC_FALLBACK_JSON, level, tag),
      })
    } finally {
      setLoading(false)
      setCharging(false)
      track(
        () =>
          resultRef.current?.scrollIntoView({
            behavior: 'smooth',
            block: 'start',
          }),
        120,
      )
    }
  }

  const handleReset = () => {
    setResult(null)
    setLoading(false)
    setCharging(false)
    setLevel(50)
    setTag(null)
    setTooltip(false)
    topRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <main className="relative min-h-dvh overflow-hidden px-4 pb-24 pt-8 sm:pt-12">
      {/* 배경 두들 격자 */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-[0.055]"
        style={{
          backgroundImage:
            'radial-gradient(var(--foreground) 1.5px, transparent 1.5px)',
          backgroundSize: '22px 22px',
        }}
      />

      <ResponsiveScaler minWidth={800}>
        <div ref={topRef} className="relative mx-auto w-full max-w-xl">
        {/* 헤더 */}
        <header className="mb-6 text-center">
          <p className="font-doodle text-muted-foreground text-base">
            하루에 한 번, 나를 위한 정비 시간
          </p>
          <h1 className="font-doodle mt-1 text-4xl font-bold leading-tight sm:text-5xl">
            오늘의 배터리 <span aria-hidden="true">🔋</span>
          </h1>
        </header>

        {/* 메인 카드 */}
        <div className="border-foreground/85 bg-card rounded-[2.25rem] border-[3px] p-5 shadow-[0_6px_0_0_var(--foreground)] sm:p-7">
          <BatteryCat level={level} />

          <div className="mt-5">
            <BatterySlider value={level} onChange={setLevel} />
          </div>

          {/* 태그 */}
          <div className="border-border mt-7 border-t-2 pt-6">
            <div className="relative">
              {/* 툴팁 말풍선 */}
              {tooltip && (
                <div
                  role="alert"
                  className="bt-pop-in absolute -top-1 left-1/2 z-10 -translate-x-1/2 -translate-y-full"
                >
                  <div className="border-destructive bg-destructive font-doodle relative rounded-2xl border-2 px-4 py-2 text-base whitespace-nowrap text-white">
                    피로 원인을 하나 골라주세요!
                    <span
                      aria-hidden="true"
                      className="border-destructive bg-destructive absolute -bottom-[7px] left-1/2 size-3 -translate-x-1/2 rotate-45 border-b-2 border-r-2"
                    />
                  </div>
                </div>
              )}

              <p className="font-doodle mb-3 text-center text-lg">
                무엇 때문에 배터리가 닳았나요?
              </p>

              <div
                ref={tagRef}
                className={cn(
                  'rounded-3xl border-2 border-transparent p-2 transition-colors duration-200',
                  shake && 'bt-shake border-destructive bg-destructive/5',
                )}
              >
                <TagChips
                  selected={tag}
                  onSelect={selectTag}
                  disabled={loading}
                  poppingId={poppingId}
                />
              </div>
            </div>
          </div>

          {/* 처방 버튼 */}
          <button
            type="button"
            onClick={handleSubmit}
            disabled={loading}
            aria-busy={loading}
            className={cn(
              'font-doodle mt-6 flex w-full items-center justify-center gap-2 rounded-2xl border-[3px] px-5 py-4 text-xl transition-all duration-150',
              'focus-visible:ring-foreground/25 focus-visible:outline-none focus-visible:ring-4',
              loading
                ? 'border-foreground/40 bg-muted text-muted-foreground cursor-not-allowed'
                : 'border-foreground bg-primary text-primary-foreground shadow-[0_5px_0_0_var(--foreground)] hover:-translate-y-0.5 hover:shadow-[0_7px_0_0_var(--foreground)] active:translate-y-0.5 active:shadow-[0_2px_0_0_var(--foreground)]',
            )}
          >
            {loading ? (
              <>
                <span
                  aria-hidden="true"
                  className="border-muted-foreground/35 border-t-foreground size-5 rounded-full border-[3px]"
                  style={{ animation: 'bt-spin-slow 0.8s linear infinite' }}
                />
                고양이가 처방전 굽는 중
                <span className="inline-flex gap-0.5" aria-hidden="true">
                  {[0, 0.15, 0.3].map((d) => (
                    <span
                      key={d}
                      className="bg-muted-foreground size-1.5 rounded-full"
                      style={{
                        animation: `bt-bounce-dot 0.7s ${d}s ease-in-out infinite`,
                      }}
                    />
                  ))}
                </span>
              </>
            ) : (
              <>
                <Zap className="size-5" aria-hidden="true" />
                1분 맞춤 처방받기
              </>
            )}
          </button>

          {/* 로딩 충전 인디케이터 */}
          {loading && (
            <div className="mt-4">
              <div
                className="border-foreground/85 relative h-4 overflow-hidden rounded-full border-[3px]"
                style={{ background: '#F3E7D5' }}
              >
                <div
                  className="absolute inset-y-0 left-0 transition-[width] duration-[1400ms] ease-out"
                  style={{
                    width: charging ? '100%' : '4%',
                    background: `repeating-linear-gradient(115deg, ${stage.color} 0 8px, ${stage.deep} 8px 16px)`,
                  }}
                />
              </div>
              <p className="font-doodle text-muted-foreground mt-2 text-center text-sm">
                {loadingText}
              </p>
            </div>
          )}
        </div>

        {/* 결과 카드 */}
        <div ref={resultRef}>
          {result && (
            <ResultCard
              key={`${result.level}-${result.prescription.banner}`}
              level={result.level}
              prescription={result.prescription}
              onFeedback={(kind) =>
                showToast(
                  kind === 'up'
                    ? '고마워요! 고양이가 골골송을 부릅니다 🐾'
                    : '알려줘서 고마워요. 더 나은 처방을 준비할게요 🙇',
                )
              }
              onReset={handleReset}
            />
          )}
        </div>

        <p className="font-doodle text-muted-foreground mt-8 text-center text-sm leading-relaxed">
          이 처방은 의학적 진단이 아니에요. 오늘 하루 고생한 나에게 주는
          작은 쉼표예요.
        </p>
      </div>
      </ResponsiveScaler>

      {/* 토스트 */}
      {toast && (
        <div
          role="status"
          aria-live="polite"
          className="border-foreground bg-foreground text-background font-doodle fixed bottom-7 left-1/2 z-50 rounded-full border-2 px-5 py-3 text-base shadow-[0_4px_0_0_rgba(0,0,0,0.25)]"
          style={{
            animation: 'bt-toast-in 0.34s cubic-bezier(0.16,1,0.3,1) both',
          }}
        >
          {toast}
        </div>
      )}
    </main>
  )
}
