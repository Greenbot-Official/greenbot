const app = require('../app')
const func = require('../resources/functions')
const { Users , UserItems, UserEffects } = require('../dbObjects')
const { Op } = require('sequelize');

module.exports = {
  name: 'use',
  aliases: 'use',
  description: 'eats a consumable to heal you',
  usage: 'eat {consumable}',
  admin: false,
  removal: false,
  async execute(message, args) {
    const user = app.currency.get(message.author.id)
		let item = await UserItems.findOne({ where: { item_id: { [Op.like]: args[0] } }});
		if (!item) {
      item = await UserItems.findOne({ where: { id: { [Op.like]: args[0] } }});
      if (!item) return message.channel.send(`unnable to find item ${args[0]}`)
    }
    const userEffects = await UserEffects.findOne({ where: { user_id: message.author.id } })
    if (item.amount < 0) return message.channel.send(`you do not own any ${item.item_id}s`)
    const heal = item.heal
    if (user.combat) {
      if (!user.turn) return message.channel.send('not your turn in combat')
      const tUser = app.currency.get(user.combat_target_id)
      user.turn = Boolean(false)
      tUser.turn = Boolean(true)
      user.save()
      tUser.save()
    }
    if (item.enchant != null) {
      let ench = app.getEnchants()
      ench = ench.get(item.enchant)
      await ench.execute(message, userEffects, null, user, null)
    }

    user.health = Number(Math.min(user.max_health, user.health + heal))
    if (item.item_id === 'water') func.clear(userEffects, 'burn', message)
    if (item.item_id === 'antidote') func.clear(userEffects, 'poison', message)
    await user.addItem(item.item_id, -1)
    
		func.log(`used a ${item.item_id}`, message);
    return message.channel.send(`${message.author.username} healed for ${heal}`);

  }
}