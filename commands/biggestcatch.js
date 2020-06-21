const app = require('../app')
const func = require('../resources/functions')

module.exports = {
  name: 'biggestcatch',
  aliases: 'bc',
  description: 'shows target\'s biggest catch',
  usage: 'biggestcatch [@user]',
  execute(message, args) {
		const target = message.mentions.users.first() || message.author
		const user = app.currency.get(target.id);
		const biggest = user.biggest_catch || 0;
		func.log(`${target}'s record is a ${biggest}`, message)
		return message.channel.send(`${target}'s record is a ${biggest}in :fish:`)

  }
}