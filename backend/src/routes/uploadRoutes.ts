import { Router } from 'express';
import { upload } from '../middleware/fileUpload';
import type { ApiResponse } from '../types';

const router = Router();

router.post(
  '/',
  upload.single('file'),
  (req, res) => {
    if (!req.file) {
      res.status(400).json({
        success: false,
        message: 'No file uploaded',
      } satisfies ApiResponse<never>);
      return;
    }

    const fileUrl = `/uploads/${req.file.filename}`;

    const responseData = {
      filename: req.file.filename,
      originalName: req.file.originalname,
      size: req.file.size,
      mimetype: req.file.mimetype,
      url: fileUrl,
    };

    res.json({
      success: true,
      message: 'File uploaded successfully',
      data: responseData,
    } satisfies ApiResponse<typeof responseData>);
  }
);

export default router;
