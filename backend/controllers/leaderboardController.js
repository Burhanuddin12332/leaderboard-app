const User = require('../models/User');
const Activity = require('../models/Activity');

// Utility to get start of day/month/year
const getStartDate = (filter) => {
  const now = new Date();
  if (filter === 'day') {
    return new Date(now.getFullYear(), now.getMonth(), now.getDate());
  } else if (filter === 'month') {
    return new Date(now.getFullYear(), now.getMonth(), 1);
  } else if (filter === 'year') {
    return new Date(now.getFullYear(), 0, 1);
  } else {
    return new Date(0); // default: all time
  }
};

// @route   GET /api/leaderboard?filter=day/month/year
exports.getLeaderboard = async (req, res) => {
  try {
    const filter = req.query.filter || 'day';
    const startDate = getStartDate(filter);

    const activities = await Activity.find({ timestamp: { $gte: startDate } });
    const userPointsMap = {};

    activities.forEach(({ userId, points }) => {
      userPointsMap[userId] = (userPointsMap[userId] || 0) + points;
    });

    const users = await User.find();
    const result = users.map(user => ({
      userId: user.userId,
      name: user.name,
      totalPoints: userPointsMap[user.userId] || 0,
      rank: 0 // will assign below
    }));

    result.sort((a, b) => b.totalPoints - a.totalPoints);

    let currentRank = 0;
    let lastPoints = 0;

    result.forEach((user, index) => {
      if (user.totalPoints !== lastPoints) {
        currentRank++;
      }
      user.rank = currentRank;
      lastPoints = user.totalPoints;
    });

    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// @route   POST /api/leaderboard/recalculate
exports.recalculateRanks = async (req, res) => {
  try {
    const activities = await Activity.find();

    const userPoints = {};
    activities.forEach(({ userId, points }) => {
      userPoints[userId] = (userPoints[userId] || 0) + points;
    });

    const users = await User.find();
    for (const user of users) {
      user.totalPoints = userPoints[user.userId] || 0;
      await user.save();
    }

    const rankedUsers = await User.find().sort({ totalPoints: -1 });

    let currentRank = 0;
    let lastPoints = null;

    for (let i = 0; i < rankedUsers.length; i++) {
      const user = rankedUsers[i];
      if (user.totalPoints !== lastPoints) {
        currentRank = i + 1;
        lastPoints = user.totalPoints;
      }
      user.rank = currentRank;
      await user.save();
    }

    res.json({ message: 'Ranks recalculated and saved.' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// @route   GET /api/leaderboard/search?userId=1
exports.searchUser = async (req, res) => {
  try {
    const userId = parseInt(req.query.userId);
    if (!userId) return res.status(400).json({ message: "User ID is required" });

    const searchUser = await User.findOne({ userId });
    if (!searchUser) return res.status(404).json({ error: 'User not found' });

    const result = await User.find({ userId: { $ne: userId } });
    result.sort((a, b) => b.totalPoints - a.totalPoints);

    let currentRank = 0;
    let lastPoints = 0;

    result.forEach((user, index) => {
      if (user.totalPoints !== lastPoints) {
        currentRank++;
      }
      user.rank = currentRank;
      lastPoints = user.totalPoints;
    });

    const finalResult = [searchUser, ...result];
    res.json(finalResult);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
