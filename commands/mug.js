const app = require('../app')

module.exports = {
  name: 'mug',
  aliases: 'mug',
  description: 'mugs target',
  usage: 'mug [@target]',
  cooldown: '300',
  execute(message, args) {
    const target = message.mentions.users.first() || message.author
    const id = target.id
    const tBal = app.getBalance(id)
    const crimexp = app.getCrimeExp(message.author.id)
		const randmult = crimexp / 3
    var rand = Math.round(Math.random() * randmult + 1)
    if (target === message.author) {
      app.addCrimeExp(message.author.id, 1)
      app.add(message.author.id, rand)
      app.log(`${message.author} mugged an innocent civilian for ${rand}`, message)
      return message.channel.send(`${message.author} mugged an innocent civilian for ${rand}💰`)

    } else {
      if (!app.getUser(target.id)) throw app.throwError('invalidUser')
      app.addCrimeExp(message.author.id, 1)
      rand = Math.min(rand, tBal)
      app.add(message.author.id, rand)
      app.add(target.id, -rand)
      app.log(`${message.author} mugged ${target} for ${rand}`, message)
      return message.channel.send(`${message.author} mugged ${target} for ${rand}💰`)

    }

  }
}