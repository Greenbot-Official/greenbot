const func = require('../resources/functions')

module.exports = {
  name: 'mug',
  aliases: 'mug',
  description: 'mugs target',
  usage: 'mug [@target]',
  cooldown: '300',
  execute(message, args) {
    const target = message.mentions.users.first() || message.author
    const id = target.id
    const tBal = func.getBalance(id)
    const crimexp = func.getCrimeExp(message.author.id)
		const randmult = crimexp / 3
    var rand = Math.round(Math.random() * randmult + 1)
    if (target === message.author) {
      func.addCrimeExp(message.author.id, 1)
      func.add(message.author.id, rand)
      func.log(`${message.author} mugged an innocent civilian for ${rand}`, message)
      return message.channel.send(`${message.author} mugged an innocent civilian for ${rand}💰`)

    } else {
      if (!func.getUser(target.id)) throw app.throwError('invalidTarget')
      func.addCrimeExp(message.author.id, 1)
      rand = Math.min(rand, tBal)
      func.add(message.author.id, rand)
      func.add(target.id, -rand)
      func.log(`${message.author} mugged ${target} for ${rand}`, message)
      return message.channel.send(`${message.author} mugged ${target} for ${rand}💰`)

    }

  }
}