const func = require('../resources/functions')
const app = require('../app')
const { PlayerShop } = require('../dbObjects')
const config = require('../config.json');

module.exports = {
  name: 'playershop',
  aliases: 'pshop',
  description: 'opens player shop',
  usage: 'playershop [item]',
  async execute(message, args) {
		if (message.author.id !== config.author) return message.channel.send('adventure curently not available')
    const items = await PlayerShop.findAll();
    func.log(`is browsing the player shop`, message)
    if (!args[0]) {
      return message.channel.send(
        'consumables:\n' +
        items.sort((a, b) => a.cost - b.cost).filter(a => a.type === 'consumable'&& a.amount > 0).map(item => `[${item.id}]${item.amount} ${item.name}: ${item.cost}💰 heal:${item.heal}`).join('\n') + '\n\n' +
        'weapons:\n' +
        items.sort((a, b) => a.cost - b.cost).filter(a => a.type === 'weapon' && a.amount > 0).map(item => `[${item.id}]${item.amount} ${item.name}: ${item.cost}💰 damage:${item.damage} attribute: ${item.attribute}`).join('\n')
        , { code: true }
      );
    } else {
      const item = await PlayerShop.findAll({ where: { name: args[0] } })
      item.sort((a, b) => a.cost - b.cost).sort((a, b) => a.id - b.id).first(1)
      let description
      if (item.type == 'consumable') {
        description = `heal: ${item.heal}`
      } else {
        description = `damage:${item.damage} attribute: ${item.attribute}`
      }
      items.sort((a, b) => a.cost - b.cost).filter(a => a.name === args[0] && a.amount > 0).first(15).map(item => `[${item.id}]${item.name}: ${item.cost}💰 ${description}`).join('/n')
    }

  }
}