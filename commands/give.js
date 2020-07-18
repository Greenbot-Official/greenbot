const func = require('../resources/functions')
const app = require('../app')
const { UserItems } = require('../dbObjects')
const { Op } = require('sequelize');

module.exports = {
  name: 'give',
  aliases: 'give',
  description: 'gives a user one of your items',
  usage: 'give {@target} {item} [amount]',
  async execute(message, args) {
    if (!args) return message.channel.send('invalid arguments')
    const target = message.mentions.users.first()
    const amount = args[2] || 1
    const tUser = app.currency.get(target.id)
    if (!tUser) return message.channel.send('could not find user')
    let item = await UserItems.findOne({ where: { user_id: message.author.id, item_id: { [Op.like]: args[1] }, amount: { [Op.gte]: amount } } })
    if (!item) {
      item = await UserItems.findOne({ where: { user_id: message.author.id, id: { [Op.like]: args[1] }, amount: { [Op.gte]: amount } } })
      if (!item) return message.channel.send(`invalid item ${args[1]}`)
    }
    await tUser.addItem(item.item_id, amount)
    item.amount -= Number(amount)
    item.save()
    func.log(`gave ${target.id} ${amount} ${item.item_id}`, message)
    return message.channel.send(`you gave ${args[0]} ${amount} ${item.item_id}`)

  }
}