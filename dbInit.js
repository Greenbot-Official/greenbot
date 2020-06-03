const Sequelize = require('sequelize');

const sequelize = new Sequelize('database', 'username', 'password', {
	host: 'localhost',
	dialect: 'sqlite',
	logging: false,
	storage: 'database.sqlite',
});

const CurrencyShop = sequelize.import('models/Shop');
const StockShop = sequelize.import('models/StockMarket');
sequelize.import('models/Users');
sequelize.import('models/UserItems');
sequelize.import('models/Stocks');

const force = process.argv.includes('--force') || process.argv.includes('-f');

sequelize.sync({ force }).then(async () => {
	const shop = [
		CurrencyShop.upsert({ name: 'apple', cost: 5}),
	];
	const stocks = [
		StockShop.upsert({ company_name: 'greenInc', value_per_stock: 10}),
	]
	await Promise.all(shop);
	await Promise.all(stocks)
	console.log('Database synced');
	sequelize.close();
}).catch(console.error);