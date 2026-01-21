import { CHART_DEFAULTS, REGIME_COLORS } from './constants';

export const createPriceChartConfig = (labels, data, options = {}) => {
  return {
    type: 'line',
    data: {
      labels,
      datasets: [
        {
          label: 'Price',
          data,
          borderColor: '#2563eb',
          backgroundColor: 'rgba(37, 99, 235, 0.1)',
          borderWidth: 2,
          fill: true,
          tension: 0.4,
          pointRadius: 0,
          pointHoverRadius: 5,
        },
      ],
    },
    options: {
      ...CHART_DEFAULTS,
      ...options,
      plugins: {
        ...CHART_DEFAULTS.plugins,
        ...options.plugins,
      },
    },
  };
};


export const createRegimeTimelineConfig = (history) => {
  const labels = history.map((item) => item.date);
  const prices = history.map((item) => item.spxPrice);
  const regimes = history.map((item) => item.regimeId);

  const backgroundColors = regimes.map((regimeId) => {
    const color = REGIME_COLORS[regimeId]?.bg || '#94a3b8';
    return color + '20'; 
  });

  return {
    type: 'line',
    data: {
      labels,
      datasets: [
        {
          label: 'S&P 500 Price',
          data: prices,
          borderColor: '#2563eb',
          borderWidth: 2,
          fill: true,
          backgroundColor: (context) => {
            const index = context.dataIndex;
            return backgroundColors[index] || 'rgba(37, 99, 235, 0.1)';
          },
          tension: 0.1,
          pointRadius: 0,
          pointHoverRadius: 5,
        },
      ],
    },
    options: {
      ...CHART_DEFAULTS,
      plugins: {
        ...CHART_DEFAULTS.plugins,
        tooltip: {
          callbacks: {
            afterLabel: (context) => {
              const regimeId = regimes[context.dataIndex];
              const regimeName = REGIME_COLORS[regimeId]?.name || 'Unknown';
              return `Regime: ${regimeName}`;
            },
          },
        },
      },
    },
  };
};

export const createForecastChartConfig = (forecast) => {
  const labels = Array.from({ length: forecast.days }, (_, i) => `Day ${i + 1}`);

  const datasets = [];

  if (forecast.mean_price_path) {
    datasets.push({
      label: 'Expected Price',
      data: forecast.mean_price_path,
      borderColor: '#2563eb',
      backgroundColor: 'rgba(37, 99, 235, 0.1)',
      borderWidth: 3,
      fill: false,
      tension: 0.3,
      pointRadius: 0,
    });
  }

  if (forecast.confidence_90) {
    datasets.push({
      label: '90% Confidence Upper',
      data: Array(forecast.days).fill(forecast.confidence_90.upper),
      borderColor: '#10b981',
      borderWidth: 1,
      borderDash: [5, 5],
      fill: false,
      pointRadius: 0,
    });

    datasets.push({
      label: '90% Confidence Lower',
      data: Array(forecast.days).fill(forecast.confidence_90.lower),
      borderColor: '#ef4444',
      borderWidth: 1,
      borderDash: [5, 5],
      fill: false,
      pointRadius: 0,
    });
  }

  return {
    type: 'line',
    data: { labels, datasets },
    options: {
      ...CHART_DEFAULTS,
      plugins: {
        ...CHART_DEFAULTS.plugins,
        legend: {
          display: true,
          position: 'top',
        },
      },
    },
  };
};

export const createVolatilityChartConfig = (labels, volatilityData) => {
  return {
    type: 'bar',
    data: {
      labels,
      datasets: [
        {
          label: 'Volatility',
          data: volatilityData,
          backgroundColor: 'rgba(251, 146, 60, 0.5)',
          borderColor: '#fb923c',
          borderWidth: 1,
        },
      ],
    },
    options: {
      ...CHART_DEFAULTS,
      plugins: {
        ...CHART_DEFAULTS.plugins,
      },
    },
  };
};
