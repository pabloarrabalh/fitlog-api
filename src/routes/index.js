const express = require('express');
const userRoutes = require('./userRoutes');
const exerciseRoutes = require('./exerciseRoutes');
const routineRoutes = require('./routineRoutes');
const sessionRoutes = require('./sessionRoutes');

const router = express.Router();

router.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Fitlog API is healthy',
    timestamp: new Date().toISOString()
  });
});

router.use('/users', userRoutes);
router.use('/exercises', exerciseRoutes);
router.use('/routines', routineRoutes);
router.use('/sessions', sessionRoutes);

module.exports = router;
