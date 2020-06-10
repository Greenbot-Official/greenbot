const app = require('../app')

module.exports = {
  name: 'dummy',
  aliases: 'dummy',
  description: 'calls target a dummy',
  usage: 'dummy {@user}',
  execute (message, args) {
		const target = message.mentions.users.first()
		if (!target) throw 'invalid target'
		app.log(`${message.author} called ${target} a dummy`, message)
		return message.channel.send(`${target} is a dummy`)

  }
}