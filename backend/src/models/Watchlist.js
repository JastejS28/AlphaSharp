import mongoose from 'mongoose';

const watchlistSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    stocks: [
      {
        ticker: {
          type: String,
          required: true,
          uppercase: true,
        },
        addedAt: {
          type: Date,
          default: Date.now,
        },
        notes: {
          type: String,
          trim: true,
        },
      },
    ],
    isDefault: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// Compound index
watchlistSchema.index({ user: 1, name: 1 }, { unique: true });

// Methods
watchlistSchema.methods.addStock = function (ticker, notes = '') {
  const exists = this.stocks.some(
    (stock) => stock.ticker === ticker.toUpperCase()
  );
  
  if (!exists) {
    this.stocks.push({
      ticker: ticker.toUpperCase(),
      notes,
    });
  }
  
  return this.save();
};

watchlistSchema.methods.removeStock = function (ticker) {
  this.stocks = this.stocks.filter(
    (stock) => stock.ticker !== ticker.toUpperCase()
  );
  
  return this.save();
};

const Watchlist = mongoose.model('Watchlist', watchlistSchema);

export default Watchlist;
