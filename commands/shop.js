const app = require('../app')
const func = require('../resources/functions')
const { Shop } = require('../dbObjects')

module.exports = {
  name: 'shop',
  aliases: 'shop',
  description: 'displays the items in the shop',
  usage: 'shop',
  async execute(message, args) {
		const items = await Shop.findAll();
		func.log(`${message.author} is browsing the shop`, message)
		return message.channel.send(
      'consumables:\n' +
      items.sort((a, b) => a.id - b.id).filter(a => a.type === 'consumable').map(item => `[${item.id}]${item.name}: ${item.cost}💰 heal:${item.heal}`).join('\n') + '\n\n' +
      'weapons:\n' +
      items.sort((a, b) => a.id - b.id).filter(a => a.type === 'weapon').map(item => `[${item.id}]${item.name}: ${item.cost}💰 damage:${item.damage}`).join('\n')
      , { code: true }
      );

  }
}