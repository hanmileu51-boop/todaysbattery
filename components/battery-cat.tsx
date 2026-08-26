'use client'

import { getStage, type Mood } from '@/lib/battery'

type Props = {
  level: number
}

const INK = '#5A4636'
const FUR = '#FFF6E9'

/** 상태별 눈 */
function Eyes({ mood }: { mood: Mood }) {
  if (mood === 'purr') {
    return (
      <g>
        <circle cx="106" cy="106" r="8.5" fill={INK} />
        <circle cx="146" cy="106" r="8.5" fill={INK} />
        <circle cx="109" cy="102.5" r="3.1" fill="#FFFDF8" />
        <circle cx="149" cy="102.5" r="3.1" fill="#FFFDF8" />
      </g>
    )
  }
  if (mood === 'calm') {
    return (
      <g stroke={INK} strokeWidth="5.5" strokeLinecap="round" fill="none">
        <path d="M98 106 h15" />
        <path d="M139 106 h15" />
      </g>
    )
  }
  if (mood === 'sleepy') {
    return (
      <g>
        <g stroke={INK} strokeWidth="5" strokeLinecap="round" fill="none">
          <path d="M97 107 q8.5 7 17 0" />
          <path d="M138 107 q8.5 7 17 0" />
        </g>
        <g stroke={INK} strokeWidth="3" strokeLinecap="round" opacity="0.4">
          <path d="M98 99 q8 -4 16 0" />
          <path d="M139 99 q8 -4 16 0" />
        </g>
      </g>
    )
  }
  if (mood === 'drained') {
    return (
      <g>
        <g stroke={INK} strokeWidth="5" strokeLinecap="round" fill="none">
          <path d="M97 105 q8.5 6 17 0" />
          <path d="M138 105 q8.5 6 17 0" />
        </g>
        <g fill="#8B6B8F" opacity="0.42">
          <ellipse cx="105.5" cy="116" rx="11" ry="5.4" />
          <ellipse cx="146.5" cy="116" rx="11" ry="5.4" />
        </g>
      </g>
    )
  }
  // dead: X_X
  return (
    <g stroke={INK} strokeWidth="5.5" strokeLinecap="round">
      <path d="M98 99 l15 15 M113 99 l-15 15" />
      <path d="M139 99 l15 15 M154 99 l-15 15" />
    </g>
  )
}

/** 상태별 입 */
function Mouth({ mood }: { mood: Mood }) {
  if (mood === 'purr') {
    return (
      <path
        d="M114 127 q12 13 24 0"
        stroke={INK}
        strokeWidth="4.6"
        strokeLinecap="round"
        fill="none"
      />
    )
  }
  if (mood === 'calm') {
    return (
      <path
        d="M118 128 l8 -7 l8 7"
        stroke={INK}
        strokeWidth="4.6"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    )
  }
  if (mood === 'sleepy') {
    return (
      <path
        d="M118 128 q8 6 16 -1"
        stroke={INK}
        strokeWidth="4.4"
        strokeLinecap="round"
        fill="none"
      />
    )
  }
  if (mood === 'drained') {
    return (
      <g>
        <path
          d="M116 125 q10 -8 20 0"
          stroke={INK}
          strokeWidth="4.4"
          strokeLinecap="round"
          fill="none"
        />
        <ellipse
          cx="126"
          cy="136"
          rx="6"
          ry="9"
          fill="#F0A0A8"
          stroke={INK}
          strokeWidth="2.6"
          style={{
            transformOrigin: '126px 128px',
            animation: 'bt-pant 0.5s ease-in-out infinite',
          }}
        />
      </g>
    )
  }
  return (
    <ellipse
      cx="126"
      cy="131"
      rx="8"
      ry="6.5"
      fill="#7E5A66"
      stroke={INK}
      strokeWidth="3"
    />
  )
}

export function BatteryCat({ level }: Props) {
  const stage = getStage(level)
  const mood = stage.mood
  const fill = Math.max(2, level)

  // 배터리 기하 (고양이 오른쪽에 세로로 세워 껴안음)
  const BX = 176
  const BY = 108
  const BW = 68
  const BH = 128

  const bodyAnim =
    mood === 'purr'
      ? 'bt-nuzzle 1.5s ease-in-out infinite'
      : mood === 'calm'
        ? 'bt-breathe 3.4s ease-in-out infinite'
        : mood === 'sleepy'
          ? 'bt-slump 2.6s ease-in-out infinite'
          : mood === 'drained'
            ? 'bt-breathe 1.1s ease-in-out infinite'
            : 'none'

  const tailAnim =
    mood === 'calm'
      ? 'bt-tail-wag 1.4s ease-in-out infinite'
      : mood === 'purr'
        ? 'bt-tail-wag 0.9s ease-in-out infinite'
        : mood === 'sleepy'
          ? 'bt-tail-wag 4s ease-in-out infinite'
          : 'none'

  const deadTilt = mood === 'dead' ? 'rotate(7deg) translateY(8px)' : 'none'
  // 졸릴수록 배터리 위로 흘러내리는 느낌
  const headTilt =
    mood === 'sleepy'
      ? 'rotate(9deg)'
      : mood === 'drained'
        ? 'rotate(13deg)'
        : mood === 'dead'
          ? 'rotate(19deg)'
          : mood === 'purr'
            ? 'rotate(-5deg)'
            : 'none'

  return (
    <div className="relative mx-auto w-full max-w-[340px]">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-8 bottom-8 top-8 rounded-[999px] blur-2xl transition-colors duration-500"
        style={{ background: stage.tint }}
      />

      <svg
        viewBox="0 0 300 290"
        role="img"
        aria-label={`배터리 ${level}%, 고양이 상태: ${stage.label}`}
        className="relative block w-full"
        style={{
          transform: deadTilt,
          transformOrigin: '150px 250px',
          transition: 'transform 450ms cubic-bezier(0.16,1,0.3,1)',
        }}
      >
        <defs>
          <clipPath id="bt-battery-clip">
            <rect x={BX} y={BY} width={BW} height={BH} rx="30" />
          </clipPath>
        </defs>

        {/* 바닥 그림자 */}
        <ellipse cx="146" cy="248" rx="98" ry="15" fill={INK} opacity="0.1" />

        {/* 골골송 음표 */}
        {mood === 'purr' && (
          <g fill={stage.color}>
            {[0, 0.55, 1.1].map((d, i) => (
              <g
                key={i}
                style={{
                  opacity: 0,
                  transformOrigin: '80px 60px',
                  animation: `bt-float-note 1.9s ${d}s ease-out infinite`,
                }}
              >
                <text
                  x={54 + i * 14}
                  y={64 - i * 7}
                  fontSize={i === 1 ? 30 : 23}
                  fontWeight="700"
                >
                  ♪
                </text>
              </g>
            ))}
          </g>
        )}

        {/* 영혼 유령 */}
        {mood === 'dead' && (
          <g>
            {[0, 1.1].map((d, i) => (
              <g
                key={i}
                style={{
                  opacity: 0,
                  transformOrigin: '126px 140px',
                  animation: `bt-ghost 2.8s ${d}s ease-out infinite`,
                }}
              >
                <g transform={`translate(${118 + i * 10} ${104 - i * 12})`}>
                  <path
                    d="M0 12 a12 12 0 0 1 24 0 v16 l-5 -5 l-4 6 l-4 -6 l-4 6 l-5 -6 z"
                    fill="#FFFFFF"
                    opacity="0.95"
                    stroke={INK}
                    strokeWidth="2.2"
                  />
                  <circle cx="8" cy="12" r="1.9" fill={INK} />
                  <circle cx="17" cy="12" r="1.9" fill={INK} />
                </g>
              </g>
            ))}
          </g>
        )}

        <g
          style={{
            transformOrigin: '140px 200px',
            animation: bodyAnim,
          }}
        >
          {/* ===== 꼬리 ===== */}
          <g
            style={{ transformOrigin: '70px 214px', animation: tailAnim }}
          >
            <path
              d="M72 214 q-38 8 -32 -28 q3 -18 17 -15"
              fill="none"
              stroke={INK}
              strokeWidth="12"
              strokeLinecap="round"
            />
            <path
              d="M72 214 q-38 8 -32 -28 q3 -18 17 -15"
              fill="none"
              stroke={FUR}
              strokeWidth="5.5"
              strokeLinecap="round"
            />
          </g>

          {/* ===== 몸통 (배터리 뒤) ===== */}
          <path
            d="M68 236 q-16 -76 30 -102 q34 -18 70 -2 q40 18 34 76 q-3 28 -12 28 z"
            fill={FUR}
            stroke={INK}
            strokeWidth="5"
            strokeLinejoin="round"
          />

          {/* 뒷발 (좌) */}
          <ellipse
            cx="88"
            cy="234"
            rx="20"
            ry="12.5"
            fill={FUR}
            stroke={INK}
            strokeWidth="4.6"
          />
          <g stroke={INK} strokeWidth="2.6" opacity="0.5">
            <path d="M84 228 v9" />
            <path d="M92 228 v9" />
          </g>

          {/* ===== 배터리 (죽부인처럼 껴안는 대상) ===== */}
          <g>
            {/* 상단 단자 */}
            <rect
              x={BX + BW / 2 - 12}
              y={BY - 15}
              width="24"
              height="17"
              rx="6"
              fill="#DDCFBB"
              stroke={INK}
              strokeWidth="4"
            />
            {/* 몸통 */}
            <rect
              x={BX}
              y={BY}
              width={BW}
              height={BH}
              rx="30"
              fill="#FCF6EC"
              stroke={INK}
              strokeWidth="5"
            />
            {/* 충전량 */}
            <g clipPath="url(#bt-battery-clip)">
              <rect
                x={BX}
                y={BY + BH - (BH * fill) / 100}
                width={BW}
                height={(BH * fill) / 100}
                fill={stage.color}
                style={{
                  transition:
                    'y 200ms cubic-bezier(0.22,1,0.36,1), height 200ms cubic-bezier(0.22,1,0.36,1), fill 200ms linear',
                }}
              />
              <g stroke={INK} strokeWidth="2" opacity="0.13">
                <path d={`M${BX} ${BY + BH * 0.25} h${BW}`} />
                <path d={`M${BX} ${BY + BH * 0.5} h${BW}`} />
                <path d={`M${BX} ${BY + BH * 0.75} h${BW}`} />
              </g>
              {/* 하이라이트 */}
              <rect
                x={BX + 10}
                y={BY + 12}
                width="8"
                height="46"
                rx="4"
                fill="#FFFFFF"
                opacity="0.45"
              />
            </g>
            {/* 테두리 재강조 */}
            <rect
              x={BX}
              y={BY}
              width={BW}
              height={BH}
              rx="30"
              fill="none"
              stroke={INK}
              strokeWidth="5"
            />
            {/* 번개 마크 */}
            <path
              d="M214 154 l-15 28 h12 l-4 24 l17 -32 h-12 z"
              fill={INK}
              opacity="0.2"
            />
            {/* 빨간 경고등 */}
            {(mood === 'drained' || mood === 'dead') && (
              <circle
                cx={BX + BW / 2}
                cy={BY + 18}
                r="6.5"
                fill="#EF4444"
                stroke={INK}
                strokeWidth="2.4"
                style={{ animation: 'bt-warn-blink 0.7s steps(1) infinite' }}
              />
            )}
          </g>

          {/* ===== 앞발: 배터리를 감싸 안음 (배터리 위에 그림) ===== */}
          <g>
            {/* 아래쪽 팔: 배터리 밑을 받쳐 안기 */}
            <path
              d="M108 206 q30 26 82 20 q18 -1 18 11 q0 12 -20 13 q-56 4 -84 -20 z"
              fill={FUR}
              stroke={INK}
              strokeWidth="5"
              strokeLinejoin="round"
            />
            <g stroke={INK} strokeWidth="2.6" opacity="0.5">
              <path d="M196 231 l0 12" />
              <path d="M205 229 l1 11" />
            </g>
            {/* 위쪽 팔: 배터리 어깨를 감싸기 */}
            <path
              d="M124 152 q30 -22 76 -14 q18 3 15 16 q-3 13 -22 10 q-40 -6 -60 3 z"
              fill={FUR}
              stroke={INK}
              strokeWidth="5"
              strokeLinejoin="round"
            />
            <g stroke={INK} strokeWidth="2.6" opacity="0.5">
              <path d="M186 145 l-2 12" />
              <path d="M195 148 l-2 11" />
            </g>
          </g>

          {/* ===== 머리 (배터리에 기대는 느낌) ===== */}
          <g
            style={{
              transformOrigin: '126px 150px',
              transition: 'transform 400ms cubic-bezier(0.16,1,0.3,1)',
              transform: headTilt,
            }}
          >
            {/* 귀 */}
            <path
              d="M90 84 l-7 -32 l29 16 z"
              fill={FUR}
              stroke={INK}
              strokeWidth="5"
              strokeLinejoin="round"
            />
            <path
              d="M162 84 l7 -32 l-29 16 z"
              fill={FUR}
              stroke={INK}
              strokeWidth="5"
              strokeLinejoin="round"
            />
            <path d="M93 76 l-2 -15 l14 8 z" fill="#F6C9C0" opacity="0.9" />
            <path d="M159 76 l2 -15 l-14 8 z" fill="#F6C9C0" opacity="0.9" />

            {/* 얼굴 */}
            <ellipse
              cx="126"
              cy="106"
              rx="55"
              ry="47"
              fill={FUR}
              stroke={INK}
              strokeWidth="5"
            />

            {/* 이마 줄무늬 */}
            <g
              stroke={INK}
              strokeWidth="3.4"
              strokeLinecap="round"
              opacity="0.45"
            >
              <path d="M118 69 l-4 11" />
              <path d="M128 67 l0 12" />
              <path d="M138 69 l4 11" />
            </g>

            {/* 뺨 */}
            <g fill="#F79FA6" opacity={mood === 'purr' ? 0.7 : 0.32}>
              <ellipse cx="91" cy="122" rx="10.5" ry="6.6" />
              <ellipse cx="161" cy="122" rx="10.5" ry="6.6" />
            </g>

            <Eyes mood={mood} />

            {/* 코 */}
            <path
              d="M121 119 h10 l-5 6 z"
              fill="#E58C93"
              stroke={INK}
              strokeWidth="2.2"
              strokeLinejoin="round"
            />

            <Mouth mood={mood} />

            {/* 수염 */}
            <g
              stroke={INK}
              strokeWidth="2.6"
              strokeLinecap="round"
              opacity="0.5"
            >
              <path d="M78 114 l-22 -7" />
              <path d="M78 123 l-23 4" />
              <path d="M174 114 l22 -7" />
              <path d="M174 123 l23 4" />
            </g>
          </g>
        </g>
      </svg>

      {/* 상태 라벨 */}
      <div className="mt-1 flex items-center justify-center gap-2">
        <span
          className="font-doodle inline-flex items-center gap-1.5 rounded-full border-2 px-3 py-1 text-base leading-none transition-colors duration-300"
          style={{
            borderColor: stage.color,
            color: stage.deep,
            background: stage.tint,
          }}
        >
          <span
            className="size-2 rounded-full"
            style={{ background: stage.color }}
          />
          {stage.label}
        </span>
      </div>
    </div>
  )
}
