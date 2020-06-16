const Sequelize = require('sequelize');

const sequelize = new Sequelize('database', 'username', 'password', {
	host: 'localhost',
	dialect: 'sqlite',
	logging: false,
	storage: 'database.sqlite',
});

const CurrencyShop = sequelize.import('models/Shop');
sequelize.import('models/Users');
sequelize.import('models/UserItems');

const force = process.argv.includes('--force') || process.argv.includes('-f');

sequelize.sync({ force }).then(async () => {
	const shop = [
		CurrencyShop.upsert({ name: 'apple', cost: 5, sell: 4, type: 'consumable', heal: 1}),
		CurrencyShop.upsert({ name: 'bread', cost: 10, sell: 8, type: 'consumable', heal: 2}),
		CurrencyShop.upsert({ name: 'stick', cost: 5, sell: 4, type: 'weapon', damage: 1}),
		CurrencyShop.upsert({ name: 'woodDagger', cost: 10, sell: 8, type: 'weapon', damage: 2}),
	];
	try {
		await Promise.all(shop);
		console.log('Database synced');
		sequelize.close();
	} catch (e) {
		console.log(e)
	}
}).catch(console.error);