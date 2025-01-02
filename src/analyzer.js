import { createChatCompletion } from './services/gemini.js';
import { formatConversationForAnalysis, createAnalysisPrompt } from './utils/conversationFormatter.js';

export async function analyzeConversation(messages) {
  try {
    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      throw new Error('Invalid conversation messages provided');
    }

    const conversationText = formatConversationForAnalysis(messages);
    const prompt = createAnalysisPrompt(conversationText);
    
    const analysis = await createChatCompletion([
      { role: 'user', content: prompt }
    ]);

    return analysis;
  } catch (error) {
    console.error('Conversation Analysis Error:', error);
    throw new Error(`Failed to analyze conversation: ${error.message}`);
  }
}