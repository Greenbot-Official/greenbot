const func = require('../resources/functions')
const app = require('../app')

module.exports = {
  name: 'balance',
  aliases: 'bal',
  description: 'gets user\'s balance',
  usage: 'balance [@user]',
  execute(message, args) {
    const target = message.mentions.users.first() || message.author
		const user = app.currency.get(target.id);
		const bal = user ? user.balance : 0;
    if (!bal) return message.channel.send(`${target.username} was not found`)
		func.log(`${message.author} checked ${target}'s balance of ${bal}`, message)
		return message.channel.send(`${target} has ${bal}💰`)

  },
}