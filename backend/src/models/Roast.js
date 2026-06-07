import mongoose from 'mongoose';

const roastSchema = new mongoose.Schema({
  url: {
    type: String,
    required: true,
    trim: true,
    maxlength: 2048
  },
  domain: {
    type: String,
    required: true
  },
  favicon: {
    type: String,
    default: null
  },
  pageTitle: {
    type: String,
    default: null
  },
  summary: {
    type: String,
    required: true
  },
  roast: {
    type: String,
    required: true
  },
  verdict: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now,
    index: true
  }
});

// Add compound index
roastSchema.index({ url: 1, createdAt: -1 });

// Add instance method toPublic()
roastSchema.methods.toPublic = function () {
  return {
    id: this._id.toString(),
    url: this.url,
    domain: this.domain,
    favicon: this.favicon,
    pageTitle: this.pageTitle,
    summary: this.summary,
    roast: this.roast,
    verdict: this.verdict,
    createdAt: this.createdAt
  };
};

const Roast = mongoose.model('Roast', roastSchema);
export default Roast;
