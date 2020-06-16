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

UserItems.belongsTo(Shop, { foreignKey: 'item_id', as: 'item' });

Users.prototype.addItem = async function(item, add) {
	const userItem = await UserItems.findOne({
		where: { user_id: this.user_id, item_id: item },
	});
	const shopItem = await Shop.findOne({
		where: { name: item },
	});
	if (userItem) {
		userItem.amount += Number(add);
		return userItem.save();
	}
	return UserItems.create({ user_id: this.user_id, item_id: item, amount: add, type: shopItem.type, damage: shopItem.damage, heal: shopItem.heal });
};

Users.prototype.getItems = async function() {
	return await UserItems.findAll({
		where: { user_id: this.user_id },
		include: ['item'],
	});
};

module.exports = { Users, Shop, UserItems };