const { token , prefix } = require('./config');
const Discord = require('discord.js');
const Sequelize = require('sequelize');

const client = new Discord.Client();
const Users = require('./dbObjects');
const currency = new Discord.Collection();
const fs = require('fs');

Reflect.defineProperty(currency, 'add', {
	value: async function add(id, amount) {
		const user = currency.get(id);
		if (user) {
			user.balance += Number(amount);
			return user.save();
		}
		const newUser = await Users.create({ user_id: id, balance: amount, fish_exp: 1});
		currency.set(id, newUser);
		return newUser;
	},
});

Reflect.defineProperty(currency, 'addFishexp', {
	value: async function addFishexp(id, amount) {
		const user = currency.get(id);
		user.fish_exp += Number(amount);
		return user.save();
	},
});

Reflect.defineProperty(currency, 'setBiggestCatch', {
	value: async function setBiggestCatch(id, amount) {
		const user = currency.get(id);
		user.biggest_catch = Number(amount);
		return user.save();
	},
});

Reflect.defineProperty(currency, 'getBalance', {
	value: function getBalance(id) {
		const user = currency.get(id);
		return user ? user.balance : 0;
	},
});

Reflect.defineProperty(currency, 'getFishexp', {
	value: function getFishexp(id) {
		const user = currency.get(id);
		return user ? user.fish_exp : 0;
	},
});

Reflect.defineProperty(currency, 'getBiggestCatch', {
	value: function getBiggestCatch(id) {
		const user = currency.get(id);
		return user ? user.biggest_catch : 0;
	},
});


client.once('ready', async () => {
	console.log(`Logged in as ${client.user.tag}!`);
	const storedBalances = await Users.findAll();
	storedBalances.forEach(b => currency.set(b.user_id, b));
});

function log(text , message) {
	var readmessagefile = fs.readFileSync('log.txt', `utf-8`);
	var writemessagefile = fs.writeFileSync('log.txt', `${message.createdAt}: ${message.guild} - ${text} \n` + readmessagefile)
	return console.log(`${message.createdAt}: ${message.guild} - ${text}`);
}

client.on('message', async message => {
	if (message.author.bot) return;
	const id = message.author.id;
	currency.add(id, 1);
	const author = message.author
	const guild = message.guild
	if (!message.content.startsWith(prefix)) return;
	const input = message.content.slice(prefix.length).trim();
	if (!input.length) return;
	const [, command, commandArgs] = input.match(/(\w+)\s*([\s\S]*)/);

	if (command === 'hello') {
		log(`${author} says hello`, message)
    return message.channel.send("hi, I am greenbot");
  
	} else if (command === 'dm') {
		const target = message.mentions.users.first()
		if (!target) return message.channel.send("Can't find user!")
    if(!message.member.hasPermission("ADMINISTRATOR")) return message.reply("You can't you that command!")
    mentionMessage = commandArgs;
    if(mentionMessage.length < 1) return message.reply('You must supply a message!')
		target.send(`${mentionMessage}`)
		return log(`${author} sent ${mentionMessage} to ${target}`, message)

	} else if (command === 'help') {
		message.channel.send('help \nhello - says hello \ndummy {@target} - calls target a dummy \ndm {@target} {message} - sends target a dm (admin only)')
		return log(`${author} is looking for help`, message)

  } else if (command === 'dummy') {
		const target = message.mentions.users.first()
		if (!target) return;
		log(`${author} called ${target} a dummy`, message)
		return message.channel.send(`${target} is a dummy`)

	} else if (command === 'balance' || command === 'bal') {
		const target = message.mentions.users.first() || message.author
		const bal = currency.getBalance(target.id)
		log (`${target} checked their balance of ${bal}`, message)
		return message.channel.send(`${target} has ${bal}:apple:`)

	} else if (command === 'fish') {
		const fishexp = currency.getFishexp(id);
		const randmult = fishexp / 5
		const rand = Math.round(Math.random() * randmult + 1)
		const money = rand / 2
		log(`${author} caught a ${rand}in fish`, message)
		currency.add(id,money)
		currency.addFishexp(id,1)
		const newrec = Math.max(rand, currency.getBiggestCatch(id))
		currency.setBiggestCatch(id, newrec)
		return message.channel.send(`${author} caught a ${rand}in :fish:`)

	} else if (command === 'biggestcatch') {
		const target = message.mentions.users.first() || message.author
		log(`${target}'s record is a ${currency.getBiggestCatch(target.id)}`, message)
		return message.channel.send(`${target}'s record is a ${currency.getBiggestCatch(target.id)}in :fish:`)

	}
  
});

client.login(token);