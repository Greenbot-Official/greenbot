const {currency , client} = require('../app');
const fs = require('fs');

module.exports = {
	log: function(text, message) {
		var readmessagefile = fs.readFileSync('log.txt', `utf-8`);
		fs.writeFileSync('log.txt', readmessagefile+`\n${message.createdAt}: ${message.guild} - ${text}`)
		return console.log(`${message.createdAt}: ${message.guild} - ${text}`);
	},
	getBalance: function(id) {
		const user = currency.get(id);
		return user ? user.balance : 0;
	},
	add: async function(id, amount) {
		const user = app.currency.get(id);
		if (user) {
			user.balance += Number(amount);
			return user.save();
		} else {
			const newUser = await Users.create({ user_id: id, balance: amount });
			currency.set(id, newUser);
		}
		return newUser;
	},
	addFishexp: async function(id, amount) {
		const user = currency.get(id);
		if (user) {
			user.fish_exp += Number(amount);
			return user.save();
		} else  {
			const newUser = await Users.create({ user_id: id, fish_exp: amount });
			currency.set(id, newUser);
		}
			return newUser;
	},
	setBiggestCatch: async function(id, amount) {
		const user = currency.get(id);
		if (user) {
			user.biggest_catch = Number(amount);
			return user.save();
		}
		const newUser = await Users.create({ user_id: id, biggest_catch: amount });
		currency.set(id, newUser);
		return newUser;
	},
	getFishexp: function(id) {
		const user = currency.get(id);
		return user ? user.fish_exp : 0;
	},
	getBiggestCatch: function(id) {
		const user = currency.get(id);
		return user ? user.biggest_catch : 0;
	},
	getCrimeExp: function(id) {
		const user = currency.get(id);
		return user ? user.crime_exp : 0
	},
	addCrimeExp: async function(id, amount) {
		const user = currency.get(id);
		if (user) {
			user.crime_exp += Number(amount);
			return user.save();
		} else {
			const newUser = await Users.create({ user_id: id, crime_exp: amount });
			currency.set(id, newUser);
		}
		return newUser;
	},
	getUser: function(id) {
		const user = currency.get(id)
		return user.user_id
	},
	findAllInShop: async function(category) {
		return Shop.findAll({
			where: { item_type: category }
		})
	},
	getLevel: function(id) {
		const user = currency.get(id);
		return user ? user.level : 0;
	},
	calcLevel: function(id) {
		const user = currency.get(id);
		return Math.pow(user.level + 1, 2)
	},
}