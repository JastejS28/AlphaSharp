import mongoose from 'mongoose';

const searchHistorySchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    ticker: {
      type: String,
      required: true,
      uppercase: true,
    },
    companyName: {
      type: String,
    },
    searchCount: {
      type: Number,
      default: 1,
    },
    lastSearched: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

// Compound index
searchHistorySchema.index({ user: 1, ticker: 1 }, { unique: true });
searchHistorySchema.index({ user: 1, lastSearched: -1 });

// Static methods
searchHistorySchema.statics.recordSearch = async function (userId, ticker, companyName) {
  return this.findOneAndUpdate(
    { user: userId, ticker: ticker.toUpperCase() },
    {
      companyName,
      $inc: { searchCount: 1 },
      lastSearched: new Date(),
    },
    { upsert: true, new: true }
  );
};

searchHistorySchema.statics.getRecentSearches = async function (userId, limit = 10) {
  return this.find({ user: userId })
    .sort({ lastSearched: -1 })
    .limit(limit);
};

const SearchHistory = mongoose.model('SearchHistory', searchHistorySchema);

export default SearchHistory;
