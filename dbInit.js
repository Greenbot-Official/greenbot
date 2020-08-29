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

const CurrencyShop = sequelize.import('models/Shop')
sequelize.import('models/Adventure')
userdata.import('models/Users')
userdata.import('models/UserItems')
userdata.import('models/UserEffects')
userdata.import('models/PlayerShop')

const force = process.argv.includes('--force') || process.argv.includes('-f');
const forceusers = process.argv.includes('--users') || process.argv.includes('-u');

sequelize.sync({ force }).then(async () => {
	const shop = [
		CurrencyShop.upsert({ name: 'apple', cost: 15, type: 'consumable', heal: 1}),
		CurrencyShop.upsert({ name: 'water', cost: 10, type: 'consumable', heal: 1}),
		CurrencyShop.upsert({ name: 'bread', cost: 30, type: 'consumable', heal: 2}),
		CurrencyShop.upsert({ name: 'antidote', cost: 50, type: 'consumable', heal: 1, enchant: 3 }),
		CurrencyShop.upsert({ name: 'fishing\_potion', cost: 100, type: 'consumable', heal: 0, enchant: 1 }),
		CurrencyShop.upsert({ name: `mysterious\_brew`, cost: 75, type: 'consumable', heal: 1, enchant: 3 }),
		CurrencyShop.upsert({ name: 'stick', cost: 10, type: 'weapon', damage: 1, attribute: 'none' }),
		CurrencyShop.upsert({ name: 'wood\_dagger', cost: 25, type: 'weapon', damage: 2, attribute: 'dex', scale: 0.1 }),
		CurrencyShop.upsert({ name: 'wood\_sword', cost: 30, type: 'weapon', damage: 3, attribute: 'str', scale: 0.1 }),
		CurrencyShop.upsert({ name: 'iron\_dagger', cost: 55, type: 'weapon', damage: 4, attribute: 'dex', scale: 1 }),
		CurrencyShop.upsert({ name: 'iron\_greatsword', cost: 60, type: 'weapon', damage: 6, attribute: 'str', scale: 1 }),
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