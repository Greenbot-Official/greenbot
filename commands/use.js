const app = require('../app')
const func = require('../resources/functions')
const { Users , UserItems } = require('../dbObjects')
const { Op } = require('sequelize');

module.exports = {
  name: 'use',
  aliases: 'use',
  description: 'eats a consumable to heal you',
  usage: 'eat {consumable}',
  async execute(message, args) {
    const user = app.currency.get(message.author.id)
		var item = await UserItems.findOne({ where: { item_id: { [Op.like]: args[0] } }});
		if (!item) {
      item = await UserItems.findOne({ where: { id: { [Op.like]: args[0] } }});
      if (!item) return message.channel.send(`unnable to find item ${args[0]}`)
    }
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

    user.health = Number(Math.min(user.max_health, user.health + heal))
    if (item.item_id === 'water') user.burn = Number(0)
    user.addItem(item.item_id, -1)
    
		func.log(`${message.author} used a ${args[0]}`, message);
    return message.channel.send(`${message.author.username} healed for ${heal}`);

  }
}