const func = require('../resources/functions')

module.exports = {
  name: 'balance',
  aliases: 'bal',
  description: 'gets user\'s balance',
  usage: 'balance [@user]',
  execute(message, args) {
    const target = message.mentions.users.first() || message.author
		const bal = func.getBalance(target.id)
    if (!bal) throw func.throwError('invalidUser')
		func.log(`${message.author} checked ${target}'s balance of ${bal}`, message)
		return message.channel.send(`${target} has ${bal}💰`)

  },
}