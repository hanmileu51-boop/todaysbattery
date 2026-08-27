import { NextRequest, NextResponse } from 'next/server'

function buildDynamicSystemPrompt(batteryLevel: number, fatigueReason: string) {
  const hour = new Date().getHours()
  let timeContext = '오후시간'
  if (hour >= 22 || hour < 6) {
    timeContext = '깊은 밤/수면 시간대 (수면 케어 및 따뜻한 안식 톤 적용)'
  } else if (hour >= 6 && hour < 12) {
    timeContext = '아침/오전 시간대 (상쾌하고 부담 없는 원기 회복 톤)'
  } else if (hour >= 12 && hour < 18) {
    timeContext = '오후/업무 및 학업 시간대 (짧고 직관적인 식곤증/스트레스 해소 톤)'
  } else {
    timeContext = '저녁/퇴근 및 하교 시간대 (하루 노고 위로 및 리프레시 톤)'
  }

  let levelContext = '보통 피로 상태'
  if (batteryLevel <= 9) {
    levelContext = '🚨 [0%~9% 긴급 응급 충전 모드] 영혼 탈곡 상태! 극도로 간단한 호흡과 부드러운 위로 필수.'
  } else if (batteryLevel >= 80) {
    levelContext = '🔋 [80%~100% 에너지 풍족 상태] 완충 상태를 유지하고 긍정적인 에너지를 다지는 루틴 제공.'
  }

  return `당신은 지친 현대인을 위해 위트 있고 다정하게 마음을 케어해주는 AI 힐링 코치 '오늘의 배터리 고양이'입니다.
사용자가 입력한 배터리 잔량(${batteryLevel}%)과 피로 원인(${fatigueReason})을 바탕으로 1분 안에 현 위치에서 실천 가능한 맞춤 처방전을 JSON 규격으로 작성하세요.

[현재 사용자 서비스 컨텍스트]
- 접속 시간대: ${timeContext}
- 에너지 상태: ${levelContext}
- 피로 고민: ${fatigueReason}

[피로 고민별 고양이 코치 조언 튜닝 지침]
- 공부: 학업 스트레스와 머리 과열을 위로하며 오늘 노력 자체를 칭찬하는 고양이 코치 톤 (~냥)
- 일: 무한 업무와 모니터 피로를 사르르 녹이며 기지개를 권하는 고양이 코치 톤 (~냥)
- 사람 관계: 타인의 시선에서 벗어나 오직 내 마음에만 달콤한 츄르를 건네도록 다독이는 고양이 톤 (~냥)
- 잠 부족: 눈꺼풀 무거운 나른함과 따뜻한 이불 속 온기를 전하는 수면 고양이 톤 (~냥)
- 이유 없음: 이유 없이 우울해도 네 잘못이 아니라고 햇살 아래 누워 안아주는 고양이 톤 (~냥)
- 연애: 마음의 파도가 출렁여도 네 존재 자체로 사랑스럽다고 보듬는 고양이 톤 (~냥)
- 모르겠음: 억지로 원인을 찾지 말고 고양이 털 복숭이 온기에 몸을 맡기라는 고양이 톤 (~냥)

[출력 작성 원칙]
1. status_comment: 현재 고민(${fatigueReason})과 시간대를 반영한 기계적이지 않은 다뜻하고 위트 있는 한 줄 비유 진단.
2. healing_routines: 지금 자리에서 1분 안에 실천 가능한 구체적 액션 3가지 (스트레칭, 호흡, 시각/감각 환기 등).
3. cheering_message: 고민(${fatigueReason})에 1:1 맞춤화된 다정하고 따뜻한 고양이 말투의 응원 메시지 (2~3문장, ~냥, ~다냥 사용).
4. recommended_bgm: 기분 전환에 도움 되는 앰비언트 BGM 무드/장르 1개.
5. micro_mission: 10초~1분 내 완수할 수 있는 초간단 마음 쉼표 미션 1개.
6. expected_charge_percent: 입력된 배터리 수치보다 +10%p~+25%p 상승한 예상 도달치 정수 (최대 100 제한).`
}

// 정적 Fallback 처방전 템플릿
function getFallbackPrescription(batteryLevel: number, fatigueReason: string) {
  const boost = Math.min(100, batteryLevel + Math.floor(Math.random() * 15) + 10)
  return {
    status_comment: `🍃 ${fatigueReason} 때문에 지친 내 마음, 잠시 쉬어가도 괜찮다냥!`,
    healing_routines: [
      '어깨를 가볍게 으쓱했다가 툭 내려놓기 (5회)',
      '창밖 먼 풍경을 10초간 멍하니 바라보기',
      '시원한 물 한 모금 천천히 마시기',
    ],
    cheering_message:
      '바람이 잠시 소식을 멈췄지만 고양이의 온기는 언제나 곁에 있다냥. 잠깐 눈을 감고 시원한 고양이 기지개를 켜보라냥 🐾',
    recommended_bgm: '잔잔한 빗소리 앰비언스',
    micro_mission: '10초 동안 마음 쉼표 켜기',
    expected_charge_percent: boost,
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { battery_level, fatigue_reason } = body

    // 1. 입력 검증
    if (
      typeof battery_level !== 'number' ||
      battery_level < 0 ||
      battery_level > 100 ||
      !fatigue_reason
    ) {
      return NextResponse.json(
        { error: '피로 원인을 선택하고 배터리 수치(0~100)를 입력해주세요.' },
        { status: 400 },
      )
    }

    const geminiApiKey = process.env.GEMINI_API_KEY
    const openaiApiKey = process.env.OPENAI_API_KEY

    // 2. Gemini API Key 지원
    if (geminiApiKey) {
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 5000)

      try {
        const geminiRes = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent?key=${geminiApiKey}`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            signal: controller.signal,
            body: JSON.stringify({
              contents: [
                {
                  role: 'user',
                  parts: [
                    {
                      text: `${buildDynamicSystemPrompt(battery_level, fatigue_reason)}\n\n사용자 입력 데이터: ${JSON.stringify({
                        battery_level,
                        fatigue_reason,
                      })}`,
                    },
                  ],
                },
              ],
              generationConfig: {
                responseMimeType: 'application/json',
                temperature: 0.7,
              },
            }),
          },
        )

        clearTimeout(timeoutId)

        if (geminiRes.ok) {
          const data = await geminiRes.json()
          const textResponse = data.candidates?.[0]?.content?.parts?.[0]?.text
          if (textResponse) {
            const parsed = JSON.parse(textResponse)
            return NextResponse.json(parsed)
          }
        } else {
          console.warn('[API/prescribe] Gemini API status:', geminiRes.status)
        }
      } catch (err: any) {
        clearTimeout(timeoutId)
        console.warn('[API/prescribe] Gemini API exception/timeout:', err?.message || err)
      }
    }

    // 3. OpenAI API Key 지원 (Fallback 1)
    if (openaiApiKey) {
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 5000)

      try {
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${openaiApiKey}`,
          },
          signal: controller.signal,
          body: JSON.stringify({
            model: 'gpt-4o-mini',
            temperature: 0.7,
            response_format: { type: 'json_object' },
            messages: [
              { role: 'system', content: buildDynamicSystemPrompt(battery_level, fatigue_reason) },
              {
                role: 'user',
                content: JSON.stringify({
                  battery_level,
                  fatigue_reason,
                }),
              },
            ],
          }),
        })

        clearTimeout(timeoutId)

        if (response.ok) {
          const data = await response.json()
          const contentStr = data.choices?.[0]?.message?.content
          if (contentStr) {
            const parsedJSON = JSON.parse(contentStr)
            return NextResponse.json(parsedJSON)
          }
        }
      } catch (err: any) {
        clearTimeout(timeoutId)
        console.warn('[API/prescribe] OpenAI API exception/timeout:', err?.message || err)
      }
    }

    // 4. API Key 미설정 또는 실패/타임아웃 시 정적 Fallback 처방 반환
    console.warn('[API/prescribe] Returning static fallback prescription.')
    return NextResponse.json(getFallbackPrescription(battery_level, fatigue_reason))
  } catch (error) {
    return NextResponse.json(
      { error: '잘못된 요청 형식이거나 알 수 없는 에러입니다.' },
      { status: 400 },
    )
  }
}
