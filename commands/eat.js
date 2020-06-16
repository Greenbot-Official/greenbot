const app = require('../app')
const func = require('../resources/functions')
const { Users , UserItems } = require('../dbObjects')
const { Op } = require('sequelize');

module.exports = {
  name: 'eat',
  aliases: 'eat',
  description: 'says hello',
  usage: 'eat {consumable}',
  async execute(message, args) {
    const user = app.currency.get(message.author.id)
		const item = await UserItems.findOne({ where: { item_id: { [Op.like]: args[0] } } });
		if (!item) return message.channel.send(`unnable to find item ${item.name}`)
    if (item.amount < 0) return message.channel.send(`you do not own any ${item.item_id}s`)
    const heal = item.heal

    if (user) {
      user.health = Number(Math.min(user.max_health, user.health + heal))
    } else {
      const newUser = await app.Users.create({ user_id: message.author.id });
      app.currency.set(message.author.id, newUser);
    }

    user.addItem(item.item_id, -1)
		func.log(`${message.author} ate a ${args[0]}`, message);
    return message.channel.send(`${message.author.username} healed for ${heal}`);

  }
}