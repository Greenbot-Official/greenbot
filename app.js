const config = require('./config');
const Discord = require('discord.js');

const client = new Discord.Client();
const PREFIX = '::';

client.once('ready', async () => {
	console.log(`Logged in as ${client.user.tag}!`);
});

client.on('message', async message => {
	const id = message.author.id;
	const messageId = message.id
	if (!message.content.startsWith(PREFIX)) return;
	const input = message.content.slice(PREFIX.length).trim();
	if (!input.length) return;
	const [, command, commandArgs] = input.match(/(\w+)\s*([\s\S]*)/);
	if (message.author.bot) return;

	if (command === 'hello') {
    return message.channel.send("hi, I am greenbot");
  
	} else if (command === 'dm') {
		const dUser = message.mentions.users.first();
		if (!dUser) return message.channel.send("Can't find user!")
    if(!message.member.hasPermission("ADMINISTRATOR")) return message.reply("You can't you that command!")
    mentionMessage = commandArgs;
    if(mentionMessage.length < 1) return message.reply('You must supply a message!')
    dUser.send(`${mentionMessage}`)
		message.author.send(`${message.author} You have sent your message to ${dUser}`)

	} else if (command === 'help') {

  } else if (command === 'dummy') {
		const target = message.mentions.users.first()
		if (!target) return;
		return message.channel.send(`${target} is a dummy`)

	}
  
});

client.login(config.token);