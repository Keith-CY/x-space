import { NextResponse } from 'next/server'
import app from '@/app'

export async function GET() {
  await app.sync();
  return NextResponse.json({}, { status: 200 })
}

