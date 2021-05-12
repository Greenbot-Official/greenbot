const func = require('../resources/functions')
const app = require('../app')

module.exports = {
  name: 'spam',
  aliases: ['spam'],
  description: 'says hello',
  usage: 'spam {@user} {text} [number]',
  admin: true,
  removal: false,
  async execute(message, args, client) {
    const text = args[0].replace('_',' ')
    const num = args[1] || 10
    func.log(`spamed \"${text}\" ${num} times`, message, client)
    let i = 0
    message.delete()
    while (i < num) {
      i++
      message.channel.send(`${text}`)
    }
    return func.log(`finished spamming ${target}`, message, client)
  }
}