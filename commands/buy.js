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
		if (!item) return message.channel.send('That item doesn\'t exist.');
		const totalCost = item.cost * buyAmmount
		if (totalCost > require('../app').getBalance(message.author.id)) return message.channel.send(`You don't have enough currency, ${message.author}`);
		const user = await Users.findOne({ where: { user_id: message.author.id } });
		require('../app').add(message.author.id, -totalCost);
		for (i=0 ; i < buyAmmount ; i++) user.addItem(item, buyAmmount);
		require('../app').log(`${message.author} bought ${buyAmmount} ${item.name}`, message)
		return message.channel.send(`You've bought ${buyAmmount} ${item.name}`);

  }
}