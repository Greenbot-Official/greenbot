const func = require('../resources/functions')
const app = require('../app')
const { Shop , UserItems , UniqueItems } = require('../dbObjects')
const { Op } = require('sequelize')

module.exports = {
  name: 'equip',
  aliases: 'equip',
  description: 'equips target weapon',
  usage: 'equip {weapon}',
  async execute(message, args) {
    if (!args[0]) return message.channel.send('please enter an item to equip')
    const user = app.currency.get(message.author.id)
    var weapon = await UserItems.findAll({ where: { item_id: { [Op.like]: args[0] }}})
    if (!weapon) {
      weapon = await UniqueItems.findAll({ where: { item_id: { [Op.like]: args[0] }}})
      if (!weapon) return message.channel.send('could not find that item')
      if (!(weapon.type === 'weapon')) return message.channel.send('that item is not a weapon')
      await user.equipUnique(weapon.item_id)
    } else {
      if (!(weapon.type === 'weapon')) return message.channel.send('that item is not a weapon')
      await user.equip(weapon.item_id)
    }

		func.log(`${message.author.id} equipped ${weapon.item_id}`, message);
    return message.channel.send(`${message.author.username} equipped ${weapon.item_id}`);

  }
}