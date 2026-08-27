import { NextRequest, NextResponse } from 'next/server'

const CHAT_SYSTEM_PROMPT = `당신은 지친 현대인의 배터리를 충전해주는 AI 힐링 코치 '오늘의 배터리 고양이'입니다.
사용자가 건넨 이야기나 고민에 대해 고양이 특유의 다정하고 위트 있는 말투(~냥, ~골골, 🐾)로 1~2문장 이내의 따뜻하고 긍정적인 답장을 건네세요.
추가적인 복잡한 조언보다 지금 이 순간 굳어있는 마음을 누그러뜨릴 수 있는 친근하고 편안한 표현을 사용하세요.`

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { user_message, battery_level, fatigue_reason } = body

    if (!user_message || typeof user_message !== 'string') {
      return NextResponse.json(
        { error: '메시지를 입력해주세요.' },
        { status: 400 },
      )
    }

    const geminiApiKey = process.env.GEMINI_API_KEY
    const openaiApiKey = process.env.OPENAI_API_KEY

    // 1. Gemini 3.6 Flash 호출
    if (geminiApiKey) {
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 4000)

      try {
        const res = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.6-flash:generateContent?key=${geminiApiKey}`,
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
                      text: `${CHAT_SYSTEM_PROMPT}\n\n현재 배터리: ${battery_level ?? 50}%, 피로 원인: ${fatigue_reason ?? '없음'}\n사용자 한마디: "${user_message.trim()}"`,
                    },
                  ],
                },
              ],
              generationConfig: {
                temperature: 0.8,
                maxOutputTokens: 150,
              },
            }),
          },
        )

        clearTimeout(timeoutId)

        if (res.ok) {
          const data = await res.json()
          const replyText = data.candidates?.[0]?.content?.parts?.[0]?.text
          if (replyText) {
            return NextResponse.json({ reply: replyText.trim() })
          }
        }
      } catch (err: any) {
        clearTimeout(timeoutId)
        console.warn('[API/chat] Gemini API exception:', err?.message || err)
      }
    }

    // 2. OpenAI API Fallback
    if (openaiApiKey) {
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 4000)

      try {
        const res = await fetch('https://api.openai.com/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${openaiApiKey}`,
          },
          signal: controller.signal,
          body: JSON.stringify({
            model: 'gpt-4o-mini',
            temperature: 0.8,
            max_tokens: 150,
            messages: [
              { role: 'system', content: CHAT_SYSTEM_PROMPT },
              {
                role: 'user',
                content: `현재 배터리: ${battery_level ?? 50}%, 피로 원인: ${fatigue_reason ?? '없음'}\n사용자 한마디: "${user_message.trim()}"`,
              },
            ],
          }),
        })

        clearTimeout(timeoutId)

        if (res.ok) {
          const data = await res.json()
          const replyText = data.choices?.[0]?.message?.content
          if (replyText) {
            return NextResponse.json({ reply: replyText.trim() })
          }
        }
      } catch (err: any) {
        clearTimeout(timeoutId)
        console.warn('[API/chat] OpenAI API exception:', err?.message || err)
      }
    }

    // 3. Fallback Response
    return NextResponse.json({
      reply: '힘들 땐 언제든 잠깐 푹 쉬어가라냥! 고양이가 항상 네 편에서 골골송으로 응원할게 🐾',
    })
  } catch (err) {
    return NextResponse.json({
      reply: '지금은 잠시 고양이가 낮잠 자는 시간이라냥! 따뜻한 차 한 잔 마시며 쉬어봐요 ☕',
    })
  }
}
