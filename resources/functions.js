const { Users , client , currency , fs , Shop } = require('../app')

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
		const user = currency.get(id);
		if (user) {
			user.balance += Number(amount);
			return user.save();
		}
		const newUser = await Users.create({ user_id: id, balance: amount });
		currency.set(id, newUser);
		return newUser;
	},
	addFishexp: async function(id, amount) {
		const user = currency.get(id);
		if (user) {
			user.fish_exp += Number(amount);
			return user.save();
		}
		const newUser = await Users.create({ user_id: id, fish_exp: amount });
		currency.set(id, newUser);
		return newUser;
	},
	setBiggestCatch: async function(id, amount) {
		const user = currency.get(id);
		user.biggest_catch = Number(amount);
		return user.save();
	},
	getFishexp: function(id) {
		const user = currency.get(id);
		return user ? user.fish_exp : 0;
	},
	getBiggestCatch: function(id) {
		const user = currency.get(id);
		return user ? user.biggest_catch : 0;
	},
	getCommands: function() {
		return client.commands
	},
	throwError: function(error) {
		return require(`./errors/${error}`).name
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
		}
		const newUser = await Users.create({ user_id: id, crime_exp: amount });
		currency.set(id, newUser);
		return newUser;
	},
	getUser: function(id) {
		const user = currency.get(id)
		return user
	},
	findAllInShop: async function(category) {
		return Shop.findAll({
			where: { item_type: category }
		})

	},
}