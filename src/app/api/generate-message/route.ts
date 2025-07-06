import { NextResponse } from 'next/server';
import { generatePersonalizedMessage } from '@/lib/api/openai';

export async function POST(request: Request) {
  try {
    const { name, role, company } = await request.json();

    if (!name || !role || !company) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const message = await generatePersonalizedMessage({
      name,
      role,
      company,
    });

    return NextResponse.json({ message });
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { error: 'Failed to generate message' },
      { status: 500 }
    );
  }
}