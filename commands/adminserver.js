const func = require('../resources/functions')

module.exports = {
  name: 'adminserver',
  aliases: ['adminserver'],
  description: 'gets link to the support server',
  usage: 'support',
  admin: true,
  removal: false,
  async execute(message, args, client) {
    func.log(`is looking for the admin server`, message, client);
    return message.channel.send("https://discord.gg/H96EY2vKWs");

  }
}