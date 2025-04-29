const express = require('express');
const router = express.Router();
const controller = require('../controllers/leaderboardController');

router.get('/', controller.getLeaderboard);
router.post('/recalculate', controller.recalculateRanks);
router.get('/search', controller.searchUser);

module.exports = router;
