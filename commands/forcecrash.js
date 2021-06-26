const func = require('../resources/functions')
const app = require('../app')
const config = require('../config.json')

module.exports = {
  name: 'forcecrash',
  aliases: ['fcrash'],
  description: 'crashes bot',
  usage: 'forcecrash',
  admin: true,
  removal: false,
  async execute(message, args, client) {
    if (message.author.id != config.author) return
    func.logconsole(`killing bot`, message, client);
    client.destroy(config.token)

  }
}