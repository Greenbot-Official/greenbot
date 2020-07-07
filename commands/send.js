const func = require('../resources/functions')
const app = require('../app')

module.exports = {
  name: 'send',
  aliases: 'transfer',
  description: 'sends target money',
  usage: 'send {@target} [amount]',
  execute(message, args) {
    if (!args) return message.channel.send('invalid arguments')
    const target = message.mentions.users.first()
    const amount = args[1] || 1
    const user = app.currency.get(message.author.id)
    const tUser = app.currency.get(target.id)
    if (!tUser) return message.channel.send('could not find user')

    user.balance -= Number(amount)
    tUser.balance += Number(amount)
    user.save()
    tUser.save()

		func.log(`transfered ${amount} to ${target.id}`, message);
    return message.channel.send(`sent ${amount}💰 to ${args[0]}`);

  }
}