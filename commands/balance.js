const func = require('../resources/functions')
const app = require('../app')

module.exports = {
  name: 'balance',
  aliases: 'bal',
  description: 'gets user\'s balance',
  usage: 'balance [@user]',
  admin: false,
  removal: false,
  async execute(message, args) {
    const target = message.mentions.users.first() || message.author
		const user = app.currency.get(target.id);
		const bal = user.balance || 0
		func.log(`checked ${target}'s balance of ${bal}`, message)
		return message.channel.send(`${target} has ${bal}💰`)

  },
}