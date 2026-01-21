import mongoose from 'mongoose';

const marketRegimeSchema = new mongoose.Schema(
  {
    date: {
      type: Date,
      required: true,
      index: true,
    },
    regimeId: {
      type: Number,
      required: false,
      min: 0,
      max: 8,
    },
    regimeLabel: {
      type: String,
      required: false,
    },
    spxPrice: {
      type: Number,
      required: false,
    },
    vixLevel: {
      type: Number,
      required: false,
    },
    characteristics: {
      expectedReturn: Number,
      expectedVolatility: Number,
      averageDuration: Number,
      riskLevel: String,
      trend: String,
    },
    features: {
      type: mongoose.Schema.Types.Mixed,
    },
    expiresAt: {
      type: Date,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// TTL index
marketRegimeSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

// Static methods
marketRegimeSchema.statics.findLatestRegime = async function () {
  return this.findOne({ expiresAt: { $gt: new Date() } })
    .sort({ date: -1 });
};

marketRegimeSchema.statics.setCurrentRegime = async function (regimeData, ttlSeconds) {
  const expiresAt = new Date(Date.now() + ttlSeconds * 1000);
  
  // Prepare data with defaults
  const dataToStore = {
    date: regimeData.date || new Date(),
    regimeId: regimeData.regime_id || regimeData.regimeId || 0,
    regimeLabel: regimeData.current_regime || regimeData.regime_name || regimeData.regimeLabel || 'Unknown',
    spxPrice: regimeData.spx_price || regimeData.spxPrice || 0,
    vixLevel: regimeData.vix_level || regimeData.vixLevel || 0,
    characteristics: regimeData.characteristics || {},
    features: regimeData.features || {},
    expiresAt,
  };
  
  return this.create(dataToStore);
};

const MarketRegime = mongoose.model('MarketRegime', marketRegimeSchema);

export default MarketRegime;
