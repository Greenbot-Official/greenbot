const func = require('../resources/functions')
const app = require('../app')
const { Shop } = require('../dbObjects');

module.exports = {
  name: 'pricechange',
  aliases: 'pricechange',
  description: 'changes price of an item in the shop',
  usage: 'pricechange {item | id} {cost}',
  admin: true,
  removal: false,
  async execute(message, args) {
    let item = await Shop.findOne({ where: { name: args[0] } })
    if (!item) item = await Shop.findOne({ where: { id: args[0] } })
    if (!item) return message.channel.send('not an item')
    item.cost = Number(args[1])
    func.log(`changed the price of an item`, message)
    return item.save()

  }
}