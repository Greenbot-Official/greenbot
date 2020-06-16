const func = require('../resources/functions')
const app = require('../app')

module.exports = {
  name: 'goblin',
  id: 0,
  level: '1',
  async execute(message, user) {
    user.health -= Number(1)
    user.save()
    func.log(`${message.author} was attacked by a goblin`, message)
    return message.channel.send(`${message.author.username} was attacked by a goblin`)
  },
}