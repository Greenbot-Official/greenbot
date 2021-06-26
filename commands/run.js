const func = require('../resources/functions')
const app = require('../app')
const { Enemy, UserEffects } = require('../dbObjects')

module.exports = {
  name: 'run',
  aliases: ['run'],
  description: 'attempt to leave combat',
  usage: 'run',
  admin: false,
  removal: false,
  async execute(message, args, client) {
    const user = app.currency.get(message.author.id)
    if (!user.combat) return message.channel.send('you are not in combat')
    if (!user.turn) return message.channel.send('not your turn')
    let rand = Math.random() * 4

    if (user.combat_target_id == '0') {
      const enemy = await Enemy.findOne({ where: { user_id: message.author.id } })
      const userEffects = await UserEffects.findOne({ where: { user_id: message.author.id } })
      let erand = Math.round(((Math.random() - 0.5) * 2) + (enemy.damage))
      let ecrit = Boolean((Math.round(Math.random() * 100) + 5) > 99)
      if (ecrit) erand * 2
      user.health -= Number(erand)
      user.save()
      if (!ecrit) { message.channel.send(`${message.author.username} was hit by ${enemy.name} for ${erand}`); }
      else { message.channel.send(`${message.author.username} was CRIT by ${enemy.name} for ${erand}`) }
      if (user.health < 1) {
        user.combat = Boolean(false)
        user.save()
        func.die(message, `was killed by the ${enemy.name}`, user, userEffects, client)
        return await Enemy.destroy({ where: { user_id: message.author.id } })
      }
    }

    const tUser = app.currency.get(user.combat_target_id)
    user.turn = Boolean(false)
    tUser.turn = Boolean(true)
    user.save()
    tUser.save()

    if (rand < 3) {
      message.channel.send('you failed to run away')
      return message.channel.send(`<@${user.combat_target_id}>, it is your turn`)
    }
    user.combat = Boolean(false)
    user.combat_exp -= Number(1)
    tUser.combat = Boolean(false)
    tUser.combat_exp += Number(1)
    user.save()
    tUser.save()

    func.log(`ran away from ${user.combat_target_id}`, message, client);
    return message.channel.send(`${message.author.username} ran away from ${user.combat_target}`);

  }
}