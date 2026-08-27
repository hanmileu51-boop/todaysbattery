export type Mood = 'purr' | 'calm' | 'sleepy' | 'drained' | 'dead'

export type Stage = {
  mood: Mood
  label: string
  /** main battery fill color */
  color: string
  /** darker outline / shadow tone */
  deep: string
  /** soft tint for backgrounds */
  tint: string
  banner: string
}

export const STAGES: Stage[] = [
  {
    mood: 'dead',
    label: '영혼 가출',
    color: '#991B1B',
    deep: '#5B0F0F',
    tint: 'rgba(153, 27, 27, 0.12)',
    banner: '🪫 포근한 이불 속에서 고양이랑 푸욱 쉬어갈 시간',
  },
  {
    mood: 'drained',
    label: '경고등 점등',
    color: '#EF4444',
    deep: '#B91C1C',
    tint: 'rgba(239, 68, 68, 0.12)',
    banner: '🔋 오늘은 잠깐 고양이처럼 절전 모드가 필요한 날',
  },
  {
    mood: 'sleepy',
    label: '꾸벅꾸벅',
    color: '#F97316',
    deep: '#C2410C',
    tint: 'rgba(249, 115, 22, 0.12)',
    banner: '🔋 기분 좋은 나른함, 잠깐 눈 붙여도 괜찮다냥',
  },
  {
    mood: 'calm',
    label: '무덤덤 평온',
    color: '#84CC16',
    deep: '#4D7C0F',
    tint: 'rgba(132, 204, 22, 0.14)',
    banner: '🔋 잔잔하게 물결치며 힐링하기 딱 좋은 상태',
  },
  {
    mood: 'purr',
    label: '골골송 만렙',
    color: '#22C55E',
    deep: '#15803D',
    tint: 'rgba(34, 197, 94, 0.14)',
    banner: '🔋 골골송이 저절로 나오는 에너지 만렙인 날!',
  },
]

export function getStage(value: number): Stage {
  if (value >= 80) return STAGES[4]
  if (value >= 50) return STAGES[3]
  if (value >= 25) return STAGES[2]
  if (value >= 10) return STAGES[1]
  return STAGES[0]
}

export type TagId =
  | 'study'
  | 'work'
  | 'people'
  | 'sleep'
  | 'noreason'
  | 'love'
  | 'dunno'

export const TAGS: { id: TagId; emoji: string; label: string }[] = [
  { id: 'study', emoji: '📚', label: '공부' },
  { id: 'work', emoji: '💼', label: '일' },
  { id: 'people', emoji: '😵', label: '사람 관계' },
  { id: 'sleep', emoji: '😴', label: '잠 부족' },
  { id: 'noreason', emoji: '😢', label: '이유 없음' },
  { id: 'love', emoji: '❤️', label: '연애' },
  { id: 'dunno', emoji: '🤷', label: '모르겠음' },
]

export type Prescription = {
  banner: string
  routines: string[]
  coach: string
  bgm: { tag: string; title: string }
  mission: string
  gain: number
  isOffline?: boolean
  isEmergency?: boolean
  isMax?: boolean
}

const TAG_PLAN: Record<
  TagId,
  {
    routines: string[]
    coach: string
    bgm: { tag: string; title: string }
    mission: string
    gain: number
  }
> = {
  study: {
    routines: [
      '책 덮고 창밖 먼 곳 20초 바라보기',
      '목 뒤에서 손 깍지 끼고 천장 보며 고양이 숨 3번',
      '오늘 수고한 나에게 소리 내어 칭찬 한 줄',
    ],
    coach:
      '머릿속 톱니바퀴가 과열됐다냥! 무거운 책을 잠시 덮어도 되냐. 오늘 책상 앞에 앉아있던 그 시간 자체가 네 멋진 실력이다냥 📚',
    bgm: { tag: '#고양이_도서관', title: 'Lo-fi Study Cat Tape' },
    mission: '책상 위 물건 딱 3개만 제자리에 부드럽게 놓기',
    gain: 16,
  },
  work: {
    routines: [
      '자리에서 일어나 어깨 크게 3번 돌리기',
      '모든 업무 알림 창 감추고 30초 멍때리기',
      '오늘 끝낸 일 하나 마음속으로 쓰다듬어주기',
    ],
    coach:
      '해야 할 일이 줄지 않는 건 네가 느린 게 아니라 세상이 너무 빠른 거다냥! 기지개 한번 켜고 어깨 툭 내려놓으라냥 💼',
    bgm: { tag: '#퇴근길_노을', title: 'Sunset Chill Chill' },
    mission: '시원한 물 한 컵 천천히 끝까지 마시기',
    gain: 14,
  },
  people: {
    routines: [
      '스마트폰 뒤집어놓고 1분간 온전히 혼자 있기',
      '어깨를 귀까지 올렸다가 툭 떨어뜨리기 3번',
      '아까 그 말 대신 내 편 드는 따뜻한 주문 외우기',
    ],
    coach:
      '모든 사람에게 좋은 사람일 필요는 없다냥. 오직 내 마음에만 달콤한 츄르를 건네라냥 🐾',
    bgm: { tag: '#나만의_비밀방', title: 'Warm Room Piano' },
    mission: '읽지 않은 메시지 하나 마음 놓고 미루기',
    gain: 18,
  },
  sleep: {
    routines: [
      '눈 감고 두 손바닥 온기로 눈두덩이 20초 감싸기',
      '시원한 고양이 하품 기지개 켜기',
      '따뜻한 물 한 모금 목넘김 느끼기',
    ],
    coach:
      '눈꺼풀이 무거워 고양이 눈처럼 스르륵 감기는구나냥! 오늘 밤은 딱 10분만 먼저 이불 속으로 쏙 들어가라냥 zZ',
    bgm: { tag: '#새벽_빗소리', title: 'Midnight Rain Lullaby' },
    mission: '알람 시계 하나 10분 뒤로 마음 편히 미루기',
    gain: 12,
  },
  noreason: {
    routines: [
      '이유 찾기 멈추고 크게 숨만 3번 쉬기',
      '창문 살짝 열어 밤/낮 공기 냄새 맡기',
      '좋아하는 멜로디 첫 구절 흥얼거리기',
    ],
    coach:
      '이유 없이 마음에 그늘이 져도 괜찮다냥. 고양이도 가끔 햇살 아래 멍하니 아무 생각 없이 서성인다냥 🐱',
    bgm: { tag: '#이유없는_휴식', title: 'Soft Floating Ambient' },
    mission: '아무 목적 없이 발걸음닿는 대로 3분 걸어보기',
    gain: 15,
  },
  love: {
    routines: [
      '가슴 위에 손을 얹고 내 심장 박동 10초 느끼기',
      '거울 속 입꼬리 살짝 올려 미소 지어보기',
      '나에게 해주고 싶은 따스한 선물 하나 생각하기',
    ],
    coach:
      '마음의 파도가 요동치는 건 그만큼 네가 다정하고 진심이었단 뜻이다냥. 넌 존재 자체로 사랑스럽다냥 ❤️',
    bgm: { tag: '#따뜻한_온기', title: 'Warm Hug Ballad' },
    mission: '거울 보고 "오늘 정말 고생했어" 한 마디 건네기',
    gain: 17,
  },
  dunno: {
    routines: [
      '지금 앉은 자리에서 발바닥을 바닥에 가볍게 디디기',
      '4초 숨 들이쉬고 6초 천천히 내쉬기 3회',
      '오늘 기분을 따스한 파스텔 색깔로 정해보기',
    ],
    coach:
      '무엇 때문인지 몰라도 마음이 지친 건 사실이다냥! 억지로 원인을 찾지 말고 고양이 털 복숭이 온기만 느끼라냥 🐾',
    bgm: { tag: '#구름_위_산책', title: 'Cloud Walking Note' },
    mission: '눈 감고 30초간 평온한 상상 속 거닐기',
    gain: 13,
  },
}

export const STATIC_FALLBACK_JSON = {
  status_comment: '통신 에너지가 잠시 방전되었지만 괜찮아요',
  healing_routines: [
    '어깨를 가볍게 으쓱했다가 툭 내려놓기 (5회)',
    '창밖 먼 풍경을 10초간 멍하니 바라보기',
    '시원한 물 한 모금 천천히 마시기',
  ],
  cheering_message:
    '인터넷 연결이 불안정해도 당신의 하루는 소중해요. 지금은 그냥 눈을 감고 크게 한 번 숨 쉬어보세요.',
  recommended_bgm: '잔잔한 빗소리 ASMR',
  micro_mission: '기지개 켜며 하품 시원하게 하기',
  expected_charge_percent: 50,
}

export function buildPrescription(
  level: number,
  tag: TagId,
  isOffline?: boolean,
): Prescription {
  const stage = getStage(level)
  const plan = TAG_PLAN[tag]
  const isEmergency = level === 0
  const isMax = level === 100

  // 100% 입력 시 유지 루틴 및 0 gain 클램핑
  if (isMax) {
    return {
      banner: '이미 완충 상태군요! 유지 루틴을 제공합니다',
      routines: [
        '현재 활력 유지를 위해 물 한 바가지 마시기',
        '옆사람에게 미소 보내며 에너지 나누기',
        '오늘 나에게 감사 인사 3번 건네기',
      ],
      coach: '에너지가 넘치는 멋진 날이에요! 이 기운을 나만의 방식으로 마음껏 펼쳐보세요.',
      bgm: { tag: '#완충_에너지', title: 'Upbeat Sunshine Pop' },
      mission: '주변 사람 한 명에게 기분 좋은 칭찬 한 마디',
      gain: 0,
      isOffline,
      isMax: true,
    }
  }

  const boost = level < 25 ? 6 : level < 50 ? 3 : 0
  const gain = plan.gain + boost
  return {
    banner: isEmergency ? '🚨 [긴급 응급 충전 모드] 방전된 나를 위한 응급처치' : stage.banner,
    routines: plan.routines,
    coach: plan.coach,
    bgm: plan.bgm,
    mission: plan.mission,
    gain: Math.min(100, level + gain) - level,
    isOffline,
    isEmergency,
  }
}

export type LLMPrescriptionResponse = {
  status_comment: string
  healing_routines: string[]
  cheering_message: string
  recommended_bgm: string
  micro_mission: string
  expected_charge_percent: number
}

export function parseLLMResponse(
  raw: any,
  level: number,
  tag: TagId,
  isOffline?: boolean,
): Prescription {
  if (
    !raw ||
    typeof raw.status_comment !== 'string' ||
    !Array.isArray(raw.healing_routines) ||
    typeof raw.cheering_message !== 'string'
  ) {
    return buildPrescription(level, tag, isOffline)
  }

  const isEmergency = level === 0
  const isMax = level === 100

  if (isMax) {
    return {
      banner: '이미 완충 상태군요! 유지 루틴을 제공합니다',
      routines: raw.healing_routines.slice(0, 4),
      coach: raw.cheering_message,
      bgm: {
        tag: '#' + String(raw.recommended_bgm || '완충_에너지').replace(/\s+/g, '_'),
        title: String(raw.recommended_bgm || 'Upbeat Sunshine Pop'),
      },
      mission: String(raw.micro_mission || '10초 동안 화면 뒤집어놓기'),
      gain: 0,
      isOffline,
      isMax: true,
    }
  }

  const bgmTitle = String(raw.recommended_bgm || '잔잔한 Lo-fi 재즈')
  const bgmTag = '#' + bgmTitle.replace(/\s+/g, '_')
  const expectedCharge =
    typeof raw.expected_charge_percent === 'number'
      ? raw.expected_charge_percent
      : level + 15

  // 100% 클램핑
  const gain = Math.max(0, Math.min(100, expectedCharge) - level)

  return {
    banner: raw.status_comment,
    routines: raw.healing_routines.slice(0, 4),
    coach: raw.cheering_message,
    bgm: { tag: bgmTag, title: bgmTitle },
    mission: String(raw.micro_mission || '10초 동안 화면 뒤집어놓기'),
    gain,
    isOffline,
    isEmergency,
  }
}

