// backend/middleware/fileUpload.js
import multer from 'multer';
import fs from 'fs';
import path from 'path';

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join('uploads', 'resumes');
    fs.mkdirSync(uploadPath, { recursive: true }); // create folder if not exists
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const uniqueName = `${Date.now()}-${file.originalname}`;
    cb(null, uniqueName);
  },
});

const uploadResume = multer({ storage }).single('resume');

export default uploadResume;
