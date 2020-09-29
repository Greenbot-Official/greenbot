const func = require('../resources/functions')
const app = require('../app')

module.exports = {
  name: 'hello',
  aliases: 'hi',
  description: 'says hello',
  usage: 'hello',
  admin: false,
  execute(message, args) {
		func.log(`says hello`, message);
    return message.channel.send(`hi, I am greenbot`);

  }
}