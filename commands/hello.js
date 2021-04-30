const func = require('../resources/functions')
const app = require('../app')
const config = require('../config.json')

module.exports = {
  name: 'hello',
  aliases: 'hi',
  description: 'says hello',
  usage: 'hello',
  admin: false,
  removal: false,
  async execute(message, args, client) {
    func.log(`says hello`, message, client);
    return message.channel.send(`hi, I am greenbot`);

  }
}