const config = require('./config');
const Discord = require('discord.js');
const Sequelize = require('sequelize');
const { Users , Shop } = require('./dbObjects');
const { Op } = require('sequelize');
const func = require('./resources/functions')

const client = new Discord.Client();
const currency = new Discord.Collection();
client.commands = new Discord.Collection();
client.events = new Discord.Collection();
client.enchants = new Discord.Collection();
const cooldowns = new Discord.Collection();

const fs = require('fs');
const { CLIENT_RENEG_LIMIT } = require('tls');

function getCommands() {
	return client.commands
}
function getEvents() {
	return client.events
}
function getEnchants() {
	return client.enchants
}

module.exports = { Users , client , currency , fs , Shop , Discord , getCommands , getEvents , getEnchants };

client.once('ready', async () => {
	var count = 1
	var i = 1
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
	client.user.setPresence({
    status: 'online',
    activity: {
        name: 'chillin with Lightning27009#1842',
        type: 'PLAYING',
        url: 'https://discord.com/oauth2/authorize?client_id=703642701974995085&scope=bot&permissions=8'
    }
	})
	console.log(`Logged in as ${client.user.tag}!`);
});


client.on('message', async message => {
	if (message.author.bot) return;
	if (message.channel.type === 'dm') return;
	let prefix = config.globalPrefix;
	const user = currency.get(message.author.id)
	if (!user) {
		const newUser = await Users.create({ user_id: message.author.id });
		currency.set(message.author.id, newUser);
		if (newUser.user_id === config.author) {
			newUser.addUniqueItem('god\_sword','weapon','flame',10,null)
			newUser.addUniqueItem('debug\_stick','weapon','flame',0,null)
		}
	}
	var cause
	if (user.burn > 0) {
		user.health -= Number(1)
		user.burn -= Number(1)
		user.save()
		cause = 'burned to death'
	}
	if (user.health < 1) {
		user.health = Number(1)
		user.save()
		func.clearStatus()
		func.log(`${message.author} ${cause}`, message)
		message.reply(`${cause}`)
	}
	if (!message.content.startsWith(prefix)) return;
	const input = message.content.slice(prefix.length).trim();
	if (!input.length) return;
	const [, command, args] = input.match(/(\w+)\s*([\s\S]*)/);
	const commandArgs = args.split(' ')
	
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
		return commandToRun.execute(message, commandArgs, client);
	} catch (e) {
		console.log(e)
	}

});

client.login(config.token);