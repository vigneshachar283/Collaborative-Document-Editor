const Document = require("../models/Document");

const createDocument = async (req, res) => {
    try {
        const { title, content } = req.body;

        const document = await Document.create({
            title,
            content,
            owner: req.user.id
        });

        res.status(201).json({
            message: "Document created successfully",
            document
        });

    } catch (error) {
        res.status(500).json({
            message: "Failed to create document",
            error: error.message
        });
    }
};
const getDocuments = async (req, res) => {
    try {
        const documents = await Document.find({
            owner: req.user.id
        }).sort({ updatedAt: -1 });

        res.status(200).json({
            documents
        });

    } catch (error) {
        res.status(500).json({
            message: "Failed to fetch documents",
            error: error.message
        });
    }
};

const getDocumentById = async (req, res) => {
    try {
        const document = await Document.findById(req.params.id);

        if (!document) {
            return res.status(404).json({
                message: "Document not found"
            });
        }

        if (document.owner.toString() !== req.user.id) {
            return res.status(403).json({
                message: "Access denied"
            });
        }

        res.status(200).json({
            document
        });

    } catch (error) {
        res.status(500).json({
            message: "Failed to fetch document",
            error: error.message
        });
    }
};


const updateDocument = async (req, res) => {
    try {
        const { title, content } = req.body;

        const document = await Document.findById(req.params.id);

        if (!document) {
            return res.status(404).json({
                message: "Document not found"
            });
        }

        if (document.owner.toString() !== req.user.id) {
            return res.status(403).json({
                message: "Access denied"
            });
        }

        document.title = title ?? document.title;
        document.content = content ?? document.content;

        await document.save();

        res.status(200).json({
            message: "Document updated successfully",
            document
        });

    } catch (error) {
        res.status(500).json({
            message: "Failed to update document",
            error: error.message
        });
    }
};


const deleteDocument = async (req, res) => {
    try {
        const document = await Document.findById(req.params.id);

        if (!document) {
            return res.status(404).json({
                message: "Document not found"
            });
        }

        if (document.owner.toString() !== req.user.id) {
            return res.status(403).json({
                message: "Access denied"
            });
        }

        await document.deleteOne();

        res.status(200).json({
            message: "Document deleted successfully"
        });

    } catch (error) {
        res.status(500).json({
            message: "Failed to delete document",
            error: error.message
        });
    }
};

module.exports = {
    createDocument,
    getDocuments,
    getDocumentById,
     updateDocument,
     deleteDocument
};