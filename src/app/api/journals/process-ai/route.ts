import { NextResponse } from 'next/server';
import { callOllamaAI } from '@/app/api/ai/ollamaService';
import { PROMPTS } from '@/app/api/ai/prompts';

export async function POST(req: Request) {
  try {
    const { promptType = 'category', content } = await req.json();

    if (!content) {
      return NextResponse.json(
        { error: 'Content is required' },
        { status: 400 }
      );
    }

    // Validate if the requested prompt type exists
    const generatePrompt = PROMPTS[promptType as keyof typeof PROMPTS];
    if (typeof generatePrompt !== 'function') {
      return NextResponse.json(
        { error: 'Invalid prompt type' },
        { status: 400 }
      );
    }

    // Generate AI prompt dynamically
    const prompt = generatePrompt(content);
    const result = await callOllamaAI(prompt);

    console.log(promptType);

    return NextResponse.json({ result }, { status: 200 });
  } catch (error) {
    console.error(`AI API Error [${req.method}]:`, error);
    return NextResponse.json(
      { error: 'Failed to process AI request' },
      { status: 500 }
    );
  }
}
