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
    const consumables = await Shop.findAll({where: { type: 'consumable' }})
    const weapons = await Shop.findAll({where: { type: 'weapon' }})
		return message.channel.send(
      'consumables:\n' +
      consumables.sort((a, b) => a.id - b.id).map(item => `[${item.id}]${item.name}: ${item.cost}💰 heal:${item.heal}`).join('\n') + '\n\n' +
      'weapons:\n' +
      weapons.sort((a, b) => a.id - b.id).map(item => `[${item.id}]${item.name}: ${item.cost}💰 damage:${item.damage}`).join('\n')
      , { code: true }
      );

  }
}