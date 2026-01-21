import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

export default function ShortTermPrediction({ predictionData }) {
  if (!predictionData) return null;

  const { prediction, confidence, expected_return, risk_level } = predictionData;

  const getPredictionColor = () => {
    if (prediction === 'bullish' || prediction === 'up') return 'text-green-600 bg-green-50 border-green-200';
    if (prediction === 'bearish' || prediction === 'down') return 'text-red-600 bg-red-50 border-red-200';
    return 'text-gray-600 bg-gray-50 border-gray-200';
  };

  const getPredictionIcon = () => {
    if (prediction === 'bullish' || prediction === 'up') return <TrendingUp className="w-8 h-8" />;
    if (prediction === 'bearish' || prediction === 'down') return <TrendingDown className="w-8 h-8" />;
    return <Minus className="w-8 h-8" />;
  };

  const getRiskColor = () => {
    if (risk_level === 'high') return 'text-red-600';
    if (risk_level === 'medium') return 'text-yellow-600';
    return 'text-green-600';
  };

  return (
    <div className="bg-white rounded-lg p-6 border border-gray-200">
      <h3 className="text-xl font-semibold mb-4 text-gray-800">Short-term Prediction</h3>
      
      <div className={`p-6 rounded-lg border-2 ${getPredictionColor()}`}>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-4">
            {getPredictionIcon()}
            <div>
              <h4 className="text-2xl font-bold capitalize">{prediction}</h4>
              {confidence && (
                <p className="text-sm opacity-75">
                  Confidence: {(confidence * 100).toFixed(1)}%
                </p>
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mt-4">
          {expected_return && (
            <div className="bg-white bg-opacity-50 p-3 rounded">
              <p className="text-sm opacity-75 mb-1">Expected Return</p>
              <p className="text-lg font-semibold">
                {expected_return > 0 ? '+' : ''}{(expected_return * 100).toFixed(2)}%
              </p>
            </div>
          )}
          
          {risk_level && (
            <div className="bg-white bg-opacity-50 p-3 rounded">
              <p className="text-sm opacity-75 mb-1">Risk Level</p>
              <p className={`text-lg font-semibold capitalize ${getRiskColor()}`}>
                {risk_level}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
