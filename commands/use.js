const app = require('../app')
const func = require('../resources/functions')
const { UserItems, UserEffects } = require('../dbObjects')
const { Op } = require('sequelize');

module.exports = {
  name: 'use',
  aliases: ['eat'],
  description: 'use a consumable or apply enchanting dust',
  usage: 'use {consumable}',
  admin: false,
  removal: false,
  async execute(message, args, client) {
    const user = app.currency.get(message.author.id)
    let item = await UserItems.findOne({ where: { item_id: { [Op.like]: args[0] } } });
    if (!item) {
      item = await UserItems.findOne({ where: { id: { [Op.like]: args[0] } } });
      if (!item) return message.channel.send(`unnable to find item ${args[0]}`)
    }
    const userEffects = await UserEffects.findOne({ where: { user_id: message.author.id } })
    if (item.amount < 0) return message.channel.send(`you do not own any ${item.item_id}s`)
    if (user.combat) {
      if (!user.turn) return message.channel.send('not your turn in combat')
      const tUser = app.currency.get(user.combat_target_id)
      user.turn = Boolean(false)
      tUser.turn = Boolean(true)
      user.save()
      tUser.save()
    }
    if (item.type == 'c') {
      const heal = item.heal
      if (item.enchant != null) {
        let ench = app.getEnchants()
        ench = ench.get(item.enchant)
        await ench.execute(message, userEffects, null, user, null)
      }

      user.health = Number(Math.min(user.max_health, user.health + heal))
      await user.addItem(item.item_id, -1)
    
      func.log(`used a ${item.item_id}`, message, client);
      return message.channel.send(`${message.author.username} healed for ${heal}`);
    } else if (item.type == 'e') {
      const equipped = await UserItems.findOne({ where: { user_id: { [Op.like]: message.author.id }, equipped: true } })
      if (!equipped) return message.channel.send('must have a weapon equipped to enchant')
      if (user.level_points < item.ecost) return message.channel.send('you dont have enough level points')
      equipped.amount -= Number(1)
      equipped.save()
      await UserItems.upsert({})
      user.level_points -= Number(item.ecost)
      await user.addItem(item.item_id, -1)
      user.save()
      func.log(`enchanted ${equipped.item_id} with ${item.ench}`, message, client);
      return message.channel.send(`${message.author.username} healed for ${heal}`);
    }
    return message.channel.send(`${args[0]} is not a consumable`)
  }
}