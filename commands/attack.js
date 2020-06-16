const func = require('../resources/functions')
const app = require('../app')
const { UserItems } = require('../dbObjects')

module.exports = {
  name: 'attack',
  aliases: 'atk',
  description: 'attacks player you are currently in combat with',
  usage: 'attack',
  async execute(message, args) {
    const user = app.currency.get(message.author.id)
    if (!user.combat) return message.channel.send('you are not in combat')
    if (!user.turn) return message.channel.send('not your turn')
    const tUser = app.currency.get(user.combat_target_id)
    const weapon = await UserItems.findOne({ where: { equipped: true }})
    var rand = Math.round(((Math.random() - 0.5) * 2) + weapon.damage)
    var crit = Boolean((Math.round(Math.random() * 100) + user.luck) > 99)
    if (crit) rand * 2

    user.turn = Boolean(false)
    tUser.turn = Boolean(true)
    tUser.health -= Number(rand)
    user.save()
    tUser.save()

		func.log(`${message.author} attacked ${user.combat_target_id}`, message);
    if (!crit) { message.channel.send(`${message.author.username} attacked ${user.combat_target} for ${rand}`); }
    else { message.channel.send(`${message.author.username} CRIT ${user.combat_target} for ${rand}`) }
    if (tUser.health < 1) {
      user.combat = Boolean(false)
      tUser.combat = Boolean(false)
      user.combat_exp += Number(tUser.combat_exp)
      tUser.health = Number(0)
      user.save()
      tUser.save()
      func.log(`${message.author} killed ${user.combat_target_id}`)
      message.channel.send(`${message.author.username} killed ${user.combat_target}`)
    }
    return
  }
}