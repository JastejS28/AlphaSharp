import { ExternalLink, Clock } from 'lucide-react';

export default function NewsCard({ articles }) {
  if (!articles || articles.length === 0) {
    return (
      <div className="bg-gray-900/50 rounded-lg p-6 border border-white/10">
        <h3 className="text-xl font-semibold mb-4 text-white">Latest News</h3>
        <p className="text-gray-400">No news available</p>
      </div>
    );
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  };

  return (
    <div className="bg-gray-900/50 rounded-lg p-6 border border-white/10">
      <h3 className="text-xl font-semibold mb-4 text-white">Latest News</h3>
      <div className="space-y-4">
        {articles.map((article, index) => (
          <a
            key={index}
            href={article.url || article.link}
            target="_blank"
            rel="noopener noreferrer"
            className="block p-4 bg-gray-800/50 rounded-lg hover:bg-gray-700/50 transition-colors border border-white/10"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <h4 className="font-semibold text-white mb-2 line-clamp-2">
                  {article.title || article.headline}
                </h4>
                {(article.summary || article.description) && (
                  <p className="text-sm text-gray-400 mb-2 line-clamp-2">
                    {article.summary || article.description}
                  </p>
                )}
                <div className="flex items-center gap-4 text-xs text-gray-500">
                  {(article.source || article.publisher) && (
                    <span className="font-medium">{article.source || article.publisher}</span>
                  )}
                  {(article.published_at || article.published || article.date) && (
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {formatDate(article.published_at || article.published || article.date)}
                    </span>
                  )}
                </div>
              </div>
              <ExternalLink className="w-5 h-5 text-cyan-400 flex-shrink-0" />
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}
