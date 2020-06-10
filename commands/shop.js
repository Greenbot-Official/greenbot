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
		return message.channel.send(items.map(item => `${item.name}: ${item.cost}💰`).join('\n'), { code: true });

  }
}