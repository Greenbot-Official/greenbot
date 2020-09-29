const app = require('../app')
const func = require('../resources/functions')
const { Users } = require('../dbObjects')

module.exports = {
  name: 'inventory',
  aliases: 'inv',
  description: 'checks user\'s inventory',
  usage: 'inv [@user]',
  admin: false,
  async execute(message, args) {
		const target = message.mentions.users.first() || message.author;
		const user = app.currency.get(target.id);
    const items = await user.getItems();
    if (!user) return message.channel.send(`${target} does not exist`)
		if (!items.length) return message.channel.send(`${target.tag} has nothing!`);
    func.log(`checked ${target}'s inventory`, message)
    return message.channel.send(
      'consumables:\n' +
      items.sort((a, b) => a.id - b.id).filter(a => a.type === 'consumable' && a.amount > 0).map(item => `[${item.id}]${item.amount} ${item.item_id} heal:${item.heal}`).join('\n') + '\n\n' +
      'weapons:\n' +
      items.sort((a, b) => a.id - b.id).filter(a => a.type === 'weapon' && a.amount > 0).map(item => `[${item.id}]${item.amount} ${item.item_id} damage:${item.damage} attribute: ${item.attribute}`).join('\n')
      , { code: true });
  }
}