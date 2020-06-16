const func = require('../resources/functions')
const app = require('../app')

module.exports = {
  name: 'event',
  aliases: 'event',
  description: 'calls a random event',
  usage: 'event',
  cooldown: '120',
  async execute(message, args) {
    const user = app.currency.get(message.author.id)
    const rand = Math.round(Math.random() * 0)
    const event = app.getEvents().get(rand)
    try {
      return event.execute(message, user);
    } catch (e) {
      console.log(e)
    }
  }
}