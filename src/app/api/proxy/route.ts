import { NextRequest, NextResponse } from 'next/server';

// The actual API server URL (using HTTPS for secure connections)
const API_SERVER_URL = 'https://196.188.249.24:3010/api';

export async function GET(request: NextRequest) {
  const url = new URL(request.url);
  const path = url.searchParams.get('path') || '';
  
  try {
    const response = await fetch(`${API_SERVER_URL}/${path}`, {
      headers: {
        'Content-Type': 'application/json',
        ...Object.fromEntries(request.headers),
      },
      // @ts-ignore - Node.js specific option
      agent: new (require('https').Agent)({ rejectUnauthorized: false }),
    });
    
    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Proxy error:', error);
    return NextResponse.json({ error: 'Failed to fetch data' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const url = new URL(request.url);
  const path = url.searchParams.get('path') || '';
  
  try {
    const body = await request.json();
    
    const response = await fetch(`${API_SERVER_URL}/${path}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...Object.fromEntries(request.headers),
      },
      body: JSON.stringify(body),
      // @ts-ignore - Node.js specific option
      agent: new (require('https').Agent)({ rejectUnauthorized: false }),
    });
    
    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Proxy error:', error);
    return NextResponse.json({ error: 'Failed to post data' }, { status: 500 });
  }
}

// Add other HTTP methods as needed (PUT, DELETE, etc.)
  