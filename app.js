const config = require('./config');
const Discord = require('discord.js');
const { Users , Shop , UserEffects } = require('./dbObjects');
const { Op } = require('sequelize');
const func = require('./resources/functions')
const Canvas = require('canvas');

const client = new Discord.Client();
const currency = new Discord.Collection();
client.commands = new Discord.Collection();
client.events = new Discord.Collection();
client.enchants = new Discord.Collection();
client.textures = new Discord.Collection();
const cooldowns = new Discord.Collection();

const fs = require('fs');

function getCommands() {
	return client.commands
}
function getEvents() {
	return client.events
}
function getEnchants() {
	return client.enchants
}
function getTextures() {
	return client.textures
}

module.exports = { Users , currency , fs , Shop , Discord , getCommands , getEvents , getEnchants , getTextures };

client.once('ready', async () => {
	const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
	for (const file of commandFiles) {
		const command = require(`./commands/${file}`);
		client.commands.set(command.name, command);
	}
	const eventFiles = fs.readdirSync('./resources/events').filter(file => file.endsWith('.js'));
	for (const file of eventFiles) {
		const event = require(`./resources/events/${file}`);
		client.events.set(event.id, event);
	}
	const enchantFiles = fs.readdirSync('./resources/enchants').filter(file => file.endsWith('.js'));
	for (const file of enchantFiles) {
		const ench = require(`./resources/enchants/${file}`);
		client.enchants.set(ench.id, ench);
	}
	const storedBalances = await Users.findAll();
	storedBalances.forEach(b => currency.set(b.user_id, b));
	client.user.setPresence({ activity: { type: 'LISTENING', name: `${client.guilds.cache.size} servers. | ::help` } })
	console.log(`Logged in as ${client.user.tag}!`);
});


client.on('message', async message => {
	if (message.author.bot) return;
	if (message.channel.type === 'dm') return;
	let prefix = config.globalPrefix;
	let user = currency.get(message.author.id)
	let userEffects = await UserEffects.findOne({ where: { user_id: message.author.id }})
	if (!user) {
		user = await Users.create({ user_id: message.author.id });
		userEffects = await UserEffects.create({ user_id: message.author.id })
		currency.set(message.author.id, user);
		if (user.user_id === config.author) {
			user.addUniqueItem('god\_sword','weapon',0,10,'str',1,null, 1)
			user.addUniqueItem('wacking\_stick','weapon',4,0,'none',null,null, 1)
			user.balance += Number(100)
			user.save()
		}
	}
	const cause = func.updateEffects(user, userEffects)
	if (user.health < 1) {
		func.die(message, cause, user, userEffects)
	}
	if (!message.content.startsWith(prefix)) return;
	const input = message.content.slice(prefix.length).trim();
	if (!input.length) return;
	const [, command, args] = input.match(/(\w+)\s*([\s\S]*)/);
	const commandArgs = args.split(' ')
	
	// dev commands
	if (user.user_id == config.author) {
		if (command == 'devgive') {
			user.balance += Number(commandArgs)
			user.save()
			return func.log(`gave themselves ${commandArgs}`, message)
		
		} else if (command == 'createweapon') {
			if (!commandArgs[0]) return message.channel.send('item, type, enchant, damage, attribute, scale, heal, amount')
			func.log(`created an item`, message)
			return await user.addUniqueItem(commandArgs[0], commandArgs[1], commandArgs[2], commandArgs[3], commandArgs[4], commandArgs[5], commandArgs[6], commandArgs[7])
		
		} else if (command == 'pricechange') {
			let item = await Shop.findOne({ where: { name: commandArgs[0] } })
			if (!item) item = await Shop.findOne({ where: { id: commandArgs[0] } })
			if (!item) return message.channel.send('not an item')
			item.cost = Number(commandArgs[1])
			func.log(`changed the price of an item`, message)
			return item.save()

		} 
	}

	const commandToRun = client.commands.get(command)
		|| client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(command));
	if(!commandToRun){
		return;
	}

	// cooldown stuff
	if (!cooldowns.has(commandToRun.name)) {
		cooldowns.set(commandToRun.name, new Discord.Collection());
	}
	const now = Date.now();
	const timestamps = cooldowns.get(commandToRun.name);
	const cooldownAmount = (commandToRun.cooldown || 1) * 1000;
	if (timestamps.has(message.author.id)) {
		const expirationTime = timestamps.get(message.author.id) + cooldownAmount;
		if (now < expirationTime) {
			const timeLeft = (expirationTime - now) / 1000;
			return message.reply(`ahhhhh! too fast, slow it down for ${timeLeft.toFixed(1)} more second(s) before reusing the \`${commandToRun.name}\` command.`);
		}
	}

	timestamps.set(message.author.id, now);
	setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);
	try {
		return await commandToRun.execute(message, commandArgs, client);
	} catch (e) {
		func.log(`had an error with the ${command} command`, message)
		console.log(e)
	}

})

client.on("guildCreate", async (guild) => {
	console.log(`[INFO] - JOINED GUILD ${guild}`)
	client.user.setPresence({ activity: { type: 'LISTENING', name: `${client.guilds.cache.size} servers. | ::help` } })
})

client.on("guildDelete", async (guild) => {
		console.log(`[INFO] - LEFT GUILD ${guild}`)
		client.user.setPresence({ activity: { type: 'LISTENING', name: `${client.guilds.cache.size} servers. | ::help` } })
})

client.login(config.token).catch(console.error())