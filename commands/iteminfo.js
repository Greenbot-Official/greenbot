const func = require('../resources/functions')
const app = require('../app')
const config = require('../config.json')
const { Shop } = require('../dbObjects')

module.exports = {
  name: 'iteminfo',
  aliases: 'iteminfo',
  description: 'shows the details of an item',
  usage: 'iteminfo {item}',
  admin: false,
  removal: false,
  async execute(message, args, client) {
    const itemName = args[0]
    if (!itemName) return message.channel.send('please enter a item name/id')
    const user = app.currency.get(message.author.id);
    let item = await Shop.findOne({ where: { name: itemName } });
    if (!item) {
      item = await Shop.findOne({ where: { id: itemName } });
      if (!item) return message.channel.send(`could not find item: ${itemName}`)
    }

    func.log(`is veiwing item ${item.name}`, message, client)
    return message.channel.send(`[${item.id}]${item.name}: ${item.desc}`);

  }

}