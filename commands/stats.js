const app = require('../app')
const func = require('../resources/functions')
const { currency } = require('../app')

module.exports = {
  name: 'stats',
  aliases: 'stat',
  description: 'gets the stats of a target',
  usage: 'stats [@target]',
  execute(message, args) {
    const target = message.mentions.users.first() || message.author
    const user = currency.get(target.id)
    if (!user) return message.channel.send(`${target.username} was not found`)
    func.log(`${message.author} is checking the stats of ${target}`, message)
    return message.channel.send(`${target.username}'s stats: \nhealth: ${user.health}/${user.max_health}`, { code: true })

  }
}