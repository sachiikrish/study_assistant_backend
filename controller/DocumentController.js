const Document = require("../model/Document");

// Create a new document
const createDocument = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { title, ocrText } = req.body;

    if (!title || !ocrText) {
      return res.status(400).json({
        message: "Title and OCR text are required.",
      });
    }

    const document = new Document({
      userId,
      title,
      ocrText,
      createdAt: new Date(),
    });

    await document.save();

    return res.status(201).json({
      message: "Document created successfully.",
      document,
    });
  } catch (error) {
    console.error("Error creating document:", error);

    return res.status(500).json({
      message: "Failed to create document.",
      error: error.message,
    });
  }
};


// Get all documents of the logged-in user
const getDocuments = async (req, res) => {
  try {
    const userId = req.user.userId;

    const documents = await Document.find({ userId }).sort({
      createdAt: -1,
    });

    return res.status(200).json({
      message: "Documents fetched successfully.",
      documents,
    });
  } catch (error) {
    console.error("Error fetching documents:", error);

    return res.status(500).json({
      message: "Failed to fetch documents.",
      error: error.message,
    });
  }
};


// Get one document of the logged-in user
const getDocumentById = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { id } = req.params;

    const document = await Document.findOne({
      _id: id,
      userId,
    });

    if (!document) {
      return res.status(404).json({
        message: "Document not found.",
      });
    }

    return res.status(200).json({
      message: "Document fetched successfully.",
      document,
    });
  } catch (error) {
    console.error("Error fetching document:", error);

    return res.status(500).json({
      message: "Failed to fetch document.",
      error: error.message,
    });
  }
};


// Delete one document of the logged-in user
const deleteDocument = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { id } = req.params;

    const document = await Document.findOneAndDelete({
      _id: id,
      userId,
    });

    if (!document) {
      return res.status(404).json({
        message: "Document not found.",
      });
    }

    return res.status(200).json({
      message: "Document deleted successfully.",
    });
  } catch (error) {
    console.error("Error deleting document:", error);

    return res.status(500).json({
      message: "Failed to delete document.",
      error: error.message,
    });
  }
};


module.exports = {
  createDocument,
  getDocuments,
  getDocumentById,
  deleteDocument,
};