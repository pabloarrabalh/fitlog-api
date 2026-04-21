const express = require('express');
const authRoutes = require('./authRoutes');
const userRoutes = require('./userRoutes');
const exerciseRoutes = require('./exerciseRoutes');
const routineRoutes = require('./routineRoutes');
const sessionRoutes = require('./sessionRoutes');
const socialRoutes = require('./socialRoutes');

const router = express.Router();

router.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Fitlog API is healthy',
    timestamp: new Date().toISOString()
  });
});

router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/exercises', exerciseRoutes);
router.use('/routines', routineRoutes);
router.use('/sessions', sessionRoutes);
router.use('/social', socialRoutes);

module.exports = router;
