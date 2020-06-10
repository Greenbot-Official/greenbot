const func = require('../resources/functions')

module.exports = {
  name: 'biggestcatch',
  aliases: 'biggestcatch',
  description: 'shows target\'s biggest catch',
  usage: 'biggestcatch [@user]',
  execute(message, args) {
		const target = message.mentions.users.first() || message.author
		func.log(`${target}'s record is a ${func.getBiggestCatch(target.id)}`, message)
		return message.channel.send(`${target}'s record is a ${func.getBiggestCatch(target.id)}in :fish:`)

  }
}