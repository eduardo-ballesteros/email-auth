import { NextResponse } from 'next/server';
import { Client } from '@microsoft/microsoft-graph-client';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]/route';

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session || !session.accessToken) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const client = Client.init({
    authProvider: (done) => {
      done(null, session.accessToken as string);
    },
  });

  try {
    const result = await client
      .api('/me/messages')
      .top(10)
      .orderby('receivedDateTime DESC')
      .select('subject,from,receivedDateTime')
      .get();

    return NextResponse.json(result.value);
  } catch (error) {
    console.error('Error fetching emails:', error);
    return NextResponse.json({ error: 'Failed to fetch emails' }, { status: 500 });
  }
}