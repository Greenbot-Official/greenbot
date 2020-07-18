const func = require('../resources/functions')
const app = require('../app')

module.exports = {
  name: 'adventure',
  aliases: 'ad',
  description: 'displays adventure menu',
  usage: 'adventure [args]',
  execute(message, args) {
    return message.channel.send('adventure curently not available')

  }
}