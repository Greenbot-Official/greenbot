module.exports = {
  name: 'biggestcatch',
  aliases: 'bc',
  description: 'shows target\'s biggest catch',
  usage: 'biggestcatch [@user]',
  execute(message, args) {
		const target = message.mentions.users.first() || message.author
		require('../app').log(`${target}'s record is a ${currency.getBiggestCatch(target.id)}`, message)
		return message.channel.send(`${target}'s record is a ${require('../app').getBiggestCatch(target.id)}in :fish:`)

  }
}