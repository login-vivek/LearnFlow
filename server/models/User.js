const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

/**
 * User Model
 *
 * Phase 1: Core authentication fields + basic learning preferences.
 * Future phases will extend this with:
 *   - knowledgeProfile (Phase 3)
 *   - progressHistory  (Phase 3)
 *   - recommendations  (Phase 4)
 *   - spacedRepetition (Phase 6)
 */
const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
      maxlength: [100, 'Name cannot exceed 100 characters'],
    },

    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email address'],
    },

    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [6, 'Password must be at least 6 characters'],
      select: false, // never returned in queries by default
    },

    avatar: {
      type: String,
      default: '',
    },

    // Learning preferences — populated during onboarding (Phase 2)
    learningGoals: {
      type: [String],
      default: [],
    },

    preferredFormats: {
      type: [String],
      enum: ['video', 'article', 'interactive', 'quiz', 'podcast'],
      default: [],
    },

    // Phase 2+: will be extended with topic/skill references
    // Phase 3+: knowledgeProfile subdocument
    // Phase 4+: recommendation metadata
  },
  {
    timestamps: true, // adds createdAt and updatedAt
  }
);

// ---------------------------------------------------------------------------
// Hash password before saving
// ---------------------------------------------------------------------------
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();

  const salt = await bcrypt.genSalt(12);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// ---------------------------------------------------------------------------
// Instance method: compare candidate password with stored hash
// ---------------------------------------------------------------------------
userSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

// ---------------------------------------------------------------------------
// Instance method: return a safe public representation of the user
// ---------------------------------------------------------------------------
userSchema.methods.toPublicJSON = function () {
  return {
    _id: this._id,
    name: this.name,
    email: this.email,
    avatar: this.avatar,
    learningGoals: this.learningGoals,
    preferredFormats: this.preferredFormats,
    createdAt: this.createdAt,
    updatedAt: this.updatedAt,
  };
};

const User = mongoose.model('User', userSchema);

module.exports = User;
