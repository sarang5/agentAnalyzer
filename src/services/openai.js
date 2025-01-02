import OpenAI from 'openai';
import dotenv from 'dotenv';

dotenv.config();

export const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

export async function createChatCompletion(messages) {
  try {
    const completion = await openai.chat.completions.create({
      messages,
      model: 'gpt-3.5-turbo',
      temperature: 0.7,
    });
    return completion.choices[0].message.content;
  } catch (error) {
    console.error('OpenAI Chat Completion Error:', error.message);
    throw new Error(`OpenAI API Error: ${error.message}`);
  }
}