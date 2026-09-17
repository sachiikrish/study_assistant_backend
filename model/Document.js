const mongoose = require("mongoose");

const documentSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    required: true
  },
  ocrText: {
    type: String,
    required: true
  },
  createdAt: Date

});

const Document = mongoose.model("document", documentSchema);

module.exports = Document;
