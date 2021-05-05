const func = require('../functions')
const app = require('../../app')

module.exports = {
  name: 'water',
  async execute(message, userEffects, tUserEffects, user, tUser) {
    userEffects.burn = Number(0)
    userEffects.save()
    return message.reply('you are no longer burning')
  },
}