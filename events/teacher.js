const func = require('../resources/functions')
const app = require('../app')

module.exports = {
  name: 'teacher',
  id: 1,
  level: '1',
  async execute(message, user) {
    const rand = Math.round(Math.random() * 3)
    var stat;
    switch (rand) {
      case 0:
        stat = 'being lucky'
        user.luck += Number(1)
        break;
      case 1:
        stat = 'fighting'
        user.combat_exp += Number(2)
        break;
      case 2:
        stat = 'fishing'
        user.fish_exp += Number(2)
        break;
      case 3:
        stat = 'crime'
        user.crime_exp += Number(2)
        break;
    }
    user.save()
    return message.channel.send(`you met someone who tought you about ${stat}`)
  },
}