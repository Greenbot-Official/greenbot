const app = require('../app')
const func = require('../resources/functions')
const { UserItems } = require('../dbObjects')
const config = require('../config.json');

module.exports = {
  name: 'playersell',
  aliases: ['psell'],
  description: 'sells specified item from the your inventory',
  usage: 'playersell {item name/id} {cost} [amount]',
  admin: false,
  removal: true,
  async execute(message, args, client) {
		const sellName = args[0]
    const sellPrice = args[1]
    let sellAmount = args[2]
    if (!sellAmount) sellAmount = 1
		if (!sellName) return message.channel.send('please enter a item to sell')
		if (!sellPrice) return message.channel.send('please enter a price')
		const user = app.currency.get(message.author.id);
		if (user.combat) return message.channel.send('you cannot do that while in combat')
		let item = await UserItems.findOne({ where: { item_id: sellName }});
		if (!item) {
			item = await UserItems.findOne({ where: { id: sellName }});
			if (!item) return message.channel.send(`could not find item: ${sellName}`)
    }
    if (item.amount < sellAmount) return message.channel.send('you do not have enough of that item')
    user.PshopSellItem(item.item_id, sellPrice, sellAmount, user.user_id)
		
    func.log(`sold ${sellAmount} ${item.item_id}`, message, client)
		return message.channel.send(`You've sold ${sellAmount} ${item.item_id}`);

  }
}