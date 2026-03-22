const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const { uploadAd, getAd, getAds, updateAd, deleteAd } = require('../controllers/ad.controller');
const { protect } = require('../middleware/auth');
const { MAX_UPLOAD_SIZE_BYTES } = require('../utils/constants');

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => {
    const unique = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, unique + path.extname(file.originalname));
  },
});
const upload = multer({
  storage,
  limits: { fileSize: MAX_UPLOAD_SIZE_BYTES },
  fileFilter: (req, file, cb) => {
    const allowed = /jpeg|jpg|png|gif/;
    const ok = allowed.test(path.extname(file.originalname).toLowerCase()) && allowed.test(file.mimetype);
    ok ? cb(null, true) : cb(new Error('Only image files are allowed (jpg, png, gif)'));
  },
});

router.use(protect);
router.get('/', getAds);
router.post('/upload', upload.single('image'), uploadAd);
router.get('/:id', getAd);
router.put('/:id', updateAd);
router.delete('/:id', deleteAd);

module.exports = router;
