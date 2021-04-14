const Sequelize = require('sequelize');

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

const Users = userdata.import('models/Users');
const Shop = sequelize.import('models/Shop');
const UserItems = userdata.import('models/UserItems');
const UserEffects = userdata.import('models/UserEffects')
const Adventures = sequelize.import('models/Adventure')
const PlayerShop = userdata.import('models/PlayerShop')
const QuestBoard = sequelize.import('models/QuestBoard')
const Enemy = sequelize.import('models/Enemy')

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
	return UserItems.create({ user_id: this.user_id, item_id: item, amount: add, type: shopItem.type, enchant: shopItem.enchant, damage: shopItem.damage, attribute: shopItem.attribute, scale: shopItem.scale, heal: shopItem.heal });
};

Users.prototype.addUniqueItem = async function(item, type, enchant, damage, attribute, scale, heal, amount) {
	const userItem = await UserItems.findOne({
		where: { user_id: this.user_id, item_id: item, type: type, enchant: enchant, damage: damage, attribute: attribute, scale: scale, heal: heal },
	});
	if (userItem) {
		userItem.amount += Number(amount)
		return userItem.save()
	}
	return UserItems.create({ user_id: this.user_id, item_id: item, amount: amount, type: type, enchant: enchant, damage: damage, attribute: attribute, scale: scale, heal: heal });
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

Users.prototype.PshopBuyItem = async function(item, add) {
	const userItem = await UserItems.findOne({
		where: { user_id: this.user_id, item_id: item },
	});
	const shopItem = await PlayerShop.findOne({
		where: { name: item },
	});
	shopItem.amount -= Number(add)
	shopItem.save()
	if (userItem) {
		userItem.amount += Number(add);
		return userItem.save();
	}
	return await UserItems.upsert({ user_id: this.user_id, item_id: item, amount: add, type: shopItem.type, enchant: shopItem.enchant, damage: shopItem.damage, attribute: shopItem.attribute, scale: shopItem.scale, heal: shopItem.heal });
};

Users.prototype.PshopSellItem = async function(item, cost, count, id) {
	const userItem = await UserItems.findOne({
		where: { user_id: this.user_id, item_id: item },
	});
	userItem.amount -= Number(count)
	userItem.save()
	const shopItem = await PlayerShop.findOne({
		where: { name: item, seller_id: id, cost: cost, type: userItem.type, enchant: userItem.enchant, damage: userItem.damage, attribute: userItem.attribute, scale: userItem.scale, heal: userItem.heal } 
	})
	if (shopItem) {
		shopItem.amount += Number(count)
		return shopItem.save()
	}
	return await PlayerShop.upsert({ name: userItem.item_id, seller_id: id, amount: count, cost: cost, type: userItem.type, enchant: userItem.enchant, damage: userItem.damage, attribute: userItem.attribute, scale: userItem.scale, heal: userItem.heal })
};

Users.prototype.addQuest = async function (quest) {
	const questb = await QuestBoard.findOne({
		where: { name: quest }
	})
	return await Enemy.upsert({ user_id: this.user_id, name: questb.enemy, max_health: questb.max_health, health: questb.max_health, enchant: questb.enchant, damage: questb.damage, reward: questb.reward })
}

module.exports = { Users, Shop, PlayerShop, UserItems, UserEffects, Adventures, QuestBoard, Enemy };