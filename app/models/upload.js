'use strict';

const mongoose = require('mongoose');

const uploadSchema = new mongoose.Schema({
  // what about validating upload size
  comment: {
    type: String,
    required: true,
  },
  location: {
    type: String,
    required: true
  }
}, {
    timestamps: true,
});

uploadSchema.virtual('length').get(function() {
  // what is text?
  return this.text.length;
});

const Upload = mongoose.model('Upload', uploadSchema); //how mongoose relates

module.exports = Upload;
