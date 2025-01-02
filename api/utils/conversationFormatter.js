export function formatConversationForAnalysis(messages) {
  try {
    return messages
      .map(m => `${m.role.toUpperCase()}: ${m.content}`)
      .join('\n');
  } catch (error) {
    console.error('Conversation Formatting Error:', error);
    throw new Error('Failed to format conversation messages');
  }
}

export function createAnalysisPrompt(conversationText) {
  return `
    Analyze this customer support conversation and rate the agent's performance in the following areas:
    1. Professionalism (1-10)
    2. Problem Resolution (1-10)
    3. Communication Clarity (1-10)
    4. Empathy (1-10)
    5. Efficiency (1-10)

    Also provide:
    - Key strengths
    - Areas for improvement
    - Overall rating (1-10)

    Conversation:
    ${conversationText}
  `;
}