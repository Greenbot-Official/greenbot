const app = require('../app')
const func = require('../resources/functions')
const { Users , Shop } = require('../dbObjects')
const { Op } = require('sequelize');

module.exports = {
  name: 'buy',
  aliases: 'buy',
  description: 'buys specified item from the shop',
  usage: 'buy {item name} [amount]',
  async execute(message, args) {
		const buyName = args[0]
		const buyAmmount = args[1] || 1
		const item = await Shop.findOne({ where: { name: { [Op.like]: buyName } } });
		if (!item) return message.channel.send(`unnable to find item ${item.name}`)
		const totalCost = item.cost * buyAmmount
		const bal = user ? user.balance : 0;
		if (totalCost > bal) return message.channel.send(`you do not have enough money for that`)
		const user = await Users.findOne({ where: { user_id: message.author.id } });
		
		if (user) {
			user.balance += Number(-totalCost);
			user.save();
		}

		user.addItem(item, buyAmmount);
		func.log(`${message.author} bought ${buyAmmount} ${item.name}`, message)
		return message.channel.send(`You've bought ${buyAmmount} ${item.name}`);

  }
}