const mongoose = require('mongoose');

let ThoughtModel = {};

const ThoughtSchema = new mongoose.Schema({
  latitude: {
    type: Number,
    required: true,
  },
  longitude: {
    type: Number,
    required: true,
  },
  username: {
    type: String,
    required: true,
    match: /^[A-Za-z0-9_\-.]{3,16}$/,
  },
  ownerId: {
    type: mongoose.Schema.ObjectId,
    required: true,
    ref: 'Account',
  },
  pubBool: {
    type: Boolean,
    required: true,
  },
  text: {
    type: String,
    required: true,
    trim: true,
  },
  createdDate: {
    type: Date,
    default: Date.now,
  },
});

ThoughtSchema.statics.toAPI = (doc) => ({
  username: doc.username,
  latitude: doc.latitude,
  longitude: doc.longitude,
  pubBool: doc.pubBool,
  text: doc.text,
});

ThoughtSchema.statics.findByOwner = (ownerId, callback) => {
  const search = {
    ownerId: mongoose.Types.ObjectId(ownerId),
  };

  return ThoughtModel.find(search).select('latitude longitude pubBool text username createdDate').lean().exec(callback);
};

ThoughtSchema.statics.findAllPublic = (callback) => {
  const search = {
    pubBool: true,
  };

  return ThoughtModel.find(search).select('latitude longitude pubBool text username createdDate').lean().exec(callback);
};

ThoughtSchema.statics.findAdPoints = (callback) => {
  const search = {
    username: 'AdNetworkAdmin',
  };
  return ThoughtModel.find(search).select('latitude longitude pubBool text username createdDate').lean().exec(callback);
};

ThoughtModel = mongoose.model('Thought', ThoughtSchema);
module.exports = ThoughtModel;
