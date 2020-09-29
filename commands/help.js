const func = require('../resources/functions')
const app = require('../app')
const fs = require('fs');
const config = require('../config.json')

module.exports = {
  name: 'help',
  aliases: 'help',
  description: 'displays help menu',
  usage: 'help',
  admin: false,
  execute(message, args) {
    const commands = app.getCommands()
    const target = message.author
    func.log(`is looking for help`, message)
    if (message.author.id != config.author) {
      return message.channel.send(commands.filter(c => !c.admin).map(c => `${c.usage}: - ${c.description}`).join('\n'), { code: true })
    } else {
      return message.channel.send(commands.map(c => `${c.usage}: - ${c.description}`).join('\n'), { code: true })
    }
  }
}