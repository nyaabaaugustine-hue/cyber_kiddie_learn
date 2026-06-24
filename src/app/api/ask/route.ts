import { NextRequest, NextResponse } from 'next/server'

export const runtime = 'edge'

export async function POST(req: NextRequest) {
  const apiKey = process.env.ANTHROPIC_API_KEY

  if (!apiKey || apiKey === 'your_api_key_here') {
    return NextResponse.json(
      { answer: '🔑 The AI Tutor needs an API key set up. Ask a grown-up to help!' },
      { status: 200 }
    )
  }

  let subject = 'general'
  let question = ''

  try {
    const body = await req.json()
    subject = body.subject ?? 'general'
    question = (body.question ?? '').slice(0, 300)
  } catch {
    return NextResponse.json({ answer: 'Please send a valid question!' }, { status: 400 })
  }

  if (!question) {
    return NextResponse.json({ answer: 'Ask me something!' }, { status: 400 })
  }

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-6',
        max_tokens: 300,
        system: `You are a friendly, enthusiastic teacher for kids aged 5-12. 
Answer questions about ${subject} in a fun, simple, age-appropriate way.
Keep answers to 2-4 sentences maximum. Use 1-2 emojis. Never use scary or complex words.
Always be encouraging and end with a fun fact or question to spark curiosity.`,
        messages: [{ role: 'user', content: question }],
      }),
    })

    if (!response.ok) {
      const err = await response.json().catch(() => ({}))
      console.error('Anthropic API error:', response.status, err)
      return NextResponse.json(
        { answer: "🤔 I'm thinking really hard but couldn't find an answer. Try asking differently!" },
        { status: 200 }
      )
    }

    const data = await response.json()
    const answer = data?.content?.[0]?.text ?? "Hmm, I'm not sure about that one! Ask a grown-up too."

    return NextResponse.json({ answer })
  } catch (error) {
    console.error('AI Tutor error:', error)
    return NextResponse.json(
      { answer: "🌐 I couldn't connect right now. Check your internet and try again!" },
      { status: 200 }
    )
  }
}
