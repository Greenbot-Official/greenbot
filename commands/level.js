const app = require('../app')
const func = require('../resources/functions')

module.exports = {
  name: 'level',
  aliases: 'lvl',
  description: 'checks target\'s level up status',
  usage: 'level [@target]',
  execute(message, args) {
    const target = message.mentions.users.first() || message.author
		const user = app.currency.get(target.id);
		const level = user ? user.level : 0;
		const calclvl = Math.pow(user.level + 1, 2)
    func.log(`${message.author} checked ${target}'s level`, message)
    return message.channel.send(`${target.username}'s level: \n${level} \n${target.username}'s next level up: \n${calclvl}`, { code: true})

  }
}