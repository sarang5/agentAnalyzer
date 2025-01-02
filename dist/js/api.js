// API interaction functions
export async function startConversation() {
  const response = await fetch('/api/conversation/start', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      agentId: 'agent-001',
      customerId: 'customer-001'
    })
  });
  const data = await response.json();
  return data.conversationId;
}

export async function addMessage(conversationId, role, content) {
  await fetch(`/api/conversation/${conversationId}/message`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ role, content })
  });
}

export async function endConversation(conversationId) {
  const response = await fetch(`/api/conversation/${conversationId}/end`, {
    method: 'POST'
  });
  const data = await response.json();
  return data.report;
}