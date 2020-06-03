const { token , globalPrefix } = require('./config');
const Discord = require('discord.js');
const Sequelize = require('sequelize');

const client = new Discord.Client();
const { Users , Shop , StockMarket } = require('./dbObjects');
const currency = new Discord.Collection();
const { Op } = require('sequelize');

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

Reflect.defineProperty(currency, 'plantCrop', {
	value: async function plantCrop(id, crop, amount) {
		const user = currency.get(id);
		var addIncome = 0;
		for (i=0 ; i < amount ; i++) {
			await user.removeItem(crop);
			await user.removeItem('farmland')
			addIncome += getCropIncome(crop)
		}
		user.farm_income += Number(addIncome);
		return user.save();
	},
});

client.once('ready', async () => {
	const storedBalances = await Users.findAll();
	storedBalances.forEach(b => currency.set(b.user_id, b));
	console.log(`Logged in as ${client.user.tag}!`);
});

function log(text , message) {
	var readmessagefile = fs.readFileSync('log.txt', `utf-8`);
	var writemessagefile = fs.writeFileSync('log.txt', `${message.createdAt}: ${message.guild} - ${text} \n` + readmessagefile)
	return console.log(`${message.createdAt}: ${message.guild} - ${text}`);
}

client.on('message', async message => {
	if (message.author.bot) return;
	if (message.channel.type === 'dm') return;
	const id = message.author.id;
	const author = message.author
	const guild = message.guild
	currency.add(id, 1);
	let prefix = globalPrefix;
	if (!message.content.startsWith(prefix)) return;
	const input = message.content.slice(prefix.length).trim();
	if (!input.length) return;
	const [, command, args] = input.match(/(\w+)\s*([\s\S]*)/);
	const commandArgs = args.split(' ')

	if (command === 'hello') {
		log(`${author} says hello`, message)
    return message.channel.send("hi, I am greenbot");
  
	} else if (command === 'dm') {
		const target = message.mentions.users.first()
		if (!target) return message.channel.send("Can't find user!")
    if(!message.member.hasPermission("ADMINISTRATOR")) return message.reply("You can't you that command!")
    mentionMessage = args;
    if(mentionMessage.length < 1) return message.reply('You must supply a message!')
		target.send(`${mentionMessage}`)
		return log(`${author} sent ${mentionMessage} to ${target}`, message)

	} else if (command === 'help') {
		message.channel.send(fs.readFileSync('helpmsg.txt', `utf-8`))
		return log(`${author} is looking for help`, message)

  } else if (command === 'dummy') {
		const target = message.mentions.users.first()
		if (!target) return;
		log(`${author} called ${target} a dummy`, message)
		return message.channel.send(`${target} is a dummy`)

	} else if (command === 'balance' || command === 'bal') {
		const target = message.mentions.users.first() || message.author
		const bal = currency.getBalance(target.id)
		log (`${author} checked ${target}'s balance of ${bal}`, message)
		return message.channel.send(`${target} has ${bal}💰`)

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

	} else if (command === 'shop') {
		const items = await Shop.findAll();
		log(`${author} is browsing the shop`, message)
		return message.channel.send(items.map(item => `${item.name}: ${item.cost}💰`).join('\n'), { code: true });

	} else if (command === 'buy') {
		const buyName = commandArgs[0]
		const buyAmmount = commandArgs[1] || 1
		const item = await Shop.findOne({ where: { name: { [Op.like]: buyName } } });
		if (!item) return message.channel.send('That item doesn\'t exist.');
		const totalCost = item.cost * buyAmmount
		if (totalCost > currency.getBalance(id)) return message.channel.send(`You don't have enough currency, ${author}`);
		const user = await Users.findOne({ where: { user_id: id } });
		currency.add(id, -totalCost);
		for (i=0 ; i < buyAmmount ; i++) await user.addItem(item);
		log(`${author} bought ${buyAmmount} ${item.name}`, message)
		return message.channel.send(`You've bought ${buyAmmount} ${item.name}`);

	} else if (command === 'inventory' || command === 'inv') {
		const target = message.mentions.users.first() || message.author;
		const user = await Users.findOne({ where: { user_id: target.id } });
		const items = await user.getItems();
		if (!items.length) return message.channel.send(`${target.tag} has nothing!`);
		log(`${author} checked ${target}'s inventory`, message)
		return message.channel.send(`${target.tag} currently has:\n${items.map(t => `${t.amount} ${t.item.name}`).join('\n')}`);

	} else if (command === 'stockmarket') {
		const stocks = await StockMarket.findAll();
		log(`${author} is browsing the stock market`, message)
		return message.channel.send(stocks.map(stock => `${stock.company_name}: ${stock.value_per_stock}💰`).join('\n'), { code: true });

	} else if (command === 'stock') {
		if (commandArgs[0] === 'buy') {
			const stockName = commandArgs[1]
			const buyAmmount = commandArgs[2] || 1
			const stock = await StockMarket.findOne({ where: { company_name: { [Op.like]: stockName } } });
			if (!stock) return message.channel.send('That stock doesn\'t exist.');
			const totalCost = stock.value_per_stock * buyAmmount
			if (totalCost > currency.getBalance(id)) return message.channel.send(`You don't have enough currency, ${author}`);
			const user = await Users.findOne({ where: { user_id: id } });
			currency.add(id, -totalCost);
			for (i=0 ; i < buyAmmount ; i++) await user.addStock(stock);
			log(`${author} bought ${buyAmmount} ${stock.company_name}`, message)
			return message.channel.send(`You've bought ${buyAmmount} ${stock.company_name}`);

		}

	}
  
});

client.login(token);