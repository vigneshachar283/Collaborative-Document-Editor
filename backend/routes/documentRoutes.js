const express = require("express");



const router = express.Router();

const {
    createDocument,
    getDocuments,
    getDocumentById,
    updateDocument,
    deleteDocument
} = require("../controllers/documentController");

const { authMiddleware } = require("../middleware/authmiddleware");

router.post("/", authMiddleware, createDocument);

router.get("/", authMiddleware, getDocuments);

router.get("/:id", authMiddleware, getDocumentById);

router.put("/:id", authMiddleware, updateDocument);

router.delete("/:id", authMiddleware, deleteDocument);

module.exports = router;