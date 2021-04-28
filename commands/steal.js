const app = require('../app')
const func = require('../resources/functions')

module.exports = {
  name: 'steal',
  aliases: 'steal',
  description: 'chance to steal money from target',
  usage: 'mug [@target]',
  cooldown: '300',
  admin: false,
  removal: true,
  execute(message, args) {
    const target = message.mentions.users.first() || message.author
    const user = app.currency.get(target.id)
    const tBal = user.balance
    if (target === message.author) {
      app.addCrimeExp(message.author.id, 1)
      app.add(message.author.id, rand)
      func.log(`mugged an innocent civilian for ${rand}`, message)
      return message.channel.send(`${message.author} mugged an innocent civilian for ${rand}💰`)

    } else {
      app.addCrimeExp(message.author.id, 1)
      rand = Math.min(rand, tBal)
      app.add(message.author.id, rand)
      app.add(target.id, -rand)
      app.log(`${message.author} mugged ${target} for ${rand}`, message)
      return message.channel.send(`${message.author} mugged ${target} for ${rand}💰`)

    }

  }
}