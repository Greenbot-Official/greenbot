const func = require('../resources/functions')
const app = require('../app')
const { UserItems } = require('../dbObjects')
const { Op } = require('sequelize')

module.exports = {
  name: 'equip',
  aliases: ['equip'],
  description: 'equips target weapon',
  usage: 'equip {weapon}',
  admin: false,
  removal: false,
  async execute(message, args, client) {
    const name = args[0]
    if (!name) {
      const user = app.currency.get(message.author.id)
      let weapon = UserItems.findOne({ where: { user_id: message.author.id, equipped: true } })
      if (!weapon) return message.channel.send('please enter an weapon to equip')
      weapon.equipped = Boolean(false)
      weapon.save()
      func.log(`dequipped ${weapon.item_id}`, message, client);
      return message.channel.send(`${message.author.username} dequipped ${weapon.item_id}`);
    }
    const user = app.currency.get(message.author.id)
    let weapon = await UserItems.findOne({ where: { user_id: message.author.id, item_id: { [Op.like]: name }, amount: { [Op.gt]: 0} }})
    if (!weapon) {
      weapon = await UserItems.findOne({ where: { user_id: message.author.id, id: { [Op.like]: name }, amount: { [Op.gt]: 0} }})
      if (!weapon) return message.channel.send('could not find that item')
    }
    if (weapon.type != 'weapon') return message.channel.send(`${name} is not a weapon`)
    await user.equip(weapon.item_id)
    func.log(`equipped ${weapon.item_id}`, message, client);
    return message.channel.send(`${message.author.username} equipped ${weapon.item_id}`);

  }
}