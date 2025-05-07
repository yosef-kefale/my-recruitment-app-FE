import { NextRequest } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const template = searchParams.get('template') || request.url.split('/').pop();

  if (!template) {
    return new Response('Template name is required', { status: 400 });
  }

  const filePath = path.join(process.cwd(), 'public/email-templates', `${template}.html`);
  
  try {
    const html = await fs.readFile(filePath, 'utf-8');
    return new Response(html, {
      headers: { 'Content-Type': 'text/html' },
    });
  } catch (err) {
    console.error('Error loading template:', err);
    return new Response('Template not found', { status: 404 });
  }
} 