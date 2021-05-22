const app = require('../app')
const func = require('../resources/functions')
const { Shop } = require('../dbObjects')

module.exports = {
  name: 'shop',
  aliases: ['shop'],
  description: 'displays the items in the shop',
  usage: 'shop',
  admin: false,
  removal: false,
  async execute(message, args, client) {
		const items = await Shop.findAll();
    func.log(`is browsing the shop`, message, client)
		return message.channel.send(
      'consumables:\n' +
      items.sort((a, b) => a.id - b.id).filter(a => a.type === 'c').map(item => `[${item.id}]${item.name}: ${item.cost}💰 heal:${item.heal}`).join('\n') + '\n\n' +
      'weapons:\n' +
      items.sort((a, b) => a.id - b.id).filter(a => a.type === 'w').map(item => `[${item.id}]${item.name}: ${item.cost}💰 damage:${item.damage} attribute: ${item.attribute}`).join('\n') + '\n\n' +
      'enchantments:\n' +
      items.sort((a, b) => a.id - b.id).filter(a => a.type === 'e').map(item => `[${item.id}]${item.name} ${item.cost}💰 enchantment cost:${item.ecost}`).join('\n')
      , { code: true }
      );

  }
}