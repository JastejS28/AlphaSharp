export default function PeerComparison({ peers }) {
  if (!peers || peers.length === 0) {
    return null;
  }

  return (
    <div className="bg-gray-900/50 rounded-lg p-6 border border-white/10">
      <h3 className="text-xl font-semibold mb-4 text-white">Peer Comparison</h3>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-white/10">
              <th className="text-left py-3 px-4 text-sm font-semibold text-white">Company</th>
              <th className="text-left py-3 px-4 text-sm font-semibold text-white">Ticker</th>
              <th className="text-right py-3 px-4 text-sm font-semibold text-white">Market Cap</th>
              <th className="text-right py-3 px-4 text-sm font-semibold text-white">P/E Ratio</th>
              <th className="text-right py-3 px-4 text-sm font-semibold text-white">Sector</th>
            </tr>
          </thead>
          <tbody>
            {peers.map((peer, index) => (
              <tr key={index} className="border-b border-white/10 hover:bg-gray-800/50">
                <td className="py-3 px-4 text-sm text-white">{peer.name || 'N/A'}</td>
                <td className="py-3 px-4 text-sm font-medium text-cyan-400">{peer.ticker}</td>
                <td className="py-3 px-4 text-sm text-white text-right">
                  {peer.market_cap ? 
                    new Intl.NumberFormat('en-US', { 
                      style: 'currency', 
                      currency: 'USD',
                      notation: 'compact',
                      maximumFractionDigits: 1
                    }).format(peer.market_cap) 
                    : 'N/A'}
                </td>
                <td className="py-3 px-4 text-sm text-white text-right">
                  {peer.pe_ratio || 'N/A'}
                </td>
                <td className="py-3 px-4 text-sm text-gray-400 text-right">{peer.sector || 'N/A'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
