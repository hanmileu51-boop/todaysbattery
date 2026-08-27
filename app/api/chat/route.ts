import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { battery_level, fatigue_reason, question } = body

    if (!question || typeof battery_level !== 'number' || !fatigue_reason) {
      return NextResponse.json(
        { error: '질문, 배터리 수치, 피로 원인이 필요합니다.' },
        { status: 400 },
      )
    }

    const geminiApiKey = process.env.GEMINI_API_KEY
    const prompt = `당신은 귀여운 AI 힐링 코치 '오늘의 배터리 고양이'입니다.
사용자 상태: 배터리 잔량 ${battery_level}%, 피로 원인: ${fatigue_reason}.
사용자의 추가 질문/요청: "${question}"

고양이 말투(~냥, ~다냥, 골골골)로 지친 사용자를 다정하고 재치 있게 위로하는 답변을 2문장 이내로 작성하세요.`

    if (geminiApiKey) {
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 4000)

      try {
        const res = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent?key=${geminiApiKey}`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            signal: controller.signal,
            body: JSON.stringify({
              contents: [{ role: 'user', parts: [{ text: prompt }] }],
              generationConfig: { temperature: 0.8 },
            }),
          },
        )

        clearTimeout(timeoutId)

        if (res.ok) {
          const data = await res.json()
          const text = data.candidates?.[0]?.content?.parts?.[0]?.text
          if (text) {
            return NextResponse.json({ reply: text.trim() })
          }
        }
      } catch (err: any) {
        clearTimeout(timeoutId)
        console.warn('[API/chat] Gemini API error, returning fallback reply:', err)
      }
    }

    // Fallback 답변 모음
    const fallbackReplies: Record<string, string> = {
      '1분 루틴 더 쉽게 하는 법?':
        '힘들면 다 안 해도 된다냥! 그냥 눈 감고 숨 한 번 크게 쉬는 것만으로도 충분히 참 잘했다냥 🐾',
      '지금 잠이 안 와냥':
        '스마트폰 불빛을 끄고 고양이처럼 몸을 동그랗게 말고 따뜻한 이불 속 온기에 집중해보라냥 zZ',
      '응원 한 번 더 해줘!':
        '오늘 하루 정말 고생 많았다냥! 넌 존재만으로도 100점 만점에 100점 배터리다냥 💖',
    }

    const reply =
      fallbackReplies[question] ||
      `집사야, 힘내라냥! 고양이가 언제나 곁에서 든든하게 골골송을 불러줄게냥 🐾`

    return NextResponse.json({ reply })
  } catch (err) {
    return NextResponse.json(
      { reply: '집사야! 조금 쉬었다가 다시 물어봐달라냥 🐾' },
      { status: 200 },
    )
  }
}
