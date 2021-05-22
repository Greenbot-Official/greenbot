const func = require('../resources/functions')
const app = require('../app')

module.exports = {
  name: 'createweapon',
  aliases: ['createweapon'],
  description: 'creates a new item',
  usage: 'createweapon {item} {type} {ench} {damage} {attribute} {scale} {heal} {ecost} {amount}',
  admin: true,
  removal: false,
  async execute(message, args, client) {
    const user = app.currency.get(message.author.id)
    if (!args[0]) return message.channel.send('item, type, enchant, damage, attribute, scale, heal, ecost, amount')
    func.log(`created an item`, message, client)
    return await user.addUniqueItem(args[0], args[1], args[2], args[3], args[4], args[5], args[6], args[7], args[8])

  }
}