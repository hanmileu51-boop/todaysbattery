import { NextRequest, NextResponse } from 'next/server'

const SYSTEM_PROMPT = `당신은 지친 현대인을 위해 위트 있고 다정하게 마음을 케어해주는 AI 힐링 코치 '오늘의 배터리 고양이'입니다.
사용자가 입력한 배터리 잔량(%)과 피로 원인을 바탕으로, 1분 안에 현 위치에서 실천 가능한 맞춤 처방전을 JSON 규격으로 작성하세요.

[출력 작성 원칙]
1. status_comment: 현재 배터리 상태에 대한 위트 있는 한 줄 비유 진단.
2. healing_routines: 지금 자리에서 1분 안에 실천 가능한 구체적 액션 3가지 (스트레칭, 호흡, 시각/감각 환기 등).
3. cheering_message: 다정하고 따뜻한 고양이 말투의 응원 메시지 (2~3문장).
4. recommended_bgm: 기분 전환에 도움 되는 BGM 무드/장르 1개.
5. micro_mission: 10초~1분 내 완수할 수 있는 초간단 미션 1개.
6. expected_charge_percent: 입력된 배터리 수치보다 +10%p~+25%p 상승한 예상 도달치 정수 (최대 100 제한).`

// 정적 Fallback 처방전 템플릿
function getFallbackPrescription(batteryLevel: number, fatigueReason: string) {
  const boost = Math.min(100, batteryLevel + Math.floor(Math.random() * 15) + 10)
  return {
    status_comment: `🔋 ${fatigueReason} 때문에 에너지가 절전 모드에 들어갔네요!`,
    healing_routines: [
      '어깨를 가볍게 으쓱했다가 툭 내려놓기 (5회)',
      '창밖 먼 풍경을 10초간 멍하니 바라보기',
      '시원한 물 한 모금 천천히 마시기',
    ],
    cheering_message:
      '배터리가 닳았다고 당황할 것 없어요. 고양이처럼 잠깐 따뜻한 해가 드는 곳에 누워 쉬어가도 충분해요.',
    recommended_bgm: '잔잔한 Lo-fi 재즈',
    micro_mission: '스마트폰 화면 10초간 뒤집어두기',
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
                      text: `${SYSTEM_PROMPT}\n\n사용자 입력 데이터: ${JSON.stringify({
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
              { role: 'system', content: SYSTEM_PROMPT },
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
