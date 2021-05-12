const func = require('../resources/functions')
const app = require('../app')
const config = require('../config.json')

module.exports = {
  name: 'reloadcmd',
  aliases: ['reloadcmd'],
  description: 'reloads all commands',
  usage: 'reloadcmd',
  admin: true,
  removal: false,
  async execute(message, args, client) {
    func.logconsole(`restarting bot`, message, client);
    process.exit()

  }
}