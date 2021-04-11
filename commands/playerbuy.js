const app = require('../app')
const func = require('../resources/functions')
const { PlayerShop } = require('../dbObjects')
const config = require('../config.json');
const { Op } = require('sequelize');

module.exports = {
  name: 'playerbuy',
  aliases: 'pbuy',
  description: 'buys specified item from the player shop',
	usage: 'playerbuy {item name/id} [amount]',
	admin: false,
  removal: true,
  async execute(message, args) {
		const buyName = args[0]
		const buyAmmount = args[1] || 1
		if (!buyName) return message.channel.send('please enter a item to buy')
		const user = app.currency.get(message.author.id);
		if (user.combat) return message.channel.send('you cannot do that while in combat')
		let item = await PlayerShop.findOne({ where: { name: buyName }});
		if (!item) {
			item = await PlayerShop.findOne({ where: { id: buyName }});
			if (!item) return message.channel.send(`could not find item: ${buyName}`)
		}
		const totalCost = item.cost * buyAmmount
		const bal = user.balance || 0;
    if (totalCost > bal) return message.channel.send(`you do not have enough money for that`)
    if (item.amount < 1) return message.channel.send(`could not find item: ${buyName}`)
		
		user.balance -= Number(totalCost);
    user.save();
		await user.PshopBuyItem(item.name, buyAmmount);
    const seller = app.currency.get(item.seller_id)
    seller.balance += Number(totalCost)
    seller.save()
		
		func.log(`bought ${buyAmmount} ${item.name}`, message)
		return message.channel.send(`You've bought ${buyAmmount} ${item.name}`);

  }
}