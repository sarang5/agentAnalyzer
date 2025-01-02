export function generateReport(analysis, conversation) {
  const duration = new Date() - conversation.startTime;
  const messageCount = conversation.messages.length;

  return {
    conversationMetrics: {
      agentId: conversation.agentId,
      customerId: conversation.customerId,
      duration: duration,
      messageCount: messageCount,
      averageResponseTime: duration / messageCount
    },
    analysis: analysis,
    timestamp: new Date(),
  };
}