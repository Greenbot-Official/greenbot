const func = require('../resources/functions')
const app = require('../app')
const { UserItems, UserEffects, Enemy } = require('../dbObjects')
const { Op } = require('sequelize')

module.exports = {
  name: 'attack',
  aliases: ['atk'],
  description: 'attacks player you are currently in combat with',
  usage: 'attack',
  admin: false,
  removal: false,
  async execute(message, args, client) {
    const user = app.currency.get(message.author.id)
    if (!user.combat) return message.channel.send('you are not in combat')
    if (!user.turn) return message.channel.send('not your turn')
    const weapon = await UserItems.findOne({ where: { user_id: { [Op.like]: message.author.id }, equipped: true } })
    const userEffects = await UserEffects.findOne({ where: { user_id: message.author.id } })
    let scale = Number(0)
    if (weapon.attribute != 'none') {
      if (weapon.attribute === 'str') {
        scale = Math.round(user.strength * weapon.scale)
      } else if (weapon.attribute === 'dex') {
        scale = Math.round(user.dexterity * weapon.scale)
      }
    }
    let rand = Math.round(((Math.random() - 0.5) * 2) + (weapon.damage + scale))
    let crit = Boolean((Math.round(Math.random() * 100) + user.luck) > 99)
    if (crit) rand * 2

    //non-player combat
    if (user.combat_target_id == '0') {
      const enemy = await Enemy.findOne({ where: { user_id: message.author.id } })
      enemy.health -= Number(rand)
      enemy.save()
      func.log(`attacked enemy:${enemy.name}`, message, client);
      if (!crit) { message.channel.send(`${message.author.username} hit ${enemy.name} for ${rand}`); }
      else { message.channel.send(`${message.author.username} CRIT ${enemy.name} for ${rand}`) }
      if (enemy.health < 1) {
        user.combat = Boolean(false)
        user.combat_exp += Number(1)
        user.save()
        func.log(`killed enemy:${enemy.name}`, message, client)
        message.channel.send(`${message.author.username} killed the ${enemy.name}`)
        return await Enemy.destroy({ where: { user_id: message.author.id } })
      }
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
    const tUserEffects = await UserEffects.findOne({ where: { user_id: user.combat_target_id } })

    user.turn = Boolean(false)
    tUser.turn = Boolean(true)
    tUser.health -= Number(rand)
    user.save()
    tUser.save()
    if (weapon.enchant != null) {
      let ench = app.getEnchants()
      ench = ench.get(weapon.enchant)
      await ench.execute(message, null, tUserEffects, user, tUser)
    }

    func.log(`attacked ${user.combat_target_id}`, message, client);
    if (!crit) { message.channel.send(`${message.author.username} attacked ${user.combat_target} for ${rand}`); }
    else { message.channel.send(`${message.author.username} CRIT ${user.combat_target} for ${rand}`) }
    if (tUser.health < 1) {
      user.combat = Boolean(false)
      tUser.combat = Boolean(false)
      user.combat_exp += Number(tUser.combat_exp)
      tUser.health = Number(0)
      user.save()
      tUser.save()
      func.clearStatus(tUserEffects)
      func.log(`killed ${user.combat_target_id}`, message, client)
      func.die(message, `was killed by <@${message.author.id}>`, tUser, tUserEffects, client)
    }
    return message.channel.send(`<@${user.combat_target_id}>, it is your turn`)
  }
}