module.exports = {
  name: 'balance',
  aliases: 'bal',
  description: 'gets user\'s balance',
  usage: 'balance [@user]',
  execute(message, args) {
    const target = message.mentions.users.first() || message.author
		const bal = require('../app').getBalance(target.id)
		require('../app').log(`${message.author} checked ${target}'s balance of ${bal}`, message)
		return message.channel.send(`${target} has ${bal}💰`)

  },
}