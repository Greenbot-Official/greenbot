const func = require('../resources/functions')
const app = require('../app')

module.exports = {
  name: 'dm',
  aliases: 'dm',
  description: 'says hello',
  usage: 'dm {id} {text} [number]',
  admin: true,
  removal: false,
  async execute(message, args, client) {
    const target = args[0]
    const text = args[1].replace('_',' ')
    message.delete()
    await target.createDM()
    await target.dmChannel.send(`${text}`);
    return func.log(`sent message to ${target}`, message, client)
  }
}