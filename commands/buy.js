const app = require('../app')
const func = require('../resources/functions')
const { Shop } = require('../dbObjects')

module.exports = {
  name: 'buy',
  aliases: 'buy',
  description: 'buys specified item from the shop',
	usage: 'buy {item name/id} [amount]',
	admin: false,
  removal: false,
  async execute(message, args) {
		const buyName = args[0]
		var buyAmmount = args[1] || 1
		if (!buyName) return message.channel.send('please enter a item to buy')
		const user = app.currency.get(message.author.id);
		if (user.combat) return message.channel.send('you cannot do that while in combat')
		let item = await Shop.findOne({ where: { name: buyName }});
		if (!item) {
			item = await Shop.findOne({ where: { id: buyName }});
			if (!item) return message.channel.send(`could not find item: ${buyName}`)
		}
		if (buyAmmount == 'max' || buyAmmount == 'all') buyAmmount = Math.floor(user.balance / item.cost)
		if (isNaN(buyAmmount)) return message.channel.send('please enter an amount to buy')
		const totalCost = item.cost * Number(buyAmmount)
		const bal = user.balance || 0;
		if (totalCost > bal) return message.channel.send(`you do not have enough money for that`)
		
		user.balance -= Number(totalCost);
		await user.addItem(item.name, buyAmmount);
		user.save();
		
		func.log(`bought ${buyAmmount} ${item.name}`, message)
		return message.channel.send(`You've bought ${buyAmmount} ${item.name}`);

  }
}