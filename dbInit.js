const Sequelize = require('sequelize');
const config = require('./config.json')

const sequelize = new Sequelize('database', 'username', 'password', {
	host: 'localhost',
	dialect: 'sqlite',
	logging: false,
	storage: 'database.sqlite',
});

const userdata = new Sequelize('database', 'username', 'password', {
	host: 'localhost',
	dialect: 'sqlite',
	logging: false,
	storage: 'userdatabase.sqlite',
});


const Users = require('./models/Users')(userdata, Sequelize.DataTypes);
const Shop = require('./models/Shop')(sequelize, Sequelize.DataTypes);
const UserItems = require('./models/UserItems')(userdata, Sequelize.DataTypes);
const UserEffects = require('./models/UserEffects')(userdata, Sequelize.DataTypes)
const Adventures = require('./models/Adventure')(sequelize, Sequelize.DataTypes)
const PlayerShop = require('./models/PlayerShop')(userdata, Sequelize.DataTypes)
const QuestBoard = require('./models/QuestBoard')(sequelize, Sequelize.DataTypes)
const Enemy = require('./models/Enemy')(sequelize, Sequelize.DataTypes)

const force = process.argv.includes('--force') || process.argv.includes('-f');
const forceusers = process.argv.includes('--users') || process.argv.includes('-u');

sequelize.sync({ force }).then(async () => {
	const shop = [
		Shop.upsert({ name: 'apple', cost: 15, type: 'consumable', heal: 1}),
		Shop.upsert({ name: 'water', cost: 10, type: 'consumable', heal: 1}),
		Shop.upsert({ name: 'bread', cost: 30, type: 'consumable', heal: 2}),
		Shop.upsert({ name: 'antidote', cost: 50, type: 'consumable', heal: 1 }),
		Shop.upsert({ name: 'fishing\_potion', cost: 100, type: 'consumable', heal: 0, enchant: 'fishing' }),
		Shop.upsert({ name: `mysterious\_brew`, cost: 75, type: 'consumable', heal: 1, enchant: 'mystery' }),
		Shop.upsert({ name: 'stick', cost: 10, type: 'weapon', damage: 1, attribute: 'none' }),
		Shop.upsert({ name: 'wood\_dagger', cost: 25, type: 'weapon', damage: 2, attribute: 'dex', scale: 10 }),
		Shop.upsert({ name: 'wood\_sword', cost: 30, type: 'weapon', damage: 3, attribute: 'str', scale: 10 }),
		Shop.upsert({ name: 'iron\_dagger', cost: 55, type: 'weapon', damage: 4, attribute: 'dex', scale: 10 }),
		Shop.upsert({ name: 'iron\_greatsword', cost: 60, type: 'weapon', damage: 6, attribute: 'str', scale: 10 }),

		QuestBoard.upsert({ name: 'goblins', desc: 'we need you to kill the goblin that has been killing our sheep', diff: 1, enemy: 'goblin', damage: 2 }),
		QuestBoard.upsert({ name: 'gigantic', desc: 'there is a terrifying giant living in those distant mountains, we need you to take care of it', diff: 100, enemy: 'giant', max_health: 100, damage: 12, reward: 10000 }),
	];
	try {
		await Promise.all(shop);
		console.log('db synced');
		sequelize.close();
	} catch (e) {
		console.log(e)
	}
}).catch(console.error);
userdata.sync({ forceusers }).then(async () => {
	try {
		console.log('users synced');
		userdata.close();
	} catch (e) {
		console.log(e)
	}
}).catch(console.error);