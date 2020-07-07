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
const UserEffects = sequelize.import('models/UserEffects')

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
	return UserItems.create({ user_id: this.user_id, item_id: item, amount: add, type: shopItem.type, enchant: shopItem.enchant, damage: shopItem.damage, heal: shopItem.heal });
};

Users.prototype.addUniqueItem = async function(item, type, enchant, damage, heal) {
	const userItem = await UserItems.findOne({
		where: { user_id: this.user_id, item_id: item, type: type, enchant: enchant, damage: damage, heal: heal },
	});
	if (userItem) {
		userItem.amount += Number(1)
		return userItem.save()
	}
	return UserItems.create({ user_id: this.user_id, item_id: item, amount: 1, type: type, enchant: enchant, damage: damage, heal: heal });
};

Users.prototype.getItems = async function() {
	return await UserItems.findAll({
		where: { user_id: this.user_id },
		include: ['item'],
	});
};

Users.prototype.equip = async function(item) {
	const equip = await UserItems.findOne({
		where: { user_id: this.user_id, item_id: item },
		include: ['item'],
	});
	const prev = await UserItems.findOne({
		where: { user_id: this.user_id, equipped: true },
		include: ['item'],
	}) || equip
	prev.equipped = Boolean(false);
	equip.equipped = Boolean(true);
	prev.save()
	equip.save()
	return
};

module.exports = { Users, Shop, UserItems, UserEffects };