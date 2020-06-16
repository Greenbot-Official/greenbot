const func = require('../resources/functions')
const app = require('../app')

module.exports = {
  name: 'goblin',
  id: 0,
  level: '1',
  async execute(message, user) {
    var kill = Boolean((Math.round(Math.random() * 100) + user.luck) > 69)
    if (!kill) {
      user.health -= Number(1)
      user.save()
      func.log(`${message.author} was attacked by a goblin`, message)
      message.channel.send(`${message.author.username} was attacked by a goblin`)
    } else {
      user.balance += Math.round(Math.random() + 1 * 2)
      user.combat_exp += Number(1)
      user.health -= Math.round(Math.random())
      user.save()
      func.log(`${message.author} was attacked by a goblin but killed it`, message)
      message.channel.send(`${message.author.username} was attacked by a goblin but killed it`)
    }
    if (user.health < 1) {
      func.log(`${message.author} was killed by a goblin`, message)
      message.channel.send(`${message.author.username} was killed by a goblin`)
    }
    return
  },
}