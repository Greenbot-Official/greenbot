const app = require('../app')
const func = require('../resources/functions')
const { Users, UserItems } = require('../dbObjects')

module.exports = {
  name: 'inventory',
  aliases: ['inv'],
  description: 'checks user\'s inventory',
  usage: 'inv [@user]',
  admin: false,
  removal: false,
  async execute(message, args, client) {
    let target = message.mentions.users.first() || message.author
		const user = app.currency.get(target.id);
    if (!user) return message.channel.send(`unnable to find ${target}`)
    const items = await user.getItems()
    if (!user) return message.channel.send(`${target} does not exist`)
    if (!items.length) return message.channel.send(`${target.tag} has nothing!`);
    let wep
    const weapon = await UserItems.findOne({ where: { user_id: message.author.id, equipped: true } })
    let ctext = ''
    let wtext = ''
    let etext = ''
    if (items.filter(a => a.type == 'c' && a.amount > 0).map(item => `${item.item_id}`).join('\n')) ctext = 'consumables:\n' + items.sort((a, b) => a.id - b.id).filter(a => a.type === 'c' && a.amount > 0).map(item => `[${item.id}]${item.amount} ${item.item_id} heal:${item.heal}`).join('\n')
    if (items.filter(a => a.type == 'w' && a.amount > 0).map(item => `${item.item_id}`).join('\n')) wtext = `${ctext ? '\n\n' : ''}weapons:\n` + items.sort((a, b) => a.id - b.id).filter(a => a.type === 'w' && a.amount > 0).map(item => `[${item.id}]${item.amount} ${item.item_id} damage:${item.damage} attribute: ${item.attribute}`).join('\n')
    if (items.filter(a => a.type == 'e' && a.amount > 0).map(item => `${item.item_id}`).join('\n')) etext = `${wtext || ctext ? '\n\n' : ''}enchanting\-powders:\n` + items.sort((a, b) => a.id - b.id).filter(a => a.type === 'e' && a.amount > 0).map(item => `[${item.id}]${item.amount} ${item.item_id} enchantment cost:${item.ecost}`).join('\n')
    if (!weapon) { wep = '' } else { wep = `${etext || wtext || ctext ? '\n\n' : ''}equipped:\n${weapon.item_id} damage:${weapon.damage} attribute: ${weapon.attribute}` }func.log(`checked <${target.id}> inventory`, message, client)
    return message.channel.send('' + ctext + wtext + etext + wep, { code: true });
  }
}