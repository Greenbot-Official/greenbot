const app = require('../app')
const func = require('../resources/functions')
const { Shop } = require('../dbObjects')

module.exports = {
  name: 'buy',
  aliases: 'buy',
  description: 'buys specified item from the shop',
  usage: 'buy {item name} [amount]',
  async execute(message, args) {
		const buyName = args[0]
		const buyAmmount = args[1] || 1
		if (!buyName) return message.channel.send('please enter a item to buy')
		const user = app.currency.get(message.author.id);
		const item = await Shop.findOne({ where: { name: `${buyName}` }});
		if (!item) return message.channel.send(`unable to find item ${args[0]}`)
		const totalCost = item.cost * buyAmmount
		const bal = user ? user.balance : 0;
		if (totalCost > bal) return message.channel.send(`you do not have enough money for that`)
		
		user.balance -= Number(totalCost);
		user.save();
		await user.addItem(item.name, buyAmmount);
		
		func.log(`${message.author} bought ${buyAmmount} ${item.name}`, message)
		return message.channel.send(`You've bought ${buyAmmount} ${item.name}`);

  }
}