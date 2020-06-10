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
		if (!item) throw func.throwError('unknownItem')
		const totalCost = item.cost * buyAmmount
		if (totalCost > func.getBalance(message.author.id)) throw func.throwError('invalidCurrency')
		const user = await Users.findOne({ where: { user_id: message.author.id } });
		func.add(message.author.id, -totalCost);
		user.addItem(item, buyAmmount);
		func.log(`${message.author} bought ${buyAmmount} ${item.name}`, message)
		return message.channel.send(`You've bought ${buyAmmount} ${item.name}`);

  }
}