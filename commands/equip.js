const func = require('../resources/functions')
const app = require('../app')
const { Shop , UserItems } = require('../dbObjects')
const { Op } = require('sequelize')

module.exports = {
  name: 'equip',
  aliases: 'equip',
  description: 'equips target weapon',
  usage: 'equip {weapon}',
  async execute(message, args) {
    if (!args[0]) return message.channel.send('please enter an item to equip')
    const user = app.currency.get(message.author.id)
    const weapon = await UserItems.findAll({ where: { item_id: { [Op.like]: args[0] }}})
    const item = await Shop.findOne({ where: { name: args[0] }})
    if (!weapon) return message.channel.send('could not find any of that item')
    if (!(item.type === 'weapon')) return message.channel.send('that item is not a weapon')

    await user.equip(item.name)

		func.log(`${message.author.id} equipped ${item.name}`, message);
    return message.channel.send(`${message.author.username} equipped ${item.name}`);

  }
}