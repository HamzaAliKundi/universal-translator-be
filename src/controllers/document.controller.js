import Document from "../models/document.model.js";
import User from "../models/user.model.js";

// Create a new document
export const createDocument = async (req, res) => {
  try {
    const {
      name,
      size,
      type,
      original_text,
      translated_text,
      text_hash,
      audio_url,
      image_url,
    } = req.body;

    // Convert size to BigInt if necessary
    const parsedSize = typeof size === "string" ? BigInt(size) : size;

    const updateNumRequests = await User.findByIdAndUpdate(req.user?._id, {
      $inc: { numRequests: 1 },
    });

    const document = await Document.create({
      user_id: req.user?._id, // Ensure the user_id is included
      name,
      size: parsedSize,
      type,
      original_text,
      translated_text,
      text_hash,
      audio_url,
      image_url,
    });

    // Convert BigInt fields to strings for JSON response
    const responseDocument = {
      ...document.toObject(),
      size: document.size.toString(), // Convert BigInt to string
    };

    res.status(201).json({
      message: "Document created successfully",
      document: responseDocument,
    });
  } catch (error) {
    if (error instanceof Error) {
      res
        .status(500)
        .json({ message: "Error creating document", error: error.message });
    } else {
      res.status(500).json({ message: "Unknown error occurred" });
    }
  }
};

export const getDocuments = async (req, res) => {
  try {
    const documents = await Document.find({ user_id: req.user?._id });
    const total = await Document.countDocuments({ user_id: req.user?._id });

    // Convert BigInt fields to strings for JSON serialization
    const serializedDocuments = documents.map((doc) => {
      const docObject = doc.toObject();
      if (docObject.size && typeof docObject.size === "bigint") {
        docObject.size = docObject.size.toString(); // Convert BigInt to string
      }
      return docObject;
    });

    res.status(200).json({ documents: serializedDocuments, total });
  } catch (error) {
    if (error instanceof Error) {
      res
        .status(500)
        .json({ message: "Error fetching documents", error: error.message });
    } else {
      res.status(500).json({ message: "Unknown error occurred" });
    }
  }
};

export const getDocument = async (req, res) => {
  try {
    const document = await Document.findOne({
      _id: req.params.id,
      user_id: req.user?._id, // Ensure `req.user` is defined properly in your middleware
    });

    if (!document) {
      res.status(404).json({ message: "Document not found" });
      return;
    }

    // Convert BigInt fields to strings for JSON serialization
    const documentObject = document.toObject();
    if (documentObject.size && typeof documentObject.size === "bigint") {
      documentObject.size = documentObject.size.toString(); // Convert BigInt to string
    }

    res.json(documentObject);
  } catch (error) {
    res.status(500).json({
      message: "Error fetching document",
      error: error.message || "An unexpected error occurred",
    });
  }
};

export const updateDocument = async (req, res) => {
  const updates = Object.keys(req.body);
  const allowedUpdates = [
    "name",
    "original_text",
    "translated_text",
    "audio_url",
    "image_url",
    "text_hash",
  ];

  const isValidOperation = updates.every((update) =>
    allowedUpdates.includes(update)
  );

  if (!isValidOperation) {
    res.status(400).json({ message: "Invalid updates" });
    return;
  }

  try {
    const document = await Document.findOne({
      _id: req.params.id,
      user_id: req.user?._id,
    });

    if (!document) {
      res.status(404).json({ message: "Document not found" });
      return;
    }

    // Apply updates dynamically
    updates.forEach((update) => {
      document[update] = req.body[update];
    });

    await document.save();
    res.json(document);
  } catch (error) {
    res.status(400).json({
      message: "Error updating document",
      error: error.message || "An unexpected error occurred",
    });
  }
};

export const deleteDocument = async (req, res) => {
  try {
    const document = await Document.findOneAndDelete({
      _id: req.params.id,
      user_id: req.user?._id,
    });

    if (!document) {
      res.status(404).json({ message: "Document not found" });
      return;
    }

    res.json({ message: "Document deleted successfully" });
  } catch (error) {
    res.status(500).json({
      message: "Error deleting document",
      error: error.message || "An unexpected error occurred",
    });
  }
};
