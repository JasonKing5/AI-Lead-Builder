import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  baseURL: process.env.OPENAI_API_BASE_URL,
});

export async function generatePersonalizedMessage(params: {
  name: string;
  role: string;
  company: string;
}) {
  try {
    const prompt = `Write a short, friendly LinkedIn outreach message to ${params.name}, who is a ${params.role} at ${params.company}. Make it casual and under 500 characters.`;

    const completion = await openai.chat.completions.create({
      messages: [
        {
          role: 'system',
          content: 'You are a helpful assistant that generates professional but friendly LinkedIn outreach messages.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      model: 'gpt-3.5-turbo',
      temperature: 0.7,
      max_tokens: 200,
    });

    return completion.choices[0]?.message?.content?.trim() || '';
  } catch (error) {
    console.error('Error generating message with OpenAI:', error);
    throw new Error('Failed to generate message. Please try again.');
  }
}