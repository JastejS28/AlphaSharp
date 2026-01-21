import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema(
  {
    // OAuth fields (optional for manual signup)
    googleId: {
      type: String,
      sparse: true, // Allows null/undefined, but must be unique if present
      index: true,
    },
    // Email/Password fields
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      select: false, // Don't return password by default
      minlength: 6,
    },
    name: {
      type: String,
      required: true,
    },
    avatar: {
      type: String,
    },
    // Auth method tracking
    authProvider: {
      type: String,
      enum: ['google', 'local'],
      default: 'local',
    },
    // Email verification for manual signup
    isEmailVerified: {
      type: Boolean,
      default: false, // Set to true for OAuth, false for manual
    },
    lastLogin: {
      type: Date,
      default: Date.now,
    },
    preferences: {
      defaultWatchlist: {
        type: String,
        default: 'My Watchlist',
      },
      theme: {
        type: String,
        enum: ['light', 'dark'],
        default: 'light',
      },
    },
  },
  {
    timestamps: true,
  }
);

// Virtual for user's watchlists
userSchema.virtual('watchlists', {
  ref: 'Watchlist',
  localField: '_id',
  foreignField: 'user',
});

// Hash password before saving (only if password is modified)
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    return next();
  }
  
  // Only hash if password exists (for OAuth users, password is null)
  if (this.password) {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
  }
  
  next();
});

// Methods
userSchema.methods.toJSON = function () {
  const user = this.toObject();
  delete user.__v;
  delete user.password; // Never expose password
  return user;
};

// Compare password method
userSchema.methods.comparePassword = async function (candidatePassword) {
  if (!this.password) {
    return false; // OAuth users don't have passwords
  }
  return await bcrypt.compare(candidatePassword, this.password);
};

const User = mongoose.model('User', userSchema);

export default User;
