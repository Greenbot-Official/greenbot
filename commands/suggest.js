const func = require('../resources/functions')
const app = require('../app')
const config = require('../config.json')

module.exports = {
  name: 'suggest',
  aliases: ['suggest'],
  description: 'can send bug reports or suggestions for the bot',
  usage: 'suggest {text}',
  admin: false,
  removal: false,
  async execute(message, args, client) {
    let text = ''
    for (let i = 0; i <= args.length; i++) {
      text = `${text} ${args[i]}`
    }
    func.log(`sent a support mesage`, message, client);
    return client.channels.cache.get('843532773138366505').send(`${message.author.username} says:\n${text}`)

  }
}