const func = require('../resources/functions')
const app = require('../app')
const Discord = require('discord.js')
const config = require('../config.json')
const Canvas = require('canvas');
const { Adventures } = require('../dbObjects');


module.exports = {
  name: 'adventure',
  aliases: 'ad',
  description: 'displays adventure menu',
  usage: 'adventure [args]',
  admin: true,
  async execute(message, args) {
  const id = message.author.id
  if (id !== config.author) return message.channel.send('adventure curently not available')
  const user = app.currency.get(id)
  if (!args[0]) {
    func.log('is veiwing the adventure help menu', message)
    return message.channel.send(
      `start: - starts a new adventure\n` +
      ``)
  }
  }
}