import { NextResponse } from 'next/server';
import { callOllamaAI } from '@/app/api/ai/ollamaService';
import { PROMPTS } from '@/app/api/ai/prompts';

/**
 * @swagger
 * /api/ai:
 *   post:
 *     summary: Generate AI response
 *     description: Processes an AI request using a predefined prompt type and user content.
 *     tags: [AI]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               promptType:
 *                 type: string
 *                 example: "category"
 *                 description: The type of AI prompt to use (must match a valid key in PROMPTS).
 *               content:
 *                 type: string
 *                 example: "Write a journal entry about productivity."
 *                 description: The input content for the AI model.
 *     responses:
 *       200:
 *         description: Successfully processed AI request
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 result:
 *                   type: string
 *                   example: "Your journal entry has been categorized as Productivity."
 *       400:
 *         description: Invalid request (missing or invalid content)
 *       500:
 *         description: Failed to process AI request
 */
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
