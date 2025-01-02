import OpenAI from 'openai';
import dotenv from 'dotenv';
import { Readable } from 'stream';
import { Buffer } from 'buffer';

dotenv.config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

export async function transcribeAudio(audioBuffer) {
  try {
    // Convert buffer to a File object that OpenAI's API expects
    const audioFile = new File([audioBuffer], 'audio.webm', { type: 'audio/webm' });
    
    const transcription = await openai.audio.transcriptions.create({
      file: audioFile,
      model: "whisper-1",
      language: "en"
    });
    
    return transcription.text;
  } catch (error) {
    console.error('Whisper API Error:', error);
    throw new Error('Failed to transcribe audio: ' + error.message);
  }
}