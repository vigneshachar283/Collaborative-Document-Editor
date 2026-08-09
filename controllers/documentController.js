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

module.exports = {
    createDocument
};