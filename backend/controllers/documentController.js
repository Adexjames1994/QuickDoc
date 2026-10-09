import crypto from "crypto";
import QRCode from "qrcode";
import Document from "../models/Document.js";

export const uploadDocument = async (req, res) => {
  try {
    const file = req.file;
    const fileHash = crypto.createHash("sha256").update(file.buffer).digest("hex");

    const verificationUrl = `${process.env.FRONTEND_URL}/verify/${fileHash}`;
    const qrCodeDataUrl = await QRCode.toDataURL(verificationUrl);

    const newDoc = await Document.create({
      filename: file.originalname,
      hash: fileHash,
      qrCodeUrl: qrCodeDataUrl,
    });

    res.json({
      message: "Document uploaded successfully",
      qrCode: qrCodeDataUrl,
      hash: fileHash,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const verifyDocument = async (req, res) => {
  try {
    const { hash } = req.params;
    const doc = await Document.findOne({ hash });
    if (!doc) return res.status(404).json({ valid: false, message: "Invalid document" });
    res.json({ valid: true, document: doc });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
