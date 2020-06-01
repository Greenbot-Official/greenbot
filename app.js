const config = require('./config');
const Discord = require('discord.js');

const client = new Discord.Client();
const PREFIX = '::';
const fs = require('fs');

client.once('ready', async () => {
	console.log(`Logged in as ${client.user.tag}!`);
});

function log(text , guild , time) {
	var readmessagefile = fs.readFileSync('log.txt', `utf-8`);
	var writemessagefile = fs.writeFileSync('log.txt', `${time}: ${guild} - ${text} \n` + readmessagefile)
	console.log(`${time}: ${guild} - ${text}`)
}

client.on('message', async message => {
	const id = message.author.id;
	const author = message.author.username
	const guild = message.guild
	if (!message.content.startsWith(PREFIX)) return;
	const input = message.content.slice(PREFIX.length).trim();
	if (!input.length) return;
	const [, command, commandArgs] = input.match(/(\w+)\s*([\s\S]*)/);
	if (message.author.bot) return;

	if (command === 'hello') {
		log(`${author} says hello`, guild, message.createdAt)
    return message.channel.send("hi, I am greenbot");
  
	} else if (command === 'dm') {
		const dUser = message.mentions.users.first();
		if (!dUser) return message.channel.send("Can't find user!")
    if(!message.member.hasPermission("ADMINISTRATOR")) return message.reply("You can't you that command!")
    mentionMessage = commandArgs;
    if(mentionMessage.length < 1) return message.reply('You must supply a message!')
		dUser.send(`${mentionMessage}`)
		return log(`${author} sent ${mentionMessage} to ${dUser}`, guild, message.createdAt)

	} else if (command === 'help') {
		message.channel.send('help \nhello - says hello \ndummy {@target} - calls target a dummy \ndm {@target} {message} - sends target a dm (admin only)')
		return log(`${author} is looking for help`, guild, message.createdAt)

  } else if (command === 'dummy') {
		const target = message.mentions.users.first()
		if (!target) return;
		log(`${author} called ${target} a dummy`, guild, message.createdAt)
		return message.channel.send(`${target} is a dummy`)

	}
  
});

client.login(config.token);