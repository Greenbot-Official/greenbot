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
    if (items.filter(a => a.type == 'w' && a.amount > 0).map(item => `${item.item_id}`).join('\n')) wtext = `${ctext ? '\n\n' : ''}weapons:\n` + items.sort((a, b) => a.id - b.id).filter(a => a.type === 'w' && a.amount > 0).map(item => `[${item.id}]${item.amount} ${item.item_id} damage:${item.damage} ${item.attribute != 'none' ? `attribute: ${ item.attribute }` : ''} ${!item.enchant ? '' : `enchant:${item.enchant}`}`).join('\n')
    if (items.filter(a => a.type == 'e' && a.amount > 0).map(item => `${item.item_id}`).join('\n')) etext = `${wtext || ctext ? '\n\n' : ''}enchantments:\n` + items.sort((a, b) => a.id - b.id).filter(a => a.type === 'e' && a.amount > 0).map(item => `[${item.id}]${item.amount} ${item.item_id}  enchant cost:${item.ecost}`).join('\n')
    if (!weapon) { wep = '' } else { wep = `${etext || wtext || ctext ? '\n\n' : ''}equipped:\n${weapon.item_id} damage:${weapon.damage} ${weapon.attribute != 'none' ? `attribute: ${weapon.attribute}` : ''} ${!weapon.enchant ? '' : `enchant:${weapon.enchant}`}` }func.log(`checked <${target.id}> inventory`, message, client)
    return message.channel.send('' + ctext + wtext + etext + wep, { code: true });
  }
}