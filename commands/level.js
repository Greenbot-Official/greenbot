const app = require('../app')
const func = require('../resources/functions')

module.exports = {
  name: 'level',
  aliases: ['lvl'],
  description: 'levels up a stat',
  usage: 'level [stat] [amount]',
  admin: false,
  removal: false,
  async execute(message, args, client) {
		const user = app.currency.get(message.author.id);
    if (!args[0]) {
      func.log(`checked their level`, message, client)
      return message.channel.send(`${message.author.username}\nlevel:${user.level}  ${user.exp}/${func.calclvl(user.level)}\npoints: ${user.level_points}\n` +
      'stats available for levelup:\nhealth\nluck\nstrength\ndexterity', { code: true })

    } else {
      if (user.combat) return message.channel.send('you cannot do that while in combat')
      if (user.level_points <= 0) return message.channel.send('you do not have any level points')
      let amount = args[1] || 1
      if (amount == 'max') amount = user.level_points
      if (isNaN(amount)) return message.channel.send('please enter a number')
      amount = Math.min(amount, user.level_points)
      user.level_points -= Number(amount)
      user.save()
      let stat;
      if (args[0] == 'health') {
        stat = 'health'
        user.max_health += Number(amount)
        user.health = user.max_health
  
      } else if (args[0] == 'luck') {
        stat = 'luck'
        user.luck += Number(amount)
  
      } else if (args[0] == 'strength' || args[0] == 'str') {
        stat = 'strength'
        user.strength += Number(amount)
  
      } else if (args[0] == 'dexterity' || args[0] == 'dex') {
        stat = 'dexterity'
        user.dexterity += Number(amount)
  
      } else {
        return message.channel.send(`unknown stat ${args}`)
      }
      user.save()
      func.log(`leveled up their ${stat}`, message, client)
      return message.channel.send(`${message.author.username} leveled up their ${stat} ${amount} ${amount > 1 ? `times` : `time`}`)

    }
  }
}