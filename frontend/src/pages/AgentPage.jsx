import { useState } from 'react';
import ChatInterface from '../components/agent/ChatInterface';
import ConversationHistory from '../components/agent/ConversationHistory';
import { Brain, MessageSquare } from 'lucide-react';

export default function AgentPage() {
  const [currentThreadId, setCurrentThreadId] = useState(`thread_${Date.now()}`);
  const [showHistory, setShowHistory] = useState(false);

  const handleSelectThread = (threadId) => {
    setCurrentThreadId(threadId);
    setShowHistory(false);
  };

  return (
    <div className="min-h-screen bg-black p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-xl flex items-center justify-center">
              <Brain className="w-7 h-7 text-black" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white">
                AI Financial Agent
              </h1>
              <p className="text-gray-400">
                Get intelligent insights powered by advanced market analysis
              </p>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Chat Interface */}
          <div className="lg:col-span-2">
            <ChatInterface key={currentThreadId} threadId={currentThreadId} />
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Toggle History on Mobile */}
            <button
              onClick={() => setShowHistory(!showHistory)}
              className="lg:hidden w-full flex items-center justify-center gap-2 px-4 py-2 bg-cyan-500 text-black rounded-lg hover:bg-cyan-400 transition-colors"
            >
              <MessageSquare className="w-5 h-5" />
              {showHistory ? 'Hide' : 'Show'} History
            </button>

            {/* Conversation History */}
            <div className={`${showHistory ? 'block' : 'hidden'} lg:block`}>
              <ConversationHistory
                onSelectThread={handleSelectThread}
                currentThreadId={currentThreadId}
              />
            </div>

            {/* Quick Tips */}
            <div className="bg-gray-900/50 rounded-lg p-6 border border-cyan-500/20">
              <h3 className="font-semibold text-white mb-3">
                💡 Quick Tips
              </h3>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>• Ask for stock analysis: "Analyze AAPL"</li>
                <li>• Get market insights: "Current market conditions?"</li>
                <li>• Request forecasts: "What's the SPX forecast?"</li>
                <li>• Compare stocks: "Compare TSLA vs F"</li>
                <li>• Get news: "Latest tech sector news"</li>
              </ul>
            </div>

            {/* Agent Features */}
            <div className="bg-gray-900/50 rounded-lg p-6 border border-white/10">
              <h3 className="font-semibold text-white mb-3">
                🤖 Agent Capabilities
              </h3>
              <ul className="space-y-2 text-sm text-gray-400">
                <li className="flex items-start gap-2">
                  <span className="text-cyan-400 mt-0.5">✓</span>
                  <span>Real-time market data analysis</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-cyan-400 mt-0.5">✓</span>
                  <span>Technical indicator insights</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-cyan-400 mt-0.5">✓</span>
                  <span>News sentiment analysis</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-cyan-400 mt-0.5">✓</span>
                  <span>Market regime forecasting</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-cyan-400 mt-0.5">✓</span>
                  <span>Multi-stock comparisons</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
