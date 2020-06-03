const { token , globalPrefix , ownerId } = require('./config');
const Discord = require('discord.js');
const Sequelize = require('sequelize');
const { Users , Shop , StockMarket } = require('./dbObjects');
const { Op } = require('sequelize');

const client = new Discord.Client();
const currency = new Discord.Collection();
client.commands = new Discord.Collection();

const fs = require('fs');



async function add(id, amount) {
	const user = currency.get(id);
	if (user) {
		user.balance += Number(amount);
		return user.save();
	}
	const newUser = await Users.create({ user_id: id, balance: amount, fish_exp: 1});
	currency.set(id, newUser);
	return newUser;
}

client.once('ready', async () => {
	const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
	for (const file of commandFiles) {
		const command = require(`./commands/${file}`);
		client.commands.set(command.name, command);
	}
	const storedBalances = await Users.findAll();
	storedBalances.forEach(b => currency.set(b.user_id, b));
	module.exports = {
		log: function(text, message) {
			var readmessagefile = fs.readFileSync('log.txt', `utf-8`);
			var writemessagefile = fs.writeFileSync('log.txt', readmessagefile+`\n${message.createdAt}: ${message.guild} - ${text}`)
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
			const newUser = await Users.create({ user_id: id, balance: amount, fish_exp: 1});
			currency.set(id, newUser);
			return newUser;
		},
		addFishexp: async function(id, amount) {
			const user = currency.get(id);
			user.fish_exp += Number(amount);
			return user.save();
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
		}
	};
	console.log(`Logged in as ${client.user.tag}!`);
});


client.on('message', async message => {
	if (message.author.bot) return;
	if (message.channel.type === 'dm') return;
	add(message.author.id, 1);
	let prefix = globalPrefix;
	if (!message.content.startsWith(prefix)) return;
	const input = message.content.slice(prefix.length).trim();
	if (!input.length) return;
	const [, command, args] = input.match(/(\w+)\s*([\s\S]*)/);
	const commandArgs = args.split(' ')
	try {
		const commandToRun = client.commands.get(command)
			|| client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(command));
		if(!commandToRun){
			return;
		} else {
			return commandToRun.execute(message, commandArgs, client);
		}
	} catch (e) {
		message.reply('an error occured while finding command');
		console.log(e)
	}
	return;
	
});

client.login(token);