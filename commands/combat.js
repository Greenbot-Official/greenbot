const func = require('../resources/functions')
const app = require('../app')
const { UserItems } = require('../dbObjects')
const { DOUBLE } = require('sequelize/types')

module.exports = {
  name: 'combat',
  aliases: 'combat',
  description: 'initiates combat with a player',
  usage: 'combat [@target]',
  async execute(message, args) {
    const target = message.mentions.users.first()
    const user = app.currency.get(message.author.id)
    if (!args[0]) {
      if (!user.combat) return message.channel.send('you are not in combat')
      return message.channel.send(`you are in combat with ${user.combat_target}`)
    }
    const tUser = app.currency.get(target.id)
    const equipped = await UserItems.findOne({ where: { equipped: true }})
    if (!tUser) return message.channel.send('unnable to find that user')
    if (user.combat) return message.channel.send('you are unnable to initiate combat')
    if (tUser.combat) return message.channel.send('that player is already in combat')
    if (!equipped) return message.channel.send('you cannot enter combat without a weapon')
    if (Number(tUser.health / tUser.max_health) < Number(3/4)) return message.channel.send('that player is too low health')

    user.combat = Boolean(true)
    user.combat_target = target.username
    user.combat_target_id = target.id
    user.combat_exp += Number(1)
    user.turn = Boolean(true)
    tUser.combat = Boolean(true)
    tUser.combat_target = message.author.username
    tUser.combat_target_id = message.author.id
    tUser.combat_exp += Number(1)
    tUser.turn = Boolean(false)
    user.save()
    tUser.save()

		func.log(`${message.author.id} initiated combat with ${target.id}`, message);
    return message.channel.send(`${message.author.username} initiated combat with ${target.username}`);

  }
}