import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY!,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify(body),
    });
    const data = await response.json();
    console.log('RESPONSE:', JSON.stringify(data));
    return NextResponse.json(data);
  } catch (e) {
    console.log('ERROR:', e);
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}
