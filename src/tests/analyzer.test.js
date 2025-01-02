import { expect, test, vi } from 'vitest';
import { analyzeConversation } from '../analyzer.js';

test('analyzeConversation generates proper analysis', async () => {
  const mockMessages = [
    { role: 'agent', content: 'Hello, how can I help you today?', timestamp: new Date() },
    { role: 'customer', content: 'My account is locked', timestamp: new Date() },
    { role: 'agent', content: 'I\'ll help you unlock it right away', timestamp: new Date() }
  ];

  const analysis = await analyzeConversation(mockMessages);
  expect(analysis).toBeDefined();
  expect(typeof analysis).toBe('string');
});