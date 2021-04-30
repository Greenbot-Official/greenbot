const app = require('../app')
const func = require('../resources/functions')

module.exports = {
  name: 'level',
  aliases: 'lvl',
  description: 'checks target\'s level up status or levels up a stat',
  usage: 'level [@target || stat]',
  admin: false,
  removal: false,
  async execute(message, args, client) {
    const target = message.mentions.users.first() || message.author
		const user = app.currency.get(target.id);
    const level = user.level || 0;
    const calclvl = func.calclvl(user.level)
    if (!args[0]) {
      func.log(`checked ${target} level`, message, client)
      return message.channel.send(`${target.username}'s level: \n${level} \n${target.username}'s next level up: \n${calclvl}💰\n` + 
      'stats available for levelup:\nhealth\nluck\nstrength\ndexterity', { code: true })

    } else {
      if (user.combat) return message.channel.send('you cannot do that while in combat')
      const bal = user.balance || 0;
      const calclvl = func.calclvl(user.level)
      if (bal < calclvl) return message.channel.send(`you do not have enough currency to level up`)
      user.level += Number(1)
      user.balance -= Number(calclvl)
      user.save()
      let stat;
      if (args[0] === 'health') {
        stat = 'health'
        user.max_health += Number(1)
        user.health = user.max_health
  
      } else if (args[0] === 'luck') {
        stat = 'luck'
        user.luck += Number(1)
  
      } else if (args[0] === 'strength' || args[0] === 'str') {
        stat = 'strength'
        user.strength += Number(1)
  
      } else if (args[0] === 'dexterity' || args[0] === 'dex') {
        stat = 'dexterity'
        user.dexterity += Number(1)
  
      } else {
        return message.channel.send(`unknown stat ${args}`)
      }
      user.save()
      func.log(`leveled up their ${stat}`, message, client)
      return message.channel.send(`${message.author.username} leveled up their ${stat}`)

    }
  }
}