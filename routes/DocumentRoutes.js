const Router = require("express").Router;

const documentRouter = Router();

const {
  createDocument,
  getDocuments,
  getDocumentById,
  deleteDocument,
} = require("../controller/DocumentController");

const authMiddleware = require("../middleware/authMiddleware");

// Create a document
documentRouter.post("/", authMiddleware, createDocument);

// Get all documents of logged-in user
documentRouter.get("/", authMiddleware, getDocuments);

// Get one document
documentRouter.get("/:id", authMiddleware, getDocumentById);

// Delete one document
documentRouter.delete("/:id", authMiddleware, deleteDocument);

module.exports = documentRouter;