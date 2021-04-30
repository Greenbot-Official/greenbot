const app = require('../app')
const func = require('../resources/functions')
const { Users, UserItems } = require('../dbObjects')

module.exports = {
  name: 'inventory',
  aliases: 'inv',
  description: 'checks user\'s inventory',
  usage: 'inv [@user]',
  admin: false,
  removal: false,
  async execute(message, args, client) {
		const target = message.mentions.users.first() || message.author;
		const user = app.currency.get(target.id);
    const items = await user.getItems();
    if (!user) return message.channel.send(`${target} does not exist`)
    if (!items.length) return message.channel.send(`${target.tag} has nothing!`);
    let wep
    const weapon = await UserItems.findOne({ where: { user_id: message.author.id, equipped: true } })
    if (!weapon) { wep = '' } else { wep = `\n\nequipped:\n${weapon.item_id} damage:${weapon.damage} attribute: ${weapon.attribute}` }
    func.log(`checked ${target} inventory`, message, client)
    return message.channel.send(
      'consumables:\n' +
      items.sort((a, b) => a.id - b.id).filter(a => a.type === 'consumable' && a.amount > 0).map(item => `[${item.id}]${item.amount} ${item.item_id} heal:${item.heal}`).join('\n') +
      '\n\n' +
      'weapons:\n' +
      items.sort((a, b) => a.id - b.id).filter(a => a.type === 'weapon' && a.amount > 0).map(item => `[${item.id}]${item.amount} ${item.item_id} damage:${item.damage} attribute: ${item.attribute}`).join('\n') +
      wep
      , { code: true });
  }
}