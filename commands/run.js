const func = require('../resources/functions')
const app = require('../app')

module.exports = {
  name: 'run',
  aliases: 'run',
  description: 'attempt to leave combat',
  usage: 'run',
  execute(message, args) {
    const user = app.currency.get(message.author.id)
    if (!user.combat) return message.channel.send('you are not in combat')
    if (!user.turn) return message.channel.send('not your turn')
    const tUser = app.currency.get(user.combat_target_id)
    var rand = Math.round(Math.random() * 5)

    user.turn = Boolean(false)
    tUser.turn = Boolean(true)
    user.save()
    tUser.save()

    if (rand < 5) return message.channel.send('you failed to run away')

    user.combat = Boolean(false)
    user.combat_exp -= Number(1)
    tUser.combat = Boolean(false)
    tUser.combat_exp += Number(1)
    user.save()
    tUser.save()

		func.log(`ran away from ${user.combat_target_id}`, message);
    return message.channel.send(`${message.author.username} ran away from ${user.combat_target}`);

  }
}