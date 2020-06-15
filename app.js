const { token , globalPrefix , ownerId , support_guildId , suggestion_channelId } = require('./config');
const Discord = require('discord.js');
const Sequelize = require('sequelize');
const { Users , Shop } = require('./dbObjects');
const { Op } = require('sequelize');
const func = require('./resources/functions')

const client = new Discord.Client();
const currency = new Discord.Collection();
client.commands = new Discord.Collection();
const cooldowns = new Discord.Collection();

const fs = require('fs');

function getCommands() {
	return client.commands
}

module.exports = { Users , client , currency , fs , Shop , Discord , getCommands };

client.once('ready', async () => {	
	const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
	for (const file of commandFiles) {
		const command = require(`./commands/${file}`);
		client.commands.set(command.name, command);
	}
	const storedBalances = await Users.findAll();
	storedBalances.forEach(b => currency.set(b.user_id, b));
	console.log(`Logged in as ${client.user.tag}!`);
});


client.on('message', async message => {
	if (message.author.bot) return;
	if (message.channel.type === 'dm') return;
	let prefix = globalPrefix;
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
		return commandToRun.execute(message, commandArgs);
	} catch (e) {
		console.log(e)
	}

});

client.login(token);