import { useState, useEffect } from 'react';
import { Activity, TrendingUp, Search, Briefcase, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function ActivityFeed() {
  const [activities, setActivities] = useState([]);

  useEffect(() => {
    // Load activities from localStorage
    const savedActivities = localStorage.getItem('user_activities');
    if (savedActivities) {
      setActivities(JSON.parse(savedActivities));
    }
  }, []);

  const getActivityIcon = (type) => {
    switch (type) {
      case 'portfolio':
        return <Briefcase className="w-4 h-4" />;
      case 'watchlist':
        return <TrendingUp className="w-4 h-4" />;
      case 'search':
        return <Search className="w-4 h-4" />;
      default:
        return <Activity className="w-4 h-4" />;
    }
  };

  const getActivityColor = (type) => {
    switch (type) {
      case 'portfolio':
        return 'bg-green-500/20 text-green-400';
      case 'watchlist':
        return 'bg-cyan-500/20 text-cyan-400';
      case 'search':
        return 'bg-blue-500/20 text-blue-400';
      default:
        return 'bg-gray-700 text-gray-400';
    }
  };

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  };

  if (activities.length === 0) {
    return (
      <div className="bg-gray-900/50 rounded-lg p-6 border border-white/10">
        <div className="flex items-center gap-2 mb-4">
          <Activity className="w-5 h-5 text-cyan-400" />
          <h3 className="text-lg font-semibold text-white">Recent Activity</h3>
        </div>
        
        <div className="text-center py-8">
          <div className="w-16 h-16 bg-gray-900/50 rounded-full flex items-center justify-center mx-auto mb-4">
            <Clock className="w-8 h-8 text-gray-400" />
          </div>
          <p className="text-gray-400 mb-2">No recent activity</p>
          <p className="text-sm text-gray-500">
            Your actions will appear here
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-900/50 rounded-lg p-6 border border-white/10">
      <div className="flex items-center gap-2 mb-4">
        <Activity className="w-5 h-5 text-cyan-400" />
        <h3 className="text-lg font-semibold text-white">Recent Activity</h3>
      </div>

      <div className="space-y-3">
        {activities.slice(0, 8).map((activity) => (
          <div
            key={activity.id}
            className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-800/50 transition-colors"
          >
            <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${getActivityColor(activity.type)}`}>
              {getActivityIcon(activity.type)}
            </div>
            
            <div className="flex-1 min-w-0">
              <p className="text-sm text-white">
                {activity.description}
              </p>
              {activity.ticker && (
                <Link
                  to={`/stock/${activity.ticker}`}
                  className="text-xs text-cyan-400 hover:text-cyan-300 font-medium"
                >
                  {activity.ticker}
                </Link>
              )}
              <p className="text-xs text-gray-400 mt-1">
                {formatTime(activity.timestamp)}
              </p>
            </div>
          </div>
        ))}
      </div>

      {activities.length > 8 && (
        <div className="mt-4 pt-4 border-t border-white/10 text-center">
          <button className="text-sm text-cyan-400 hover:text-cyan-300">
            View All Activity
          </button>
        </div>
      )}
    </div>
  );
}

// Helper function to log activity (export for use in other components)
export const logActivity = (type, description, ticker = null) => {
  const activity = {
    id: Date.now(),
    type,
    description,
    ticker,
    timestamp: new Date().toISOString(),
  };

  const saved = localStorage.getItem('user_activities');
  const activities = saved ? JSON.parse(saved) : [];
  activities.unshift(activity);

  // Keep only last 50 activities
  const trimmed = activities.slice(0, 50);
  localStorage.setItem('user_activities', JSON.stringify(trimmed));
};
