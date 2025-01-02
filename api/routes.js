import express from 'express';
import { analyzeConversation } from '../src/analyzer.js';
import { generateReport } from '../src/reportGenerator.js';
import { transcribeAudio } from '../src/services/audioTranscription.js';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const router = express.Router();
const conversations = new Map();

// Configure multer for handling audio files
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit
  }
});

router.get('/api', (req, res) => {
  res.json({
    message: 'Support Call Analyzer API',
    endpoints: {
      'POST /api/conversation/start': 'Start a new conversation',
      'POST /api/conversation/:id/message': 'Add a message to conversation',
      'POST /api/conversation/:id/audio': 'Add audio message to conversation',
      'POST /api/conversation/:id/end': 'End conversation and get analysis'
    }
  });
});

router.post('/api/conversation/start', (req, res) => {
  const conversationId = Date.now().toString();
  conversations.set(conversationId, {
    messages: [],
    startTime: new Date(),
    agentId: req.body.agentId || 'default-agent',
    customerId: req.body.customerId || 'default-customer'
  });
  res.json({ conversationId });
});

router.post('/api/conversation/:id/message', (req, res) => {
  const conversation = conversations.get(req.params.id);
  if (!conversation) {
    return res.status(404).json({ error: 'Conversation not found' });
  }

  conversation.messages.push({
    role: req.body.role,
    content: req.body.content,
    timestamp: new Date()
  });

  res.json({ success: true });
});

router.post('/api/conversation/:id/audio', upload.single('audio'), async (req, res) => {
  try {
    const conversation = conversations.get(req.params.id);
    if (!conversation) {
      return res.status(404).json({ error: 'Conversation not found' });
    }

    if (!req.file) {
      return res.status(400).json({ error: 'No audio file provided' });
    }

    // Log the incoming file details for debugging
    console.log('Received audio file:', {
      mimetype: req.file.mimetype,
      size: req.file.size,
      role: req.body.role
    });

    const transcription = await transcribeAudio(req.file.buffer);
    
    conversation.messages.push({
      role: req.body.role,
      content: transcription,
      timestamp: new Date(),
      type: 'audio'
    });

    res.json({ 
      success: true,
      transcription 
    });
  } catch (error) {
    console.error('Audio processing error:', error);
    res.status(500).json({ 
      error: 'Failed to process audio',
      details: error.message 
    });
  }
});

router.post('/api/conversation/:id/end', async (req, res) => {
  const conversation = conversations.get(req.params.id);
  if (!conversation) {
    return res.status(404).json({ error: 'Conversation not found' });
  }

  try {
    const analysis = await analyzeConversation(conversation.messages);
    const report = generateReport(analysis, conversation);
    conversations.delete(req.params.id);
    res.json({ report });
  } catch (error) {
    console.error('Analysis error:', error);
    res.status(500).json({ 
      error: 'Failed to analyze conversation',
      details: error.message 
    });
  }
});

export { router };