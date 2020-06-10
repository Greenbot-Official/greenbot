const func = require('../resources/functions')
const fs = require('fs');

module.exports = {
  name: 'help',
  aliases: 'help',
  description: 'displays help menu',
  usage: 'help',
  execute(message, args, client) {
    const commands = func.getCommands()
    func.log(`${message.author} is looking for help`, message)
    return message.channel.send(commands.map(c => `${c.usage}: - ${c.description}`).join('\n'), { code: true })

  }
}