require('dotenv').config();

const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
const connectDB = require('../src/config/database');
const User = require('../src/models/User');

const users = [
	{
		username: 'admin',
		firstName: 'Admin',
		lastName: 'Fitlog',
		email: 'admin@fitlog.local',
		password: 'admin',
		role: 'admin',
		experience: 'advanced',
		objective: 'strength'
	},
	{
		username: 'pablo',
		firstName: 'Pablo',
		lastName: 'User',
		email: 'pablo@fitlog.local',
		password: 'pablo',
		role: 'user',
		experience: 'beginner',
		objective: 'hypertrophy'
	},
	{
		username: 'miguel',
		firstName: 'Miguel',
		lastName: 'User',
		email: 'miguel@fitlog.local',
		password: 'miguel',
		role: 'user',
		experience: 'beginner',
		objective: 'hypertrophy'
	}
];

async function seedUsers(options = {}) {
	const shouldCloseConnection = options.closeConnection === true;

	if (mongoose.connection.readyState === 0) {
		await connectDB();
	}

	const operations = [];

	for (const user of users) {
		const hashedPassword = await bcrypt.hash(user.password, 12);
		operations.push({
			updateOne: {
				filter: { username: user.username },
				update: {
					$set: {
						username: user.username,
						firstName: user.firstName,
						lastName: user.lastName,
						email: user.email,
						password: hashedPassword,
						role: user.role,
						experience: user.experience,
						objective: user.objective
					}
				},
				upsert: true
			}
		});
	}

	const result = await User.bulkWrite(operations);

	console.log(`Seed de usuarios completado. Insertados o actualizados: ${result.upsertedCount + result.modifiedCount}`);

	if (shouldCloseConnection) {
		await mongoose.connection.close();
	}
}

if (require.main === module) {
	seedUsers({ closeConnection: true }).catch(async (error) => {
		console.error('Error al ejecutar el seeder de usuarios:', error);
		await mongoose.connection.close();
		process.exit(1);
	});
}

module.exports = seedUsers;