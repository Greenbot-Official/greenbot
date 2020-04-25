const Discord = require('discord.js');
const { prefix, token } = require('./config.json');
const client = new Discord.Client();

client.once('ready', () => {
  console.log('Ready!');
})

client.on('message', message => {
  if (message.content.startsWith(prefix)) {
		const input = message.content.slice(prefix.length).split(' ');
		const command = input.shift();
		const commandArgs = input.join(' ');
    if (command === 'e') {
      message.channel.send("hi, I am greenbot");
    }
  }
});

client.login(token);