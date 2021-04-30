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
  removal: false,
  async execute(message, args, client) {
    const commands = app.getCommands()
    const target = message.author
    func.log(`is looking for help`, message, client)
    if (!config.tester.includes(message.author.id)) {
      return message.channel.send(commands.filter(c => !c.admin && !c.removal).map(c => `${c.usage}: - ${c.description}`).join('\n'), { code: true })
    } else {
      message.channel.send(commands.filter(c => !c.admin && !c.removal).map(c => `${c.usage}: - ${c.description}`).join('\n'), { code: true })
      if (args[0] == "admin" && config.author.includes(message.author.id)) {
        message.channel.send(`\n ---- admin ----`, { code: true })
        message.channel.send(commands.filter(c => c.admin && !c.removal).map(c => `${c.usage}: - ${c.description}`).join('\n'), { code: true })
        message.channel.send(`\n ---- marked for removal ----`, { code: true })
        message.channel.send(commands.filter(c => c.removal).map(c => `${c.usage}: - ${c.description}`).join('\n'), { code: true })
      } else if (args[0] == "test") {
        message.channel.send(`\n ---- marked for removal ----`, { code: true })
        message.channel.send(commands.filter(c => c.removal && !c.admin).map(c => `${c.usage}: - ${c.description}`).join('\n'), { code: true })
      }
      return
    }
  }
}