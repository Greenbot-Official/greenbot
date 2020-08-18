const func = require('../resources/functions')
const app = require('../app')
const fs = require('fs');

module.exports = {
  name: 'help',
  aliases: 'help',
  description: 'displays help menu',
  usage: 'help',
  execute(message, args) {
    const commands = app.getCommands()
    const target = message.author
    func.log(`is looking for help`, message)
    if (!args[0]) {
      return message.channel.send(commands.map(c => `${c.usage}: - ${c.description}`).join('\n'), { code: true })
    }
  }
}