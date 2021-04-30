const func = require('../resources/functions')
const app = require('../app')

module.exports = {
  name: 'nuke',
  aliases: 'nuke',
  description: 'says hello',
  usage: 'nuke {@user} {text} [number]',
  admin: true,
  removal: false,
  async execute(message, args, client) {
    const target = message.mentions.users.first() || args[0]
    const target2 = String(target).replace('!','')
    const text = args[1].replace('_',' ')
    const num = args[2] || 10
    await target.createDM()
    func.log(`nuked ${target2} with \"${text}\" ${num} times`, message, client)
    let i = 0
    message.delete()
    while (i < num) {
      i++
      await target.dmChannel.send(`${text}`);
    }
    return func.log(`finished nuking ${target2}`, message, client)
  }
}