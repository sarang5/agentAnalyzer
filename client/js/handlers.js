// Event handlers for UI interactions
import state from './state.js';
import { startConversation, addMessage, endConversation } from './api.js';
import { AudioRecorder } from './audioRecorder.js';

const audioRecorder = new AudioRecorder();

export async function handleStart() {
  state.currentConversationId = await startConversation();
  document.getElementById('messageControls').style.display = 'block';
  document.getElementById('startBtn').disabled = true;
}

export async function handleMessage(role) {
  const content = document.getElementById('messageInput').value;
  if (!content.trim()) return;
  
  await addMessage(state.currentConversationId, role, content);
  document.getElementById('messageInput').value = '';
}

export async function handleRecord(role) {
  const button = document.getElementById(`record${role.charAt(0).toUpperCase() + role.slice(1)}Btn`);
  
  if (!state.isRecording) {
    try {
      await audioRecorder.start();
      state.isRecording = true;
      state.recordingRole = role;
      button.classList.add('recording');
      button.textContent = `Stop Recording ${role}`;
    } catch (error) {
      console.error('Failed to start recording:', error);
      alert('Failed to start recording. Please ensure microphone access is granted.');
    }
  } else if (state.recordingRole === role) {
    const audioBlob = await audioRecorder.stop();
    state.isRecording = false;
    state.recordingRole = null;
    button.classList.remove('recording');
    button.textContent = `Record ${role}`;

    const formData = new FormData();
    formData.append('audio', audioBlob);
    formData.append('role', role);

    try {
      const response = await fetch(`/api/conversation/${state.currentConversationId}/audio`, {
        method: 'POST',
        body: formData
      });
      console.log('--res ', response)
      const data = await response.json();
      
      if (data.success) {
        document.getElementById('transcript').textContent = `Transcription: ${data.transcription}`;
      } else {
        throw new Error(data.error);
      }
    } catch (error) {
      console.error('Failed to send audio:', error);
      alert('Failed to process audio recording.');
    }
  }
}

export async function handleEnd() {
  if (state.isRecording) {
    await audioRecorder.stop();
    state.isRecording = false;
    state.recordingRole = null;
    document.getElementById(`record${state.recordingRole.charAt(0).toUpperCase() + state.recordingRole.slice(1)}Btn`)
      .classList.remove('recording');
  }

  document.getElementById('endBtn').disabled = true;
  document.getElementById('loading').style.display = 'block';

  const report = await endConversation(state.currentConversationId);
  console.log('--rep ', report)
  const summary = `${(report && report.analysis) || ''}`
  document.getElementById('analysis-report').innerText = summary;

  const metrics = `${JSON.stringify(report.conversationMetrics || {}, null, 2)}`
  document.getElementById('report').textContent = metrics
  document.getElementById('messageControls').style.display = 'none';
  document.getElementById('startBtn').disabled = false;
  document.getElementById('transcript').textContent = '';
  state.currentConversationId = null;

  document.getElementById('loading').style.display = 'none';
  document.getElementById('endBtn').disabled = false;
}