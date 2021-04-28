const func = require('../resources/functions')
const app = require('../app')

module.exports = {
  name: 'nuke',
  aliases: 'nuke',
  description: 'says hello',
  usage: 'nuke {@user} {text} [number]',
  admin: true,
  removal: false,
  async execute(message, args) {
    const target = message.mentions.users.first() || args[0]
    const text = args[1].replace('_',' ')
    const num = args[2] || 10
    func.log(`nuked ${target} with \"${text}\" ${num} times`, message)
    let i = 0
    while (i < num) {
      i++
      await app.getCommands().dm.execute(message, args)
    }
    return func.log(`finished nuking ${target}`, message)
  }
}