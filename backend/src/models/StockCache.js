import mongoose from 'mongoose';

const stockCacheSchema = new mongoose.Schema(
  {
    ticker: {
      type: String,
      required: true,
      uppercase: true,
      index: true,
    },
    endpoint: {
      type: String,
      required: true,
      enum: ['analysis', 'news'],
      index: true,
    },
    data: {
      type: mongoose.Schema.Types.Mixed,
      required: true,
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

// Compound index for efficient lookup
stockCacheSchema.index({ ticker: 1, endpoint: 1 });

// TTL index - MongoDB will automatically delete expired documents
stockCacheSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

// Static methods
stockCacheSchema.statics.findValidCache = async function (ticker, endpoint) {
  return this.findOne({
    ticker: ticker.toUpperCase(),
    endpoint,
    expiresAt: { $gt: new Date() },
  });
};

stockCacheSchema.statics.setCache = async function (ticker, endpoint, data, ttlSeconds) {
  const expiresAt = new Date(Date.now() + ttlSeconds * 1000);
  
  return this.findOneAndUpdate(
    { ticker: ticker.toUpperCase(), endpoint },
    { data, expiresAt },
    { upsert: true, new: true }
  );
};

const StockCache = mongoose.model('StockCache', stockCacheSchema);

export default StockCache;
