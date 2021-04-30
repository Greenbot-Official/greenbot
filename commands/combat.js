const func = require('../resources/functions')
const app = require('../app')
const { UserItems } = require('../dbObjects')

module.exports = {
  name: 'combat',
  aliases: 'combat',
  description: 'initiates combat with a player',
  usage: 'combat [@target]',
  cooldown: '0',
  admin: false,
  removal: true,
  async execute(message, args) {
    const target = message.mentions.users.first()
    const user = app.currency.get(message.author.id)
    if (!args[0]) {
      if (!user.combat) return message.channel.send('you are not in combat, mention a user to start')
      return message.channel.send(`you are in combat with ${user.combat_target}\n`
        + `attack: attacks player you are currently in combat with\n`
        + `run: attemt to flee from combat`, { code: true })
    }
    const tUser = app.currency.get(target.id)
    const equipped = await UserItems.findOne({ where: { user_id: message.author.id, equipped: true } })
    const tEquipped = await UserItems.findOne({ where: { user_id: user.combat_target_id, equipped: true } })
    if (!tUser || !target) return message.channel.send('unnable to find that user')
    if (user.combat) return message.channel.send('you are unnable to initiate combat')
    if (tUser.combat) return message.channel.send('that player is already in combat')
    if (!equipped) return message.channel.send('your target does not have a weapon')
    if (!tEquipped) return message.channel.send('you cannot enter combat without a weapon')
    if (Number(tUser.health / tUser.max_health) < Number(3 / 4)) return message.channel.send('that player\'s is too low health')

    user.combat = Boolean(true)
    user.combat_target = target.username
    user.combat_target_id = target.id
    user.combat_exp += Number(1)
    user.turn = Boolean(false)
    tUser.combat = Boolean(true)
    tUser.combat_target = message.author.username
    tUser.combat_target_id = message.author.id
    tUser.combat_exp += Number(1)
    tUser.turn = Boolean(true)
    user.save()
    tUser.save()

    func.log(`initiated combat with <@${target.id}>`, message);
    return message.channel.send(`${message.author.username} initiated combat with ${target.username}`);

  }
}