const app = require('../app')

module.exports = {
  name: 'hello',
  aliases: 'hi',
  description: 'says hello',
  usage: 'hello',
  execute(message, args) {
		app.log(`${message.author} says hello`, message);
    return message.channel.send("hi, I am greenbot");

  }
}