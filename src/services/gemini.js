import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';

dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export async function createChatCompletion(messages) {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
    const chat = model.startChat();
    
    // Convert OpenAI message format to text for Gemini
    const prompt = messages
      .map(m => `${m.role.toUpperCase()}: ${m.content}`)
      .join('\n');
    
    const result = await chat.sendMessage(prompt);
    const response = await result.response;
    
    return response.text();
  } catch (error) {
    console.error('Gemini Chat Completion Error:', error.message);
    throw new Error(`Gemini API Error: ${error.message}`);
  }
}