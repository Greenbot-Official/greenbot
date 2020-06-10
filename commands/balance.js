const app = require('../app')

module.exports = {
  name: 'balance',
  aliases: 'bal',
  description: 'gets user\'s balance',
  usage: 'balance [@user]',
  execute(message, args) {
    const target = message.mentions.users.first() || message.author
    const bal = app.getBalance(target.id)
    if (!bal) throw app.throwError('invalidUser')
		app.log(`${message.author} checked ${target}'s balance of ${bal}`, message)
		return message.channel.send(`${target} has ${bal}💰`)

  },
}