const app = require('../app')
const func = require('../resources/functions')

module.exports = {
  name: 'levelup',
  aliases: 'lvlup',
  description: 'levels a stat up at the cost of money',
  usage: 'levelup {stat}',
  execute(message, args) {
		const user = app.currency.get(message.author.id);
		if (user.combat) return message.channel.send('you cannot do that while in combat')
		const bal = user.balance || 0;
		const calclvl = (user.level + 1) * 3
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
    func.log(`leveled up their ${stat}`, message)
    return message.channel.send(`${message.author.username} leveled up their ${stat}`)

  }
}