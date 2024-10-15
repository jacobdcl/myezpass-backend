const mongoose = require('mongoose');
const crypto = require('crypto');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  salt: String
});

// Hash password before saving
userSchema.pre('save', function(next) {
  if (!this.isModified('password')) return next();
  this.salt = crypto.randomBytes(16).toString('hex');
  this.password = crypto.pbkdf2Sync(this.password, this.salt, 1000, 64, 'sha512').toString('hex');
  next();
});

// Compare password method
userSchema.methods.comparePassword = function(candidatePassword) {
  const hash = crypto.pbkdf2Sync(candidatePassword, this.salt, 1000, 64, 'sha512').toString('hex');
  return this.password === hash;
};

module.exports = mongoose.model('User', userSchema);
