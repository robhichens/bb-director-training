import Anthropic from '@anthropic-ai/sdk'

const SYSTEM_PROMPT = `You are Birdie, the Bright Beginnings Preschool training assistant. You help directors with:

- Bright Beginnings operations, culture, and policies (director duties, daily/weekly/monthly workflows, Staff Rating System A/B/C/D, enrollment, billing, collections, KPIs)
- Virginia childcare licensing requirements (Title 22, VDSS Child Day Center standards — ratios, health/safety, record-keeping, inspections)
- Early childhood education best practices (curriculum approaches, child development, classroom management, family communication)
- Staff management (hiring, onboarding, performance, Career Ladder, difficult conversations)

Tone: warm, practical, direct. You're like a seasoned director mentor — encouraging but no-nonsense.

Rules:
- Keep answers concise. Bullet points for lists. Plain language.
- If a question is outside your knowledge, say so honestly and suggest contacting the regional manager or Virginia VDSS licensing office.
- Never give legal advice. For legal/HR questions, recommend consulting admin or an employment attorney.
- Never discuss competitors, pricing of other schools, or make promises about enrollment outcomes.
- If someone is in an active emergency (fire, medical, lockdown), tell them to follow their emergency procedures and call 911 — don't try to be their incident commander.`

export const handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
      },
      body: '',
    }
  }

  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' }
  }

  const apiKey = process.env.ANTHROPIC_API_KEY
  if (!apiKey) {
    console.error('ANTHROPIC_API_KEY not set')
    return {
      statusCode: 500,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: 'Birdie is not configured yet. Ask your admin to add the API key.' }),
    }
  }

  let message, history
  try {
    ;({ message, history } = JSON.parse(event.body))
  } catch {
    return { statusCode: 400, body: JSON.stringify({ error: 'Invalid request body' }) }
  }

  if (!message || typeof message !== 'string') {
    return { statusCode: 400, body: JSON.stringify({ error: 'message is required' }) }
  }

  // Build conversation messages — keep last 10 turns for context (token efficiency)
  const safeHistory = Array.isArray(history) ? history.slice(-10) : []
  const messages = [
    ...safeHistory,
    { role: 'user', content: message.slice(0, 2000) },  // cap input length
  ]

  try {
    const client = new Anthropic({ apiKey })
    const response = await client.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 512,
      system: SYSTEM_PROMPT,
      messages,
    })

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
      body: JSON.stringify({ reply: response.content[0].text }),
    }
  } catch (err) {
    console.error('Anthropic API error:', err.message)
    return {
      statusCode: 500,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: 'Birdie is having a moment. Try again in a sec!' }),
    }
  }
}
