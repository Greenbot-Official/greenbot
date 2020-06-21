const app = require('../app')
const func = require('../resources/functions')

module.exports = {
  name: 'levelup',
  aliases: 'levelup',
  description: 'levels a stat up at the cost of money',
  usage: 'levelup {stat}',
  execute(message, args) {
		const user = app.currency.get(message.author.id);
		const bal = user.balance || 0;
		const calclvl = Math.pow(user.level + 1, 2)
    if (bal < calclvl) return message.channel.send(`you do not have enough currency to level up`)
    user.level += Number(1)
    user.balance -= Number(calclvl)
    user.save()
    var stat;
    if (args[0] === 'health') {
      stat = 'health'
      user.max_health += Number(1)
      user.health = user.max_health
      user.save()
      
    } else if (args[0] === 'luck') {
      stat = 'luck'
      user.luck += Number(1)
      user.save()

    } else {
      return message.channel.send(`unknown stat ${args}`)
    }
    func.log(`${message.author} leveled up their ${stat}`, message)
    return message.channel.send(`${message.author.username} leveled up their ${stat}`)

  }
}