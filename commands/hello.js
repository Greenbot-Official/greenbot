const func = require('../resources/functions')

module.exports = {
  name: 'hello',
  aliases: 'hi',
  description: 'says hello',
  usage: 'hello',
  execute(message, args) {
		func.log(`says hello`, message);
    return message.channel.send("hi, I am greenbot");

  }
}