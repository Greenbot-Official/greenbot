const Sequelize = require('sequelize');

const sequelize = new Sequelize('database', 'username', 'password', {
	host: 'localhost',
	dialect: 'sqlite',
	logging: false,
	storage: 'database.sqlite',
});

const Users = sequelize.import('models/Users');
const Shop = sequelize.import('models/Shop');
const UserItems = sequelize.import('models/UserItems');
const StockMarket = sequelize.import('models/StockMarket');
const Stocks = sequelize.import('models/Stocks');

UserItems.belongsTo(Shop, { foreignKey: 'item_id', as: 'item' });
Stocks.belongsTo(StockMarket, { foreignKey: 'stock_id', as: 'stock'})

Users.prototype.addItem = async function(item, add) {
	const userItem = await UserItems.findOne({
		where: { user_id: this.user_id, item_id: item.id },
	});
	if (userItem) {
		userItem.amount += Number(add);
		return userItem.save();
	}
	return UserItems.create({ user_id: this.user_id, item_id: item.id, amount: add });
};

Users.prototype.removeItem = async function(item) {
	const userItem = await UserItems.findOne({
		where: { user_id: this.user_id, item_id: item.id },
	});
	if (userItem) {
		userItem.amount -= 1;
		return userItem.save();
	}
	return UserItems.create({ user_id: this.user_id, item_id: item.id, amount: 0 });
};

Users.prototype.getItems = function() {
	return UserItems.findAll({
		where: { user_id: this.user_id },
		include: ['item'],
	});
};

Users.prototype.getItemCount = function(item) {
	return UserItems.findAll({
		where: { user_id: this.user_id, item_id: item.id },
		include: ['amount'],
	});
};

Users.prototype.addStock = async function(stock_name) {
	const userStock = await Stocks.findOne({
		where: { user_id: this.user_id, stock_id: stock_name.id },
	});

	if (userStock) {
		userStock.amount += 1;
		return userStock.save();
	}

	return Stocks.create({ user_id: this.user_id, stock_id: stock_name.id, amount: 1 });
};

module.exports = { Users, Shop, UserItems, StockMarket, Stocks };