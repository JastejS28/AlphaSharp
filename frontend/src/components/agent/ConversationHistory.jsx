import { useState, useEffect } from 'react';
import { MessageSquare, Clock, Trash2 } from 'lucide-react';

export default function ConversationHistory({ onSelectThread, currentThreadId }) {
  const [conversations, setConversations] = useState([]);

  useEffect(() => {
    // Load conversations from localStorage
    const saved = localStorage.getItem('agent_conversations');
    if (saved) {
      setConversations(JSON.parse(saved));
    }
  }, []);

  const deleteConversation = (threadId) => {
    const updated = conversations.filter(c => c.threadId !== threadId);
    setConversations(updated);
    localStorage.setItem('agent_conversations', JSON.stringify(updated));
  };

  if (conversations.length === 0) {
    return (
      <div className="bg-gray-900/50 rounded-lg p-6 border border-white/10 text-center">
        <MessageSquare className="w-12 h-12 text-gray-600 mx-auto mb-3" />
        <p className="text-gray-400">No conversation history yet</p>
      </div>
    );
  }

  return (
    <div className="bg-gray-900/50 rounded-lg border border-white/10">
      <div className="p-4 border-b border-white/10">
        <h3 className="font-semibold text-white">Recent Conversations</h3>
      </div>
      
      <div className="divide-y divide-white/10">
        {conversations.map((conv) => (
          <div
            key={conv.threadId}
            className={`p-4 hover:bg-gray-800/50 cursor-pointer transition-colors ${
              currentThreadId === conv.threadId ? 'bg-cyan-500/20' : ''
            }`}
            onClick={() => onSelectThread(conv.threadId)}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1">
                <p className="font-medium text-white line-clamp-1">
                  {conv.title || conv.firstMessage}
                </p>
                <div className="flex items-center gap-2 mt-1 text-sm text-gray-400">
                  <Clock className="w-4 h-4" />
                  {new Date(conv.lastActivity).toLocaleDateString()}
                </div>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  deleteConversation(conv.threadId);
                }}
                className="p-1 hover:bg-red-500/20 rounded transition-colors"
              >
                <Trash2 className="w-4 h-4 text-red-500" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
