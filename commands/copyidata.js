const func = require('../resources/functions')
const app = require('../app')
const config = require('../config.json')

module.exports = {
  name: 'copyidata',
  aliases: ['copyidata'],
  description: 'sends the item data of the items in users inv',
  usage: 'copyinvdata {id}',
  admin: true,
  removal: false,
  async execute(message, args, client) {
    // just a future reminder, if a command or alias is named inv, nothing 
    // can even have inv in the name
    const tuser = app.currency.get(args[0])
    const items = await tuser.getItems();
    func.log(`checked ${tuser.user_id} inv`, message, client);
    return message.channel.send(`${items.sort((a, b) => a.id - b.id).map(i => `[${i.shop_id}] ${i.id}: ${i.item_id} ${i.type} ${i.enchant} ${i.damage} ${i.attribute} ${i.scale} ${i.heal} ${i.ecost} ${i.amount}`).join('\n')}`)

  }
}