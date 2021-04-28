const func = require('../resources/functions')
const app = require('../app')
const Discord = require('discord.js')
const config = require('../config.json')
const { Adventures } = require('../dbObjects');


module.exports = {
  name: 'adventure',
  aliases: 'ad',
  description: 'displays adventure menu',
  usage: 'adventure [args]',
  admin: false,
  removal: true,
  async execute(message, args) {
    const id = message.author.id
    const user = app.currency.get(id)
    if (!args[0]) {
      func.log('is veiwing the adventure help menu', message)
      return message.channel.send(
        `start: - starts a new adventure\n` +
        ``)
    } else if (args[0] == 'start') {
      
    }
  }
}