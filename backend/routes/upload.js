/* ─── Upload Routes ────────────────────────────────── */
const router = require('express').Router();
const upload = require('../middleware/upload');
const { verifyToken } = require('../middleware/auth');

router.post('/', verifyToken, upload.array('images', 10), (req, res) => {
  try {
    const urls = req.files.map(f => `/uploads/${f.filename}`);
    res.json({ urls });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

module.exports = router;
