import { NextResponse } from 'next/server'
import app from '@/app'

const GENERAL_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': '*',
  'Access-Control-Allow-Headers': 'Content-Type',
}


export async function GET() {
  const tweets = await app.getTweets()
  return NextResponse.json({ tweets }, { status: 200 })
}

export async function POST(req: Request) {
  const body = await req.json();

  if (!body) {
    return NextResponse.json({ error: 'No body' }, { status: 405 })
  }

  switch (body.method) {
    case 'sync':
      app.sync();
      return NextResponse.json(null, { status: 200, headers: GENERAL_HEADERS })

    case 'like':
      if (!body.id) {
        return NextResponse.json({ error: 'No id' }, { status: 405 })
      }

      await app.likeTweet(body.id)
      return NextResponse.json(null, { status: 200, headers: GENERAL_HEADERS })
    case 'dislike':
      if (!body.id) {
        return NextResponse.json({ error: 'No id' }, { status: 405 })
      }

      await app.dislikeTweet(body.id)
      return NextResponse.json(null, { status: 200, headers: GENERAL_HEADERS })
    default:
      return NextResponse.json({ error: 'Invalid method' }, { status: 405 })
  }

}

export async function OPTIONS() {
  return NextResponse.json({}, { headers: GENERAL_HEADERS })
}
