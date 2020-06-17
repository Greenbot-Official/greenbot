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
    const eventFiles = app.fs.readdirSync('./events').filter(file => file.endsWith('.js'));
    const event = app.getEvents().get(Math.round(Math.random() * (eventFiles.length - 1)))
    try {
      return event.execute(message, user);
    } catch (e) {
      console.log(e)
    }
  }
}