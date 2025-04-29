const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('../models/User');
const Activity = require('../models/Activity');

dotenv.config();

const users = [
  { userId: 1, name: 'Jake Williamson' },
  { userId: 2, name: 'Robert Montoya' },
  { userId: 3, name: 'Emily Clark' },
  { userId: 4, name: 'David Johnson' },
  { userId: 5, name: 'Susan Miller' },
  { userId: 6, name: 'Scott Miller' },
  { userId: 7, name: 'Brent Hayes' },
  { userId: 8, name: 'Emma Perry' },
  { userId: 9, name: 'Johnson' },
  { userId: 10, name: 'Petry Thomas' },
];

async function seedData() {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    }).then(() => console.log("DB connected")).catch(console.error);

    await User.deleteMany();
    await Activity.deleteMany();

    await User.insertMany(users);

    for (const user of users) {
      const activityCount = Math.floor(Math.random() * 15) + 5;

      const activities = [];
      for (let i = 0; i < activityCount; i++) {
        const randomDate = new Date();
        randomDate.setDate(randomDate.getDate() - Math.floor(Math.random() * 30)); // within last 30 days

        activities.push({
          userId: user.userId,
          timestamp: randomDate,
          points: 20,
        });
      }

      await Activity.insertMany(activities);
    }

    console.log('✅ Seed data inserted successfully!');
    process.exit();
  } catch (err) {
    console.error('❌ Seeding failed:', err);
    process.exit(1);
  }
}

seedData();