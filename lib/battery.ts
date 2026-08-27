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
    banner: '🪫 지금은 충전기 꽂고 누워야 하는 날',
  },
  {
    mood: 'drained',
    label: '경고등 점등',
    color: '#EF4444',
    deep: '#B91C1C',
    tint: 'rgba(239, 68, 68, 0.12)',
    banner: '🔋 오늘은 절전모드가 필요한 날',
  },
  {
    mood: 'sleepy',
    label: '꾸벅꾸벅',
    color: '#F97316',
    deep: '#C2410C',
    tint: 'rgba(249, 115, 22, 0.12)',
    banner: '🔋 잠깐 눈 붙여도 아무도 안 뭐라 해요',
  },
  {
    mood: 'calm',
    label: '무덤덤 평온',
    color: '#84CC16',
    deep: '#4D7C0F',
    tint: 'rgba(132, 204, 22, 0.14)',
    banner: '🔋 딱 적당히 굴러가는 중',
  },
  {
    mood: 'purr',
    label: '골골송 만렙',
    color: '#22C55E',
    deep: '#15803D',
    tint: 'rgba(34, 197, 94, 0.14)',
    banner: '🔋 오늘은 남한테 나눠줄 힘까지 있는 날',
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
      '목 뒤에서 손 깍지 끼고 천장 보며 숨 3번',
      '지금 외운 것 딱 한 줄만 소리 내어 말하기',
    ],
    coach:
      '머리에 다 안 들어와도 괜찮아. 오늘 앉아 있었던 그 시간, 그거 자체가 실력이야.',
    bgm: { tag: '#조용한_도서관_소음', title: 'Lo-fi Study Room' },
    mission: '책상 위 물건 딱 3개만 제자리에 놓기',
    gain: 16,
  },
  work: {
    routines: [
      '자리에서 일어나 어깨 크게 3번 돌리기',
      '알림 창 전부 닫고 30초 아무것도 안 하기',
      '오늘 끝낸 일 하나 마음속으로 칭찬하기',
    ],
    coach:
      '해야 할 일이 줄지 않는 건 네가 느린 게 아니라 원래 안 줄어드는 거야. 잠깐 숨 쉬어.',
    bgm: { tag: '#퇴근길_시티팝', title: 'Evening Commute' },
    mission: '물 한 컵 끝까지 다 마시기',
    gain: 14,
  },
  people: {
    routines: [
      '휴대폰 뒤집어 놓고 1분 혼자 있기',
      '어깨를 귀까지 올렸다가 툭 떨어뜨리기 3번',
      '아까 그 말 대신 내 편 드는 말 한 줄 속으로 하기',
    ],
    coach:
      '모든 사람에게 좋은 사람일 필요는 없어. 오늘은 너한테만 좋은 사람이 되자.',
    bgm: { tag: '#혼자_있는_방', title: 'Quiet Room Piano' },
    mission: '읽지 않은 메시지 하나 미루기 (진짜 미뤄도 돼요)',
    gain: 18,
  },
  sleep: {
    routines: [
      '눈 감고 눈두덩이 손바닥으로 20초 덮기',
      '기지개 한 번, 소리 내도 좋아요',
      '따뜻한 물 반 컵 천천히 마시기',
    ],
    coach:
      '잠이 부족한 건 의지 문제가 아니야. 오늘 밤은 10분만 더 일찍 눕자, 딱 10분만.',
    bgm: { tag: '#새벽_빗소리', title: 'Rain on Window' },
    mission: '알람 하나 10분 뒤로 미루기',
    gain: 12,
  },
  noreason: {
    routines: [
      '이유 찾기 그만두고 숨만 3번 크게',
      '창문 조금 열고 바깥 공기 냄새 맡기',
      '가장 좋아하는 노래 첫 소절만 듣기',
    ],
    coach:
      '이유 없이 지치는 날도 있어. 이유가 없으니까 네 잘못도 아니라는 뜻이야.',
    bgm: { tag: '#이유없는_오후', title: 'Soft Ambient Loop' },
    mission: '아무 목적 없이 3분 걷기',
    gain: 15,
  },
  love: {
    routines: [
      '가슴에 손 얹고 심장 소리 10초 듣기',
      '입꼬리만 살짝 올려보기 (억지로도 됨)',
      '나한테 하고 싶은 말 한 줄 적어보기',
    ],
    coach:
      '마음 쓰는 일은 원래 배터리를 많이 먹어. 그만큼 진심이었다는 증거야.',
    bgm: { tag: '#새벽_감성_발라드', title: 'Late Night Ballad' },
    mission: '거울 보고 "오늘 수고했어" 한 마디',
    gain: 17,
  },
  dunno: {
    routines: [
      '지금 앉은 자리에서 발바닥 바닥에 붙이기',
      '숨 4초 들이쉬고 6초 내쉬기 3세트',
      '오늘 기분을 색깔 하나로 정해보기',
    ],
    coach:
      '뭔지 몰라도 지친 건 사실이야. 원인은 나중에 찾고, 지금은 쉬는 게 먼저야.',
    bgm: { tag: '#멍때리기_플리', title: 'Blank Mind Tape' },
    mission: '눈 감고 30초 아무 생각 안 하기',
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

