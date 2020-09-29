const func = require('../resources/functions')
const app = require('../app')
const { PlayerShop } = require('../dbObjects')
const config = require('../config.json');

module.exports = {
  name: 'playershop',
  aliases: 'pshop',
  description: 'opens player shop',
  usage: 'playershop [page]',
  admin: false,
  async execute(message, args) {
    const items = await PlayerShop.findAll();
    const page = args[0] || 1
    if (isNaN(page)) return message.channel.send('please enter a valid page number')
    func.log(`is browsing the player shop`, message)
    return message.channel.send(
      'consumables:\n' +
      items.sort((a, b) => a.cost - b.cost).filter(a => a.type === 'consumable'&& a.amount > 0 && a.id > (page - 1 * 10) && a.id < (page * 10)).map(item => `[${item.id}]${item.amount} ${item.name}: ${item.cost}💰 heal:${item.heal}`).join('\n') + '\n\n' +
      'weapons:\n' +
      items.sort((a, b) => a.cost - b.cost).filter(a => a.type === 'weapon' && a.amount > 0 && a.id > (page - 1 * 10) && a.id < (page * 10)).map(item => `[${item.id}]${item.amount} ${item.name}: ${item.cost}💰 damage:${item.damage} attribute: ${item.attribute}`).join('\n') + '\n' +
      `${page}`
      , { code: true }
    );

  }
}