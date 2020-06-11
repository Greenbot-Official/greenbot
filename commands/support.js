const func = require('../resources/functions')

module.exports = {
  name: 'support',
  aliases: 'support',
  description: 'gets link to the support server',
  usage: 'support',
  execute(message, args) {
		func.log(`${message.author} is looking for the support server`, message);
    return message.channel.send("https://discord.gg/teVCtMX");

  }
}