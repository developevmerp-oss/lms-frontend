import { NextRequest } from 'next/server';
import { POST as handleChat } from '../chat/route';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  return handleChat(req);
}
