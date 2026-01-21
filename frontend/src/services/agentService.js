import api from './api';

export const agentService = {
  // Query AI agent
  async queryAgent(query, threadId = 'default_thread') {
    return api.post('/agent/query', {
      query,
      thread_id: threadId,
    });
  },

  // Get thread history (placeholder)
  async getThreadHistory(threadId) {
    return api.get(`/agent/threads/${threadId}`);
  },
};
