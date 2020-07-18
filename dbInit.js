const Sequelize = require('sequelize');
const config = require('./config.json')

const sequelize = new Sequelize('database', 'username', 'password', {
	host: 'localhost',
	dialect: 'sqlite',
	logging: false,
	storage: 'db/users.sqlite',
});

const shop = new Sequelize('database', 'username', 'password', {
	host: 'localhost',
	dialect: 'sqlite',
	logging: false,
	storage: 'db/shop.sqlite',
});

const items = new Sequelize('database', 'username', 'password', {
	host: 'localhost',
	dialect: 'sqlite',
	logging: false,
	storage: 'db/items.sqlite',
});

const adventures = new Sequelize('database', 'username', 'password', {
	host: 'localhost',
	dialect: 'sqlite',
	logging: false,
	storage: 'db/adventure.sqlite',
});

const CurrencyShop = shop.import('models/Shop')
sequelize.import('models/Users')
items.import('models/UserItems')
sequelize.import('models/UserEffects')
adventures.import('models/Adventure')

const force = process.argv.includes('--force') || process.argv.includes('-f');

adventures.sync({ force }).then(async () => {
	try {
		console.log('1/4 adventure synced');
		adventures.close();
	} catch (e) {
		console.log(e)
	}
}).catch(console.error);

sequelize.sync({ force }).then(async () => {
	try {
		console.log('2/4 users synced');
		sequelize.close();
	} catch (e) {
		console.log(e)
	}
}).catch(console.error);

items.sync({ force }).then(async () => {
	try {
		console.log('3/4 items synced');
		items.close();
	} catch (e) {
		console.log(e)
	}
}).catch(console.error);

shop.sync({ force }).then(async () => {
	const shopItems = [
		CurrencyShop.upsert({ name: 'apple', cost: 5, type: 'consumable', heal: 1}),
		CurrencyShop.upsert({ name: 'water', cost: 8, type: 'consumable', heal: 1}),
		CurrencyShop.upsert({ name: 'bread', cost: 10, type: 'consumable', heal: 2}),
		CurrencyShop.upsert({ name: 'antidote', cost: 20, type: 'consumable', heal: 1, enchant: 3 }),
		CurrencyShop.upsert({ name: 'fishing\_potion', cost: 85, type: 'consumable', heal: 0, enchant: 1 }),
		CurrencyShop.upsert({ name: `mysterious\_brew`, cost: 75, type: 'consumable', heal: 1, enchant: 3 }),
		CurrencyShop.upsert({ name: 'stick', cost: 10, type: 'weapon', damage: 1, attribute: 'none' }),
		CurrencyShop.upsert({ name: 'wood\_dagger', cost: 25, type: 'weapon', damage: 2, attribute: 'dex', scale: 0.1 }),
		CurrencyShop.upsert({ name: 'wood\_sword', cost: 30, type: 'weapon', damage: 3, attribute: 'str', scale: 0.1 }),
		CurrencyShop.upsert({ name: 'iron\_dagger', cost: 55, type: 'weapon', damage: 4, attribute: 'dex', scale: 1 }),
		CurrencyShop.upsert({ name: 'iron\_greatsword', cost: 60, type: 'weapon', damage: 6, attribute: 'str', scale: 1 }),
	];
	try {
		await Promise.all(shopItems);
		console.log('4/4 shop synced');
		shop.close();
	} catch (e) {
		console.log(e)
	}
}).catch(console.error);