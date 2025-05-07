import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

export async function GET(
  req: NextRequest,
  { params }: { params: { template: string } }
) {
  const { template } = params;
  const filePath = path.join(process.cwd(), 'src/lib/utils/emailTemplates', `${template}.html`);
  try {
    const html = await fs.readFile(filePath, 'utf-8');
    return new NextResponse(html, {
      headers: { 'Content-Type': 'text/html' },
    });
  } catch (err) {
    return new NextResponse('Template not found', { status: 404 });
  }
}
